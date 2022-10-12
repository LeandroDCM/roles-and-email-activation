import {Address} from '../models/Address';
import {User} from '../models/User';

module.exports = {
  async index(req: any, res: any) {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: { association: 'addresses' }
    })

    return res.json(user.addresses);
  },


  async store(req: any, res: any) {
    const { user_id } = req.params;
    const { zipcode, street, number } = req.body;

    const user = await User.findByPk(user_id)

    if (!user) {
      return res.status(400).json({ error: 'User not found'});
    }

    const address = await Address.create({
      zipcode,
      street,
      number,
      user_id
    });

    return res.json(address);
  },

  async update(req: any, res: any) {
    const { user_id } = req.params;
    const { zipcode, street, number } = req.body;

    const [address] = await Address.findAll({
      where: { user_id }
    })

    address.update({
      zipcode: zipcode,
      street: street,
      number: number
    })

    return res.json(address);
  },
};