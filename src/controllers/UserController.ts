import { User } from "../models/User";
import hasErrors from "../utils/paramsValidator";

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
  }
}

export default new UserController();
