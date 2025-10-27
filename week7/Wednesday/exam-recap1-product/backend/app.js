require('dotenv').config()
const express = require("express");
const app = express();
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors())
app.use(express.json());

connectDB();
app.use(express.static('view'));  // Serve frontend static files

// Use the productRouter for all "/products" routes
app.use("/api/products", productRouter);
// Use the userRouter for all "/users" routes
app.use("/api/users", userRouter);

app.use('/api', unknownEndpoint);
app.use(errorHandler);
app.use((req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});
module.exports = app;

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })  
