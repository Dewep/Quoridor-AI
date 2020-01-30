const uuid = require('uuid/v4')
const moment = require('moment')
const GameServer = require('../game/server')

class Manager {
  constructor () {
    this.clients = []

    this.currentGames = []
    this.lastGames = []
    this.loadedGames = []
    this._waitingRequestAuth = null
  }

  _getGame (gameSlug) {
    return this.loadedGames.find(g => g.slug === gameSlug) || null
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
        this._waitingRequestAuth = null
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
    game.reset()
    this.loadedGames.unshift(game)
    this.currentGames.unshift(slug)

    this.updateGamesList()

    if (player1.auth) {
      this.watchGame(slug, player1.auth)
    }
    if (player2.auth) {
      this.watchGame(slug, player2.auth)
    }

    return slug
  }

  actionGame (gameSlug, auth, action) {
    const game = this._getGame(gameSlug)

    if (!game) {
      return
    }

    if (game.currentPlayer.auth !== auth) {
      return
    }

    // TODO: Convert allowedMoves into array of string (actions), then check if action is allowed
    // if (!game.allowedMoves || !game.allowedMoves.includes(action)) {
    //   return
    // }

    game._executeAction(action)

    this.sendGameStatus(gameSlug)

    if (game.isEnd) {
      this.currentGames = this.currentGames.filter(slug => slug !== game.slug)
      this.lastGames.unshift(game.slug)

      // TODO: save game in a file

      this.updateGamesList()
    }
  }

  watchGame (gameSlug, auth, sendEvent = true) {
    let game = this._getGame(gameSlug)

    if (!game) {
      // TODO: Check if game is saved in a file?
    }

    if (!game) {
      this.send({ auth: [auth] }, 'game-not-found', { gameSlug })
      console.warn('[Watch-Game] Not found:', gameSlug)
      return
    }

    if (sendEvent) {
      this.send({ auth }, 'game-watch', { gameSlug })
    }

    game.watch = [...game.watch.filter(a => a !== auth), auth]

    this.sendGameStatus(gameSlug, auth)
  }

  sendGameStatus (gameSlug, auth = null) {
    const game = this._getGame(gameSlug)

    if (!game) {
      return
    }

    const state = game.getState()
    for (const watchAuth of game.watch) {
      if (!auth || auth === watchAuth) {
        const data = { gameSlug, state: { ...state } }
        if (game.currentPlayer.auth !== watchAuth) {
          data.state.allowedMoves = null
        }
        this.send({ auth: [watchAuth] }, 'game-state', data)
      }
    }
  }

  updateGamesList (onlyForThisClient = null) {
    const data = {
      current: this.currentGames.map(slug => this._getGame(slug)).filter(g => g).map(game => game.summary()),
      last: this.lastGames.map(slug => this._getGame(slug)).filter(g => g).map(game => game.summary())
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
