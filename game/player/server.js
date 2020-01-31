const Player = require('./index')

class PlayerServer extends Player {
  constructor (game, id = 1) {
    super(game, id)
  }

  _isWinningPosition (row, col = null) {
    if (col === null) {
      row = Math.floor(row / 9)
    }
    return row === (this.id === 1 ? 0 : 8)
  }

  _recursiveFindBestPath (solutions) {
    let nextSolutions = [...solutions]

    let noSolutionPossible = true
    for (const solution of solutions) {
      if (solution.impossible) {
        continue
      }

      const lastPosition = solution.path[solution.path.length - 1]
      const newSolutionsPosition = this.game._getPossibleMoves(this.id, lastPosition.row, lastPosition.col).filter(c => {
        // Not a position already in the current solutions
        return !solutions.some(sol => sol.path.some(({ row, col }) => (row === c.row && col === c.col)))
      })

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
}

module.exports = PlayerServer
