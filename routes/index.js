const route = require('express').Router();
const User = require('../db/models').User;
const passport = require('../auth/passport');
const eli = require('../auth/utils').eli;
const AuthToken = require('../db/models').AuthToken;
const uid2 = require('uid2');
const encrypt = require('../auth/utils').encrypt;
const path = require('path');
const Request = require('request');
const parser = require('node-feedparser');

route.post('/signup', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: encrypt(req.body.password)
    }).then((user) => {
        res.redirect('/login.html')
    })
});

route.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login.html'
}));

route.get('/logout', (req, res) => {
    req.user = null;
    req.logout();
    req.session.destroy(function () {
        res.redirect('/login.html')
    })
});


route.get('/profile', eli('/login.html'), (req, res) => {
   res.sendFile(path.resolve('./static/feed.html'));

});



route.post('/profile', (req, res) => {
    Request(req.body.url, (error, resp, body)=> {
        parser(body, (error, ret) => {
            console.log(error);
            console.log(ret);
            res.render('abc.hbs', {x:ret});
        });
    });
});

route.post('/token', passport.authenticate('local'), (req, res) => {

    AuthToken.create({
        token: uid2(20),
        userId: req.user.id
    }).then((authToken) => {
        return res.send({
            token: authToken.token
        })
    })

});

module.exports = route;
