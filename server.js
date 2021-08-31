const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require("./routes/adminRoutes");
const patientsRoutes = require("./routes/patientsRoutes");

const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

//Routes section
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/patients", patientsRoutes);

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}, error => {
    if(!error){
        console.log('Connected to MongoDB database');
    } else {
        console.log('ERROR: ' + error);
    }
});

//Start the server application
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Blockchain EMR server started at port 5000");
});
