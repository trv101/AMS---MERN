import express from "express";
const router = express.Router();

import {
  getAttendanceListHandler,
  getAttendanceByIdHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
  getAttendanceForSingleStudentHandler,
  markAttendanceWithQRHandler,
} from "../controllers/attendanceControler.js";

import {
  basicAuth,
  adminAccess,
  studentAccess,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(basicAuth, adminAccess, getAttendanceListHandler)
  .post(basicAuth, createAttendanceHandler);

router
  .route("/student/:id")
  .get(basicAuth, studentAccess, getAttendanceForSingleStudentHandler);

router
  .route("/:studentID/:sessionID")
  .get(basicAuth, adminAccess, getAttendanceByIdHandler)
  .put(basicAuth, adminAccess, updateAttendanceHandler)
  .delete(basicAuth, adminAccess, deleteAttendanceHandler);

router.get(
  "/qr/:studentID/:sessionID",
  basicAuth,
  studentAccess,
  markAttendanceWithQRHandler
);

export default router;
