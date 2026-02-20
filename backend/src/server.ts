import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import countryRoutes from "./routes/country.routes";
import jewelryDesignRoutes from "./routes/jewelry-design.routes";
import path from "path";
import sellerRoutes from "./routes/seller.routes";
import gemRoutes from "./routes/gem.routes";
import superAdminRoutes from "./routes/superAdmin.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/jewelry-design", jewelryDesignRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/seller", sellerRoutes);
app.use("/api/gems", gemRoutes);
app.use("/api/super-admin", superAdminRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
