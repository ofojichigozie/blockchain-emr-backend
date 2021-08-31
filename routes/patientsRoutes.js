const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Patient = require('../models/Patient');
const Block = require('../blockchain/block');
const Blockchain = require('../blockchain/blockchain');

const router = express.Router();
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// Function to verify authentication token
const verifyJwtToken = (req, res, next) => {
    let authorizationHeader = req.headers.authorization;

    if(typeof authorizationHeader !== 'undefined'){
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, jwtSecretKey, (error, authData) => {
            if(error){
                res.sendStatus(403);
            }else{
                next();
            }
        });
    }else{
        res.sendStatus(403);
    }
}

router.get('/newID', verifyJwtToken, (req, res) => {

    const patients = Patient.find();

    patients.exec()
    .then(result => {
        const newID = (result.length + 1) * 100;
        res.status(200).json({
            newID
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });

});

router.get('/verifyPatientID/:patientID', verifyJwtToken, (req, res) => {
    // Get patient's ID
    const patientID = req.params.patientID;

    const patient = Patient.findOne({patientID: patientID});

    patient.exec()
    .then(result => {
        res.status(200).json({
            isFound: (result != null ? 1 : 0)
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });

});

router.get('/verifyCredentialAddress/:credentialAddress', verifyJwtToken, (req, res) => {
    // Get patient's ID
    const credentialAddress = req.params.credentialAddress;

    const patient = Patient.findOne({credentialAddress: credentialAddress});

    patient.exec()
    .then(result => {
        res.status(200).json({
            patient: result
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });

});

router.post('/', verifyJwtToken, (req, res) => {
    // Get new patient's details
    const  { firstName, lastName, phoneNumber, dob, address, patientID } = req.body;

    // Generate a cryptographic key
    let credentialAddress = crypto.createHash('sha256').update(
        JSON.stringify({
            firstName, lastName, phoneNumber, dob, address, patientID
        })
    ).digest('hex');

    // Attach '0bemr' to the cryptographic key
    credentialAddress = '0bemr' + credentialAddress;

    // Initiate blockchain record for this patient
    let recordChain = new Blockchain();

    const patient = new Patient({
        credentialAddress,
        firstName,
        lastName,
        phoneNumber,
        dob,
        address,
        patientID,
        recordChain
    });

    patient.save()
    .then(result => {
        res.status(200).json({
            patient: result
        });
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });

});

router.patch('/addRecord', verifyJwtToken, (req, res) => {
    const { 
        credentialAddress, condition, treatmentDuration, treatmentFrequency, 
        lastExaminationDate, description, diagnosis, treatmentType, medication 
    } = req.body;

    const date  = (new Date()).toLocaleString();

    const data = {
        date,
        condition,
        treatmentDuration,
        treatmentFrequency,
        lastExaminationDate, 
        description,
        diagnosis,
        treatmentType,
        medication 
    }

    // Find patient, retrieve blockchain and add the new block
    const patient = Patient.findOne({credentialAddress: credentialAddress});

    patient.exec()
    .then(result => {
        if(result != null){
            let blockchain = Blockchain.instanceFrom(result.recordChain.blockchain);

            const block = new Block(
                date, data
            );
    
            blockchain.addBlock(block);
    
            const updatedPatient = Patient.updateOne(
                {credentialAddress: credentialAddress},
                {$set: {
                    recordChain: blockchain
                }}
            );
            updatedPatient.exec()
            .then(result => {
                res.status(200).json({
                    message: 'Record has been added'
                });
            })
            .catch(error => {
                res.status(500).json({
                    error
                });
            });
        }else{
            res.status(400).json({
                message: 'Patient with credential address was not found'
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            error
        });
    });
});

module.exports = router;