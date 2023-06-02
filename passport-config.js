const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const passport = require('passport')
const User = require('./modules/user_model')

passport.use(new LocalStrategy({ usernameField: 'email' },(email, password,done)=>{
  const user = User.findOne({email:email}).then(async (user)=>{
    if(user==null){
      return done(null, false, {message:'No user with that email'});
    }
    // try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        
        return done(null, false, { message: 'Password incorrect' })
      }
  });
}));
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>{
  const fetchuser=(id) => User.findById(id)
  fetchuser(id).then((user)=>{
    return done(null,user);
  })
});