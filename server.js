var express     =  require('express');
var bodyParser  =  require('body-parser');
var app         =  express();
var Promise     =  require('bluebird');
var Data        =  require('./data');
var shortid     =  require('shortid');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/www'));
app.set('views', __dirname + '/www');
app.set('view engine', 'html');
app.use(bodyParser.json());

app.post('/sharelink', function(req, res) {
  var obj = req.body;
  var data = Promise.promisifyAll(new Data({
    seq: obj.seq,
    dbn: obj.dbn,
    url: shortid.generate()
  }));

  data.saveAsync().then(function(d) {
    var obj = {
      url: d.url,
      seq: d.seq,
      dbn: d.dbn
    };
    res.send(obj);
  });

});

app.get('/l/*', function(req, res) {
  var url = req.path.substring(3);
  Data.findOne({url: url}, function(err, data) {
    if (err) {
      redirect('/');
      return;
    }

    if (!(("seq" in data)&&("dbn" in data))) {
      redirect('/');
      return;
    }

    var query = "/d/seq=" + data.seq + "&dbn=" + data.dbn;
    var port  = app.get('port');
    if (port) {
      port = ":" + port;
    } else {
      port = "";
    }
    res.redirect(req.protocol + "://" + req.hostname + port + query);
  });

});

app.get('/d/*', function(req, res) {
  var url = req.path.substring(1);
  res.render('index.ejs');
});



app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + server.address().port);
});

var data = require('./data');