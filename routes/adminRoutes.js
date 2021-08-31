const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

let jwtSecretKey = process.env.JWT_SECRET_KEY;

router.post('/login', (req, res) => {
    // Get login details
    const { email, password } = req.body;

    if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
        // Generate authentication token and send response
        jwt.sign({email, password}, jwtSecretKey, (error, token) => {
            res.json({
                token
            });
        });
    }else{
        res.json({
            token: null
        });
    }

});

router.post('/logout', (req, res) => {
    
});

module.exports = router;