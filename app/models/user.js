var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator')

// Validator
var nameValidator = [
    validate({
        validator: 'matches',
        // arguments: /^([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})$/,
        arguments: /^[a-zA-Z]+$/,
        // message: "Must be at least 3 -30 characters. No special characters, no numbers and must bhave space in between name"
        message: "Name must be no special characters, no numbers"

    })
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        message: "Is not a valid e-mail"
    }),

    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'email should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var usernameValidator = [

    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'UserName should be between {ARGS[0]} and {ARGS[1]} characters'
    }),

    validate({
        validator: 'isAlphanumeric',
        message: "Username must contain letters and numbers only"
    }),
];

var passwordValidator = [

    validate({
        validator: 'matches',
        arguments: /^(?=.*[a-z]).{6,128}$/,
        message: "Password must be at less 6 letters"
    }),
];

// Validator end

var UserSchema = new Schema({

    name: {
        type: String,
        required: true,
        validate: nameValidator
    },

    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: usernameValidator
    },

    password: {
        type: String,
        required: true,
        validate: passwordValidator
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: emailValidator

    }


});

UserSchema.pre('save', function(next) {
    var user = this;

    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    })

    next();
})

UserSchema.plugin(titlize, {
    paths: ['name']
});



UserSchema.methods.comparePassword = function(_password) {

    return bcrypt.compareSync(_password, this.password);
}



module.exports = mongoose.model('User', UserSchema)