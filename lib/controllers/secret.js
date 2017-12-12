const Secret = require('./lib/models/secret')

const getSecret = (request, response) => {
  var id = request.params.id
  Secret.show(id)
    .then(function(data) {
      if (data.rowCount == 0) { return response.sendStatus(404) }

      response.json(data.rows[0])
    })
  })
}

module.exports = {
  getSecret,
}
