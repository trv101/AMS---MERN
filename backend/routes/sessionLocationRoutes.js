import express from "express";
const router = express.Router();

import {
  createSessionLocationHandler,
  getAllSessionLocationsHandler,
  getSessionLocationByIdHandler,
  updateSessionLocationByIdHandler,
  deleteSessionLocationByIdHandler,
} from "../controllers/sessionLocationController.js";

import { basicAuth, adminAccess } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(basicAuth, adminAccess, createSessionLocationHandler)
  .get(basicAuth, adminAccess, getAllSessionLocationsHandler);

router
  .route("/:id")
  .get(basicAuth, adminAccess, getSessionLocationByIdHandler)
  .put(basicAuth, adminAccess, updateSessionLocationByIdHandler)
  .delete(basicAuth, adminAccess, deleteSessionLocationByIdHandler);

export default router;
