
const http = require('http')
const express = require('express')
const WebSocket = require('ws')
const path = require('path')
const Manager = require('./manager')
const Client = require('./client')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(express.static('dist'))

const manager = new Manager()

function noop () {}

function heartbeat () {
  this.isAlive = true
}

wss.on('connection', function connection (client) {
  client.isAlive = true
  client.on('pong', heartbeat)

  return new Client(manager, client)
})

setInterval(function ping() {
  for (const client of wss.clients) {
    if (client.isAlive === false) {
      client.terminate()
    } else {
      client.isAlive = false
      client.ping(noop)
    }
  }
}, 30000)

function indexFallback (req, res) {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
}
app.get('/', indexFallback)
app.get('*', indexFallback)

server.listen(8061, () => console.info('Listening on http://127.0.0.1:8061'))
