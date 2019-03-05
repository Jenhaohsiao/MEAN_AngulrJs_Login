var User = require('../models/user');


module.exports = function(router) {
    router.post('/users', function(require, response) {
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

    });

    return router;


}