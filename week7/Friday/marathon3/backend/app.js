require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const jobRouter = require("./routes/jobRouter");
const userRouter = require("./routes/userRouter");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors())
app.use(express.json());

connectDB();

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
// Use the userRouter for all "/users" routes
app.use("/api/users", userRouter);

// Serve static files from dist directory
app.use(express.static('dist'));

// SPA fallback: serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(errorHandler);

module.exports = app;

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })  
