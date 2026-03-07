import express from "express";
import {
  reAuthenticateSuperAdmin,
  createAdmin,
  getAllAdmins,
  editAdmin,
  updateAdminStatus,
  freezeAccount,
  removeAdmin,
} from "../controllers/superAdmin.controller";

import { authGuard } from "../middleware/auth.middleware";
import { requireSuperAdmin } from "../middleware/role.middleware";

const router = express.Router();

router.post("/re-authenticate", authGuard, requireSuperAdmin, reAuthenticateSuperAdmin);

router.post("/admins", authGuard, requireSuperAdmin, createAdmin);
router.get("/admins", authGuard, requireSuperAdmin, getAllAdmins);
router.put("/admins/:id", authGuard, requireSuperAdmin, editAdmin);
router.patch("/admins/:id/status", authGuard, requireSuperAdmin, updateAdminStatus);
router.patch("/users/:id/freeze", authGuard, requireSuperAdmin, freezeAccount);
router.delete("/admins/:id", authGuard, requireSuperAdmin, removeAdmin);

export default router;