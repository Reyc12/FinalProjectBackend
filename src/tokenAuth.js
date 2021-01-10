require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = {

    authenticate: function (req,res,next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null){
            return res.sendStatus(401);
        }
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403);
            req.user = user;
            console.log('authenticated');
            next();
        })
    },
    generateAccessToken: function (user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET /*{expiresIn: '30s'}*/);
}


};

/*
app.post('/login', async(req,res) => {
    //Authenticate User
    const user = users.find(user => user.name === req.body.name)
    if (user == null){
        res.status(400).send('Cannot find user');
    }
    try{
        if (await bcrypt.compare(req.body.password, user.password)){
            const username = req.body.name;
            const newUser = {name: username};
            const accessToken = tokenAuth.generateAccessToken(newUser);
            const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken);
            res.json({accessToken: accessToken , refreshToken: refreshToken});
        }else{
            res.send('Wrong Password');
        }
    } catch {
        res.status(500).send();
    }
});*/

/*
app.post('/token',(req,res) => {
   const refreshToken = req.body.token;
   if (refreshToken==null){ res.sendStatus(401);}
   if (!refreshTokens.includes(refreshToken)){res.sendStatus(403);}
   jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, (err,user)=> {
       if(err) return res.sendStatus(403);
       const accessToken = tokenAuth.generateAccessToken({name: user.name});
       res.send(accessToken);
   })
});
*/
/*
app.delete('logout', (req, res) => {
   refreshTokens = refreshTokens.filter(token => token !== req.body.token);
   res.sendStatus(204);
});*/

