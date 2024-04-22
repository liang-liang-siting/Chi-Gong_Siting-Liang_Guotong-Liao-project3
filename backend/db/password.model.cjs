const { model } = require('mongoose');
const PasswordSchema = require('./password.schema.cjs');

const PasswordModel = model('Password', PasswordSchema);

function insertPassword(service) {
    return PasswordModel.create(service);
}

// useless function
function getAllPassword() {
    return PasswordModel.find().exec();
}

function getPasswordByName(url, username) {
    return PasswordModel.findOne({ url: url, username: username }).exec();
}

function deletePassword(url, username) {
    return PasswordModel.deleteOne({ url: url, username: username}).exec();
}

function getPasswordsByUsername(username) {
    return PasswordModel.find({ 
        $or: [
            { username: username },
            { sharedWith: username }
        ]
    }).exec();
}

function updatePassword(passwordEntry) {
    // url and username cannot be updated
    const { url, username } = passwordEntry;
    const updatedService = {
        ...passwordEntry,
        lastUpdateTime: new Date(),
        sharedWith: passwordEntry.sharedWith
    };
    console.log(updatedService);
    return PasswordModel.findOneAndUpdate({ url: url, username: username }, updatedService, { new: true }).exec();
}

function updateSharedWith(url, username, sharedWith) {
    return PasswordModel.findOneAndUpdate({ url: url, username: username }, { sharedWith: sharedWith }, { new: true }).exec();
}

module.exports = {
    getPasswordByName,
    deletePassword,
    updatePassword,
    insertPassword, 
    getAllPassword,
    getPasswordsByUsername,
    updateSharedWith,
}