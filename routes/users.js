const express = require('express');
const router = express.Router();
const {storeReturnTo} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const {username,email,password} = req.body;
        const user = new User({ username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success',"Welcome!");
            res.redirect('/events');
        });
        
    }catch (e){
        req.flash('error', e.message);
        res.redirect('/register')
    }    

}))

router.get('/login', (req, res) =>{
    res.render('users/login');

})

router.post('/login', storeReturnTo, 
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    (req, res) =>{
    req.flash('success',"Welcom Back!");
    const redirectUrl = res.locals.returnTo || 'events';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

})

router.get('/logout', (req, res, next) => {
    req.logout(function (err){
        if(err) {
            return next(err)
        }
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
    
})



module.exports = router;