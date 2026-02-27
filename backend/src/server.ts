import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import countryRoutes from "./routes/country.routes";
import jewelryDesignRoutes from "./routes/jewelry-design.routes";
import path from "path";
import sellerRoutes from "./routes/seller.routes";
import gemRoutes from "./routes/gem.routes";
import buyerRoutes from "./routes/buyer.routes";
import superAdminRoutes from "./routes/superAdmin.routes";
import adminSellerRoutes from "./routes/adminSeller.routes";
import adminGemRoutes from "./routes/adminGem.routes";
import adminUserRoutes from "./routes/adminUser.routes";
import adminReviewRoutes from "./routes/adminReview.routes";
import adminOrderRoutes from "./routes/adminOrder.routes";
import adminBlogRoutes from "./routes/adminBlog.routes";
import blogRoutes from "./routes/blog.routes";
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
app.use("/api/buyer", buyerRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminSellerRoutes);
app.use("/api/admin", adminGemRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminReviewRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/blogs", adminBlogRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
