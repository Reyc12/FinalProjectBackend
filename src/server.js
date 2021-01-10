const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const apiRouter = require('./api/api');

const app = express();
const PORT = 4000;


//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('dev'));
//Routes
app.use('/api', apiRouter);

app.use(errorHandler());

//Start Server
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});


module.exports = app;