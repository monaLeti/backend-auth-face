const passport = require('passport')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    FacebookStrategy = require('passport-facebook').Strategy

//Passport-local will authenticate the user by the username and the password send to the user
const LocalStrategy = require('passport-local')

const User = require('../models/user')
const config = require('../config')

var localOptions = {
  usernameField: 'email'
}

var localStrategy = new LocalStrategy(localOptions, function(email, password, done){
  //First look for the user in the database
  console.log('passport',email, password);
  User.findOne({email:email}, function(err, user){
    if(err){
      done(err,null)
    }
    if(!user){
      done(null, false)
    }
    console.log('user found', user, err);
    user.comparePassword(password, function(err, isMatch){
      if(err){
        done(err,null)
      }
      if(!isMatch){
        done(null, false)
      }
      done(null, user)
    })
  })
})

var jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest : ExtractJwt.fromHeader('authorization')
}

//Protects our routes
var jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done){
  User.findById(payload.sub, function(err,user){
    if(err){
      done(err, false)
    }
    if(user){
      done(false, user)
    }
    else{
      done(null, false)
    }
  })
})

// Authenticate with Facebook

var facebookStrategy = new FacebookStrategy({
  clientID: '1772376096337848',
  clientSecret: '78f0a8f958d3fb2102e072d0e78dd04e',
  callbackURL: 'http://localhost:3000/v1/answer'
  },
  // The verify callback
  function(accessToken, refreshToken, profile, cb){
    User.findOne({email:profile.email}, function(err, existingUser){
      if(err){
        return cb(err, null)
      }
      if(existingUser){
        return cb(err, null)
      }
      var user = new User({
        email:profile.email,
        password: accessToken
      })
      user.save(function(err){
        if(err){
          return cb(err, null)
        }
        cb(null, user)
      })
    })
  }
)

passport.use(jwtStrategy)
passport.use(localStrategy)
passport.use(facebookStrategy)
