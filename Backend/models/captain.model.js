const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname : {
        firstname : {
            type : String,
            required : true,
            minLength : [3, 'First name must be 3 characters long'],
        },
        lastname : {
            type : String,
            minLength : [3, 'First name must be 3 characters long'],
        }
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        match : [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] 
    },
    password : {
        type : String,
        required : true,
        select : false,
    },
    socketId : {
        type : String,
    },
    status : {
        type : String,
        enum : ['active', 'inactive'],
        default : 'active',
    },
    vehicle : {
        color : {
            type : String,
            required : true,
            minLength : [3, "Captain's vehicle color must be 3 characters long"],
        },
        plate : {
            type : String,
            required : true,
            minLength : [3, "Captain's plate must be 3 character long"],
        },
        capacity : {
            type : Number,
            required : true,
            min : [1, "Captain's vehicle capacity must be at least 1"]
        },
        vehicleType : {
            type : String,
            required : true,
            enum : ['car','auto','motorcycle'],
        }
    },
    location : {
        lat : {
            type : Number,
        },
        lng : {
            type : Number,
        }
    }

});

captainSchema.methods.generateAuthToken = async() => {
    const token = jwt.sign({_id : this._id }, process.env.JWT_SECRET, {expiresIn : '24h'});
    return token;
}

captainSchema.methods.comaprePassword = async (password) => {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain', captainSchema);

module.exports = captainModel;