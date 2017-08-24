// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID()
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('unable to connecto mongodb server')
  console.log('connected to mongodb')

// db.collection('Todos').insertOne({
//   text: 'some things',
//   completed: false
// }, (err, result) => {
//   if(err) return console.log('unable to insert', err)
//   console.log(JSON.stringify(result.ops, undefined, 2))
// })
//
// db.collection('Users').insertOne({
//   name: 'ahmed bham',
//   age: 25,
//   location: 'lilburn'
// }, (err, result) => {
//   if(err) return console.log('unable to insert', err)
//   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
// })

  db.close()
})
