import express from 'express';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import DBManager from './db_manager';
import Data from './data';
import shortid from 'shortid';

var app         =  express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/../../www'));
app.use(favicon(__dirname + '/../../www/res/favicon.ico'));
app.set('views', __dirname + '/../../www');
app.use(bodyParser.json());

app.post('/sharelink', function(req, res) {
  let {seq, dbn} = req.body;

  Data.findOne({seq, dbn}).exec()
  .then(function (data) {
    if (data)
      return data;

    let url = shortid.generate();
    var newData = new Data({url, seq, dbn});
    return newData.save();
  }).then(function ({url, seq, dbn}) {
    res.send({url, seq, dbn});
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/*', function(req, res) {
  var url = req.path.substring(1);
  if (!url) {
    res.render('index');
    return;
  }

  Data.findOne({url: url}).exec()
  .then(function (data) {
    if (!data) throw Error("Not found: " + url);
    res.render('index');
  }).catch(function (err) {
    console.log(err);
    res.redirect('/');
  });
});

app.post('/data', function(req, res) {
  let {url} = req.body;
  Data.findOne({url}).exec()
  .then(function (data) {
    if (!data) throw Error("Not found: " + url);
    let {seq, dbn} = data;
    if (!seq) throw Error("Invalid url: " + url);
    if (!dbn) throw Error("Invalid url: " + url);
    res.send({url, seq, dbn});
  }).catch(function (err) {
    console.log(err);
    res.sendStatus(400);
  });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + server.address().port);
});

DBManager.init();
