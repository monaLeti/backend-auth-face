const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user){
  var timeStmp = new Date().getTime()
  return jwt.encode({
    sub: user.id,
    iat: timeStmp
  }, config.secret)
}

exports.singin = function(req, res, next){
  var user = req.user
  res.send({token: tokenForUser(user), user_id:user._id})
}

exports.singup = function(req, res, next){
  var email= req.body.email
  var password = req.body.password
  if (!email || !password) {
    return res.status(422).json({error:'Provide an email or a password'})
  }
  // Check if the user already exists
  User.findOne({email:email}, function(err, existingUser){
    if(err){
      return next(err)
    }
    if(existingUser){
      return res.status(422).json({error:'Email taken'})
    }
    var user = new User({
      email:email,
      password: password
    })
    user.save(function(err){
      if(err){
        return next(err)
      }
      res.json({user_id:user._id, token:tokenForUser(user)})
    })
  })
}
