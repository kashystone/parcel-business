const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        lowercase: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
              return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
            },
            message: (props) => `Enter a valid ${props.path} address!`,
          },
      
    },

    password: {
        type: String,
        required: true,
        minlength: 6

    },

    phoneNumber: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (v) {
              return /^(\+|00)[0-9]{1,3}[0-9]{7,14}(?:x.+)?$/.test(v);
            },
            message: (props) =>
              `${props.path} should be atleast (8)characters! & should contain a country code`,
          },
      
      

    },

    address: {
        type: String,
        required: true,
        minlength: 6,



    },




});

module.exports = mongoose.model('User', userSchema);