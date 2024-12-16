import { v4 as uuidv4 } from "uuid";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  getCoursesByTeacherID,
} from "../models/courseModel.js";
import { findFacultyByDepartment } from "../models/facultyModel.js";

// @desc Create a new course
// @route POST /api/course
// @access admin

const createCourseHandler = async (req, res, next) => {
  try {
    const { courseName, teacherID, facultyName, year } = req.body;

    if (!courseName || !teacherID || !facultyName || !year) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    const faculty = await findFacultyByDepartment(facultyName);

    const courseID = uuidv4();
    const course = await createCourse(
      courseID,
      courseName,
      teacherID,
      faculty.facultyID,
      year
    );

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc View all courses
// @route GET /api/course
// @access admin

const getAllCoursesHandler = async (req, res, next) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc View single course
// @route GET /api/course/:id
// @access admin

const getCourseByIdHandler = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc Update course
// @route PUT /api/course/:id
// @access admin

const updateCourseByIdHandler = async (req, res, next) => {
  const { courseName, teacherID, facultyID, year } = req.body;

  try {
    const updates = { courseName, teacherID, year };
    const course = await updateCourseById(req.params.id, updates);

    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc Delete course
// @route DELETE /api/course/:id
// @access admin

const deleteCourseByIdHandler = async (req, res, next) => {
  try {
    await deleteCourseById(req.params.id);
    res.status(200).json({ msg: "Delete success" });
  } catch (error) {
    next(error);
  }
};

// @desc view teacher course list
// @route DELETE /api/course/teacher
// @access admin/teacher

const getTeacherCourseListHandler = async (req, res, next) => {
  try {
    const response = await getCoursesByTeacherID(req.user.teacherID);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export {
  createCourseHandler,
  getAllCoursesHandler,
  getCourseByIdHandler,
  updateCourseByIdHandler,
  deleteCourseByIdHandler,
  getTeacherCourseListHandler,
};
