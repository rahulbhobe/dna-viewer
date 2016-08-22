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
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.post('/link', (req, res) => {
  let {type, url, seq, dbn} = req.body;

  Promise.resolve(type)
  .then((type) => {
    if (type === 'save') {
      return Data.update({url}, {seq, dbn}).exec()
      .then((data) => {
        return data;
      });
    } else if (type === 'add') {
      let url = shortid.generate();
      var newData = new Data({url, seq, dbn});
      return newData.save();
    } else if (type === 'delete') {
      return Data.remove({url}).exec()
      .then(() => {
        return ({url: ""});
      });
    }
  }).then(({url}) => {
    res.send({url});
  }).catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.get('/*', (req, res) => {
  var url = req.path.substring(1);
  if (!url) {
    res.render('index');
    return;
  }

  Data.findOne({url: url}).exec()
  .then((data) => {
    if (!data) throw Error("Not found: " + url);
    res.render('index');
  }).catch((err) => {
    console.log(err);
    res.redirect('/');
  });
});

app.post('/data', (req, res) => {
  let {url} = req.body;
  Data.findOne({url}).exec()
  .then((data) => {
    if (!data) throw Error("Not found: " + url);
    let {seq, dbn} = data;
    if (!seq) throw Error("Invalid url: " + url);
    if (!dbn) throw Error("Invalid url: " + url);
    res.send({url, seq, dbn});
  }).catch((err) => {
    console.log(err);
    res.sendStatus(400);
  });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), () => {
  console.log('Server listening on port ' + server.address().port);
});

DBManager.init();
