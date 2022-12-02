const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) {
        console.log(err);
        if (err.message === "jwt expired") {
          res.status(403).json("token expired");
        } else {
          res.status(403).json("token is not valid");
        }
        // res.status(403).json(err.message);
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are Not authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not Allowed..");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Not Allowed (not admin)");
    }
  });
};

const verifyTokenn = (req, res, next) => {
  verifyToken(req, res, () => {
    next();
  });
};

module.exports = {
  verifyToken,
  verifyTokenn,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
