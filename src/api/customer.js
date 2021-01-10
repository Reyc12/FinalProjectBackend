const  express = require('express');
const dateEdit = require("../dateEdit");
const tokenAuth = require("../tokenAuth");
const customerRouter = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./findmytableproject.sqlite');



//UPCOMING RESERVATION
customerRouter.post('/customerUpcomingReservations',tokenAuth.authenticate,(req,res,next)=> {
    const date = req.body.date;
    db.all(
        `SELECT Reservation.*, Restaurant.restaurant_name FROM Reservation JOIN Restaurant ON
            Reservation.restaurant_id = Restaurant.restaurant_id
         WHERE Reservation.customer_id = $id`,
        {$id : req.user.id},
        (err,rows) => {
            if(err){
                next(err);
            } else{
                rows.forEach(dateEdit.transform);
                const n = dateEdit.sort(rows,date,true);
                res.status(200).send(n);
            }

        }
    );
});

//PAST RESERVATIONS
customerRouter.post('/customerPastReservations',tokenAuth.authenticate,(req,res,next)=> {
    const date = req.body.date;
    db.all(
        `SELECT Reservation.*, Restaurant.restaurant_name FROM Reservation JOIN Restaurant ON
            Reservation.restaurant_id = Restaurant.restaurant_id
         WHERE Reservation.customer_id = $id`,
        {$id : req.user.id},
        (err,rows) => {
            if(err){
                next(err);
            } else{
                rows.forEach(dateEdit.transform);
                const n = dateEdit.sort(rows,date,false);
                res.status(200).send(n);
            }

        }
    );
});


//SPECIAL REQUEST FOR CUSTOMER
customerRouter.post('/addSpecialRequest',tokenAuth.authenticate,(req,res,next) => {
    db.run(`UPDATE  Reservation SET reservation_specialRequest = $specialRequest WHERE reservation_id = $id`,
        {
            $specialRequest : req.body.specialRequest,
            $id : req.body.id
        },
        function (err){
        if (err){
            next(err);
        }
        res.status(201).send('successfully updated');
        });


});


module.exports = customerRouter;