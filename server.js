const express = require('express');
const bodyParser = require('body-parser');

const PORT = 1902;
const app = express();
app.use('/', express.static(__dirname + "/public_static"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes/index'));

app.listen(PORT, function () {
    console.log("Server started on http://localhost:"+PORT);
});