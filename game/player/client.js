const Player = require('./index')

class PlayerClient extends Player {
  constructor (game, id = 1) {
    super(game, id)
  }
}

module.exports = PlayerClient
