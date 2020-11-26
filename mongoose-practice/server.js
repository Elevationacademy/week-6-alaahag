const express = require('express');
const api = require('./server/routes/api.js');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const ip = '0.0.0.0';
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', api);

app.listen(port, ip, function()
{
    console.log(`server is running on IP: '${ip}', port: '${port}'`);
});