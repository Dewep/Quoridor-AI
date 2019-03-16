const Player = require('./player')

class Game {
  constructor (history = null) {
    this.player1 = new Player(this, 1)
    this.player2 = new Player(this, 2)

    // history = 'p67,p13,p58,p22,p49,w36,p48,w34,w96,w24,w26,w89,p49,w108,w60,w123,w62,w43,w127,w114,w55,w57,w84,w13,w28,p13'
    // history = [null, ...history.split(',')]
    this.history = !history || !history.length ? [null] : history
    this.historyIndex = 0

    this._temporaryWall = null
    this._allowedMoves = null

    this.setHistory(this.history.length - 1)
  }

  getPlayer (id = 1) {
    return id === 1 ? this.player1 : this.player2
  }

  _isWallAt (position) {
    return this.player1.walls.includes(position) || this.player2.walls.includes(position) || position === this._temporaryWall
  }

  _isMoveCrossingWall (rowFrom, colFrom, rowTo, colTo) {
    const rowModification = rowTo - rowFrom
    const colModification = colTo - colFrom
    if (rowModification === -1 || rowModification === 1) {
      const wallPosition = (rowFrom + (rowModification === -1 ? -1 : 0)) * 8 + colFrom - 1
      if (colFrom > 0 && this._isWallAt(wallPosition)) {
        return true
      }
      if (colFrom < 8 && this._isWallAt(wallPosition + 1)) {
        return true
      }
    }
    if (colModification === -1 || colModification === 1) {
      const wallPosition = 64 + (rowFrom - 1) * 8 + colFrom + (colModification === -1 ? -1 : 0)
      if (rowFrom > 0 && this._isWallAt(wallPosition)) {
        return true
      }
      if (rowFrom < 8 && this._isWallAt(wallPosition + 8)) {
        return true
      }
    }
    if (colModification === 1 || colModification === -1) {
    }
    return false
  }

  get currentPlayer () {
    return this.getPlayer(this.currentPlayerID)
  }

  get allowedMoves () {
    if (!this._allowedMoves) {
      const cases = [
        { row: this.currentPlayer.row - 1, col: this.currentPlayer.col },
        { row: this.currentPlayer.row + 1, col: this.currentPlayer.col },
        { row: this.currentPlayer.row, col: this.currentPlayer.col - 1 },
        { row: this.currentPlayer.row, col: this.currentPlayer.col + 1 }
      ].filter(c => {
        if (c.row < 0 || c.row > 8 || c.col < 0 || c.col > 8) {
          return false
        }
        // Can't cross walls
        if (this._isMoveCrossingWall(this.currentPlayer.row, this.currentPlayer.col, c.row, c.col)) {
          return false
        }
        return true
      })
      const walls = !this.currentPlayer.remainingWalls ? [] : Array.from(Array(128).keys()).filter(w => {
        // Wall already placed at this position
        if (this._isWallAt(w)) {
          return false
        }
        // Can't cross other walls
        if (this._isWallAt(w + 64) || this._isWallAt(w - 64) || (w < 63 && this._isWallAt(w + 1)) || (w > 63 && this._isWallAt(w + 8))) {
          return false
        }
        // Can't block player to win
        this._temporaryWall = w
        if (!this.player1.isPossibleToWin(this._temporaryWall) || !this.player2.isPossibleToWin(this._temporaryWall)) {
          this._temporaryWall = null
          return false
        }
        this._temporaryWall = null

        return true
      })
      this._allowedMoves = { cases, walls }
    }
    return this._allowedMoves
  }

  getState (playerID = 1) {
    return this.getPlayer(playerID).state
  }

  placeWall (wallPosition) {
    return this._executeAction('w' + wallPosition)
  }

  movePlayer ({ index = null, row = null, col = null }) {
    if (index === null && row !== null && col !== null) {
      index = row * 9 + col
    }
    if (index !== null) {
      return this._executeAction('p' + index)
    }
    return null
  }

  _executeAction (action, addHistory = true) {
    if (!action || action.length < 2) {
      return
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

    this.player1.refreshBestPath()
    this.player2.refreshBestPath()

    this.currentPlayerID = this.currentPlayerID === 1 ? 2 : 1
    this._allowedMoves = null
  }

  reset () {
    this.player1.reset()
    this.player2.reset()
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

module.exports = Game
