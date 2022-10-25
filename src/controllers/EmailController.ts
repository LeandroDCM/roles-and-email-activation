import { User } from "../models/User";
import jwt from "jsonwebtoken";
import mailgun from "mailgun-js";
import "dotenv/config";

const DOMAIN = process.env.EMAIL_DOMAIN as string;
const mg = mailgun({
  apiKey: process.env.EMAIL_API_KEY as string,
  domain: DOMAIN,
});

class EmailController {
  async recover(req: any, res: any) {
    const { email } = req.body;

    //check for user
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //check for user
    if (!user) {
      return res.json({
        msg: "Email not found!",
      });
    }

    //makes username a token to compare username at password reset link
    const secret = process.env.JWT_SECRET as string;

    const token = jwt.sign({ username: user.username }, secret);

    //Email data
    const data = {
      from: "Excited User <me@samples.mailgun.org>",
      to: `${email}`,
      subject: "Password Change",
      text: `<a href="${process.env.CLIENT_URL}/auth/reset/${token}">Password Change Link</a>`,
      html: `<a href="${process.env.CLIENT_URL}/auth/reset/${token}">Password Change</a>`,
    };

    try {
      //send email
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
      res.json({
        msg: "Email sent with your information!",
      });
      return await user.update({
        resetLink: token,
      });
    } catch (error) {
      console.log(error);
      res.json({
        msg: "Reset password link error",
      });
    }
  }
}

export default new EmailController();
