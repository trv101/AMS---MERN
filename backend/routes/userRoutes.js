import express from "express";
const router = express.Router();

import {
  authUser,
  registerUser,
  getUsers,
  updateUser,
  getSingleUser,
  studentList,
  getTeachersList,
  getUnapprovedUsers,
  getStaffListData,
  deleteUser,
} from "../controllers/userController.js";
import { basicAuth, adminAccess } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(basicAuth, adminAccess, getUsers);

router.route("/login/:role").post(authUser);

router.route("/unapproved").get(basicAuth, adminAccess, getUnapprovedUsers);

router.route("/teachers").get(basicAuth, adminAccess, getTeachersList);
router.route("/staff").get(basicAuth, adminAccess, getStaffListData);
router.route("/students").get(basicAuth, adminAccess, studentList);

router
  .route("/:id")
  .get(basicAuth, getSingleUser)
  .put(basicAuth, adminAccess, updateUser)
  .delete(basicAuth, adminAccess, deleteUser);

export default router;
