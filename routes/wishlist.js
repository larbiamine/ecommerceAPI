const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const { verifyToken } = require("./verifyToken");

router.post("/", async (req, res) => {
  const newWishlist = new Wishlist(req.body);
  try {
    await newWishlist.save();
    res.status(200).json("newWishlist added!");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:userId", verifyToken, async (req, res) => {
  if (req.user.id == req.params.userId) {
    const filter = { userId: req.params.userId };
    const ws = await Wishlist.findOne(filter);

    const exist = ws.products.some((p) => {
      return p === req.body.productId;
    });

    if (exist) {
      res.status(200).json("Product already exists");
    } else {
      const update = { $push: { products: req.body.productId } };
      const options = { new: true };
      try {
        await Wishlist.findOneAndUpdate(filter, update, options);
      } catch (error) {
        res.status(500).json(error);
      }
      res.status(200).json("Products Added To wishlist");
    }
  } else {
    res.status(500).json("not same user");
  }
});

// //Get user's wishlist
router.get("/find/:userId", verifyToken, async (req, res) => {
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

router.put("/edit/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.id == req.params.userId) {
      const filter = {
        userId: req.params.userId,
      };
      const ws = await Wishlist.findOne(filter);

      const newProducts = ws.products.filter((d) => d !== req.body.product_id);

      console.log(newProducts);

      try {
        await Wishlist.findOneAndUpdate(
          filter,
          { $set: { products: newProducts } },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
      // const updatedWishlist = await Wishlist.findOneAndUpdate(filter);

      // updatedWishlist.products.pop(req.product_id);
      // await updatedWishlist.save();

      res.status(200).json(newProducts);
    } else {
      res.status(500).json("not same user");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
