var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var User = require('../models/user');
var settings = require('../config/settings'); // get settings file

module.exports = (passport)=>{
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = settings.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
        User.findOne({id: jwt_payload.id}, (err, user)=>{
            if(err){
                return done(err, false);
            }
            if(user){
                done(null, user);
            }
            else{
                done(null, false);
            }
        });
    }));
};