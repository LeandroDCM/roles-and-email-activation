const { Op } = require('sequelize');
const User = require('../models/User');


module.exports = {
  async show(req, res) {
    //Find every user that has an email that ends in @rocketseat
    //From these users i want to find everyone that lives in street: Rua Guilherme Gembala
    //From them i want to search the techs that start with React

    const users = await User.findAll({
      attributes: ['name', 'email'],
      where: {
        email: {
          [Op.iLike]: '%@rocketseat.com.br'
        }
      },
      include: [
        { association: 'addresses', 
        where: { street: 'Rua Guilherme Gembala' }, },
        { association: 'techs',
        required: false,
        where: {
          name: {
            [Op.iLike]: 'React%'
          }
        }}
      ]
    })

    return res.json(users)
  }
};