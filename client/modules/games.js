const state = {
  current: [],
  last: []
}

const getters = {
  currentGames: state => state.current || [],
  lastGames: state => state.last || []
}

const actions = {
  newGame ({ commit }, { type }) {
    commit('WS_SEND', { type: 'new-game', data: { type } })
  }
}

const mutations = {
  WS_EVENT (state, { type, data }) {
    if (type === 'games') {
      state.current = data.current || []
      state.last = data.last || []
    }
  }
}

module.exports = {
  state,
  getters,
  actions,
  mutations
}
