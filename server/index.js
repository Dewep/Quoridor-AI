
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

wss.on('connection', function connection (ws) {
  return new Client(manager, ws)
})

function indexFallback (req, res) {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
}
app.get('/', indexFallback)
app.get('*', indexFallback)

server.listen(8061, () => console.info('Listening on http://127.0.0.1:8061'))
