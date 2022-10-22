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

    //make new post and link it to the user
    const newPost = await Post.create({
      post: post,
      user_id: user.id,
    });

    await newPost.save();
    return res.json(newPost.post);
  }

  async updatePost(req: any, res: any) {
    const postid = req.params.postid;
    const userInformation = req.session;
    const { newPost } = req.body;

    //check for valid post id and prevents crash
    const isValid = idIsValid(postid);
    if (isValid) {
      return res.status(422).json({ msg: isValid });
    }

    //find user and post
    const user = await User.findOne({
      where: {
        username: userInformation.username,
      },
    });

    //find post by pk and only return post
    const post = await Post.findByPk(postid, {
      attribute: ["post"],
    });

    //check if user exists
    if (!user)
      return res.status(400).json({
        msg: "User not found",
      });

    //check if post is empty/exists
    if (post === null || !post)
      return res.status(400).json({
        msg: "Empty post id or non existent.",
      });

    //check if new post is empty/exists
    if (!newPost)
      return res.status(400).json({
        msg: "Post can't be empty",
      });

    //checks if user is updating own post or someone elses
    if (user.id.toString() === post.user_id.toString()) {
      await post.update(
        {
          post: newPost,
        },
        {
          where: {
            user_id: user.id,
          },
        }
      );
      return res.json(newPost);
    } else {
      return res.json({ Error: "Cannot update another users post." });
    }
  }
}

export default new PostController();
