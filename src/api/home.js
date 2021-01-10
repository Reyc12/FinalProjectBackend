const  express = require('express');
const homeRouter = express.Router();


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./findmytableproject.sqlite');

//Show restaurants based on location
homeRouter.get('/:location',(req,res,next) => {

db.all(
    `SELECT restaurant_id, restaurant_name, restaurant_cuisine,
            restaurant_numberOfReviews, restaurant_rating, restaurant_price, restaurant_imagePath, restaurant_location FROM Restaurant WHERE restaurant_location = $location`,
    {
        $location: req.params.location
    },
    (err,rows) => {
        if(err){
            next(err);
        }else {
            res.status(200).send(rows);
        }
    }
);
});



module.exports = homeRouter;
