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
   var arr_titles = [];
   Feeds.findAll({ where: {userId: req.user.id} }).then(titles=>{
        for(each in titles)
        {
            
            arr_titles.push(titles[each]['dataValues']['title']);
        }
    res.render('xyz.hbs', {y: arr_titles});
   });


});


route.post('/profile', (req, res) => {
    console.log(userid);
   var title = req.body.titleforcrud;
   var url;
   if(req.body.addurl)
        {   
            Request(req.body.url, (error, resp, body)=> {
                parser(body, (error, ret) => {
                    AddUrl(req.body.url, userid, ret['site']['title']);
                    for(i of ret.items){
                            if(i.summary.search('<')==-1) {
                                i.description = i.summary;
                            }
                            else {
                                x = i.description.search('<');
                                //i.imgUrl=i.description.substr(x);
                                i.description = i.description.substr(0, x);

                                /*
                                 x = i.imgUrl.search('src="');
                                 y = i.imgUrl.search('" he');
                                 i.imgUrl = i.imgUrl.substr(x+5, y-10);
                                 console.log(i.imgUrl);
                                 */
                            }
                        }
                        res.render('abc.hbs', {x:ret});
                });                
            });    
        }
    else
    {
       Feeds.findOne({ where: {title: title, userId: userid} }).then(feeds=> {
            url = feeds['url'];
            if(req.body.remove)
            {
                RemoveUrl(url, userid);
                var arr_titles = [];
                Feeds.findAll({ where: {userId: req.user.id} }).then(titles=>{
                    for(each in titles)
                    {
                        arr_titles.push(titles[each]['dataValues']['title']);
                    }
                    res.render('xyz.hbs', {y: arr_titles});
                });
            }
            
            if(req.body.display)
            {
                Request(url, (error, resp, body)=> {
                    parser(body, (error, ret) => {
                        for(i of ret.items){
                            if(i.summary.search('<')==-1) {
                                i.description = i.summary;
                            }
                            else {
                                x = i.description.search('<');
                                //i.imgUrl=i.description.substr(x);
                                i.description = i.description.substr(0, x);

                                /*
                                 x = i.imgUrl.search('src="');
                                 y = i.imgUrl.search('" he');
                                 i.imgUrl = i.imgUrl.substr(x+5, y-10);
                                 console.log(i.imgUrl);
                                 */
                            }
                        }
                        res.render('abc.hbs', {x:ret});
                    });
                });
            }

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
