const router = require("express").Router()
const {verifyToken} = require("./verifyToken");

router.put("/:id", verifyToken() )

module.exports = router;