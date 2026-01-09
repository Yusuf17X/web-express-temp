const mongoose = require("mongoose");
const fs = require("fs");
const Movie = require("./../models/movieModel"); // Adjust path to your model

const DB =
  "mongodb+srv://yousif_db_user:T40Xl4XPR9nUgdWj@cluster0.drdsrxq.mongodb.net/movies";

mongoose
  .connect(DB)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error:", err));

// Read and parse movies. json
let movies = [];
try {
  const data = fs.readFileSync(`${__dirname}/movies.json`, "utf-8");
  movies = JSON.parse(data);
  console.log("Movies loaded:", movies.length, "records");
} catch (err) {
  console.error("Error reading movies.json:", err.message);
  process.exit(1);
}

const importData = async () => {
  try {
    // Using the Mongoose Model runs validators and type casting!
    await Movie.create(movies, { validateBeforeSave: true });
    console.log("Data loaded successfully with validation!");
  } catch (err) {
    console.error("ERROR LOADING DATA:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Movie.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.error("ERROR DELETING DATA:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

// CLI commands:  node import-dev-data.js --import OR --delete
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Please use --import or --delete flag");
  process.exit();
}

// # Import data with validation
// node dev-data/data/import-dev-data.js --import

// # Delete all data
// node dev-data/data/import-dev-data. js --delete
