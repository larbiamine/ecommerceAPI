const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT, (err, user) => {
            if (err) {
                res.status(403).json("token is not valid");
            }
            req.user = user;
            next();
        })
    }else{
        console.log("here");
        return res.status(401).json("You are Not authenticated yeh");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin ) {
            next()
            
        }else{
            res.status(403).json("Not Allowed");
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin ) {
            next()
        }else{
            res.status(403).json("Not Allowed (not admin)");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};