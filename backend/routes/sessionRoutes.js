import express from "express";
const router = express.Router();

import {
  createSessionHandler,
  getSessionByIdHandler,
  updateSessionByIdHandler,
  getAllSessionsHandler,
  deleteSessionByIdHandler,
  getAllSessionsRelatedToStudentHandler,
  getTeacherSessionsHandler,
  getAllsessionsTeacherHandler,

} from "../controllers/sessionController.js";

import { basicAuth, adminAccess, teacherAccess, studentAccess } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(basicAuth, teacherAccess, createSessionHandler)
  .get(basicAuth, adminAccess, getAllSessionsHandler);


router.get('/teacher',basicAuth, teacherAccess, getTeacherSessionsHandler)

router.get('/student',basicAuth, studentAccess, getAllSessionsRelatedToStudentHandler)
router.get('/teacher/all',basicAuth, teacherAccess, getAllsessionsTeacherHandler)

  router
  .route("/student/:id")
  .get(basicAuth, adminAccess, getAllSessionsRelatedToStudentHandler);

router
  .route("/:id")
  .get(basicAuth, adminAccess, getSessionByIdHandler)
  .put(basicAuth, teacherAccess, updateSessionByIdHandler)
  .delete(basicAuth, teacherAccess, deleteSessionByIdHandler);

export default router;
