import messageSchema from "./message.schema.cjs";

const model = require('mongoose').model;

const MessageModel = model('Message', messageSchema);

function insertMessage(message) {
    return MessageModel.create(message);
}

function getMessageByReceiverUserName(receiverUserName) {
    return MessageModel.find({ receiverUserName: receiverUserName }).exec();
}

function deleteMessageByServiceUrl(serviceUrl) {
    return MessageModel.deleteMany({ serviceUrl: serviceUrl }).exec();
}

module.exports = {
    getMessageByReceiverUserName,
    deleteMessageByServiceUrl,
    insertMessage,
}
