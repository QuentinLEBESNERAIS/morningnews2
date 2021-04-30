const mongoose = require('mongoose')

const articlesShema = mongoose.Schema({
    title:String,
    img:String,
    content:String,
})

const userSchema = mongoose.Schema({
    articles:[articlesShema],
    username: String,
    email: String,
    password: String,
    token: String,
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel