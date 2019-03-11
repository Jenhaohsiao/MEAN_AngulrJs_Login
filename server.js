var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);
// e.g. http://lacalhost:8080/api/users


mongoose.connect('mongodb://localhost:27017/tutorial', function(err) {
    if (err) {
        console.log("the server is NOT connected");
    } else {
        console.log("Great, the server is connected!!");
    }
});

app.get('*', function(req, res) {
    console.log("get here")
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));

})

app.listen(port, function() {
    console.log("Runing the server on port:", port);
});



// app.get('/', function(require, response) {
//     response.send('Hello World!!');
// })

// app.get('/home', function(require, response) {
//     response.send('Hello from home');
// })

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     // we're connected!
//     console.log("we're connected");
// });