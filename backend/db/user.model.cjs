const model = require('mongoose').model;

const UserSchema = require('./user.schema.cjs');

const UserModel = model('User', UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getAllUser() {
    return UserModel.find().exec();
}

function getUserByUsername(username) {
    return UserModel.findOne({ username }).exec();
}

module.exports = {
    getUserByUsername,
    insertUser, 
    getAllUser,
}