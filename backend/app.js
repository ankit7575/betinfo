const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error");
const dotenv = require("dotenv");
const path = require("path");

const app = express();

// Load env variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "config", "config.env") });
}

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.7:3000",
  "https://betinfo.live",
  "https://www.betinfo.live"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// Trust proxy
app.set("trust proxy", 1);

// Body parsing
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const userRoutes = require("./routes/userRoute");
const planRoutes = require("./routes/planRoutes");
const transactionRoute = require("./routes/transactionRoute");
const coinRoute = require("./routes/coinRoute");
const matchRoutes = require("./routes/matchRoutes");
const betfairRoutes = require("./routes/betfairRoutes");
const scoreRoute = require("./routes/score");

// Route use
app.use("/api", scoreRoute);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1", coinRoute);
app.use("/api/v1/transaction", transactionRoute);
app.use("/api/v1", userRoutes);
app.use("/api/v1", matchRoutes);
app.use("/api/v1", betfairRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend is running.");
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
