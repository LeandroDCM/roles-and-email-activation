import { User } from "../models/User";
import { Post } from "../models/Post";
import idIsValid from "../utils/postIdValidator";

class PostController {
  async makePost(req: any, res: any) {
    const { post } = req.body;

    if (!post) {
      return res.json({
        msg: "Post can't be empty",
      });
    }
    //gets email and username from checkToken (req.session)
    const userInformation = req.session;

    //finds user and only returns if for post association
    const user = await User.findOne({
      where: {
        username: userInformation.username,
      },
      attributes: ["id"],
    });

    if (!user) {
      return res.json({
        msg: "User not found",
      });
    }

    const newPost = await Post.create({
      post: post,
      user_id: user.id,
    });

    await newPost.save();
    return res.json(newPost.post);
  }
}

export default new PostController();
