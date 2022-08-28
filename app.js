const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const path = require('path')
const dotenv = require('dotenv');
const swaggerUI = require('swagger-ui-express');
const swaggerjsDoc = require('swagger-jsdoc');



dotenv.config();
app.use(cors())
const PORT = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "Parcel-Delivery",
            description: "Parcel-Delivery-API",
            contact: {
                name: "Kash",
                
            }
        },
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"

                } 
            }   
        },
       
            servers: [{
                url:  process.env.SERVER_URL,
            }, 
        ], 
           
        
    },
    apis: ["./api/routes/users.js", "./api/routes/products.js"],

};



const swaggerDocs = swaggerjsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose.promise = global.promise;






const productsRouter = require('./api/routes/products');
const usersRouter = require('./api/routes/users');
const { JsonWebTokenError } = require('jsonwebtoken');

mongoose.connect(process.env.DB_CONNECT,
    ()=> console.log('DB success')); 
  

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=> { 
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // if (req.method === 'OPTIONS') {
    //     req.header('Access-Control-Allow-Mehods', 'PUT, POST, PATCH, GET, DELETE');
    //     return res.status(200).json({});
    // }
    next();
});

app.get('/', function (req,res){
    res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.use('/products', productsRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error('Not founde');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));

module.exports = app;