const ServiceSchema = require('./service.schema.cjs');

const model = require('mongoose').model;

const ServiceModel = model('Service', ServiceSchema);

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

function getServiceByUserName(userName) {
    return ServiceModel.find({ 
        $or: [
            { userName: userName },
            { sharedWith: userName }
        ]
    }).exec();
}

function updateService(service) {
    const updatedService = {
        ...service,
        lastUpdateTime: new Date() // Assuming you want to update lastUpdateTime to the current date
    };
    return ServiceModel.findOneAndUpdate({ serviceName: service.serviceName }, updatedService, { new: true }).exec();
}


module.exports = {
    getServiceByName,
    deleteService,
    updateService,
    insertService, 
    getAllServices,
    getServiceByUserName,
}