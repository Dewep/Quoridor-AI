const uuid = require('uuid/v4')
const moment = require('moment')
const GameServer = require('../game/server')

class Manager {
  constructor () {
    this.clients = []

    this.currentGames = []
    this.lastGames = []
    this._waitingRequestAuth = null
  }

  addClient (client) {
    this.clients.push(client)
    this.updateGamesList(client)
  }

  removeClient (client) {
    this.clients = this.clients.filter(instance => instance !== client)
  }

  newGameRequest (type, auth) {
    if (type === 'local') {
      this.newGame({ auth, name: '🧑' }, { auth, name: '🧑' })
    } else if (type === 'online') {
      if (this._waitingRequestAuth) {
        this.newGame({ auth: this._waitingRequestAuth, name: '🧑' }, { auth, name: '🧑' })
      } else {
        this._waitingRequestAuth = auth
      }
    } else if (type === 'human-bot') {
      this.newGame({ auth, name: '🧑' }, { auth: null, name: '🤖' })
    } else if (type === 'bot-bot') {
      this.newGame({ auth: null, name: '🤖' }, { auth: null, name: '🤖' })
    }
  }

  newGame (player1, player2) {
    if (Math.random() < 0.5) { // Random first player
      const tmp = player1
      player1 = player2
      player2 = tmp
    }

    const now = moment()
    const slugPrefix = now.format('YYMMDD')
    const slugMain = uuid()
    const slug = slugPrefix + '-' + slugMain

    const game = new GameServer(slug, player1, player2, now.format('HH:mm'))
    this.currentGames.unshift(game)

    this.updateGamesList()
  }

  updateGamesList (onlyForThisClient = null) {
    const data = {
      current: this.currentGames.map(game => game.summary()),
      last: this.lastGames.map(game => game.summary())
    }
    this.send(onlyForThisClient ? { instances: [onlyForThisClient] } : {}, 'games', data)
  }

  send ({ instances = null, auth = null }, type, data) {
    for (const client of this.clients) {
      if (instances && !instances.includes(client)) {
        continue
      }
      if (auth && !auth.includes(client.auth)) {
        continue
      }

      client.send(type, data)
    }
  }
}

module.exports = Manager
