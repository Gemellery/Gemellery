import { Router } from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { authGuard } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post("/register", upload.single("seller_license"), register);
router.post("/login", login);
router.get("/profile", authGuard, (req, res) => {
    res.json((req as any).user);
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/__test", (req, res) => {
  res.json({ ok: true });
});


export default router;
