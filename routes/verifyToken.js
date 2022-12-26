const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.token;

	if (authHeader) {
		const token = authHeader.split(" ")[1];
		try {
			const user = jwt.verify(token, process.env.JWT);

			req.user = user;
			next();
		} catch (err) {
			console.log(err.message);
			if (err.message === "jwt expired") {
				// res.status(200).json("token expired");
				res.status(200).json({ redirectURL: "/login" });
				// res.redirect("/login");
			} else {
				res.status(200).json("token is not valid");
			}
		}

		// jwt.verify(token, process.env.JWT, (err, user) => {
		// 	if (err) {
		// 		console.log(err);
		// 		console.log(err.message);
		// 		if (err.message === "jwt expired") {
		// 			res.status(403).json("token expired");
		// 		} else {
		// 			res.status(403).json("token is not valid");
		// 		}
		// 	}
		// 	req.user = user;
		// 	next();
		// });
	} else {
		return res.status(200).json("You are Not authenticated");
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
