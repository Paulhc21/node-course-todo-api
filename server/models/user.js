const mongoose = require( 'mongoose' ),
      validator = require( 'validator' ),
      jwt = require( 'jsonwebtoken' ),
      _ = require( 'lodash' );
      Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this,
        userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this,
        access = 'auth',
        token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save()
        .then(() => {
            return token;
        });
};

UserSchema.statics.findByToken = function( token ) {
    var User = this,
        decoded;

    try {
        decoded = jwt.verify(token, 'abc123')
    } catch ( err ) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};