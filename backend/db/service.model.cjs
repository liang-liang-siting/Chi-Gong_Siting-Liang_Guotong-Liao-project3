const { model } = require('mongoose');
const serviceSchema = require('./service.schema.cjs');

const ServiceModel = model('Service', serviceSchema);

function insertService(service) {
    return ServiceModel.create(service);
}

function getAllServices() {
    return ServiceModel.find().exec();
}

function getServiceByName(serviceName) {
    return ServiceModel.findOne({ serviceName: serviceName }).exec();
}

function deleteService(serviceName) {
    return ServiceModel.deleteOne({ serviceName: serviceName }).exec();
}

function updateService(serviceName, password) {
    const updatedService = {
        password: password,
        lastUpdateTime: new Date()
    };
    return ServiceModel.findOneAndUpdate({ serviceName: serviceName }, updatedService, { new: true }).exec();
}


module.exports = {
    getServiceByName,
    deleteService,
    updateService,
    insertService, 
    getAllServices,
}