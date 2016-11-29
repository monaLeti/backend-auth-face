const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')

var validateEmail = (email) => {
  return(/\S+@\S+\.\S+/).test(email)
}

var userSchema = new Schema({
  email:{
    type:String,
    unique:true,
    lowercase:true,
    required: 'Email required',
    validate:[validateEmail, 'Please enter a valid email']
  },
  password:{
    type:String
  }
})


//Incript the password before is saved
userSchema.pre('save', function(next){
  var user = this
  //Check if the user is new or the password is modified
  if(user.isNew || user.isModified('password')){
    //10 work factor the times of the data is processes
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, null, function(err, hash){
        if(err){
          return next(null)
        }
        user.password = hash
        next()
      })
    })
  }else{
    next()
  }
})

userSchema.methods.comparePassword = function(candidatePassword, callback){
  console.log('user', candidatePassword);
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      callback(err)
    }
    callback(null, isMatch)
  })
}

module.exports = mongoose.model('user', userSchema)
