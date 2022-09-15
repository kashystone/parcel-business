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
        type: Number,
        required: true,
    },
    userId: {
        type: String,

    }



});

module.exports = mongoose.model('Product', productSchema);