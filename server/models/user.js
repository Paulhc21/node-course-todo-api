const mongoose = require( 'mongoose' ),
      Schema = mongoose.Schema;

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    User
};