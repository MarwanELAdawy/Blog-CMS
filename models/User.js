var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
var bycrypt = require("bcrypt");

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if(this.isModified('password') || this.isNew){
        bycrypt.genSalt(10, (err, salt)=>{
            if (err) {
                return next(err);
            }
            bycrypt.hash(user.password, salt, null, (err, hash)=>{
                if(err){
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else{
        return next();
    }
});

UserSchema.methods.comparePassword = (pass, cb)=>{
    bycrypt.compare(pass, this.password, (err, isMatch)=>{
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);