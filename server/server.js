var express = require('express'),
    moment = require('moment'),
    app = express(),
    port = process.env.PORT || 8000,
    cors = require('cors'),
    data = require('./data/data');

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.send('');
});

app.get('/planet-radiuses', function(req, res) {
    res.send(data.planetsRadiuses.planetsRadiuses);
});

app.get('/planets/:name', function(req, res) {
    var planetName = req.params.name.toLowerCase();

    res.send({
        "data": {
            "id": planetName,
            "type": 'planet',
            "attributes": data.planets[planetName]
        }
    });
});

app.get('*', function(req, res) {
    res.redirect('/');
});

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
