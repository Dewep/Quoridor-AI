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
      const slug = this.newGame({ auth: null, name: '🤖' }, { auth: null, name: '🤖' })
      this.watchGame(slug, auth)
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

    if (player1.auth) {
      this.watchGame(slug, player1.auth)
    }
    if (player2.auth) {
      this.watchGame(slug, player2.auth)
    }

    return slug
  }

  watchGame (gameSlug, auth, sendEvent = true) {
    const game = this.currentGames.find(g => g.slug === gameSlug)

    if (!game) {
      return
    }

    if (sendEvent) {
      this.send({ auth }, 'watch-game', { gameSlug })
    }

    game.watch = [...game.watch.filter(a => a !== auth), auth]

    this.sendGameStatus(gameSlug, auth)
  }

  sendGameStatus (gameSlug, auth = null) {
    const game = this.currentGames.find(g => g.slug === gameSlug)

    if (!game) {
      return
    }

    const state = game.getState()
    for (const watchAuth of game.watch) {
      if (!auth || auth === watchAuth) {
        this.send({ auth: [watchAuth] }, 'game-state', { gameSlug, state })

        if (game.currentPlayer.auth === watchAuth) {
          const data = { gameSlug, currentPlayerID: game.currentPlayerID, allowedMoves: game.allowedMoves }
          this.send({ auth: [watchAuth] }, 'game-actions', data)
        }
      }
    }
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
