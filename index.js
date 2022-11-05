const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")

dotenv.config();
const app = express();

mongoose.connect(process.env.DATABASE_CONNECTION)
.then(()=>console.log("Database Connected") )
.catch((error) => console.log(error) ); 

app.use(express.json());
app.use("/api/auth", authRoutes )
app.use("/api/user", userRoutes )

app.listen(process.env.PORT || 5000 , () => {
    console.log("server running at port 5000");
});  