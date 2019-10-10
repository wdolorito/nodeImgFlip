let socket = {}
let loadedmemes = []
let font = 'impact'
let current = 0

const setupSocket = () => {
  socket = io()

  socket.on('gotall', raw => {
    populateAll(raw)
    populateWorker(0)
  })

  socket.on('created', resp => {
    console.log(resp)
  })
}

const findid = meme => {
  return meme.id === meme
}

const handleClick = mid => {
  populateWorker(mid)
  $(window).scrollTop(0)
}

const populateAll = raw => {
  loadedmemes = []
  let json = JSON.parse(raw)
  if(json.success) {
    const memes = json.data.memes
    const len = memes.length
    let html = ''
    for(let count = 0; count < len; count++) {
      const meme = memes[count]
      loadedmemes.push(meme)

      const newrow = count % 3
      if(newrow === 0) {
        html += '<div class="row">\n'
      }
      html += '  <div class="col s12 m4">\n'
      html += '    <div class="card">\n'
      html += '      <div class="card-content">\n'
      html += '        <span class="card-title">' + meme.name + '</span>\n'
      html += '        <img class="responsive-img" src="' + meme.url + '"/>\n'
      html += '      </div>\n'
      html += '      <div class="card-action">\n'
      html += '        <p><strong>ID: </strong>' + meme.id + '</p>\n'
      html += '        <a class="waves-effect waves-teal btn-flat" onclick=handleClick(' + count + ')>Pick me!</a>\n'
      html += '      </div>\n'
      html += '    </div>\n'
      html += '  </div>\n'
      if(newrow === 2) {
        html += '</div>\n'
      }
    }
    $('#all').html(html)
  }}

const populateWorker = (index) => {
  /*
   * html replacement:
   *  #wmtitle => meme.name
   *  #wmimg src => meme.url
   *  #wmid => <strong>ID: </strong>meme.id
   *
   */

   current = index

   hideBoxes()

   const meme = loadedmemes[current]
   const template_id = meme.id
   const boxes = meme.box_count

   for(let count = 0; count < boxes; count++) {
     let element = '#textbox_'
     element += count.toString()
     $(element).removeClass('hide')
   }

   $('#wmtitle').html(meme.name)
   $('#wmimg').attr('src', meme.url)
   $('#wmid').html('<strong>ID: </strong>' + meme.id)
   $('#create').removeClass('hide')
}

const initPage = () => {
  hideBoxes()
  socket.emit('getall')
}

const hideBoxes = () => {
  $('#create').addClass('hide')
  for(let count = 0; count < 5; count++) {
    let element = '#textbox_'
    element += count.toString()
    $(element).val('')
    $(element).addClass('hide')
  }
}

$('#refresh').click(() => {
  socket.emit('getall')
})

$('.fontchoice').click((e) => {
  const font = $(e.target).attr('str')
  $('#fontTitle').html(font)
})

$('#create').click((e) => {
  /*
   * to post:
   *   template_id: meme.id
   *   username: <input>
   *   password: <input>
   *   font: impact or arial picker
   *   boxes: [{"text": <input>}] <== from memes.boxes
   *
   */

   const payload = {}
   const template_id = loadedmemes[current].id
   payload.template_id = template_id

   const username = $('#username').html()
   payload.username = username

   const password = $('#password').html()
   payload.password = password

   const font = $('#fontTitle').html()
   payload.font = font

   const boxes = []
   for(let count = 0; count < 5; count++) {
     let element = '#textbox_'
     element += count.toString()
     if(count === 0) payload.text0 = $(element).val()
     if(count === 1) payload.text1 = $(element).val()
     if(!$(element).hasClass('hide')) {
       const obj = JSON.parse('{ "text": "' + $(element).val() + '" }')
       boxes.push(obj)
     }
   }
   payload.boxes = boxes

   socket.emit('create', payload)
})

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
      success: () => {
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
  $('.dropdown-button').dropdown()
  setupSocket()
  initPage()
})
