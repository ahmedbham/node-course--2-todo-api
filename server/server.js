const express = require('express')
const bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('mongodb')

var app = express()
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  })

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((docs) => {
    res.send({docs})
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(400).send('id was invalid')

  Todo.findById(id).then((todo) => {
    if(!todo) return res.status(404).send('invalid id was send')
    res.send({todo})
  }, ((e) => res.status(400).send('id was e'))).catch((e) => res.status(400).send())

  // res.send(req.params)
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) return res.status(400).send('Invalid Object')

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) return res.status(404).send('id not found')
    res.status(200).send({todo})
  }).catch((e) => res.status(400).send('error occured in retrieving'))
})

app.listen(port, () => {
  console.log(`started on port ${port}`)
})

module.exports = {app}
