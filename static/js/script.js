let socket = {}

const setupSocket = () => {
  socket = io()
}

$(document).ready(() => {
  $('.modal').modal()
  setupSocket()
})
