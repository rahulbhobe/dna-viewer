var express = require('express');

var app = express();

app.use('/', express.static(__dirname + '/www'));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port);
});

var data = require('./data');