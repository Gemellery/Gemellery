import { Router } from "express";
import { getCountries } from "../controllers/country.controller";

const router = Router();

router.get("/", getCountries);

export default router;
