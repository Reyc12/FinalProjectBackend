const express = require('express');
const searchRouter = require('./search');
const homeRouter = require('./home');
const reservationRouter = require('./reservation');
const restaurantRouter = require("./restaurant");
const customerRouter = require("./customer");

const apiRouter = express.Router();



apiRouter.use('/search', searchRouter);
apiRouter.use('/home',homeRouter);
apiRouter.use('/reservation',reservationRouter);
apiRouter.use('/restaurant',restaurantRouter);
apiRouter.use('/customer',customerRouter);



module.exports = apiRouter;