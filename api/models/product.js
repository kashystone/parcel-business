const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemDescription: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
         
    },
    price: {
        type: Number,  
    },
    pickupLocation: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    status: {
        type: String,

    },
    currentLocation: {
        type: String,
        

    },
    recipientName: {
        type: String,
        required: true,
    },
    recipientNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
              return /^(\+|00)[0-9]{1,3}[0-9]{7,14}(?:x.+)?$/.test(v);
            },
            message: (props) =>
              `${props.path} should be atleast (8)characters! & should contain a country code`,
          },
    },
    userId: {
        type: String,

    }



});

module.exports = mongoose.model('Product', productSchema);