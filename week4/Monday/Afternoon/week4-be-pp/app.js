const express = require("express");
const app = express();
const tourRouter = require("./routes/tourRouter");
const userRouter = require('./routes/userRouter');

const morgan = require('morgan');

const authorizeUsersAccess = require('./middleware/auth');

// Middleware to parse JSON
app.use(morgan('tiny'));

app.use(express.json());

app.use("/tours", tourRouter);

app.use('/users', authorizeUsersAccess, userRouter);

const port = 4000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});