const router = require("express").Router();
const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const filterUsername = { username: req.body.username };
    const filterEmail = { email: req.body.email };

    const byUsername = await User.findOne(filterUsername);
    const byEmail = await User.findOne(filterEmail);

    if (byUsername) {
      res.status(500).json("username already exists");
      return;
    }
    if (byEmail) {
      res.status(500).json("Email already exists");
      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }

  const newUser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    //Creating users cart
    const cart = {
      userId: savedUser._id,
      products: [],
    };
    const newCart = new Cart(cart);
    await newCart.save();
    //Creating User's Wishlist
    const wishlist = {
      userId: savedUser._id,
      products: [],
    };
    const newWishlist = new Wishlist(wishlist);
    await newWishlist.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(401).json("wrong credentials (user not found)");
      return;
    }

    const hashpass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET_KEY
    );
    const userPassword = hashpass.toString(CryptoJS.enc.Utf8);

    if (userPassword != req.body.password) {
      res.status(401).json("wrong credentials");
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
