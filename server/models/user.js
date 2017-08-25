var mongoose = require('mongoose')

var schema2 = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

var User = mongoose.model('User', schema2)

module.exports = {User}
