const User = require('../models/User');


module.exports = {
  async index(req: any, res: any) {
    const users = await User.findAll();
    return res.json(users)
  },


  async store(req: any, res: any) {
    const { name , email } = req.body;

    const user = await User.create({ name, email});

    return res.json(user);
  }
};

