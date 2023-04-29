require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

// bring in db.config.js
const { mongoURI, mongoSetup } = require('./configs/db.config')



// Create express instance
const app = express()

// setu middlewares

app.use(
    express.json({
      limit: "50mb",
      extended: true,
      parameterLimit: 1000000,
    })
    );

app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 1000000,
    })
);

app.use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      abortOnLimit: true,
    })
  );


app.use(cors())
app.use(helmet());

app.use(morgan('devs'))

// handles cors 

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "HEAD",
        "PUT, POST, GET, PATCH, DELETE"
      );
      return res.status(200).send("");
    }
  
    next();
  });

// Handles cookies for other midllewares

app.use(cookieParser());

// setup ROutes 

app.get("/", (req, res) => {
    res.send({
      status: 200,
      message: "Welcome to Fire BLog v1.0",
    });
  });

//  connect to mongoose
mongoose.set('strictQuery', true)
mongoose.connect(mongoURI, mongoSetup)
  .then(() => {
    console.log('MongoDb connected...')
  })
  .catch(err => console.log(err ?? ''))

 

// Export express app
module.exports = app

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
})