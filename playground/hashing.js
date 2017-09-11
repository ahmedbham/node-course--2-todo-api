const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var password = 'password1'

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

var hashedpassword = '$2a$10$fL761iV45tb5K9fzzlVOn.zV5RtvK8rUfyccd9th6x25ylDqzZHqa'

bcrypt.compare(password, hashedpassword, (err, res) => {
  console.log(res)
})

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc')
// console.log(token)
//
// var decoded = jwt.verify(token, '123abc')
// console.log('decoded: ', decoded)

// var message = 'i am user number 3'
// var hash = SHA256(message).toString()
//
// console.log(`message ${message}`)
// console.log(`hash: ${hash}`)
//
// var data = {
//   id: 4
// }
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()
//
// var resultToken = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultToken === token.hash) console.log('token was not changed')
// else console.log('token was changed')
