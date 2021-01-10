const  express = require('express');
const tokenAuth = require("../tokenAuth");
const emailSender = require("../emailSender");
const reservationRouter = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./findmytableproject.sqlite');


/*app.get('/customerDetails',tokenAuth.authenticate,(req,res,next)=>{
    db.get(
        `SELECT * FROM Customer WHERE customer_id = $id`,
        {$id : req.user.id},
        (err,row) => {
            if(err){
                next(err);
            }else{
                res.send(row);
            }
        }
    );
});*/

reservationRouter.put('/registeredCustomer',tokenAuth.authenticate ,(req,res,next) => {
    let email;
    let name;


    db.get(
        `SELECT customer_name, customer_email FROM Customer WHERE customer_id = $id`,
        {$id : req.user.id},
        (err,row) => {
            if(err){
                next(err);
            }else{
                name = row.customer_name;
                email = row.customer_email;
                db.run(
                    `INSERT INTO Reservation (customer_id,table_id,restaurant_id,reservation_time, reservation_date,reservation_guestnumber, reservation_guestName, reservation_guestEmail) VALUES ($customerId,$tableId,$restaurantId,$time,$date,$guestNumber,$guestName,$guestEmail)`,
                    {
                        $customerId: req.user.id,
                        $restaurantId: req.body.restaurantId,
                        $tableId: req.body.table_id,
                        $time: req.body.time,
                        $date: req.body.date,
                        $guestNumber: req.body.guestNumber,
                        $guestName: name,
                        $guestEmail: email
                    },
                    function(error){
                        if(error){
                            return next(error);
                        }
                        db.get(`SELECT Reservation.reservation_id, 
Reservation.reservation_time, Reservation.reservation_date, Reservation.reservation_guestnumber, Reservation.reservation_guestName, Reservation.reservation_guestEmail,
Restaurant.restaurant_name
             FROM Reservation
             JOIN Restaurant
             ON Reservation.restaurant_id = Restaurant.restaurant_id
             WHERE Reservation.reservation_id = ${this.lastID}`,
                            (error, reservation) => {
                                emailSender.main(reservation);
                                res.status(201).send('Successful reservation');
                            });

                    }
                );
            }
        }
    );

});



reservationRouter.put('/guestCustomer', (req,res,next) => {

    db.run(
        `INSERT INTO Reservation (table_id,restaurant_id,reservation_time, reservation_date,reservation_guestnumber, reservation_guestName, reservation_guestEmail) VALUES ($tableId,$restaurantId,$time,$date,$guestNumber,$guestName,$guestEmail)`,
        {
            $restaurantId: req.body.restaurantId,
            $tableId: req.body.table_id,
            $time: req.body.time,
            $date: req.body.date,
            $guestNumber: req.body.guestNumber,
            $guestName: req.body.guestName,
            $guestEmail: req.body.guestEmail
        },
        function(error){
            if(error){
                return next(error);
            }
            db.get(`SELECT Reservation.reservation_id, 
Reservation.reservation_time, Reservation.reservation_date, Reservation.reservation_guestnumber, Reservation.reservation_guestName, Reservation.reservation_guestEmail,
Restaurant.restaurant_name
             FROM Reservation
             JOIN Restaurant
             ON Reservation.restaurant_id = Restaurant.restaurant_id
             WHERE Reservation.reservation_id = ${this.lastID}`,
                (error, reservation) => {
                emailSender.main(reservation);
                res.status(201).send('Successful reservation');
                });
        }
    );

});


//DELETE RESERVATIONS
reservationRouter.delete('/:reservationId',tokenAuth.authenticate, (req,res,next) => {

    db.run(
        `DELETE FROM Reservation WHERE Reservation.reservation_id = $reservationId`,
        {
            $reservationId: req.params.reservationId
        },
        (error) => {
           if(error){
               next(error);
           } else{
               res.sendStatus(204);
           }
        });
});
reservationRouter.get('/:restaurantId',(req,res,next) => {
    db.all(
        `SELECT Reservation.*, Customer.customer_name
             FROM Reservation
             JOIN Customer
             ON Reservation.customer_id = Customer.customer_id
             WHERE Reservation.restaurant_id = $restaurantId
             AND reservation_date = $date`,{
            $restaurantId: req.params.restaurantId,
            $date: req.query.date
        }, (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }
        }
    );
});
reservationRouter.get('/:restaurantId',(req,res,next) => {
    db.all(
        `SELECT Reservation.*, Customer.customer_name
             FROM Reservation
             JOIN Customer
             ON Reservation.customer_id = Customer.customer_id
             WHERE Reservation.restaurant_id = $restaurantId
             AND reservation_date = $date`,{
            $restaurantId: req.params.restaurantId,
            $date: req.query.date
        }, (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }
        }
    );
});
//RESTAURANT BY DATE
reservationRouter.get('/:restaurantId',(req,res,next) => {
    const date = req.body.date;
    db.get(
        `SELECT Reservation.*
             FROM Reservation
             JOIN Restaurant
             ON Reservation.restaurant_id = Restaurant.restaurant_id
             WHERE Reservation.restaurant_id = $restaurantId
             AND reservation_date = $date`,{
            $restaurantId: req.params.restaurantId,
            $date: date
        }, (err,row) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(row);
            }
        }
    );
});


reservationRouter.get('/customer/:customerId',(req,res,next) => {
    db.get(
        `SELECT Reservation.reservation_id,Reservation.restaurant_id, Reservation.table_id, 
Reservation.reservation_time, Reservation.reservation_date, Reservation.reservation_guestnumber, Customer.customer_name
             FROM Reservation
             JOIN Customer
             ON Reservation.customer_id = Customer.customer_id
             WHERE Reservation.customer_id = $customerId`,{
            $customerId: req.params.customerId
        }, (err,rows) => {
            if(err){
                next(err);
            } else{
                res.status(200).send(rows);
            }
        }
    );
});




module.exports = reservationRouter;