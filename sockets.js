const imgflip = require(__dirname + '/imgflip')
let thisIo = {}

const sock = socket => {
  console.log(Date(), 'client', socket.id, 'connected')

  socket.on('getall', () => {
    const getall = imgflip.getMemes()
    getall.then(result => {
      if(result) socket.emit('gotall', result)
    }).catch(err => {
      console.log(err)
    })
  })

  socket.on('create', (payload) => {
    const toWork = payload

    if(!toWork.username) {
      toWork.username = 'nodeImgflip'
      toWork.password = 'nodeImgflip'
    }

    const create = imgflip.createMeme(toWork)
    create.then(result => {
      socket.emit('created', result)
    })
  })

  socket.on('disconnect', function () {
    console.log(Date(), 'client', this.id, 'disconnected')
  })
}

module.exports = function(io) {
  thisIo = io

  let funcs = {}
  funcs.sock = sock

  return funcs
}
