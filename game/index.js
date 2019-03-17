// const Player = require('./player')

class Game {
  constructor (history = null) {
    // this.player1 = new Player(this, 1)
    // this.player2 = new Player(this, 2)

    // history = 'p67,p13,p58,p22,p49,w36,p48,w34,w96,w24,w26,w89,p49,w108,w60,w123,w62,w43,w127,w114,w55,w57,w84,w13,w28,p13'
    // history = [null, ...history.split(',')]
    // this.history = !history || !history.length ? [null] : history
    this.history = [null]
    this.historyIndex = 0

    this._temporaryWall = null
    this._allowedMoves = null

    // this.setHistory(this.history.length - 1)
  }

  getPlayer (id = 1) {
    return id === 1 ? this.player1 : this.player2
  }

  get currentPlayer () {
    return this.getPlayer(this.currentPlayerID)
  }

  reset () {
    this.player1.reset()
    this.player2.reset()
  }

  _executeAction (action, addHistory = true) {
    if (!action || action.length < 2) {
      return false
    }

    const type = action[0]
    const index = +action.slice(1)

    if (type === 'w') {
      this.currentPlayer.walls.push(index)
    }
    if (type === 'p') {
      this.currentPlayer.row = Math.floor(index / 9)
      this.currentPlayer.col = index % 9
    }

    if (addHistory) {
      this.history.push(action)
      this.historyIndex += 1
    }

    this.currentPlayerID = this.currentPlayerID === 1 ? 2 : 1
    this._allowedMoves = null

    return true
  }

  get allowedMoves () {
    return this._allowedMoves || null
  }

  getState () {
    return {
      history: this.history.slice(1).join(','),
      player1: {
        bestPath: this.player1.bestPath
      },
      player2: {
        bestPath: this.player2.bestPath
      },
      currentPlayerID: this.currentPlayerID,
      allowedMoves: this.allowedMoves
    }
  }

  updateState (state) {
    this.history = [null, ...state.history.split(',')]
    this.historyIndex = 0

    this.setHistory(this.history.length - 1)

    this.player1._bestPath = state.player1.bestPath
    this.player2._bestPath = state.player2.bestPath

    this.currentPlayerID = state.currentPlayerID
    this._allowedMoves = state.allowedMoves
  }

  setHistory (historyIndex) {
    this.reset()
    this.currentPlayerID = 1
    this.historyIndex = 0

    while (this.historyIndex < this.history.length && this.historyIndex <= historyIndex) {
      const action = this.history[this.historyIndex]

      if (action) {
        this._executeAction(action, false)
      }

      this.historyIndex += 1
    }
  }
}

module.exports = Game
