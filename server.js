const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('./auth/passport');

const PORT = 8000;
const app = express();
app.use('/', express.static(__dirname + "/static"));

app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser('secret'));
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
    	expires:false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));

app.listen(PORT, function () {
    console.log("Server started on http://localhost:"+PORT);
});

module.exports = app;