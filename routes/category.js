var passport = require('passport');
var config = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Category = require("../models/category");

getToken = (headers)=> {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } 
      else {
        return null;
      }
    } 
    else {
      return null;
    }
};

router.get('/', passport.authenticate('jwt', { session: false}), (req, res)=>{
    var token = getToken(req.headers);
    if (token) {
        Category.find((err, categories)=>{
        if (err) 
            return next(err);
        res.json(categories);
      });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.get('/:id', passport.authenticate('jwt', { session: false}), (req, res, next)=>{
    var token = getToken(req.headers);
    if (token) {
      Category.findById(req.params.id, (err, category)=> {
        if (err) 
            return next(err);
        res.json(category);
    });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
      Category.create(req.body, (err, category)=> {
        if (err) 
            return next(err);
        res.json(category);
      });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.put('/:id', passport.authenticate('jwt', { session: false}), (req, res, next)=> {
    var token = getToken(req.headers);
    if (token) {
      Category.findByIdAndUpdate(req.params.id, req.body, (err, category)=> {
        if (err) 
            return next(err);
        res.json(category);
      });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false}), (req, res, next)=> {
    var token = getToken(req.headers);
    if (token) {
      Category.findByIdAndRemove(req.params.id, req.body, (err, category)=> {
        if (err) 
            return next(err);
        res.json(category);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

module.exports = router;
