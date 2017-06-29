const route = require('express').Router();

route.get('/', (req, res) => {
    "use strict";
    res.send('success');
});

module.exports = route;
