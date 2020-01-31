const Game = require('./index')
const PlayerServer = require('./player/server')

class GameServer extends Game {
  constructor (slug, player1, player2, date) {
    super(null)

    this.slug = slug
    this.date = date
    this.watch = []

    this.player1 = new PlayerServer(this, 1)
    this.player2 = new PlayerServer(this, 2)

    this.player1.auth = player1.auth
    this.player1.name = player1.name
    this.player2.auth = player2.auth
    this.player2.name = player2.name

    if (player1.auth) {
      this.watch.push(player1.auth)
    }
    if (player2.auth) {
      this.watch.push(player2.auth)
    }
  }

  reset () {
    super.reset()

    this.player1.refreshBestPath()
    this.player2.refreshBestPath()
  }

  _executeAction (action, addHistory = true) {
    if (!super._executeAction(action, addHistory)) {
      return false
    }

    this.player1.refreshBestPath()
    this.player2.refreshBestPath()

    return true
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

  _isOpponentOnCase (rowTo, colTo) {
    if (this.opponentPlayer.row === rowTo && this.opponentPlayer.col === colTo) {
      return true
    }
    return false
  }

  get allowedMoves () {
    if (!this._allowedMoves) {
      const adjacentCases = [
        { row: this.currentPlayer.row - 1, col: this.currentPlayer.col },
        { row: this.currentPlayer.row + 1, col: this.currentPlayer.col },
        { row: this.currentPlayer.row, col: this.currentPlayer.col - 1 },
        { row: this.currentPlayer.row, col: this.currentPlayer.col + 1 }
      ]

      const cases = adjacentCases.filter(c => {
        if (c.row < 0 || c.row > 8 || c.col < 0 || c.col > 8) {
          return false
        }
        // Can't cross walls
        if (this._isMoveCrossingWall(this.currentPlayer.row, this.currentPlayer.col, c.row, c.col)) {
          return false
        }
        // Can't be on same position as opponent
        if (this._isOpponentOnCase(c.row, c.col)) {
          return false
        }
        return true
      })

      const occupiedCases = adjacentCases.filter(c => {
        return this._isOpponentOnCase(c.row, c.col)
      })
      let adjacentToOpponentCases = []
      for (const c of occupiedCases) {
        adjacentToOpponentCases.push({ opponent: c, row: c.row - 1, col: c.col })
        adjacentToOpponentCases.push({ opponent: c, row: c.row + 1, col: c.col })
        adjacentToOpponentCases.push({ opponent: c, row: c.row, col: c.col - 1 })
        adjacentToOpponentCases.push({ opponent: c, row: c.row, col: c.col + 1 })
      }
      const afterJumpCases = adjacentToOpponentCases.filter(c => {
        if (c.row < 0 || c.row > 8 || c.col < 0 || c.col > 8) {
          return false
        }
        // Can't cross walls
        if (this._isMoveCrossingWall(c.opponent.row, c.opponent.col, c.row, c.col)) {
          return false
        }
        // Don't go back to original case
        if (this.currentPlayer.row === c.row && this.currentPlayer.col === c.col) {
          return false
        }
        return true
      })
      for (const c of afterJumpCases) {
        cases.push({ row: c.row, col: c.col })
      }

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
