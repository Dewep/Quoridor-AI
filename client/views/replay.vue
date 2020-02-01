<template>
  <div class="flex-view game">
    <div class="flex-extensible-fixed">
      <div class="board">
        <div v-for="(row, $rowIndex) in grid" :key="'row-' + $rowIndex" class="row">
          <div
            v-for="(col, $colIndex) in row"
            :key="'col-' + $colIndex"
            :class="col.classes"
            @click.prevent="col.click"
          >
            <div class="player" />
            <div class="cross-1" />
            <div class="cross-2" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-fixed flex-view flex-column game-info">
      <div class="flex-fixed">
        <div class="columns m-1 mt-2 p-1">
          <div class="column col-6">
            <section class="player player-1" :class="{ current: currentPlayerID === 1 }">
              <h5>Player 1</h5>
              <small>Remaining walls: {{ game.player1.remainingWalls }}</small><br>
              <small>Tiles to the victory: {{ game.player1.bestPath ? game.player1.bestPath.length : 'N/A' }}</small><br>
              <small>Evaluation score: {{ game.player1.score || 'N/A' }}</small>
            </section>
          </div>
          <div class="column col-6">
            <section class="player player-2" :class="{ current: currentPlayerID === 2 }">
              <h5>Player 2</h5>
              <small>Remaining walls: {{ game.player2.remainingWalls }}</small><br>
              <small>Tiles to the victory: {{ game.player2.bestPath ? game.player2.bestPath.length : 'N/A' }}</small><br>
              <small>Evaluation score: {{ game.player2.score || 'N/A' }}</small>
            </section>
          </div>
        </div>
      </div>

      <div class="flex-extensible">
        <h6>History</h6>
        <!-- <div>
          <input v-model="index" type="number">
          <button class="btn btn-primary" @click="placeWall">
            Wall
          </button>
          <button class="btn btn-primary" @click="movePlayer">
            Move
          </button>
        </div> -->
        <ul class="menu without-bg">
          <li
            v-for="(item, $index) in history"
            :key="item.uuid + $index"
            class="menu-item"
          >
            <a href="#">
              {{ item.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const Game = require('@/game')

module.exports = {
  name: 'game',

  data () {
    return {
      index: '',
      game: new Game()
    }
  },

  computed: {
    currentPlayerID () {
      return this.game.currentPlayerID
    },
    history () {
      return [
        { uuid: '2019-03-19-11-21-43588-HH-kajvbzz', name: '🧑 vs 🧑' },
        { uuid: '2019-03-19-11-20-43588-HR-kajvbzz', name: '🧑 vs 🤖' },
        { uuid: '2019-03-19-11-19-43588-RH-kajvbzz', name: '🤖 vs 🧑' },
        { uuid: '2019-03-19-11-18-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-17-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-16-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-21-43588-HH-kajvbzz', name: '🧑 vs 🧑' },
        { uuid: '2019-03-19-11-20-43588-HR-kajvbzz', name: '🧑 vs 🤖' },
        { uuid: '2019-03-19-11-19-43588-RH-kajvbzz', name: '🤖 vs 🧑' },
        { uuid: '2019-03-19-11-18-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-17-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-16-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-21-43588-HH-kajvbzz', name: '🧑 vs 🧑' },
        { uuid: '2019-03-19-11-20-43588-HR-kajvbzz', name: '🧑 vs 🤖' },
        { uuid: '2019-03-19-11-19-43588-RH-kajvbzz', name: '🤖 vs 🧑' },
        { uuid: '2019-03-19-11-18-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-17-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-16-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-21-43588-HH-kajvbzz', name: '🧑 vs 🧑' },
        { uuid: '2019-03-19-11-20-43588-HR-kajvbzz', name: '🧑 vs 🤖' },
        { uuid: '2019-03-19-11-19-43588-RH-kajvbzz', name: '🤖 vs 🧑' },
        { uuid: '2019-03-19-11-18-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-17-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-16-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-21-43588-HH-kajvbzz', name: '🧑 vs 🧑' },
        { uuid: '2019-03-19-11-20-43588-HR-kajvbzz', name: '🧑 vs 🤖' },
        { uuid: '2019-03-19-11-19-43588-RH-kajvbzz', name: '🤖 vs 🧑' },
        { uuid: '2019-03-19-11-18-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-17-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-16-43588-RR-kajvbzz', name: '🤖 vs 🤖' },
        { uuid: '2019-03-19-11-15-43588-RR-kajvbzz', name: '🤖 vs 🤖' }
      ]
    },
    grid () {
      const rows = []

      for (let y = 0; y < 9; y++) {
        if (y > 0) {
          const cols = []
          for (let x = 0; x < 9; x++) {
            const wallPosition = y * 8 - 8 + x - 1

            if (x > 0) {
              if (this.game.player1.walls.includes(wallPosition) || this.game.player1.walls.includes(64 + wallPosition)) {
                cols.push({ classes: ['wall wall-point wall-player-1'], click: () => {} })
              } else if (this.game.player2.walls.includes(wallPosition) || this.game.player2.walls.includes(64 + wallPosition)) {
                cols.push({ classes: ['wall wall-point wall-player-2'], click: () => {} })
              } else {
                cols.push({ classes: ['wall wall-point'], click: () => {} })
              }
            }

            const classes = ['wall wall-horizontal']
            if ((x > 0 && this.game.player1.walls.includes(wallPosition)) || (x < 8 && this.game.player1.walls.includes(wallPosition + 1))) {
              classes.push('wall-player-1')
            } else if ((x > 0 && this.game.player2.walls.includes(wallPosition)) || (x < 8 && this.game.player2.walls.includes(wallPosition + 1))) {
              classes.push('wall-player-2')
            } else if (this.game.allowedMoves && x < 8 && this.game.allowedMoves.walls.includes(wallPosition + 1)) {
              classes.push('wall-place')
            }
            const click = () => {
              if (classes.includes('wall-place')) {
                this.game.placeWall(wallPosition + 1)
              }
            }
            cols.push({ classes, click })
          }
          rows.push(cols)
        }

        const cols = []
        for (let x = 0; x < 9; x++) {
          if (x > 0) {
            const wallPosition = y * 8 + x - 1

            const classes = ['wall wall-vertical']
            if (this.game.player1.walls.includes(64 + wallPosition) || (y > 0 && this.game.player1.walls.includes(64 + wallPosition - 8))) {
              classes.push('wall-player-1')
            } else if (this.game.player2.walls.includes(64 + wallPosition) || (y > 0 && this.game.player2.walls.includes(64 + wallPosition - 8))) {
              classes.push('wall-player-2')
            } else if (this.game.allowedMoves && this.game.allowedMoves.walls.includes(64 + wallPosition)) {
              classes.push('wall-place')
            }
            const click = () => {
              if (classes.includes('wall-place')) {
                this.game.placeWall(64 + wallPosition)
              }
            }
            cols.push({ classes, click })
          }

          const classes = ['tile']
          if (this.game.player1.row === y && this.game.player1.col === x) {
            classes.push('player-1')
          } else if (this.game.player2.row === y && this.game.player2.col === x) {
            classes.push('player-2')
          } else if (this.game.allowedMoves && this.game.allowedMoves.tiles.some(c => c.row === y && c.col === x)) {
            classes.push('tile-move')
          }
          if (this.game.player1.bestPath.some(c => c.row === y && c.col === x)) {
            classes.push('path-player-1')
          }
          if (this.game.player2.bestPath.some(c => c.row === y && c.col === x)) {
            classes.push('path-player-2')
          }
          const click = ((tileY, tileX) => {
            return () => {
              if (classes.includes('tile-move')) {
                this.game.movePlayer({ row: tileY, col: tileX })
              }
            }
          })(y, x)
          cols.push({ classes, click })
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
@import "../styles/variables.scss";

.game {
  background: $board-color;
}

.game-info {
  .player {
    border-radius: .5rem;
    border: .1rem solid $board-color;
    opacity: .6;
    padding: .5rem;
    color: #FFF;
    width: 9rem;
    text-align: center;

    &.player-1 {
      background: $player-one-color;
    }
    &.player-2 {
      background: $player-two-color;
    }
    &.current {
      border-color: $primary-color;
      opacity: 1;
    }
  }
}

.board {
  padding: 20px 20px 60px;
  max-width: 44rem;

  .row {
    clear: both;
  }
  .tile {
    padding-top: 9%;
    width: 9%;
    float: left;
  }
  .wall {
    padding-top: 2%;
    width: 2%;
    float: left;
    position: relative;

    &.wall-place:hover::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: #CCC;
      cursor: pointer;
      z-index: 1;
    }
  }

  .wall-horizontal {
    width: 9%;

    &.wall-place:hover::after {
      right: -122%;
    }
  }
  .wall-vertical {
    padding-top: 9%;

    &.wall-place:hover::after {
      bottom: -122%;
    }
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
    opacity: .2;
  }
  .cross-1 {
    top: 40%;
    left: 40%;
    bottom: 40%;
    right: 40%;
  }
  .cross-2 {
    top: 40%;
    left: 40%;
    bottom: 40%;
    right: 40%;
  }
  .wall-player-1,
  .player-1 .player,
  .path-player-1 .cross-1 {
    background: $player-one-color;
  }
  .wall-player-2,
  .player-2 .player,
  .path-player-2 .cross-2 {
    background: $player-two-color;
  }
  .tile {
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
  // .path-player-1.player-1,
  // .path-player-1.player-2,
  // .path-player-2.player-1,
  // .path-player-2.player-2 {
  //   .cross-1 {
  //     right: 75%;
  //     bottom: 75%;
  //   }
  //   .cross-2 {
  //     top: 75%;
  //     left: 75%;
  //   }
  // }
  .tile-move:hover {
    background: #CCC;
    cursor: pointer;
  }
}
</style>
