const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

var {app} = require('./../server')
var {Todo} = require('./../models/todo')

const todos = [{
  _id: new ObjectID(),
  text: "do this 1"
}, {
  _id: new ObjectID(),
  text: "do this 2"
}]

var id2 = todos[0]._id.toHexString()
var id3 = id2.replace(/^5/, '6')

var id1 = todos[0]._id.toHexString()
var id4 = id1 + '11'

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

describe('GET/:id tests', () => {
  it('should return todo items', (done) => {
    request(app)
    .get(`/todos/${id1}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done)
  })

  it('should return 404 if no records found', (done) => {
    request(app)
    .get(`/todos/${id3}`)
    .expect(404)
    .end(done)
  })

  it('should return 400 if id is invalid', (done) => {
    request(app)
    .get(`/todos/${id4}`)
    .expect(400)
    .end(done)
  })
})

describe('DELETE /todos/:id tests', () => {
  it('should delete object and return deleted object', (done) => {
    request(app)
    .delete(`/todos/${id1}`)
    .expect(200)
    .expect((res) => expect(res.body.todo._id).toBe(id1))
    .end((err, res) => {
      if(err) return done(err)
      Todo.findById(id1).then((todo) => {
        expect(todo).toNotExist()
        done()
      }).catch((e) => done(e))
    })
  })

  it('should return 404 if not found', (done) => {
    request(app)
    .delete(`/todos/${id3}`)
    .expect(404)
    .end(done)
  })

  it('should return 400 if object is invalid', (done) => {
    request(app)
    .delete(`/todos/${id4}`)
    .expect(400)
    .end(done)
  })
})
