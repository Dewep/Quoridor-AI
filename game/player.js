class Player {
  constructor (game, id = 1) {
    id = id === 1 ? 1 : 2

    this.game = game
    this.id = id

    this.reset()
  }

  reset () {
    this.row = this.id === 1 ? 8 : 0
    this.col = 4

    this.walls = []
  }

  get bestPath () {
    return []
  }

  get opponent () {
    return this.id === 1 ? this.game.player2 : this.game.player1
  }

  get positionIndex () {
    return this.row * 9 + this.col
  }

  get remainingWalls () {
    return 10 - this.walls.length
  }

  get state () {
    return {
      my: {
        row: this.row,
        col: this.col,
        index: this.positionIndex,
        walls: this.walls,
        remainingWalls: this.remainingWalls
      },
      opponent: {
        row: this.opponent.row,
        col: this.opponent.col,
        index: this.opponent.positionIndex,
        walls: this.opponent.walls,
        remainingWalls: this.opponent.remainingWalls
      }
    }
  }
}

export default Player
