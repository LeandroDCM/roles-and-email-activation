import { User } from "../models/User";
import hasErrors from "../utils/paramsValidator";
import validPassword from "../utils/validPassword";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailgun from "mailgun-js";
import "dotenv/config";

//setting up mailgun
const DOMAIN = process.env.EMAIL_DOMAIN as string;
const mg = mailgun({
  apiKey: process.env.EMAIL_API_KEY as string,
  domain: DOMAIN,
});

class UserController {
  async register(req: any, res: any) {
    const { username, name, email, password, confirmPassword } = req.body;

    //verify if there are empty fields
    const requestFields = [
      "username",
      "name",
      "email",
      "password",
      "confirmPassword",
    ];

    const errors = hasErrors(requestFields, req.body);
    if (errors.length === 1) {
      //if one error exist
      return res
        .status(422) //join and return them
        .json({ msg: `Field: ${errors[0]} is required` });
    } else if (errors.length > 1) {
      //if errors exist
      return res
        .status(422) //join and return them
        .json({ msg: `Fields: ${errors.join(",")} are required!` });
    }

    //validations
    const isPasswordInvalid = validPassword(password, confirmPassword);
    if (isPasswordInvalid)
      return res.status(422).json({ msg: isPasswordInvalid });

    //check if user exists
    const userExists = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
    });

    if (userExists) {
      return res.status(422).json({ msg: "Email or username already in use!" });
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      //makes username a token to compare username at password reset link
      const secret = process.env.JWT_SECRET as string;

      const token = jwt.sign({ username: username }, secret);

      //Email data
      const data = {
        from: "noreply@email.com",
        to: `${email}`,
        subject: "Activate Account",
        text: `<a href="${process.env.CLIENT_URL}/auth/activate/${token}">Activation Link</a>`,
        html: `<a href="${process.env.CLIENT_URL}/auth/activate/${token}">Activation Link</a>`,
      };

      //send email
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });

      //create user
      const user = await User.create({
        username: username,
        name: name,
        email: email,
        password: passwordHash,
      });

      res.status(201).json({
        msg: "User created successfully, Please confirm your Email to be able to make Posts",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Error ocurred in server, try again later!",
      });
    }
  }

  async login(req: any, res: any) {
    // username OR email = login
    const { login, password } = req.body;

    //validation
    const requestFields = ["login", "password"];
    const errors = hasErrors(requestFields, req.body);
    if (errors.length === 1) {
      return res.status(422).json({
        msg: `Field: ${errors[0]} is required!`,
      });
    } else if (errors.length > 1) {
      return res.status(422).json({
        msg: `Fields: ${errors.join(",")} are required!`,
      });
    }
    //check if user exists
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: login,
          },
          {
            email: login,
          },
        ],
      },
    });
    if (!user) {
      return res.status(422).json({ msg: "User not found!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "Invalid password!" });
    }

    try {
      //Generates token with user email and username
      const secret = process.env.JWT_SECRET as string;

      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
          role_id: user.role_id,
        },
        secret
      );

      //Simulates sending token through header
      res.status(200).json({ msg: "Successful authentication ", token });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        msg: "Error ocurred in server, try again later!",
      });
    }
  }

  async resetPassword(req: any, res: any) {
    const { newPassword, confirmNewPass, username } = req.body;
    //token came from recovery email
    const { token } = req.params;

    //checking password regex
    const isPasswordInvalid = validPassword(newPassword, confirmNewPass);
    if (isPasswordInvalid)
      return res.status(422).json({ msg: isPasswordInvalid });

    if (!newPassword || !confirmNewPass) {
      return res.status(422).json({ msg: "Password is required!" });
    }

    try {
      const secret = process.env.JWT_SECRET as string;
      //grab username from token passed through email
      const informationToken = jwt.verify(token, secret) as any;

      //compares username grabbed from inside the email of the user
      //with the username provided by the user in the time of password changing
      if (username !== informationToken.username) {
        return res.json({
          Error: "User not found!",
        });
      }
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      //finds user from the token that he got from email
      await User.update(
        {
          password: passwordHash,
        },
        {
          where: {
            username: informationToken.username,
          },
        }
      );

      return res.json({
        msg: "New password created successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        msg: "Invalid token",
      });
    }
  }

  async userIndex(req: any, res: any) {
    try {
      //gets username from checkToken (req.session)
      const information = req.session;

      //finds user based on username from information token
      //only shows the 'name' attribute
      const user = await User.findOne({
        where: {
          username: information.username,
        },
        attributes: ["name"],
      });

      //check if users exists
      if (!user || user === null) {
        res.status(422).json({ User: "not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ msg: "User not found!" });
    }
  }

  async deleteUser(req: any, res: any) {
    try {
      const userId = req.params.id;
      const userInformation = req.session;
      //find logged user
      const loggedUser = await User.findOne({
        where: {
          username: userInformation.username,
        },
      });

      //find user to be deleted
      const user = await User.findByPk(userId);
      //if user role_id === 3 "ADMIN" delete anything he wants
      if (loggedUser.role_id === 3) {
        //delete post if tests are passed
        await user.destroy();
        return res.status(200).json({
          msg: "User deleted successfully",
        });
      } else {
        throw new Error("Error!");
      }
    } catch (error) {
      console.log(error);
      return res
        .status(404)
        .json({ msg: "User not found or no permission to delete" });
    }
  }

  async activate(req: any, res: any) {
    try {
      const token = req.params.token;
      //acts as a fake activate button
      const { activateButton } = req.body;

      //decoding jwt token
      const secret = process.env.JWT_SECRET as string;
      const userInformation = jwt.verify(token, secret) as any;

      //find user
      const user = await User.findOne({
        where: {
          username: userInformation.username,
        },
      });

      //checks if he clicks the fake button
      if (activateButton === "ACTIVATE") {
        await user.update({
          is_activated: true,
        });
        return res.json({
          msg: "User account activated!",
        });
      }
      throw new Error("Something went wrong!");
    } catch (error) {
      console.log(error);
      return res.json({
        msg: "Something went wrong!",
      });
    }
  }
}

export default new UserController();
