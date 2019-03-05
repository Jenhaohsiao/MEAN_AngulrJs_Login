var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/tutorial', function(err) {
    if (err) {
        console.log("we're NOT connected");
    } else {
        console.log("we're connected!!");
    }
});

app.post('/users', function(require, response) {
    var user = new User();
    user.username = require.body.username;
    user.password = require.body.password;
    user.email = require.body.email;

    if (require.body.username == null || require.body.username == '' || require.body.password == null || require.body.password == '' || require.body.email == null || require.body.email == '') {
        response.send('Ensure username, emial, and password were provided');

    } else {
        user.save(function(err) {
            if (err) {
                response.send(err);
            } else {
                response.send("User created");

            }
        });
    }



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