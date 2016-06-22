import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
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
  let {seq, dbn} = req.body;

  Data.findOneAsync({seq, dbn}).then(function (data) {
    if (data)
      return data;

    let url = shortid.generate();
    var newData = Promise.promisifyAll(new Data({url, seq, dbn}));
    return newData.saveAsync();
  }).then(function ({url, seq, dbn}) {
    res.send({url, seq, dbn});
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
    let {seq, dbn} = data;
    if (!seq) throw Error("Invalid url: " + url);
    if (!dbn) throw Error("Invalid url: " + url);
    res.render('index', {
      data: JSON.stringify({seq, dbn})
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
