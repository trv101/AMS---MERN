import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Teacher from "./teacherModel.js";
import Faculty from "./facultyModel.js";
import User from "./userModel.js";

const Course = db.define("course", {
  courseID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  teacherID: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  facultyID: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3, 4]],
    },
  },
  // Add other course-related fields as needed
});

// Define association with Teacher model
Course.belongsTo(Teacher, { foreignKey: "teacherID" });

// Define association with Faculty model
Course.belongsTo(Faculty, { foreignKey: "facultyID" });

export default Course;

//reusable quries===========================================

// Create a new course
export const createCourse = async (
  courseID,
  courseName,
  teacherID,
  facultyID,
  year
) => {
  const course = await Course.create({
    courseID,
    courseName: courseName,
    teacherID: teacherID,
    facultyID: facultyID,
    year: year,
  });

  return course;
};

// Read all courses
export const getAllCourses = async () => {
  const courses = await Course.findAll({
    include: [
      {
        model: Teacher,
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"], // Include teacher's name from the User table
          },
        ],
      },
      { model: Faculty },
    ],
  });

  return courses;
};

export const getAllCoursesCount = async () => {
  const count = await Course.count();

  return count;
};

export const getCoursesByTeacherID = async (teacherID) => {
  const courses = await Course.findAll({
    where: {
      teacherID: teacherID,
    },
    include: [
      {
        model: Teacher,
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"], // Include teacher's name from the User table
          },
        ],
      },
      { model: Faculty },
    ],
  });

  return courses;
};

export const getCourseCountByTeacherID = async (teacherID) => {
  const count = await Course.count({
    where: {
      teacherID: teacherID,
    },
  });

  return count;
};

export const getCoursesByFaculty = async (FacultyID) => {
  const courses = await Course.findAll({
    where: {
      FacultyID: FacultyID,
    },

    include: [
      {
        model: Teacher,
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"], // Include teacher's name from the User table
          },
        ],
      },
      { model: Faculty },
    ],
  });

  return courses;
};
// Read course by ID
export const getCourseById = async (id) => {
  const course = await Course.findByPk(id, {
    include: [
      {
        model: Teacher,
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"], // Include teacher's name from the User table
          },
        ],
      },
      { model: Faculty },
    ],
  });

  return course;
};

// Update course by ID
export const updateCourseById = async (id, updates) => {
  const course = await Course.findByPk(id);

  if (!course) {
    throw new Error("Course not found");
  }

  await course.update(updates);

  return course;
};

// Delete course by ID
export const deleteCourseById = async (id) => {
  const course = await Course.findByPk(id);

  if (!course) {
    throw new Error("Course not found");
  }

  await course.destroy();

  return course;
};
