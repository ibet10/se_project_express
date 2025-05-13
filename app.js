const express = require("express");

require("dotenv").config();

const mongoose = require("mongoose");

const cors = require("cors");

const helmet = require("helmet");

const { errors } = require("celebrate");

const mainRouter = require("./routes/index");

const errorHandler = require("./middleware/error-handler");

const { requestLogger, errorLogger } = require("./middleware/logger");

const limiter = require("./middleware/rateLimiter");

const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", true); // Set because of: (node:14092) [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
// Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.

const app = express();

app.use(express.json()); // parse JSON data sent in the request body. Handle JSON-encoded data

app.use(cors()); // enable secure cross-origin resource sharing (CORS) requests and data transfers between browsers and servers

app.use(helmet()); // protects app from some well-known web vulnerabilities by setting HTTP headers appropriately. Place after express.json() and cors() and before route handlers

app.use(limiter); // basic rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(requestLogger); // Enable the request logger before all route handlers

// server crash testing - REMOVE AFTER APPROVED
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use("/", mainRouter); // Route handler

app.use(errorLogger); // Enable errorLogger after the route handler and before the error handlers

app.use(errors()); // Celebrate Error Handler

app.use(errorHandler); // Centralized Error handler

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

module.exports = app;
