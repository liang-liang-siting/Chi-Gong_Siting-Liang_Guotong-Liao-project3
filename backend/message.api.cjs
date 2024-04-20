const express = require('express');
const router = express.Router();
const MessageModel = require('./db/message.model.cjs');
const ServiceModel = require('./db/service.model.cjs');

// Get messages by receiver username
router.get('/:receiverUserName', async function(request, response) {
    try {
        const receiverUserName = request.params.receiverUserName;
        const messages = await MessageModel.getMessageByReceiverUserName(receiverUserName);
        response.json(messages);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Add new message
router.post('/add', async function(request, response) {
    try {
        const message = request.body;
        const result = await MessageModel.insertMessage(message);
        response.status(201).json(result);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post('/accept', async function(request, response) {
    try {
        const serviceUrl = request.body.serviceUrl;
        const receiverUserName = request.body.receiverUserName;
        const passwordEntry = await ServiceModel.getServiceByName(serviceUrl);
        const newPassWordEntry = {
            ...passwordEntry,
            sharingWith: [...passwordEntry.sharingWith, receiverUserName],
        };
        await ServiceModel.updateService(newPassWordEntry);
        // delete the message
        await MessageModel.deleteMessageByServiceUrl(serviceUrl);
        response.status(200).json({ message: 'Password shared successfully' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

// Delete message by service URL
router.delete('/delete/:serviceUrl', async function(request, response) {
    try {
        const serviceUrl = request.params.serviceUrl;
        const result = await MessageModel.deleteMessageByServiceUrl(serviceUrl);
        response.json(result);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;
