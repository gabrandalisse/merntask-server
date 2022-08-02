const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("the database is connected");
  } catch (error) {
    console.log(error);
    process.exit(1); // Detiene la app en caso de error
  }
};

module.exports = connectToDB;
