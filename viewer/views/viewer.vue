<template>
  <div>
    <div class="viewer">
      <div class="board">
        <div v-for="(row, $rowIndex) in grid" :key="'row-' + $rowIndex" class="row">
          <div v-for="(col, $colIndex) in row" :key="'col-' + $colIndex" :class="col">
            <div class="player" />
            <div class="cross-1" />
            <div class="cross-2" />
          </div>
        </div>
      </div>
    </div>
    <input v-model="index" type="number">
    <button class="btn btn-primary" @click="placeWall">
      Wall
    </button>
    <button class="btn btn-primary" @click="movePlayer">
      Move
    </button>
  </div>
</template>

<script>
import Game from '@/game'

export default {
  name: 'viewer',

  data () {
    return {
      index: '',
      game: new Game()
    }
  },

  computed: {
    grid () {
      const rows = []

      for (let y = 0; y < 9; y++) {
        if (y > 0) {
          const cols = []
          for (let x = 0; x < 9; x++) {
            const wallPosition = y * 8 - 8 + x - 1

            if (x > 0) {
              if (this.game.player1.walls.includes(wallPosition) || this.game.player1.walls.includes(64 + wallPosition)) {
                cols.push(['wall wall-point wall-player-1'])
              } else if (this.game.player2.walls.includes(wallPosition) || this.game.player2.walls.includes(64 + wallPosition)) {
                cols.push(['wall wall-point wall-player-2'])
              } else {
                cols.push(['wall wall-point'])
              }
            }

            if ((x > 0 && this.game.player1.walls.includes(wallPosition)) || (x < 8 && this.game.player1.walls.includes(wallPosition + 1))) {
              cols.push(['wall wall-horizontal wall-player-1'])
            } else if ((x > 0 && this.game.player2.walls.includes(wallPosition)) || (x < 8 && this.game.player2.walls.includes(wallPosition + 1))) {
              cols.push(['wall wall-horizontal wall-player-2'])
            } else {
              cols.push(['wall wall-horizontal'])
            }
          }
          rows.push(cols)
        }

        const cols = []
        for (let x = 0; x < 9; x++) {
          if (x > 0) {
            const wallPosition = y * 8 + x - 1

            if (this.game.player1.walls.includes(64 + wallPosition) || (y > 0 && this.game.player1.walls.includes(64 + wallPosition - 8))) {
              cols.push(['wall wall-vertical wall-player-1'])
            } else if (this.game.player2.walls.includes(64 + wallPosition) || (y > 0 && this.game.player2.walls.includes(64 + wallPosition - 8))) {
              cols.push(['wall wall-vertical wall-player-2'])
            } else {
              cols.push(['wall wall-vertical'])
            }
          }

          const classes = ['case']
          if (this.game.player1.row === y && this.game.player1.col === x) {
            classes.push('player-1')
          } else if (this.game.player2.row === y && this.game.player2.col === x) {
            classes.push('player-2')
          } else if (this.game.allowedMoves.cases.some(c => c.row === y && c.col === x)) {
            classes.push('case-move')
          }
          if (this.game.player1.bestPath.some(c => c.row === y && c.col === x)) {
            classes.push('path-player-1')
          }
          if (this.game.player2.bestPath.some(c => c.row === y && c.col === x)) {
            classes.push('path-player-2')
          }
          cols.push(classes)
        }
        rows.push(cols)
      }

      return rows
    }
  },

  methods: {
    placeWall () {
      this.game.placeWall(+this.index)
      this.index = ''
    },
    movePlayer () {
      this.game.movePlayer({ index: +this.index })
      this.index = ''
    }
  }
}
</script>

<style lang="scss">
.board {
  background: #5f5353;
  padding: 20px 20px 60px;

  .row {
    clear: both;
  }
  .case {
    height: 40px;
    width: 40px;
    float: left;
  }
  .wall {
    height: 10px;
    width: 10px;
    float: left;
  }
  .wall-horizontal {
    width: 40px;
  }
  .wall-vertical {
    height: 40px;
  }
  .wall {
    background: #ecd8d8;
  }
  .player,
  .cross-1,
  .cross-2 {
    top: 5px;
    left: 5px;
    bottom: 5px;
    right: 5px;
    position: absolute;
    display: none;
  }
  .player {
    border-radius: 50%;
  }
  .cross-1,
  .cross-2 {
    top: 1px;
    left: 1px;
    bottom: 1px;
    right: 1px;
    position: absolute;
    border-radius: 50%;
    opacity: .25;
  }
  .cross-1 {
    right: 25px;
    bottom: 25px;
  }
  .cross-2 {
    top: 25px;
    left: 25px;
  }
  .wall-player-1,
  .player-1 .player,
  .path-player-1 .cross-1 {
    background: red;
  }
  .wall-player-2,
  .player-2 .player,
  .path-player-2 .cross-2 {
    background: green;
  }
  .case {
    background: #FFF;
    position: relative;
  }
  .player-1,
  .player-2 {
    .player {
      display: block;
    }
  }
  .path-player-1 {
    .cross-1 {
      display: block;
    }
  }
  .path-player-2 {
    .cross-2 {
      display: block;
    }
  }
  .path-player-1.player-1,
  .path-player-1.player-2,
  .path-player-2.player-1,
  .path-player-2.player-2 {
    .cross-1 {
      right: 30px;
      bottom: 30px;
    }
    .cross-2 {
      top: 30px;
      left: 30px;
    }
  }
  .case-move:hover {
    background: #CCC;
    cursor: pointer;
  }
}
</style>
