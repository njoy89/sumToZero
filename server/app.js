/**
 * Copyright (c) 2015, Grzegorz Swatowski
 */

'use strict';

let config = require('./../config.json');
let paths = require('./../paths.json');

let express = require('express');
let path = require('path');

let app = express();
let port = process.env.PORT || config.port;

app.use(express.static(path.join(__dirname, './../' + paths.files.build.path)));

app.listen(port);

console.log('Running the server on the address: http://localhost:' + port + '/');