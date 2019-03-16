const validate = require('validate.js')
const constraints = require('../constraints')
const isAvailable = require('./username')
const { User } = require('../../../dbload')

validate.validators.userNameIsAvailable = value => {
  return new validate.Promise((resolve, reject) => {
    // prevent expensive web call if basic constraints are violated
    if (
      value.length < constraints.userName.length.minimum ||
      value.length > constraints.userName.length.maximum ||
      !value.match(constraints.userName.format.pattern)
    ) { return resolve('unavailable') }

    isAvailable(value)
      .then(result => resolve(result ? null : 'unavailable'))
      .catch((_) =>
        reject({
          userName: [
            `error: currently unable to validate availability this user name`
          ]
        })
      )
  })
}

validate.validators.emailIsAvailable = value => {
  return new validate.Promise((resolve, reject) => {
    // prevent expensive web call if basic constraints are violated
    if (
      value.length < constraints.email.length.minimum ||
      value.length > constraints.email.length.maximum
    ) { return resolve('unavailable') }

    User.findAll({ where: { email: value } })
      .then(result => {
        resolve(result.length ? 'An email already exist' : null)
      }).catch((_) =>
        reject({
          email: [
            `error: currently unable to validate availability this email`
          ]
        })
      )
  })
}

module.exports = validate
