const Movie = require("./../models/movieModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.aliasTop5 = (req, res, next) => {
  req.queryOverrides = {
    ...req.query,
    sort: "-ratingAverage,-year",
    fields: "title,year,ratingAverage",
    limit: "5",
  };
  next();
};

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const querySource = req.queryOverrides || req.query;

  const features = new APIFeatures(Movie.find(), querySource)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query;

  res.status(200).json({
    status: "success",
    results: movies.length,
    data: { movies },
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  if (!req.body)
    return res.status(400).json({ status: "fail", message: "Invalid data!" });

  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      movie: newMovie,
    },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return next(new AppError("No movie with that ID!", 404));

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) return next(new AppError("No movie with that ID!", 404));

  res.status(200).json({ status: "success", data: { updatedMovie } });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) return next(new AppError("No movie with that ID!", 404));

  res.status(204).json({ status: "success", data: null });
});

exports.getMovieStats = catchAsync(async (req, res, next) => {
  const stats = await Movie.aggregate([
    {
      $match: {
        year: { $gte: 2000 },
      },
    },
    {
      $unwind: "$genre",
    },
    {
      $group: {
        _id: "$genre",
        num: { $sum: 1 },
        totalRatings: { $sum: "$ratingQuantity" },
        avgRate: { $avg: "$ratingAverage" },
        minDuration: { $min: "$duration" },
        maxDuration: { $max: "$duration" },
      },
    },
    {
      $sort: { num: -1 },
    },
    {
      $match: { _id: { $ne: "Drama" } },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getTopGenre = catchAsync(async (req, res, next) => {
  const { year } = req.params;
  const stats = await Movie.aggregate([
    {
      $match: {
        releaseDate: {
          $gte: new Date(`${year}-1-1`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $unwind: "$genre",
    },
    {
      $group: {
        _id: "$genre",
        numMovies: { $sum: 1 },
        avgRate: { $avg: "$ratingAverage" },
        totalRatings: { $sum: "$ratingQuantity" },
      },
    },
    {
      $sort: {
        numMovies: -1,
      },
    },
    { $limit: 5 },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
