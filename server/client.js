const uuid = require('uuid/v4')

class Client {
  constructor (manager, ws) {
    this.manager = manager
    this.ws = ws

    this.auth = null

    this.ws.on('close', () => this.close())
    this.ws.on('message', message => this.onMessage(message))
  }

  close () {
    if (this.auth) {
      this.manager.removeClient(this)
    }
  }

  onMessage (message) {
    try {
      const { type, data } = JSON.parse(message)

      if (!this.auth) {
        if (type === 'auth') {
          if (!data.auth) {
            data.auth = 'c-' + uuid()
          }
          this.auth = data.auth
          this.send('auth', { auth: data.auth })
          this.manager.addClient(this)
          return
        } else {
          throw new Error('Auth required')
        }
      }

      if (type === 'new-game') {
        this.manager.newGameRequest(data.type, this.auth)
      } else if (type === 'watch-game') {
        this.manager.watchGame(data.gameSlug, this.auth, false)
      } else if (type === 'action-game') {
        this.manager.actionGame(data.gameSlug, this.auth, data.action)
      } else {
        console.info('Client.onMessage unknown type =', type)
      }
    } catch (err) {
      console.warn('Client.onMessage error:', err)
      this.close()
    }
  }

  send (type, data) {
    this.ws.send(JSON.stringify({ type, data }), (err) => {
      if (err) {
        console.warn('Client.send error:', err)
        this.close()
      }
    })
  }
}

module.exports = Client
