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

  _isPossibleMove (fromRow, fromCol, toRow, toCol, player) {
    // Sides of the board
    if (toRow < 0 || toRow > 8 || toCol < 0 || toCol > 8) {
      return false
    }
    // Can't cross walls
    if (this._isMoveCrossingWall(fromRow, fromCol, toRow, toCol)) {
      return false
    }
    // Can't go the current player position (in case of override positions)
    if (player.row === toRow && player.col === toCol) {
      return false
    }
    return true
  }

  _getPossibleMoves (playerID = null, row = null, col = null) {
    playerID = playerID || this.currentPlayerID
    const current = this.getPlayer(playerID)
    const opponent = this.getOtherPlayer(playerID)

    // If no override (in case of simulation to find the best path), get the real positions
    row = row === null ? this.getPlayer(playerID).row : row
    col = col === null ? this.getPlayer(playerID).col : col

    let jumpOpponent = false

    // Start with the basic moves
    const tiles = [
      { row: row - 1, col: col },
      { row: row + 1, col: col },
      { row: row, col: col - 1 },
      { row: row, col: col + 1 }
    ].filter(tile => {
      // Sides, walls, initial position
      if (!this._isPossibleMove(row, col, tile.row, tile.col, current)) {
        return false
      }
      // Can't be on same position as opponent
      if (opponent.row === tile.row && opponent.col === tile.col) {
        jumpOpponent = true
        return false
      }
      return true
    })

    // We can jump the opponent
    if (jumpOpponent) {
      const rowModification = opponent.row - row
      const colModification = opponent.col - col

      // Jump forward
      const forwardJumpTiles = [
        { row: row + rowModification * 2, col: col + colModification * 2 }
      ].filter(tile => this._isPossibleMove(opponent.row, opponent.col, tile.row, tile.col, current))

      if (forwardJumpTiles.length) {
        tiles.push(...forwardJumpTiles)
      } else {
        // Jump on the sides
        const sideJumpTiles = [
          { row: opponent.row + colModification, col: opponent.col + rowModification },
          { row: opponent.row - colModification, col: opponent.col - rowModification }
        ].filter(tile => this._isPossibleMove(opponent.row, opponent.col, tile.row, tile.col, current))

        tiles.push(...sideJumpTiles)
      }
    }

    return tiles
  }

  get allowedMoves () {
    if (!this._allowedMoves) {
      const cases = this._getPossibleMoves()

      const walls = !this.currentPlayer.remainingWalls ? [] : Array.from(Array(128).keys()).filter(w => {
        // Wall already placed at this position
        if (this._isWallAt(w)) {
          return false
        }
        // Can't cross other walls
        if (this._isWallAt(w + 64) || this._isWallAt(w - 64) || (w < 63 && w % 8 !== 7 && this._isWallAt(w + 1)) || (w > 63 && this._isWallAt(w + 8))) {
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
