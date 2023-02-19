const crypto = require('crypto')

function createHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data), 'utf8').digest('base64')
}

module.exports = {
  createHash
}
