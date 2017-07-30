const route = require('express').Router();
const User = require('../db/models').User;
const Groups = require('../db/models').Groups;
const Links = require('../db/models').Links;
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
   var arr_titles = [];
   var gr = [];

    Groups.findAll({ where: {uid: req.user.id} }).then(groups=>{
        for(each in groups)
        {
            gr.push(groups[each]['dataValues']);
        }
   Feeds.findAll({ where: {userId: req.user.id} }).then(titles=>{
        for(each in titles)
        {
            arr_titles.push(titles[each]['dataValues']['title']);
        }
    res.render('xyz.hbs', {y: arr_titles, g: gr});
   });
   });
});

route.post('/addg', eli('/login.html'), (req, res) => {
    Groups.create({
        uid: req.user.id,
        name: req.body.groupname
    }).then((abc) => {
        res.redirect('/addlinks/'+abc.id)
    })
});

route.get('/addlinks/:gid/', eli('/login.html'), (req, res) => {
    var arr_links = [];
    Groups.findAll({ where: {id: req.params.gid} }).then(gp => {
        Links.findAll({where: {gid: req.params.gid}}).then(linkArr => {
            for (each in linkArr) {
                arr_links.push(linkArr[each]['dataValues']['email']);
            }
            res.render('addg.hbs', {gname: gp[0]['dataValues']['name'], links: arr_links, gid:req.params.gid});
        });
    });
});

route.post('/addlinks/', eli('/login.html'), (req, res) => {
    "use strict";
    Links.create({
        email: req.body.email,
        gid: req.body.gid
    }).then((link) => {
        res.redirect('/addlinks/'+req.body.gid+'/')
    })
});

route.post('/profile', eli('/login.html'), (req, res) => {
   var title = req.body.titleforcrud;
   var url;
       Feeds.findOne({ where: {title: title, userId: req.user.id} }).then(feeds=> {
            url = feeds['url'];
            if(req.body.remove)
            {
                RemoveUrl(url, req.user.id);
                res.redirect('/profile');
            }
       });
    
});

route.post('/display', eli('/login.html'), (req, res)=>{
    var title= req.body.titleforcrud;
    Feeds.findOne({ where: {userId:req.user.id, title:title } }).then(feeds=> {
        url = feeds['url'];
        Request(url, (error, resp, body)=> {
            parser(body, (error, ret) => {
                for(i of ret.items){
                    if(i.summary.search('<')==-1) {
                            i.description = i.summary;
                        }
                    else {
                        x = i.description.search('<');
                        i.description = i.description.substr(0, x);
                        }
                    }
                res.render('abc.hbs', {x:ret});
            });
        });

    });
});

route.post('/addurl', eli('/login.html'), (req,res)=>{
    Request(req.body.url, (error, resp, body)=> {
        parser(body, (error, ret) => {
            AddUrl(req.body.url, req.user.id, ret['site']['title']);
                for(i of ret.items){
                    if(i.summary){
                        if(i.summary.search('<')==-1) {
                            i.description = i.summary;
                            }}
                            else {
                                x = i.description.search('<');
                                i.description = i.description.substr(0, x);
                            }
                        }
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
