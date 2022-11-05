const router = require("express").Router()
const Order = require("../models/Order");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

// //create oder

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        await newOrder.save()
        res.status(200).json("Order added!");
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/:id", verifyTokenAndAdmin , async (req, res) =>{
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
} )

router.delete("/:id", verifyTokenAndAdmin, async (req, res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order deleted");
    } catch (error) {
        res.status(500).json(error);
    }
})

// //Get user oder
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const orders = await Order.find({userId: req.params.userId});

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
})

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error);
    }
} )



router.get("/income", verifyTokenAndAdmin, async(req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1));

    try {
        aggregate = [
            { 
                $match: {
                    createdAt:{
                        $gte:previousMonth}
                }
            },
            {
                $project:{
                    $month: { $month: "$createdAt"},
                    sales: "$amount",
                },
            },
            {
                $group:{
                    _id: "$month",
                    total:{$sum: "$sales"},
                },
            }
            
        ];
        const income = await Order.aggregate(aggregate)
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error);
    }

}) 

module.exports = router;