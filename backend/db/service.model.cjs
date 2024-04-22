const { model } = require('mongoose');
const serviceSchema = require('./service.schema.cjs');

const ServiceModel = model('Service', serviceSchema);

function insertService(service) {
    return ServiceModel.create(service);
}

function getAllServices() {
    return ServiceModel.find().exec();
}

function getServiceByName(serviceName, username) {
    return ServiceModel.findOne({ serviceName: serviceName, username: username }).exec();
}

function deleteService(serviceName, username) {
    return ServiceModel.deleteOne({ serviceName: serviceName, username: username}).exec();
}

function updateService(serviceName, password, username) {
    const updatedService = {
        password: password,
        lastUpdateTime: new Date()
    };
    return ServiceModel.findOneAndUpdate({ serviceName: serviceName, username: username }, updatedService, { new: true }).exec();
}


function getPasswordsByUsername(username) {
    return ServiceModel.find({ username: username }).exec();
}

function getPasswordsSharedWithUser(username) {
    return ServiceModel.find({ sharedWith: username }).exec();
}

module.exports = {
    getServiceByName,
    deleteService,
    updateService,
    insertService, 
    getAllServices,
    getPasswordsByUsername,
    getPasswordsSharedWithUser
}