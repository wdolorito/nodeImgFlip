const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const router = require(__dirname + '/routes')
const sockets = require(__dirname + '/sockets')(io)
const bodyParser = require('body-parser')
const fs = require('fs')

let port = 5000

app.use(express.static(__dirname + '/static'))
app.use(bodyParser.urlencoded({ extended: true }))

try {
  port = fs.readFileSync(__dirname + '/port', 'utf8')
  console.log('input port: ' + port)
} catch(error) {
  console.log(error.stack)
}

app.use('/', router)

io.on('connection', sockets.sock)

server.listen(port, function() {
  console.log('Live at Port ' + port)
})
