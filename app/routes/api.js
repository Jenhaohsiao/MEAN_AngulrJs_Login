var User = require('../models/user');
var jwt = require('jsonwebtoken');
var tokenSecret = "harrypotter";

module.exports = function(router) {

    // USER Registeration Route

    router.post('/users', function(require, response) {

        // http://localhost:8080/api/uers
        var user = new User();

        user.username = require.body.username;
        user.password = require.body.password;
        user.email = require.body.email;
        user.name = require.body.name;

        if (require.body.username == null || require.body.username == '' || require.body.password == null || require.body.password == '' || require.body.email == null || require.body.email == '' || require.body.name == null || require.body.name == '') {
            response.json({
                success: false,
                message: 'Ensure username, email, and password were provided'
            });

        } else {
            user.save(function(err) {
                if (err) {

                    if (err.errors != null) {
                        if (err.errors.name) {
                            response.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if (err.errors.email) {
                            response.json({
                                success: false,
                                message: err.errors.email.message
                            });
                        } else if (err.errors.username) {
                            response.json({
                                success: false,
                                message: err.errors.username.message
                            });
                        } else if (err.errors.password) {
                            response.json({
                                success: false,
                                message: err.errors.password.message
                            });
                        } else {
                            response.json({
                                success: false,
                                message: err
                            });
                        }
                    } else if (err) {
                        if (err.code == 11000) {

                            if (err.errmsg[61] == "u") {
                                response.json({
                                    success: false,
                                    message: 'The Username already taken'
                                });
                            } else if (err.errmsg[61] == "e") {
                                response.json({
                                    success: false,
                                    message: 'The email already taken'
                                });
                            }

                        } else {
                            response.json({
                                success: false,
                                message: err
                            });
                        }
                    }

                } else {

                    response.json({
                        success: true,
                        message: 'User created'
                    });

                }
            });
        }

    });

    // USER Registeration Route end


    // USER Login Route
    // http://locathost:port/api/authentlcate
    router.post('/authenticate', function(req, res) {

        if (!req.body.username) {
            res.json({
                success: false,
                message: 'Neend user name'
            });
            return
        }

        User.findOne({
            username: req.body.username
        }).select('email username password').exec(function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'Could Not authenticate this user'
                });

                return

            } else if (user) {

                var validPassword = null
                if (req.body.password) {

                    validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({
                        success: false,
                        message: 'No password provided'
                    });

                    return
                }


                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Could Not authenticate password'
                    });

                    return

                } else {

                    var token = jwt.sign({
                            username: user.username,
                            email: user.email
                        },
                        tokenSecret, {
                            expiresIn: '5s'
                        });
                    res.json({
                        success: true,
                        message: 'User authenticated!',
                        token: token
                    });

                    return

                }

            }
        });
    });

    // middleware

    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {

            jwt.verify(token, tokenSecret, function(err, decoded) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Token invalid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })

        } else {
            res.json({
                success: false,
                message: 'No token provided',
            });
        }
    });

    // middleware end

    router.post('/me', function(req, res) {

        res.send(req.decoded);

    })

    return router;
}

// var decoded = jwt.verify(token, 'shhhhh');
// console.log(decoded.foo)