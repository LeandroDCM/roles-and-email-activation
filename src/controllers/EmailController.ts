import { User } from "../models/User";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import "dotenv/config";

//mailtrap credentials
let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASS,
  },
});

class EmailController {
  async recover(req: any, res: any) {
    const { email } = req.body;

    //checks if connection with mailtrap is happening
    transport.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

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

    const mailOptions = {
      from: "07c7405dc0-27a88f@inbox.mailtrap.io", // Sender address
      to: email, // List of recipients
      subject: "Account password reset link", // Subject line
      text: `Hello! click this link to reset your password`,
      html: `<a href="http://localhost:3333/auth/reset/${token}">Recovery Link</a>`, // Plain text body
    };

    try {
      transport.sendMail(mailOptions);
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
