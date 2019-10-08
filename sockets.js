const imgflip = require(__dirname + '/imgflip')
let thisIo = {}

const sock = async socket => {
  console.log(Date(), 'client', socket.id, 'connected')
}

module.exports = function(io) {
  thisIo = io

  let funcs = {}
  funcs.sock = sock

  return funcs
}
