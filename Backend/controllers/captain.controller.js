const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }

    const { fullname, email, password, vehicle } = req.body;

    const isEmailAlreadyExists = await captainModel.findOne({email});
    if(isEmailAlreadyExists) {
        return res.status(400).json({message : 'Captain Already exists with this email.'});
    }

    const hashPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        password : hashPassword,
        email,
        color : vehicle.color,
        plate : vehicle.plate,
        capacity : vehicle.capacity,
        vehicleType : vehicle.vehicleType
    });

    const token = await captain.generateAuthToken();

    return res.status(201).json({token, captain});
}