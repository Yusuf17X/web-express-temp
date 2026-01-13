const mongoose = require("mongoose");
const slugify = require("slugify");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A movie must have a title!"],
      unique: true,
      trim: true,
      minlength: [2, "Title too short!"],
      maxlength: [100, "Title too long!"],
    },
    slug: String,
    director: {
      type: String,
      required: [true, "A movie must have a director!"],
    },
    year: {
      type: Number,
      required: [true, "A movie must have a year!"],
      min: [1888, "Movies didnt exist before 1888!"],
      max: [2030, "Far in the future!"],
    },
    ratingAverage: {
      type: Number,
      default: 1.0,
      min: [1, "Ratting cannot be below 1.0!"],
      max: [10, "Rating cannot exceed 10.0!"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    genre: {
      type: [String],
      required: [true, "A movie must have a genre!"],
      enum: {
        values: ["Action", "Comedy", "Drama", "Horror", "Sci-fi"],
        message: "{VALUE} is not a valid genre!",
      },
    },
    actors: [String],
    duration: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A movie must have a summary!"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A movie must have a description!"],
      validate: {
        validator: function (value) {
          //! the this keyword here point to the current document only when we are creating a new document :( So wont work on update
          return value.length > this.summary.length;
        },
        message: "Description must be longer than the summary!",
      },
    },
    posterImage: {
      type: String,
      required: [true, "A movie must have a poster!"],
    },
    trailerUrl: String,
    releaseDate: Date,
    isReleased: {
      type: Boolean,
      required: true,
    },
    isSecret: {
      type: Boolean,
      default: false,
    },

    //* Could be useful note
    //   createdAt: {
    //     type: Date,
    //     default: Date.now(),
    //   }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//? Cant be used in a query | Not part of the database
//TODO Could of made it in the controller instead of virtual property
//* But its all about fat models this controllers (you know separate business from app logic)
movieSchema.virtual("durationInHours").get(function () {
  return Math.round((this.duration / 60) * 10) / 10;
});

//* Types of hooks in mongoose:
// Document, query, aggregate and model

// Document middleware: will act on the currently processed document

// Runs before .save() and .create() not .insertMany()
// this here point to the document.. remember ? :) document middleware
movieSchema.pre("save", function () {
  this.slug = slugify(this.title, { lower: true });
});

movieSchema.post("save", function (doc) {});

// Query middleware
// the this here is a query object
movieSchema.pre(/^find/, function () {
  this.find({ isReleased: { $ne: false } });
  this.start = Date.now();
});

movieSchema.post(/^find/, function (docs) {
  console.log(`This query took ${Date.now() - this.start}ms`);
});

// Aggregation middleware/hook
movieSchema.pre("aggregate", function () {
  // console.log(this.pipeline())
  this.pipeline().unshift({ $match: { isReleased: { $ne: false } } });
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
