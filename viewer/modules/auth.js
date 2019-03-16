const state = {
  loading: false,
  connected: false
}

const getters = {
  isAuthLoading: state => state.loading === true,
  isAuthConnected: state => state.connected === true
}

const actions = {
  async setAuth ({ commit }, { loading, connected }) {
    commit('SET_AUTH', { loading, connected })
  }
}

const mutations = {
  SET_AUTH (state, { loading, connected }) {
    state.loading = loading === true
    state.connected = connected === true
  },

  WS_SEND (state, { type, data }) {
    // Mutation used to send data on the WS
  }
}

module.exports = {
  state,
  getters,
  actions,
  mutations
}
