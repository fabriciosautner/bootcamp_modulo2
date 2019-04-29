const moment = require('moment')
const { Op } = require('sequelize')
const { Appointment, User } = require('../models')

class ScheduleController {
  async index (req, res) {
    const value = moment(new Date()).format()
    console.log(value) // 2019-04-29T09:59:16-03:00

    const appointments = await Appointment.findAll({
      include: [{ model: User }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.gt]: [value] // NA SAÍDA FICA 2019-01-01 02:00:00.000 +00:00
        }
      }
    })

    const available = appointments.map(client => {
      const { date, User } = client

      return {
        date_full: moment(date).format('DD/MM/Y'),
        hour: moment(date).format('LT'),
        client: User.dataValues.name
      }
    })

    return res.render('schedule/index', { available })
  }
}

module.exports = new ScheduleController()
