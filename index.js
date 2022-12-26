const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripe");

const ORIGIN = process.env.ORIGIN_AUTHORISATION;

//mongodb Config
const mongoose = require("mongoose");
mongoose
	.connect(process.env.DATABASE_CONNECTION)
	.then(() => console.log("Database Connected"))
	.catch((error) => console.log(error));

const cors = require("cors");
dotenv.config();
const app = express();

app.use(express.json());
app.use(
	cors({
		origin: [ORIGIN],
	})
);
app.get("/", (req, res) => {
	//res.status(200).json("hello there");
	res.sendFile(path.join(__dirname + "/index.html"));
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/Wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", stripeRoutes);

app.listen(process.env.PORT || 5000, () => {
	console.log("server running at port 5000");
});
