const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DB.replace(
  "<DATABASE_PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => console.log("DB Connected!"));

app.listen(3000, () => {
  console.log("Started listening...");
});
