var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");

router.post('/login', function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.json({success: false, msg: 'Please type username and password.'});
    } 
    else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
      // save the user
      newUser.save((err)=>{
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
    }
});

router.post('/register', (req, res)=>{
    User.findOne({
      username: req.body.username
    }, (err, user)=>{
      if (err) 
        throw err;
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } 
      else {
        // check if password matches
        user.comparePassword(req.body.password, (err, isMatch)=>{
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } 
          else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
});

router.post('/logout', passport.authenticate('jwt', { session: false}), (req, res)=>{
    req.logout();
    res.json({success: true});
});

module.exports = router;