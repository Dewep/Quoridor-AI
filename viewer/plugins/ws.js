module.exports = store => {
  // called when the store is initialized

  let socket = null
  let authToken = window.localStorage.authToken || null

  function eventHandler (type, data) {
    if (type === 'toto') {
      // ...
    } else {
      store.commit('WS_EVENT', { type, data })
    }
  }

  function send (type, data) {
    if (socket) {
      socket.send(JSON.stringify({ type, data }))
    } else {
      console.warn('WS not opened, cannot send', type)
    }
  }

  function connect () {
    store.dispatch('setAuth', { loading: true, connected: false })

    socket = new WebSocket('ws://127.0.0.1:8061')

    socket.addEventListener('open', function (event) {
      send('auth', { auth: authToken })
    })

    socket.addEventListener('close', function (event) {
      store.dispatch('setAuth', { loading: false, connected: false })
      setTimeout(connect, 3000)
    })

    socket.addEventListener('message', function (event) {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'auth') {
          if (payload.data.auth) {
            window.localStorage.authToken = payload.data.auth
            authToken = payload.data.auth
          }
          store.dispatch('setAuth', { loading: false, connected: true })
        } else {
          eventHandler(payload.type, payload.data)
        }
      } catch (err) {
        console.warn('WS JSON error:', event.data || event, err)
      }
    })
  }

  connect()

  store.subscribe(({ type, payload }) => {
    if (type === 'WS_SEND' && payload.type && payload.data) {
      send(payload.type, payload.data)
    }
  })
}
