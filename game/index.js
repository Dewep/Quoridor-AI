import Player from './player'

class Game {
  constructor (history = null) {
    this.player1 = new Player(this, 1)
    this.player2 = new Player(this, 2)

    this.history = !history || !history.length ? [null] : history
    this.historyIndex = 0

    this.setHistory(this.history.length - 1)
  }

  getPlayer (id = 1) {
    return id === 1 ? this.player1 : this.player2
  }

  get currentPlayer () {
    return this.getPlayer(this.currentPlayerID)
  }

  get allowedMoves () {
    const cases = [
      { row: this.currentPlayer.row - 1, col: this.currentPlayer.col },
      { row: this.currentPlayer.row + 1, col: this.currentPlayer.col },
      { row: this.currentPlayer.row, col: this.currentPlayer.col - 1 },
      { row: this.currentPlayer.row, col: this.currentPlayer.col + 1 }
    ].filter(c => {
      if (c.row < 0 || c.row > 8 || c.col < 0 || c.col > 8) {
        return false
      }
      // TODO: Can't cross walls
      return true
    })
    const walls = !this.currentPlayer.remainingWalls ? [] : Array.from(Array(128).keys()).filter(w => {
      if (this.player1.walls.includes(w) || this.player2.walls.includes(w)) {
        return false
      }
      // TODO: Can't place walls where emplacements are used by other walls
      // TODO: Can't cross other walls
      // TODO: Can't block player to win
      return true
    })
    return {
      cases,
      walls
    }
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

  _executeAction (action) {
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

    this.currentPlayerID = this.currentPlayerID === 1 ? 2 : 1
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
        this._executeAction(action)
      }

      this.historyIndex += 1
    }
  }
}

export default Game
