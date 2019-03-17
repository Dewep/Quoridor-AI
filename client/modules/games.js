import Vue from 'vue'

const GameClient = require('../../game/client')

const state = {
  current: [],
  last: [],
  watch: [],
  instances: {}
}

const getters = {
  currentGames: state => state.current || [],
  lastGames: state => state.last || [],
  getGameInstance: state => gameSlug => state.instances[gameSlug] || null
}

const actions = {
  newGame ({ commit }, { type }) {
    commit('WS_SEND', { type: 'new-game', data: { type } })
  },
  watchGame ({ state, commit }, { gameSlug }) {
    if (!state.watch.includes(gameSlug)) {
      commit('WS_EVENT', { type: 'game-watch', data: { gameSlug } })
      commit('WS_SEND', { type: 'watch-game', data: { gameSlug } })
    }
  },
  actionGame ({ commit }, { gameSlug, action }) {
    commit('WS_SEND', { type: 'action-game', data: { gameSlug, action } })
  }
}

const mutations = {
  WS_EVENT (state, { type, data }) {
    if (type === 'games') {
      state.current = data.current || []
      state.last = data.last || []
    }

    if (type === 'game-watch') {
      state.watch = [...state.watch, data.gameSlug]
    }

    if (type === 'game-state') {
      if (!state.instances[data.gameSlug]) {
        Vue.set(state.instances, data.gameSlug, new GameClient(data.gameSlug))
      }
      state.instances[data.gameSlug].updateState(data.state)
    }
  }
}

module.exports = {
  state,
  getters,
  actions,
  mutations
}
