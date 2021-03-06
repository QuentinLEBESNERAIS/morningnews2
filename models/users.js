const mongoose = require('mongoose')

const articlesShema = mongoose.Schema({
    title:String,
    urlToImage:String,
    content:String,
    description:String,
})

const userSchema = mongoose.Schema({
    articles:[articlesShema],
    username: String,
    email: String,
    password: String,
    token: String,
    language : String,
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel