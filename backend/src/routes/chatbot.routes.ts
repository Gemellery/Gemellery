import { Router } from "express";
import { handleChat } from "../controllers/chatbot.controller";

const router = Router();

router.post("/", handleChat);

export default router;
