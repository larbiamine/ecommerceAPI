const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const { verifyTokenn } = require("./verifyToken");

router.post("/", async (req, res) => {
  const newWishlist = new Wishlist(req.body);
  try {
    await newWishlist.save();
    res.status(200).json("newWishlist added!");
  } catch (error) {
    res.status(500).json(error);
  }
});

// //Get user wishlist
router.get("/find/:userId", verifyTokenn, async (req, res) => {
  try {
    if (req.user.id == req.params.userId) {
      const wishlist = await Wishlist.findOne({ userId: req.params.userId });
      var products = [];
      for (let i in wishlist.products) {
        const p = await Product.findById(wishlist.products[i]);
        products.push(p);
      }
      res.status(200).json(products);
    } else {
      res.status(500).json("not same user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/edit/:userId", verifyTokenn, async (req, res) => {
  try {
    if (req.user.id == req.params.userId) {
      const updatedWishlist = await Wishlist.findOne({
        userId: req.params.userId,
      });
      await Wishlist.findOneAndDelete({ userId: req.params.userId });

      updatedWishlist.products.pop(req.product_id);
      await wl.save();

      res.status(200).json(updatedWishlist);
    } else {
      res.status(500).json("not same user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
