const express = require('express');
const app = express();


app.use(express.static('public'))
app.use('/sounds', express.static('sounds'));
app.use('/images', express.static('images'));


module.exports = app;