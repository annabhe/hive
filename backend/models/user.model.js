const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {type: String},
    username: { type: String, required: true, index: {unique: true}},
    password: { type: String, required: true},
    avatar: {},
    pet: []
}, {timestamps: true});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;