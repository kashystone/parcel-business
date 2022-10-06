const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check_Auth');
const User = require('../models/user');
const roleAuth = require('../middleware/role_Auth');


const Product = require('../models/product');


const errorFormatter = (e) => {
    let errors = {};
  
    // "User validation failed: email: Enter a valid email address!, phoneNumber: phoneNumber is not a valid!"
  
    const allErrors = e.substring(e.indexOf(":") + 1).trim();
    const allErrorsFormatted = allErrors.split(",").map((err) => err.trim());
    allErrorsFormatted.forEach((error) => {
      const [key, value] = error.split(":").map((err) => err.trim());
      errors[key] = value;
    });
    return errors;
  };




router.get('/', roleAuth, (req, res, next) => {
    Product.find()
        .select('itemDescription price pickupLocation currentLocation destination recipientName recipientNumber status userId')
        .exec()
        .then(data => {
            const response = {
                products: data.map((dat) => {
                    return {
                        _id: dat._id,
                        itemDescription: dat.itemDescription,
                        price: dat.price,
                        pickupLocation: dat.pickupLocation,
                        destination: dat.destination,
                        currentLocation: dat.currentLocation,
                        recipientName: dat.recipientName,
                        recipientNumber: dat.recipientNumber,
                        status: dat.status,
                        userId: User._id,

                        
                    };
                })


            };
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });

});

router.post('/', checkAuth, (req, res, next) => {
    const user = req.userData;

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        itemDescription: req.body.itemDescription,
        weight: req.body.weight,
        price: req.body.weight * 330,
        pickupLocation: req.body.pickupLocation,
        destination: req.body.destination,
        status: "created",
        currentLocation: req.body.currentLocation,
        recipientName: req.body.recipientName,
        recipientNumber: req.body.recipientNumber,
        userId: user.userId,

    });
    product
        .save()
        .then(data => {
            res.status(200).json({
                createdproduct: {
                    _id: data._id,
                    itemDescription: data.itemDescription,
                    price: data.price,
                    pickupLocation: data.pickupLocation,
                    destination: data.destination,
                    recipientName: data.recipientName,
                    recipientNumber: data.recipientNumber,
                    status: data.status,
                    userId: data.userId,
                

                }
            })

        }).catch(e => {
            
            res.status(400).json({ error: errorFormatter(e.message) })
        });

});

router.get('/user', checkAuth, (req, res, next) => {
    const user = req.userData;
    Product.find({ userId: user.userId })
        .select('itemDescription price pickupLocation currentLocation destination recipientName recipientNumber status userId')
        .exec()
        .then(data => {

            const response = {
                products: data
            };
            return res.status(200).json({ data: data })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
});



router.put('/:productId/status', roleAuth, (req, res, next) => {
    const id = req.params.productId
    const status = req.body.status;
    const stat = ["created", "in-transit", "delivered"];
    if(!stat.includes(status))
    return res.status(401).json({message: "status invalid", status: 0})

    Product.updateOne({ _id: id }, { status: status }, { upsert: true })
        .then(data => {
          
           
            res.status(200).json({
                message: 'Status updated',
               
               
            });
        
        })
        .catch(err => { res.status(500).json({ error: err }) });
});

router.put('/:productId/destination', checkAuth, (req, res, next) => {
    const id = req.params.productId
    const destination = req.body.destination;
    Product.updateOne({ _id: id }, { destination: destination }, { upsert: true })
        .then(data => {
            res.status(200).json({
                message: 'Destination updated',
                
                
            });
        })
        .catch(err => { res.status(500).json({ error: err }) });
});

router.put('/:productId/currentLocation', roleAuth, (req, res, next) => {
    const id = req.params.productId
    const currentLocation = req.body.currentLocation;
    Product.updateOne({ _id: id }, { currentLocation: currentLocation }, { upsert: true })
        .then(data => {
            res.status(200).json({
                message: 'Current Location updated',
               
            });
        })
        .catch(err => { res.status(500).json({ error: err }) });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
               
            })
        })
        .catch(err => {
            res.status(500).json(err)
        })
});










module.exports = router;