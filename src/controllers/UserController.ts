import {User} from '../models/User';


module.exports = {
  async index(req: any, res: any) {
    const users = await User.findAll();
    return res.json(users)
  },


  async store(req: any, res: any) {
    const { name , email } = req.body;

    const user = await User.create({ name, email});

    return res.json(user);
  },

  async user(req: any, res: any) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id)

    if (!user) {
      return res.status(400).json({ error: 'User not found'});
    }

    return res.json(user);
  },

  async userUpdateName(req: any, res: any) {
    const { name, email } = req.body;
    const { user_id } = req.params;

    const user = await User.findByPk(user_id)
    
    if (!user) {
      return res.status(400).json({ error: 'User not found'});
    }

    user.update({
      name: name,
      email: email
    })
    return res.status(200).json(user)
  },

  async delete(req: any, res: any) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id)

    if (!user) {
      return res.status(400).json({ error: 'User not found'});
    }

    user.destroy()

    return res.status(200).json({ Success: 'User DELETED'});
  }
};

