require("dotenv").config();

// console.log(process.env.MONGODB_URI);

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Error:");
        console.error(error);
    }
}

 
connectDB();

const db = client.db("cafeDB");
const ordersCollection = db.collection("orders");
console.log("DB Name:", db.databaseName);
console.log("Collection Ready");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


// Home Page
app.get("/", (req, res) => {
    res.send("Cafe Ordering Backend Running!");
});

// Get All Orders

app.get("/orders", async (req, res) => {
    try {
        console.log("GET /orders hit");

        const orders = await ordersCollection.find().toArray();

        console.log(orders);

        res.json(orders);

    } catch (error) {

        console.log("FULL ERROR:");
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
});


// Create Order

app.post("/orders", async (req, res) => {

    const order = {
        id: Date.now(),
        table: req.body.table,
        items: req.body.items,
        status: "Pending"
    };

    try {
        await ordersCollection.insertOne(order);

        console.log("New Order:");
        console.log(order);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating order"
        });
    }
});

app.put("/orders/:id", async (req, res) => {

    const orderId = Number(req.params.id);

    try {

        const result = await ordersCollection.updateOne(
            { id: orderId },
            {
                $set: {
                    status: req.body.status
                }, 
                $currentDate: {
                    updatedAt: true
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const updatedOrder = await ordersCollection.findOne({
            id: orderId
        });

        res.json(updatedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating order"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});