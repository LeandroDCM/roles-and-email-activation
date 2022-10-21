import { User } from "../models/User";
import hasErrors from "../utils/paramsValidator";
import validPassword from "../utils/validPassword";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
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

    console.log(passwordHash);
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
      console.log(passwordHash);
      res.status(500).json({
        msg: "Error ocurred in server, try again later!",
      });
    }
  }
}

export default new UserController();
