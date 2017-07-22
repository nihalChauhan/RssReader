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
const Feeds = require('../db/models').Feeds;
const AddUrl = require('../routes/UserFunctions').AddUrl;
const RemoveUrl = require('../routes/UserFunctions').RemoveUrl;
const UpdateUrl = require('../routes/UserFunctions').UpdateUrl;

var userid;

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
   userid = req.user.id; 
   var arr_urls = [];
   var new_array = [];
   Feeds.findAll({ where: {userId: req.user.id} }).then(urls=>{
        for(each in urls)
        {
            if(urls[each]['dataValues']['url'])
            arr_urls.push(urls[each]['dataValues']['url']);
        }
    res.render('xyz.hbs', {y: arr_urls});     

   });


});


route.post('/profile', (req, res) => {
    console.log(userid);
   // RemoveUrl(req.body.url, userid);
    //AddUrl(req.body.url, userid);
   // UpdateUrl('http://feeds.bbci.co.uk/news/world/rss.xml',userid, req.body.url);
   //console.log(req.body.changedurl);
   console.log()
   if(req.body.remove)
    {
        RemoveUrl(req.body.urlforcrud, userid);
        res.send("Success");   
    }
   if(req.body.addurl)
   {
        AddUrl(req.body.url, userid);
        res.send("Success!");
   }
    if(req.body.display)
    {
        Request(req.body.urlforcrud, (error, resp, body)=> {
            parser(body, (error, ret) => {
            res.render('abc.hbs', {x:ret});
            });
        });
    }
    
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
