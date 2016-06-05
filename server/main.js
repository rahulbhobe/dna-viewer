import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import _ from 'underscore';
import Promise from 'bluebird';
import DBManager from './db_manager';
import DataImport from './data';
import shortid from 'shortid';

var app         =  express();
var Data        =  Promise.promisifyAll(DataImport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/../www'));
app.use(favicon(__dirname + '/../www/res/favicon.ico'));
app.set('views', __dirname + '/../www');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.post('/sharelink', function(req, res) {
  var obj = _(req.body).pick(['seq', 'dbn']);

  Data.findOneAsync(obj).then(function (data) {
    if (data && ('seq' in data) && ('dbn' in data))
      return data;

    _(obj).extend({url: shortid.generate()});
    var newData = Promise.promisifyAll(new Data(obj));
    return newData.saveAsync();
  }).then(function (data) {
    res.send(_(data).pick(['url', 'seq', 'dbn']));
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/', function(req, res) {
  res.render('index', {
    data: ''
  });
});

app.get('/*', function(req, res) {
  var url = req.path.substring(1);
  Data.findOneAsync({url: url}).then(function (data) {
    if (!data) throw Error("Not found: " + url);
    if (!data.seq) throw Error("Invalid url: " + url);
    if (!data.dbn) throw Error("Invalid url: " + url);
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

DBManager.init();
