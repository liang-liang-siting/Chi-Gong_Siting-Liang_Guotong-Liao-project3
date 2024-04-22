const MessageSchema = require('./message.schema.cjs');

const model = require('mongoose').model;

const MessageModel = model('Message', MessageSchema);

function insertMessage(message) {
    return MessageModel.create(message);
}

function getMessageByReceiverUserName(receiverUsername) {
    return MessageModel.find({ receiverUsername: receiverUsername }).exec();
}

function deleteMessage(id) {
    return MessageModel.deleteMany({ id: id }).exec();
}

module.exports = {
    getMessageByReceiverUserName,
    deleteMessage,
    insertMessage,
}
