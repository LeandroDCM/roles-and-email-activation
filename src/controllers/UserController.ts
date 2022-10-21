import { User } from "../models/User";
import hasErrors from "../utils/paramsValidator";
import validPassword from "../utils/validPassword";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
      //create user
      const user = await User.create({
        username: username,
        name: name,
        email: email,
        password: passwordHash,
      });

      res.status(201).json({
        msg: "User created successfully",
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
      //Generates token with user email
      const secret = process.env.JWT_SECRET as string;

      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
          // change this for email
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
}

export default new UserController();
