require("dotenv").config();

const express = require("express");

const http = require("http");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Import all routes here
const stripeRouter = require("./stripe/stripe.routes");
const documentRoutes = require("./document/document.routes");

const app = express();
const server = http.createServer(app);

// APP SETUP
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

// Use the routes here
app.use("/api/v1/stripe", stripeRouter);
app.use("/api/v1/ocr", documentRoutes);

server.listen(port, () => console.log(`Server running on port ${port}`));
