import { getTeacherByUserId, getTeacherCount } from "../models/teacherModel.js";
import { getUnapprovedUsersCount } from "../models/userModel.js";
import {
  getAllCoursesCount,
  getCourseCountByTeacherID,
} from "../models/courseModel.js";
import { getAllFacultiesCount } from "../models/facultyModel.js";
import { getStudentByUserId, getStudentCount } from "../models/studentModel.js";
import {
  getAllActiveSessions,
  getSessionByCourseID,
} from "../models/sessionsModel.js";
import { getAllStudentCourseRelationshipsByUserID } from "../models/studentCourseModel.js";

// @desc View dashboard stats
// @route GET /api/stats/:role
// @access admin

const adminStatsHandler = async (req, res, next) => {
  try {
    if (req.params.role === "admin") {
      const [studentCount, teacherCount, facultyCount, courseCount] =
        await Promise.all([
          getStudentCount(),
          getTeacherCount(),
          getAllFacultiesCount(),
          getAllCoursesCount(),
        ]);
      res.json({ studentCount, teacherCount, facultyCount, courseCount });
      return;
    } else if (req.params.role === "teacher") {
      const teacher = await getTeacherByUserId(req.user.userID);
      let sessionCount = 0;

      const [courseCount, activeSessions] = await Promise.all([
        getCourseCountByTeacherID(teacher.teacherID),
        getAllActiveSessions(),
      ]);

      for (let session of activeSessions) {
        if (session.course.teacher.teacherID === teacher.teacherID) {
          sessionCount += 1;
        }
      }
      res.json({ courseCount, sessionCount });
    } else if (req.params.role === "student") {
      let sessionCount = 0;
      const student = await getStudentByUserId(req.user.userID);
      const studentcourses = await getAllStudentCourseRelationshipsByUserID(
        student.studentID
      );

      for (let course of studentcourses) {
        const sessionforcourse = await getSessionByCourseID(course.courseID);
        if (sessionforcourse.length > 0) {
          sessionCount += sessionforcourse.length;
        }
      }
      res
        .status(200)
        .json({ sessionCount, coursesCount: studentcourses.length });
    } else {
      res.status(400);
      throw new Error("Invalid Role");
    }
  } catch (error) {
    next(error);
  }
};

// @desc View notification
// @route GET /api/stats/notification/:role
// @access admin

const notificationHandler = async (req, res, next) => {
  try {
    let count = 0;
    if (req.params.role === "admin") {
      count = await getUnapprovedUsersCount();

      res.status(200).json(count);
      return;
    } else if (req.params.role === "teacher") {
      const teacher = await getTeacherByUserId(req.user.userID);

      const activeSessions = await getAllActiveSessions();

      for (let session of activeSessions) {
        if (session.course.teacher.teacherID === teacher.teacherID) {
          count += 1;
        }
      }

      res.status(200).json(count);
      return;
    } else if (req.params.role === "student") {
      const student = await getStudentByUserId(req.user.userID);
      const studentcourses = await getAllStudentCourseRelationshipsByUserID(
        student.studentID
      );

      for (let course of studentcourses) {
        const sessionforcourse = await getSessionByCourseID(course.courseID);
        if (sessionforcourse.length > 0) {
          count += sessionforcourse.length;
        }
      }
      res.status(200).json(count);
      return;
    } else {
      res.status(400);
      throw new Error("Invalid Role");
    }
  } catch (error) {
    next(error);
  }
};

export { adminStatsHandler, notificationHandler };
