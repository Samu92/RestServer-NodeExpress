const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name : {
        type: String,
        required: [true, 'The name is mandatory']
    },
    email: {
        type: String,
        required: [true, 'The email is mandatory'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "The password is mandatory"]
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: [true, "The role is mandatory"]
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id,  ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);