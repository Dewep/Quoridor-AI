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
    this._bestPath = null
  }

  _isWinningPosition (row, col = null) {
    if (col === null) {
      row = Math.floor(row / 9)
    }
    return row === (this.id === 1 ? 0 : 8)
  }

  _isAllowedMove (solutions, currentRow, currentCol, nextRow, nextCol) {
    // Stay on the board
    if (nextRow < 0 || nextCol < 0 || nextRow > 8 || nextCol > 8) {
      return false
    }
    // Check not a wall between currentRow/nextRow or nextRow/nextCol
    if (this.game._isMoveCrossingWall(currentRow, currentCol, nextRow, nextCol)) {
      return false
    }
    // Not a position already in the current solutions
    return !solutions.some(solution => solution.path.some(({ row, col }) => (row === nextRow && col === nextCol)))
  }

  _getNextSolutionPosition (allSolutions, currentSolution, rowModification, colModification) {
    const lastPosition = currentSolution.path[currentSolution.path.length - 1]
    const nextRow = lastPosition.row + rowModification
    const nextCol = lastPosition.col + colModification

    if (this._isAllowedMove(allSolutions, lastPosition.row, lastPosition.col, nextRow, nextCol)) {
      return { row: nextRow, col: nextCol }
    }

    return null
  }

  _recursiveFindBestPath (solutions) {
    let nextSolutions = [...solutions]

    let noSolutionPossible = true
    for (const solution of solutions) {
      if (solution.impossible) {
        continue
      }

      const newSolutionsPosition = [
        this._getNextSolutionPosition(nextSolutions, solution, 0, -1),
        this._getNextSolutionPosition(nextSolutions, solution, 0, 1),
        this._getNextSolutionPosition(nextSolutions, solution, -1, 0),
        this._getNextSolutionPosition(nextSolutions, solution, 1, 0)
      ]

      let noNewSolution = true
      for (const newSolutionPosition of newSolutionsPosition) {
        if (newSolutionPosition) {
          noNewSolution = false

          if (this._isWinningPosition(newSolutionPosition.row, newSolutionPosition.col)) {
            solution.path.push(newSolutionPosition)
            return solution.path
          }

          const newSolution = { impossible: false, path: [...solution.path, newSolutionPosition] }
          nextSolutions.push(newSolution)
        }
      }

      if (noNewSolution) {
        solution.impossible = true
      } else {
        nextSolutions = nextSolutions.filter(s => s !== solution)
        noSolutionPossible = false
      }
    }

    if (noSolutionPossible) {
      return null
    }

    return this._recursiveFindBestPath(nextSolutions)
  }

  isPossibleToWin (temporaryWall) {
    const bestPath = this._bestPath
    if (!bestPath) {
      return false
    }
    if (!bestPath.length) {
      return true
    }
    let bestPathCrossingTmpWall = false
    for (let index = 0; index < bestPath.length - 1; index++) {
      if (this.game._isMoveCrossingWall(bestPath[index].row, bestPath[index].col, bestPath[index + 1].row, bestPath[index + 1].col)) {
        bestPathCrossingTmpWall = true
        break
      }
    }
    if (!bestPathCrossingTmpWall) {
      return true
    }
    const newBestPath = this._recursiveFindBestPath([
      { impossible: false, path: [{ row: this.row, col: this.col }] }
    ])
    return newBestPath !== null
  }

  refreshBestPath () {
    if (this._isWinningPosition(this.row, this.col)) {
      this._bestPath = []
      return
    }
    this._bestPath = this._recursiveFindBestPath([
      { impossible: false, path: [{ row: this.row, col: this.col }] }
    ])
  }

  get cannotWinAnymore () {
    return this._bestPath === null
  }

  get bestPath () {
    return this._bestPath || []
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

module.exports = Player
