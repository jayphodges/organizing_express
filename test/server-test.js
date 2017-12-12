var assert = require('chai').assert
var app = require('../server')
var request = require('request')
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const Secret = require('../lib/models/secret')

describe('Server', function(){
  before(function(done){
    this.port = 9872
    this.server = app.listen(this.port, function(err, result){
      if(err) { return done(err) }
      done()
    })
    this.request = request.defaults({
      baseUrl: 'http://localhost:9872'
    })
  })

  after(function(){
    this.server.close()
  })

  it('should exist', function(){
    assert(app)
  })

  describe('GET /', function(){
    it('should return a 200', function(done){
      this.request.get('/', function(error, response){
        if (error) { done(error) }
        assert.equal(response.statusCode, 200)
        done()
      })
    })

    it('should have a body with the name of the application', function(done){
      this.request.get('/', function(error, response){
        if (error) { done(error) }
        assert.include(response.body, app.locals.title)
        done()
      })
    })
  })

  describe('GET /api/secrets/:id', function(){
      beforeEach((done) => {
          Secret.create("I open bananas from the wrong side")
          .then(() => done())
  })

    afterEach(function(done) {
      database.raw('TRUNCATE secrets RESTART IDENTITY')
      .then(function() { done() })
    })

    it('should return 404 if resource is not found', function(done) {
      this.request.get('/api/secrets/10000', function(error, response) {
        if (error) { done(error) }
        assert.equal(response.statusCode, 404)
        done()
      })
    })

    it('should return the id and message from the resource found', function(done) {
      this.request.get('/api/secrets/1', function(error, response) {
        if (error) { done(error) }

        const id = 1
        const message = "I open bananas from the wrong side"

        let parsedSecret = JSON.parse(response.body)

        assert.equal(parsedSecret.id, id)
        assert.equal(parsedSecret.message, message)
        assert.ok(parsedSecret.created_at)
        done()
      })
    })
  })

  describe('POST /api/secrets', function(){
    beforeEach((done) => {
      Secret.create("I open bananas from the wrong side")
      .then(() => done())
    })

    afterEach((done) => {
      Secret.destroyAll()
      .then(() => done())
    })

    it('should receive and store data', function(done){
      var message = {
        message: 'I like pineapples!'
      }

      this.request.post('/api/secrets', { form: message }, function(error, response){
        if (error) { done(error) }
        var parsedSecret = JSON.parse(response.body)
        assert.equal("I like pineapples!", parsedSecret.message)
        assert.equal(response.statusCode, 201)
        done()
      })
    })
  })
})
