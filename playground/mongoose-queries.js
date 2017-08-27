const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')
// const {ObjectID} = require('mongodb')
//
// var id = '69a1d31a5f694d1b3cbe7feb11'
// if(!ObjectID.isValid(id)) console.log('Object ID invalid')

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos)
// })
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo)
// })

// Todo.findById(id).then((todo) => {
//   if(!todo) return console.log('id not found')
//   console.log('Todo find:', todo)
// }).catch((e) => { console.log('error occured: ', e)})

const id = '69a01bf8c9fe8b23f4f8d2f1as'

// User.find({
//   _id: id
// }).then((users) => {
//   console.log('users found', users)
// })
//
// User.findOne({
//   _id: id
// }).then((user) => {
//   console.log('found user by one: ', user)
// })

User.findById(id).then((user) => {
  console.log('user found by id: ', user)
}).catch((e) => console.log('error occured: ', e))
