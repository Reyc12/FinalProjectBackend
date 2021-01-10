const  express = require('express');
const dateEdit = require("../dateEdit");
const tokenAuth = require("../tokenAuth");
const restaurantRouter = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./findmytableproject.sqlite');




//UPCOMING RESERVATION
restaurantRouter.post('/restaurantUpcomingReservations',tokenAuth.authenticate,(req,res,next)=> {
    const date = req.body.date;
    db.all(
        `SELECT Reservation.* FROM Reservation WHERE Reservation.restaurant_id = $id`,
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
restaurantRouter.post('/restaurantPastReservations',tokenAuth.authenticate,(req,res,next)=> {
    const date = req.body.date;
    db.all(
        `SELECT Reservation.* FROM Reservation WHERE Reservation.restaurant_id = $id`,
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


//CURRENT DAY RESERVATIONS
restaurantRouter.post('/currentDayReservations',tokenAuth.authenticate,(req,res,next)=> {
    const date = req.body.date;
    db.all(
        `SELECT Reservation.* FROM Reservation WHERE Reservation.restaurant_id = $id AND Reservation.reservation_date = $date`,
        {$id : req.user.id,
        $date : date},
        (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }

        }
    );
});

//TOTAL  RESERVATIONS
restaurantRouter.get('/totalReservations',tokenAuth.authenticate,(req,res,next)=> {
    db.all(
        `SELECT COUNT(reservation_id) AS totalReservations FROM Reservation WHERE Reservation.restaurant_id = $id`,
        {$id : req.user.id},
        (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }

        }
    );
});

//TOTAL  Guests
restaurantRouter.get('/totalGuests',tokenAuth.authenticate,(req,res,next)=> {
    db.all(
        `SELECT SUM(reservation_guestnumber) AS totalGuests FROM Reservation WHERE Reservation.restaurant_id = $id`,
        {$id : req.user.id},
        (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }

        }
    );
});

//AVG DAILY GUEST
restaurantRouter.get('/avgDailyGuest',tokenAuth.authenticate,(req,res,next)=> {
    db.all(
        `SELECT AVG(reservation_guestnumber) AS avgGuest FROM Reservation WHERE Reservation.restaurant_id = $id`,
        {$id : req.user.id},
        (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }

        }
    );
});



module.exports = restaurantRouter;