const mongoose = require('mongoose');

const PatientSchema = mongoose.Schema({
    credentialAddress: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    patientID: {
        type: String,
        required: true
    },
    recordChain: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Patient', PatientSchema);