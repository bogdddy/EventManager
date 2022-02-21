const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require("../controllers/auth.controller");
const auth = require('../middlewares/auth.middleware')

// register
router.get('/register', auth.checkNotAuthenticated, (req, res) =>  res.render('auth/register', {error: req.flash('error'), info: req.flash('info')}));
router.post('/register', auth.checkNotAuthenticated, authController.register);

// login
router.get('/login', auth.checkNotAuthenticated, (req, res) =>  res.render('auth/login', {info: req.flash('info')}));
router.post('/login', auth.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/events',
    failureRedirect: '/auth/login',
    failureFlash: true 
}))

//logout
router.delete('/logout', authController.logout)

module.exports = router;