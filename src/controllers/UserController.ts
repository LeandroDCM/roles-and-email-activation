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

    return res.json(user);
  },
  
  async userUpdateName(req: any, res: any) {
    const { name } = req.body;
    const { user_id } = req.params;
    const user = await User.findByPk(user_id)
    user.name = name;
    await user.save();
    return res.json(user);
  },
};

