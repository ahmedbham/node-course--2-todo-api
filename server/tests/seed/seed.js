const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
_id: userOneId,
email: 'abh@gmail.com',
password: 'userOnePass',
tokens: [{
  access: 'auth',
  token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
}]
  },
  {
    _id: userTwoId,
    email: 'bhs@yah.com',
    password: 'userTwoPass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
]


const populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save()
    var user2 = new User(users[1]).save()

    return Promise.all([user1, user2])
  }).then(() => done())
}


const todos = [{
  _id: new ObjectID(),
  text: "do this 1",
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: "do this 2",
  completed: true,
  completedAt: 222,
  _creator: userTwoId
}]


const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
}


module.exports = {todos, populateTodos, users, populateUsers}
