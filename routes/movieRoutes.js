const express = require("express");
const movieController = require("./../controllers/movieController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/top-5")
  .get(movieController.aliasTop5, movieController.getAllMovies);

router.route("/movies-stat").get(movieController.getMovieStats);

router.route("/top-genre/:year").get(movieController.getTopGenre);

router
  .route("/")
  .get(authController.protect, movieController.getAllMovies)
  .post(movieController.createMovie);
router
  .route("/:id")
  .get(movieController.getMovie)
  .put(movieController.updateMovie)
  .delete(
    authController.protect,
    authController.restrictTo("editor", "admin"),
    movieController.deleteMovie,
  );

module.exports = router;
