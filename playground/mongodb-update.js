// const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

// var obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) return console.log('unable to connecto mongodb server')
  console.log('connected to mongodb')

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('599efdd36ee3f525c83020a1')
  },{
    $inc: {
      age: 10
    },
    $set: {
      name: 'kim'
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2))
  })

//  db.close()
})
