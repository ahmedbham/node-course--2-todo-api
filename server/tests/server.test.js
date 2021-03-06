const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

var {app} = require('./../server')
var {Todo} = require('./../models/todo')
var {User} = require('./../models/user')
var {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)



describe('post calls', () => {
  it('should post correct todo text and save it', (done) => {

    var text = 'some todo test'

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.docs.length).toBe(1)
    })
    .end(done)
  })
})

describe('GET/:id tests', () => {
  it('should return todo items', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done)
  })

  it('should not return todo items for other users', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return 404 if no records found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return 400 if id is invalid', (done) => {
    request(app)
    .get(`/todos/abc111`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(400)
    .end(done)
  })
})

describe('DELETE /todos/:id tests', () => {
  it('should delete object and return deleted object', (done) => {
    var id1 = todos[1]._id.toHexString()
    request(app)
    .delete(`/todos/${id1}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => expect(res.body.todo._id).toBe(id1))
    .end((err, res) => {
      if(err) return done(err)
      Todo.findById(id1).then((todo) => {
        expect(todo).toBeFalsy()
        done()
      }).catch((e) => done(e))
    })
  })

  it('should not delete object if not owner', (done) => {
    var id1 = todos[0]._id.toHexString()
    request(app)
    .delete(`/todos/${id1}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end((err, res) => {
      if (err) return done(err)
      Todo.findById(id1).then((todo) => {
        expect(todo).toBeTruthy()
      done()
    }).catch((e) => done(e))
   })
  })

  it('should return 404 if not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return 400 if object is invalid', (done) => {
    request(app)
    .delete(`/todos/abc111`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(400)
    .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('should update text, and completed to true', (done) => {
    var newtxt = 'new stuff'
    var id1 = todos[1]._id.toHexString()
    request(app)
    .patch(`/todos/${id1}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      text: newtxt,
      completed: true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(newtxt)
      expect(res.body.todo.completed).toBe(true)
      expect(typeof res.body.todo.completedAt).toBe('number')
    })
    .end((err, res) => {
      if(err) return done(err)
      Todo.findById(id1).then((doc) => {
        expect(doc.text).toBe(newtxt)
        expect(doc.completed).toBe(true)
        expect(typeof doc.completedAt).toBe('number')
        done()
      }).catch((e) => done(e))
    })
  })

  it('should not update text, if not owner', (done) => {
    var newtxt = 'new stuff'
    var id1 = todos[1]._id.toHexString()
    request(app)
    .patch(`/todos/${id1}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      text: newtxt,
      completed: true
    })
    .expect(404)
    .end((err, res) => {
      if(err) return done(err)
      Todo.findById(id1).then((doc) => {
        expect(doc.text).toBe(todos[1].text)
        expect(doc.completed).toBe(todos[1].completed)
        expect(typeof doc.completedAt).toBe('number')
        done()
      }).catch((e) => done(e))
    })
  })

  it('should clear completedAt if completed is false', (done) => {
    var id1 = todos[1]._id.toHexString()
    request(app)
    .patch(`/todos/${id1}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.todo.completedAt).toBeFalsy()
    })
    .end((err, res) => {
      if(err) return done(err)
      Todo.findById(id1).then((doc) => {
        expect(doc.completed).toBe(false)
        expect(doc.completedAt).toBeFalsy()
        done()
      }).catch((e) => done(e))
  })
})
})

describe('GET: /users/me: ', () => {
  it('should return authenticated users', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString())
      expect(res.body.email).toBe(users[0].email)
    })
    .end(done)
  })
  it('should return 401 for unathenticated users', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      // expect(res.body._id).toEqual(undefined)
      expect(res.body._id).toBeFalsy()
    })
    .end(done)
  })
})

describe('POST: /users ', () => {
  it('should create a user if request valid', (done) => {
    var email = 'jhg@gmail.com'
    var password = 'ajh762kd'

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy()
      expect(res.body._id).toBeTruthy()
      expect(res.body.email).toBe(email)
    })
    .end((err) => {
      if(err) {
        return done(err)
      }
      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy()
        expect(user.password).not.toBe(password)
        done()
      }).catch((e) => done(e))
    })
  })

  it('should return validation errors for invalid request', (done) => {
    var email = 'jhg@gmail.com'
    var password = 'ajh7'

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy()
      expect(res.body._id).toBeFalsy()
    })
    .end(done)
    })

  it('should return error if email in use', (done) => {
    var email = 'abh@gmail.com'
    var password = 'ajh7'

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy()
      expect(res.body._id).toBeFalsy()
    })
    .end(done)
  })
})

describe('POST /users/login', () => {
  it('should return a valid token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy()
    })
    .end((err, res) => {
      if (err) return done(err)
      User.findById(users[1]._id).then((user) => {
        expect(user.toObject().tokens[1]).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        })
          done()
        }).catch((e) => done(e))
      })
    })

  it('should return an error for invalid user', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'akjhbahm'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy()
    })
    .end((err, res) => {
      if (err) return done(err)
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe('DELETE /users/me/token: ', () => {
  it('should delete token', (done) => {
    var email = users[0].email
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)
      User.findOne({email}).then((user) => {
        expect(user.tokens.length).toBe(0)
        done()
      }).catch((e) => done(e))
    })
  })
})
