const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use(express.json());

let orders = [];

// Home Page
app.get("/", (req, res) => {
    res.send("Cafe Ordering Backend Running!");
});

// Get All Orders
app.get("/orders", (req, res) => {
    res.json(orders);
});

// Create Order
app.post("/orders", (req, res) => {

    const order = {
        id: Date.now(),
        table: req.body.table,
        items: req.body.items,
        status: "Pending"
    };

    orders.push(order);

    console.log("New Order:");
    console.log(order);

    res.json({
        success: true,
        order
    });
}); 

app.put("/orders/:id", (req, res) => {

    const orderId = Number(req.params.id);

    const order = orders.find(
        o => o.id === orderId
    );

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    order.status = req.body.status;

    res.json(order);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});