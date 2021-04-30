var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      language: 'fr'
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

/*GESTION ARTICLES BDD */
router.post('/add-article', async function(req,res,next){
  var user = await userModel.findOne({token:req.body.token})
  console.log(req.body.token)
  user.articles.push(
    {title:req.body.title,
    img:req.body.img,
    content:req.body.content,})
var userSaved = await user.save()
res.json(userSaved)
})

router.get('/import-bdd/', async function(req,res,next){
  var user = await userModel.findOne({token:req.query.token})
  var articles = user.articles
  console.log(articles)
  res.json(articles)
})

/*GESTION LANGUES BDD**/
router.post('/update-language', async function(req,res,next){
  var user = await userModel.updateOne({token:req.body.token},{language :req.body.language })
  console.log(req.body.language,"-----------------")
  //var userSaved = await user.save()
res.json(user)
})

router.delete('/delete-article', async function(req,res,next){
  var user = await userModel.findOne({token:req.body.token})
  console.log(user.articles)
  var tempTab = user.articles
  var newTab = tempTab.filter(x=>x.title!==req.body.title)
  user.articles = newTab
  await user.save()
res.json("article supprimé")
})

module.exports = router;
