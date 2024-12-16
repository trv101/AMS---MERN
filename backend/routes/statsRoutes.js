import express from "express";

import {
  adminStatsHandler,
  notificationHandler,
} from "../controllers/statsController.js";

import { basicAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard/:role", basicAuth, adminStatsHandler);

router.get("/notification/:role", basicAuth, notificationHandler);

export default router;
