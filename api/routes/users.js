const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//signup
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


//login
router.post('/login', function(req, res){
     User.findOne({email: req.body.email}, function(err, data){
        if(data){                      //data[0].password, if User.find used, as it carries array
               bcrypt.compare(req.body.password, data.password, function(err, result){
                    if(result){
                       const token = jwt.sign({
                            email: data.email,
                            id: data._id
                        }, "process.env.JWT_KEY",
                        {
                            expiresIn: 600
                        }
                        );
                        res.json({
                            message: 'login succeed',
                            token: token
                        }) 
                    }else{
                        res.json({
                            message: 'password doesnot matched'
                        })
                    }
               });
            }else{
                res.json({
                    message: 'user doesnot exist',
                    Sign_up:{
                        type: 'POST',
                        url:'http://localhost:3000/users/signup'
                    }
                });
            }        
     });     
});

router.get('/', (req, res)=>{
    User.find({}, (err, data)=>{
        if(data){
            console.log(data)
            res.json({
                users: data
            });
        }else{
            res.json({
                error: err,
                message: 'something went wrong'
            })
        }
    })
});

router.delete('/:userEmail', function(req, res){//we must pass id for a route, like in orders and products
    User.remove({email: req.params.userEmail}, function(err, data){
        if(data){
            res.json({
                message: 'user deleted',
                remainingUsers:{
                    type: 'GET',
                     url:'http://localhost:3000/users/'
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