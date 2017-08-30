const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// const {ObjectID} = require('mongodb')

// Todo.remove({}).then((results) => {
//   console.log(`items removed: ${results}`)
// }).catch((e) => console.log(e))

Todo.findByIdAndRemove('59a55024822d8d3e8b54ec3b').then((todo) => {
 console.log({todo})
}).catch((e) => console.log(e))
