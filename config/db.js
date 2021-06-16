const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    mongoose.Error.prototype.code = 600;
    Error.prototype.code = 700;

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection ERROR", err, err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
