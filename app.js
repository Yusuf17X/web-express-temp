const express = require("express");
const morgan = require("morgan");
const movieRouter = require("./routes/movieRoutes");
const userRouter = require("./routes/userRoutes");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/users", userRouter);

// .all() means all the verbs(HTTP methods): GET, POST, etc...
app.all("/*splat", (req, res, next) => {
  next(new appError(`Cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
