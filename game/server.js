const Game = require('./index')

class GameServer extends Game {
  constructor (slug, player1, player2, date) {
    super(null)

    this.slug = slug
    this.date = date

    this.player1.auth = player1.auth
    this.player1.name = player1.name
    this.player2.auth = player2.auth
    this.player2.name = player2.name
  }

  summary () {
    return {
      slug: this.slug,
      player1: this.player1.name,
      player2: this.player2.name,
      date: this.date
    }
  }
}

module.exports = GameServer
