const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const mySqlPool = require("./database");
const errorMiddleware = require("./middleware/ErrorMiddleware");

const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

//configure dotenv
dotenv.config();

//rest object
const app = express();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
//routes
app.use("/api/v1/account", require("./routes/AccountRoutes"));
app.use("/api/v1/organizer", require("./routes/OrganizerRoutes"));
app.use("/api/v1/user", require("./routes/UserRoutes"));
app.use("/api/v1/staff", require("./routes/StaffRoutes"));
app.use("/api/v1/event", require("./routes/EventRoutes"));
app.use("/api/v1/category", require("./routes/CategoryRoutes"));
app.use("/api/v1/address", require("./routes/AddressRoutes"));
app.use("/api/v1/order", require("./routes/OrderRoutes"));

app.get("/test", (req, res) => {
  res.status(200).send("<h1>Welcome</h1>");
});

//middleware
app.use(errorMiddleware);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 400;
  res.status(statusCode).json({
    error: err.message,
  });
});

//port
const PORT = process.env.PORT || 3000;

//conditionally Listen
mySqlPool
  .query("SELECT 1")
  .then(() => {
    //My SQL
    console.log("MySQL DB Connected");
    //listen
    app.listen(PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
