const express = require('express')
const router = express.Router()
const views = __dirname + '/views'

// generate app specific password at https://myaccount.google.com/apppasswords
// create gmail-credentials.json with the following:
// {
//   "user": "aUser@gmail.com",
//   "pass": "abcdefghijklmnop"
// }

// const credentials = require(__dirname + '/gmail-credentials.json')
// const send = require('gmail-send')({
//   user: credentials.user,
//   pass: credentials.pass,
//   to:   credentials.user,
// })

router.use(function (req, res, next) {
  console.log(Date() + ' ' + req.path + ' ' + req.method)
  next()
})

router.get('/', function(req, res) {
  res.sendFile(views + '/index.html')
})

// router.post('/', function(req, res) {
//   let name = req.body.name
//   let email = req.body.email
//   let subject = req.body.subjectArea
//   let message = req.body.messageArea
//   console.log(req.body)
//   console.log('sending email from ' + name + ' with address: ' + email)
//
//   send({
//     replyTo: email,
//     subject: subject,
//     text:    name + ' has sent a message:\n\n' + message
//   }, function (err, res) {
//     console.log('send() callback returned: err:', err, '; res:', res);
//   })
//
//   res.send(true)
// })

router.get('*', function(req,res) {
  res.sendFile(views +  '/404.html')
})

module.exports = router
