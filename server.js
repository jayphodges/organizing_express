var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const Secret = require('./lib/models/secret')
const secretController = require('./lib/controllers/secret')
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Secret Box'
app.locals.secrets = {
  wowowow: 'I am a banana'
}
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(request, response) {
  response.send(app.locals.title)
})
app.get('/api/secrets/:id', secretController.getSecret)

// app.get('/api/secrets/:id', function(request, response){
//   var id = request.params.id
//
//   Secret.show(id)
//     .then(function(data) {
//       if (data.rowCount == 0) { return response.sendStatus(404) }
//
//       response.json(data.rows[0])
//     })
//   })

app.post('/api/secrets', (request, response) => {
  let id = Date.now()
  let message = request.body.message

  if (!message) {
    return response.status(422).send({ error: "No message property provided!"})
  }

  Secret.create(message)
    .then((data) => {
      response.status(201).json(data.rows[0])
    })
})

if(!module.parent) {
  app.listen(app.get('port'), function() {
    console.log(app.locals.title + " is running on " + app.get('port') + ".")
  })
}

module.exports = app
