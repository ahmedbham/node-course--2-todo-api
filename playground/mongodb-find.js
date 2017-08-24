// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

// var obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('unable to connecto mongodb server')
  console.log('connected to mongodb')

db.collection('Users').find({name: 'ahmed bham'}).toArray().then((docs) => {
  console.log('Users')
  console.log(JSON.stringify(docs, undefined, 2))
}, (err) => {
  console.log('unable to fetch documents', err)
})

db.collection('Users').find({name: 'ahmed bham'}).count().then((count) => {
  console.log(`Todos: ${count}`)
}, (err) => {
  console.log('unable to fetch documents', err)
})

//  db.close()
})
