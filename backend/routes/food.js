var express = require("express");
const food = require("../models/food");
var Router = express.Router();

const foodImport = require("../models/food");
const foodItem = foodImport.foodItem;

Router.get("/", function(req, res) {

    if (req.query.vendorid === null || req.query.vendorid === undefined) {
        foodItem.find(function(err, users) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {

                res.status(200).json(users);
            }
        });
    } else {
        foodItem.find({VendorID: req.query.vendorid}, function(err, users) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {

                res.status(200).json(users);
            }
        });
    }
});

// Add or insert food item 
Router.post("/insert-item", async (req, res) => {
    const FoodItem = req.body;

    const existingFoodItem = await foodItem.findOne({ Name: FoodItem.Name, VendorID: FoodItem.VendorID });
    if (existingFoodItem) {
        res.status(400).json({errMsg: "You already have a food item by this name in your menu."});
    } else {
        const newFoodItem = new foodItem(FoodItem);
        newFoodItem
            .save()
            .then(foodItem => res.status(200).json(foodItem))
            .catch(err => res.status(500).json(err));
    }
});

// Edit 
Router.post('/edit-item', async (req, res) => {
    const FoodItem = req.body;
    if (FoodItem.vendorEdited) {
        foodItem.updateMany({VendorID: FoodItem.VendorID}, {
            CanteenOpeningTime: FoodItem.COT,  
            CanteenClosingTime: FoodItem.CCT, 
            VendorName: FoodItem.VendorName,
            ShopName: FoodItem.ShopName
        }, (err) => console.log(err));
    } else {
        if (FoodItem.rate) {
            foodItem.findOneAndUpdate({ Name: FoodItem.Name, VendorID: FoodItem.VendorID },
                {
                    $inc: { BuyersRated: 1 }
                }, 
                {new: true},
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                    } else {
                        const newRating = (doc.Rating * (doc.BuyersRated - 1) + FoodItem.Rating) / (doc.BuyersRated); 
                        foodItem.findOneAndUpdate({ _id: doc._id },
                            {
                                Rating: newRating
                            }, 
                            {new: true},
                            (err, doc) => {
                                if (err) {
                                    console.log(err);
                                    res.status(500).json(err);
                                } else {
                                    res.status(200).send(`OK, edited ${doc.Name}`);
                                }
                            }
                        );
                        res.status(200).json({BuyersRated: doc.BuyersRated, oldRating: doc.Rating});
                    }
                }
            );
        } else {
            foodItem.findOneAndUpdate({ Name: FoodItem.Name, VendorID: FoodItem.VendorID },
                {
                    Price: FoodItem.Price,
                    Veg: FoodItem.Veg,
                    AddOns: FoodItem.AddOns, 
                    Tags: FoodItem.Tags,
                }, 
                {new: true},
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                    } else {
                        res.status(200).send(`OK, edited ${doc.Name}`);
                    }
                }
            );
        }
    }
});

// Delete
Router.post('/delete', async (req, res) => {
    const ID = req.body._id;
    foodItem.deleteOne({_id: ID}).then(() => {
        res.status(200).send("OK");
    }).catch((error) => {
        res.status(500).json({errMsg: error.message});
    })
});

module.exports = Router;

