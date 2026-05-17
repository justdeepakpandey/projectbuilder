const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);


app.get("/", (req, res) => {
  res.send("Server running");
});

const startServer = async () => {
  const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;

  if (!mongoUrl) {
    console.error("MongoDB connection failed: MONGO_URL is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server started");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
