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
      attributes: ["id", "name"],
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
    if (user.id === post.user_id) {
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

  async deletePost(req: any, res: any) {
    try {
      const postid = req.params.postid;
      const userInformation = req.session;
      //check for valid post id and prevents crash
      const isValid = idIsValid(postid);
      if (isValid) {
        return res.status(422).json({ msg: isValid });
      }

      //finds user trying to delete and post
      const user = await User.findOne({
        where: {
          username: userInformation.username,
        },
      });
      //find the post from id in params and find out who posted by accessing owner.role_id
      const thisPost = await Post.findByPk(postid, {
        include: [
          {
            association: "owner",
            attributes: ["role_id"],
          },
        ],
      });

      //check if post exists and prevents crash from null
      if (!thisPost || thisPost === null) {
        throw new Error("Invalid post id");
      }

      //if user role_id === 3 "ADMIN" delete anything he wants
      if (user.role_id === 3) {
        //delete post if tests are passed
        await thisPost.destroy();
        return res.status(200).json({
          msg: "Post deleted successfully",
        });
      }

      //if user role_id === 2 "MODERATOR" delete anything but ADMIN posts
      if (user.role_id === 2 && thisPost.owner.role_id !== 3) {
        //delete post if tests are passed
        await thisPost.destroy();
        return res.status(200).json({
          msg: "Post deleted successfully",
        });
      }

      //if user role_id === 1 "USER" and this post was made by the same user
      if (user.role_id === 1 && user.id === thisPost.user_id) {
        //delete post if tests are passed
        await thisPost.destroy();
        return res.status(200).json({
          msg: "Post deleted successfully",
        });
      }

      //check if user is trying to do something he does not have permission to do
      throw new Error(
        "Access denied. You do not have permission to delete this post"
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Error! Access denied. You do not have permission to delete this post",
      });
    }
  }

  async postsIndex(req: any, res: any) {
    try {
      //gets only post
      const posts = await Post.findAll({
        attributes: ["post"],
        include: [
          {
            //includes the name of the poster using association made in model Post
            association: "owner",
            attributes: ["name", "role_id"],
          },
        ],
      });
      res.json(posts);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async userPosts(req: any, res: any) {
    try {
      const id = req.params.id;

      const testId = idIsValid(id);
      if (testId) {
        return testId;
      }

      const posts = await Post.findAll({
        where: {
          user_id: id,
        },
        attributes: ["post"],
        include: [
          {
            //includes the name of the poster using association made in model Post
            association: "owner",
            attributes: ["name"],
          },
        ],
      });

      if (!posts || posts.length === 0) {
        return res.json({
          msg: "Post not found or wrong post id.",
        });
      }

      res.json(posts);
    } catch (error) {
      res.status(500).json({
        msg: "Error with user id",
      });
    }
  }
}

export default new PostController();
