const expect = require('expect')
const request = require('supertest')

var {app} = require('./../server')
var {Todo} = require('./../models/todo')

const todos = [{
  text: "do this 1"
}, {
  text: "do this 2"
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
})

describe('post calls', () => {
  it('should post correct todo text and save it', (done) => {

    var text = 'some todo test'

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text)
    })
    .end((err, res) => {
      if(err) return done(err)
      Todo.find({text}).then((doc) => {
        expect(doc.length).toBe(1)
        expect(doc[0].text).toBe(text)
        done()
      }).catch((e) => done(e))
    })
  })

  it('should fail if sending bad data', (done) => {
    request(app)
    .post('/todos')
    .send({text: ''})
    .expect(400)
    .end((err, res) => {
      if (err) return done(err)
      Todo.find().then((doc) => {
        expect(doc.length).toBe(2)
        done()
      }).catch((e) => done(e))
    })
  })
})

describe('GET test', () => {
  it('should GET all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.docs.length).toBe(2)
    })
    .end(done)
  })
})
