import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import countryRoutes from "./routes/country.routes";
import jewelryDesignRoutes from "./routes/jewelry-design.routes";
import path from "path";
import sellerRoutes from "./routes/seller.routes";
import gemRoutes from "./routes/gem.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

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
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
