import express from "express";
import cors from "cors";
import pricingRoutes from "./routes/pricing.js";

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pricing", pricingRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Intervista AI Backend is running 🚀",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});