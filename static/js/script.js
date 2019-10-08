let socket = {}

const setupSocket = () => {
  socket = io()
}

$('#sender').click(() => {
  const name = $('#name').val()
  let email = ''
  if($('#email').hasClass('valid')) email = $('#email').val()
  const subject = $('#subjectArea').val()
  const message = $('#messageArea').val()
  if(name && email && subject && message) {
    data = $('form').serialize()
    $.ajax({
      url: '/',
      type: 'post',
      data: data,
      success: function() {
        $('.modal').modal('close')
        alert('Thank you for the message ' + name + '!')
        $('form').trigger('reset')
      }
    })
  } else {
    let msg = 'Please fill in your '
    if(!name) msg += '1Name2 '
    if(!email) msg += '1Email Address2 '
    if(!subject) msg += '1Subject2 '
    if(!message) msg += '1Message2 '
    msg = msg.trim()
    const count = (msg.match(/1/g) || []).length
    switch(count) {
      case 2:
      case 3:
        msg = msg.replace(/1/g, '')
        msg = msg.replace(/2/g, ',')
        msg = msg.substr(0, msg.length - 1) + '.'
        let lastComma = msg.lastIndexOf(',')
        msg = msg.substr(0, lastComma) + ' and' + msg.substr(++lastComma)
        break
      case 4:
        msg = 'You didn\'t fill anything out.  Try again.'
        break
      default:
        msg = msg.replace(/1/g, '')
        msg = msg.replace(/2/g, '.')
        break
    }
    alert(msg)
  }
})

$(document).ready(() => {
  $('.modal').modal()
  setupSocket()
})
