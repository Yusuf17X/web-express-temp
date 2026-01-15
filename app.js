const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("@exortek/express-mongo-sanitize");
const hpp = require("hpp");
const inputSanitizer = require("./utils/inputSanitizer");

const movieRouter = require("./routes/movieRoutes");
const userRouter = require("./routes/userRoutes");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request. Please try again later!",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

// Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Sanitization against XSS
//! NEEDS REVIEW AFTER AI
// escape all HTML in body/params:
app.use(inputSanitizer({ mode: "escape" }));
// OR strip tags completely:
// app.use(inputSanitizer({ mode: 'strip' }));

// HTTP Parameter Pollution protection
app.use(
  hpp({
    whitelist: ["year", "ratingAverage", "duration", "releaseDate"],
  }),
);

app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/users", userRouter);

// .all() means all the verbs(HTTP methods): GET, POST, etc...
app.all("/*splat", (req, res, next) => {
  next(new appError(`Cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
