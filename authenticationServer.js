require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./findmytableproject.sqlite');
const tokenAuth = require('./src/tokenAuth');
const jwt = require("jsonwebtoken");
const emailSender = require("./src/emailSender");
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));



// REGISTER NEW CUSTOMER OFFICIAL ROUTE
app.post('/registerCustomer', async(req, res, next) => {
    const name = req.body.customer.name,
        email = req.body.customer.email,
        password = req.body.customer.password,
        address = req.body.customer.address;
    if (!name || !email || !password) {
        return res.sendStatus(400);
    }
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO Customer (customer_name, customer_password,customer_email, customer_address)' +
            'VALUES ($name, $password, $email, $address)';
        const values = {
            $name: name,
            $password: hashedPassword,
            $email: email,
            $address: address
        };
        db.run(sql, values, function(error) {
            if (error) {
                next(error);
            } else {
                db.get(`SELECT * FROM Customer WHERE Customer.customer_id = ${this.lastID}`,
                    (error, customer) => {
                        res.status(201).json({customer: customer});
                    });
            }
        });
    }catch{
        res.status(500).send();
    }

});

// REGISTER NEW RESTAURANT OFFICIAL ROUTE
app.post('/registerRestaurant', async(req, res, next) => {
    const
        email = req.body.Restaurant.email,
        password = req.body.Restaurant.password;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'UPDATE Restaurant SET  restaurant_password = $password  WHERE restaurant_email = $email'
        const values = {
            $password: hashedPassword,
            $email: email,
        };
        db.run(sql, values, function(error) {
            if (error) {
                next(error);
            } else {
                db.get(`SELECT * FROM Restaurant`,
                    (error, customer) => {
                        res.status(201).json({customer: customer});
                    });
            }
        });
    }catch{
        res.status(500).send();
    }

});

/*const refreshTokens=[];*/
// CUSTOMER LOGIN OFFICIAL ROUTE
app.post('/customerLogin',  (req,res,next) => {
    //Find if Customer exists
    const  email  =  req.body.username;
    const  password  =  req.body.password;
    const table = 'Customer';
    const prefix = 'customer';
    findUserByEmail(table,prefix,email, async (err,user)=>{
        if(err){
            next(err);
        }
        if(!user){
            console.log('cannot find email');
            res.status(400).send('Cannot find User');}

        try{
            if (await bcrypt.compare(password, user.customer_password)){
                const id = user.customer_id;
                const newUser = {id: id};
                //res.send(newUser);
                const accessToken = tokenAuth.generateAccessToken(newUser);
                /*const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken);*/
                res.send({user: id, accessToken });
                console.log('Logged in');
            }else{
                console.log('wrong password');
                res.status(400).send('Wrong Password');
            }
        } catch {
            res.status(500).send();
        }
    });
});


// RESTAURANT LOGIN OFFICIAL ROUTE
app.post('/restaurantLogin',  (req,res,next) => {
    //Find if Customer exists
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    const table = 'Restaurant';
    const prefix = 'restaurant';
    findUserByEmail(table,prefix,email, async (err,user)=>{
        if(err){
            next(err);
        }
        if(!user){
            console.log('cannot find User');
            res.status(400).send('Cannot find User');}

        try{
            if (await bcrypt.compare(password, user.restaurant_password)){
                const id = user.restaurant_id;
                const newUser = {id: id};
                //res.send(newUser);
                const accessToken = tokenAuth.generateAccessToken(newUser);
                /*const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET);
                refreshTokens.push(refreshToken);*/
                res.send({user: id, accessToken });
                console.log('Restaurant Logged in');
            }else{
                res.send('Wrong Password');
            }
        } catch {
            res.status(500).send();
        }
    });
});

//TESTING IF TOKEN WORKS
app.get('/customerDetails',tokenAuth.authenticate,(req,res,next)=>{
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
});



//****** find user by email helper function
/*runs a query to find user by email*/
const findUserByEmail  =  (table,prefix,email, cb) => {
    return  db.get(`SELECT * FROM ${table} WHERE ${prefix}_email = $email`,{$email: email}, (err, row) => {
        cb(err, row)
    });
}

function test(){
    return  db.get(`SELECT reservation_date FROM Reservation`, (err, row) => {
        if(err){
            console.log(err);
        }
        console.log(row);
        const dateString = (row.reservation_date);
        const dateParts = dateString.split("/");
        const dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
        const testString = '07/01/2021';
        const b = testString.split("/");
        const c = new Date(+b[2], b[1] - 1, +b[0]);
        console.log(c < dateObj);
        console.log(dateObj);
    });
}
//test();

//emailSender.main().catch(console.error);
app.listen(8080);

// CUSTOMER LOG OUT *********************