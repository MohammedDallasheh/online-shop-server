require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");

//Auth
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

//Connect to the database
const connectDB = require("./config/db");
connectDB();

// Init middleware
app.disable("etag");
app.use(cors({ exposedHeaders: "Content-Range" }));
app.use(express.json({ extended: false, limit: "5000kb" }));

//Logger
const { logger } = require("./middleware/logger");
app.use(logger);

//API test
app.get("/", (req, res) => {
  res.send("API Running");
});

// Define Routes
app.use(express.static("public"));
app.use("/api/display", require("./routes/api/display"));
app.use("/api/categories", require("./routes/api/categories"));
app.use("/api/subs", require("./routes/api/subs"));
app.use("/api/products", require("./routes/api/products"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/customers", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/orders", require("./routes/api/orders"));
app.use("/api/invoices", require("./routes/api/orders"));
app.use("/api/constants", require("./routes/api/constant"));
app.use("/api/image", require("./routes/api/image"));

/******************* */
app.use("/dev", require("./routes/dev"));
app.use("/data", require("./routes/data/dataGenerator"));
/******************* */

const { errorHandler } = require("./utils/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
