const express = require("express");
const mongoose = require("mongoose");
const movieController = require("../controllers/movieController");

const router = express.Router();

// router.param("id", (req, res, next, val) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ status: "fail", message: "Invalid ID!" });
//   }

//   next();
// });

router
  .route("/top-5")
  .get(movieController.aliasTop5, movieController.getAllMovies);

router.route("/movies-stat").get(movieController.getMovieStats);

router.route("/top-genre/:year").get(movieController.getTopGenre);

router
  .route("/")
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);
router
  .route("/:id")
  .get(movieController.getMovie)
  .put(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
