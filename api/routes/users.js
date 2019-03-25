const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/signup', function (req, res) {
    User.find({email: req.body.email}, function(err, data){
        if(data.length > 0){
            res.json({
                message: 'user exists'
            })
        }else{
            bcrypt.hash(req.body.password, 10, function(err, hash){
                if(err){
                    res.json({
                        error: err
                    })
                }else{
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save(function(err, data){
                        if(err){
                            res.json({
                                error: err
                            });
                        }else{
                            //console.log(data);
                            res.json({
                                message: 'user created',
                                createdUser: data
                            })
                        }
                    });
                }
            });
        }
    })
});

router.post('/login', function(req, res){
    
});

router.get('/', (req, res)=>{
    User.find({}, (err, data)=>{
        if(data){
            res.json({
                users: data
            });
        }else{
            res.json({
                message: 'something went wrong'
            })
        }
    })
});

router.delete('/:userEmail', function(req, res){//we mostly pass id for a route like in orders and products
    User.remove({email: req.params.userEmail}, function(err, data){
        if(data){
            res.json({
                message: 'user deleted',
                remainingusers:{
                    type: 'GET',
                     url:'http://localhost:3000/user/'
                }
            });
        }else{
            res.json({
                error: err
            });
        }
    });
});

module.exports = router;