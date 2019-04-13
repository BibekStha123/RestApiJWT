const jwt = require('jsonwebtoken'); 

//decode will just decode the token, verify will decode and verify too
module.exports = function(req, res, next){
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "process.env.JWT_KEY");
        req.userData = decoded;
        next();
    }catch(error){
        res.json({
            msg: 'authentication failed'
        })
    }
}