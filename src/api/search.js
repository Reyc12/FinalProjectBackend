const  express = require('express');
const searchRouter = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./findmytableproject.sqlite');

/*
Returns the restaurants that have available tables to book based on customer search by :
location, number of guests, time of required reservation, date of required reservation
in order to return only one table per search removeDuplicates function is used
 */
searchRouter.get('/',(req,res,next) => {
    const sql = `SELECT Restaurant.restaurant_id, Restaurant.restaurant_name,Restaurant.restaurant_cuisine,
Restaurant.restaurant_numberOfReviews,Restaurant.restaurant_rating,Restaurant.restaurant_price,Restaurant.restaurant_imagePath, RestaurantTable.table_id
FROM Restaurant JOIN RestaurantTable 
ON Restaurant.restaurant_id = RestaurantTable.restaurant_id
WHERE restaurant_location = $location
AND RestaurantTable.table_capacity = $guestNumber
AND Restaurant.restaurant_id NOT IN ( SELECT restaurant_id FROM Reservation WHERE  (
      reservation_time= $time AND reservation_date= $date) )`;

    db.all(sql,{
        $location: req.query.location,
        $guestNumber: req.query.guestNumber,
        $time: req.query.time,
        $date: req.query.date
        },
        (err, values) => {
        if(err){
            next(err);
        }else {
            const rows = removeDuplicates(values,"restaurant_id");
            res.status(200).send(rows);
        }
        }
    );
});

//removes objects with a duplicate prop in an array of objects
function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
}






module.exports = searchRouter;