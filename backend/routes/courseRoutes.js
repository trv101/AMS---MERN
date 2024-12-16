import express from "express";
const router = express.Router();

import {
  createCourseHandler,
  getAllCoursesHandler,
  getCourseByIdHandler,
  updateCourseByIdHandler,
  deleteCourseByIdHandler,
  getTeacherCourseListHandler,
} from "../controllers/courseController.js";

import {
  basicAuth,
  adminAccess,
  teacherAccess,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(basicAuth, adminAccess, createCourseHandler)
  .get(basicAuth, adminAccess, getAllCoursesHandler);

router.get("/teacher", basicAuth, teacherAccess, getTeacherCourseListHandler);
router
  .route("/:id")
  .get(basicAuth, adminAccess, getCourseByIdHandler)
  .put(basicAuth, adminAccess, updateCourseByIdHandler)
  .delete(basicAuth, adminAccess, deleteCourseByIdHandler);

export default router;
