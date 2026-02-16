import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import countryRoutes from "./routes/country.routes";
import jewelryDesignRoutes from "./routes/jewelry-design.routes";
import path from "path";
import sellerRoutes from "./routes/seller.routes";
import gemRoutes from "./routes/gem.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/jewelry-design", jewelryDesignRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/seller", sellerRoutes);
app.use("/api/gems", gemRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
