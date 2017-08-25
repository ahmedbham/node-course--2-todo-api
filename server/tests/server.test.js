const expect = require('expect')
const request = require('supertest')

var {app} = require('./../server')
var {Todo} = require('./../models/todo')

beforeEach((done) => {
  Todo.remove({}).then(() => done())
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
      Todo.find().then((doc) => {
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
        expect(doc.length).toBe(0)
        done()
      }).catch((e) => done(e))
    })
  })
})
