var express     =  require('express');
var bodyParser  =  require('body-parser');
var favicon     =  require('serve-favicon');
var app         =  express();
var _           =  require('underscore');
var Promise     =  require('bluebird');
var Data        =  Promise.promisifyAll(require('./data'));
var shortid     =  require('shortid');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/www'));
app.use(favicon(__dirname + '/www/res/favicon.ico'));
app.set('views', __dirname + '/www');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.post('/sharelink', function(req, res) {
  var obj = req.body;

  Data.findOneAsync({
    seq: obj.seq,
    dbn: obj.dbn
  }).then(function (data) {
    if (data && ('seq' in data) && ('dbn' in data))
      return data;

    var newData = Promise.promisifyAll(new Data({
      seq: obj.seq,
      dbn: obj.dbn,
      url: shortid.generate()
    }));
    return newData.saveAsync();
  }).then(function (data) {
    res.send(_(data).pick(['url', 'seq', 'dbn']));
  }).catch(function (err) {
    res.sendStatus(500);
  });
});

app.get('/*', function(req, res) {
  var url = req.path.substring(1);
  Data.findOneAsync({url: url}).then(function (data) {
    res.render('index', {
      data: JSON.stringify(_(data).pick(['seq', 'dbn']))
    });
  }).catch(function (err) {
    console.log(err);
    res.redirect('/');
  });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + server.address().port);
});

var data = require('./data');
