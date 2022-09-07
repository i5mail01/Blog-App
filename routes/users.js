//Include
const express  = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/register', (req,res) => {
    res.render('site/register', {active:{register:true}, pageTitle: 'Register'});
});



router.post('/register', (req,res) => {
    User.create(req.body, (error,user)=>{
        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Successful...'
        };
        res.redirect('/users/login');
    })
});

//getting the login page
router.get('/login', (req,res) => {
    res.render('site/login', {active:{login:true}, pageTitle: 'Login'});
});


//reading login form
router.post('/login', (req,res) => {
    const {email,password} = req.body;
    User.findOne({email},(error,user)=>{
        if (user){
            if(user.password=password){
                //Session
                req.session.isAdmin=user.isAdmin;
                req.session.userId=user._id;
                res.redirect('/');
            } else{
                res.redirect('/users/login');
            }
        } else{
            res.redirect('/user/register');
        }
    })
});


router.get('/logout', (req,res) => {
    req.session.destroy(()=>{
        res.redirect('/');
    });
});



module.exports = router;