import express from "express";
const router = express.Router();
import {
  createFacultyHandler,
  getFacultyByIdHandler,
  updateFacultyByIdHandler,
  getAllFacultiesHandler,
  deleteFacultyByIdHandler,
} from "../controllers/facultyController.js";

import {
  basicAuth,
  studentAccess,
  teacherAccess,
  adminAccess,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(basicAuth, adminAccess, createFacultyHandler)
  .get(basicAuth, adminAccess, getAllFacultiesHandler);

router
  .route("/:id")
  .get(basicAuth, adminAccess, getFacultyByIdHandler)
  .put(basicAuth, adminAccess, updateFacultyByIdHandler)
  .delete(basicAuth, adminAccess, deleteFacultyByIdHandler);

export default router;
