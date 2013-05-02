var findProfile = require('./lib/findUserProfile')
var getOrCreateProfile = require('./lib/getOrCreateProfile')
var checkPassword = require('./lib/checkPassword')
var hashPassword = require('./lib/hashPassword')
module.exports = {
  getOrCreateProfile: getOrCreateProfile,
  findProfile: findProfile,
  checkPassword: checkPassword,
  hashPassword: hashPassword
}
