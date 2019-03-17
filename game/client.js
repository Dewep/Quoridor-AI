const Game = require('./index')
const PlayerClient = require('./player/client')

class GameClient extends Game {
  constructor (slug) {
    super(null)

    this.slug = slug

    // history = 'p67,p13,p58,p22,p49,w36,p48,w34,w96,w24,w26,w89,p49,w108,w60,w123,w62,w43,w127,w114,w55,w57,w84,w13,w28,p13'

    this.player1 = new PlayerClient(this, 1)
    this.player2 = new PlayerClient(this, 2)
  }

  getHistory () {
    let player = 1
    let index = 0
    const history = [{ index, name: 'Start of the game' }]

    for (const item of this.history) {
      index += 1
      let name
      if (item[0] === 'w') {
        name = `P${player} placed a wall`
      } else if (item[0] === 'w') {
        name = `P${player} moved its pawn`
      } else {
        name = `P${player} ??`
      }
      history.unshift({ index, name })
      player = player === 1 ? 2 : 1
    }

    return history
  }
}

module.exports = GameClient
