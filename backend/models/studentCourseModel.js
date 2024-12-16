import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Student from "./studentModel.js";
import Course from "./courseModel.js";
import User from "./userModel.js";

import Faculty from "./facultyModel.js";

const StudentsCourses = db.define("students_courses", {
  studentID: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  courseID: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
});

// Define associations with Student and Course models
StudentsCourses.belongsTo(Student, {
  foreignKey: "studentID",
  onDelete: "CASCADE",
});
StudentsCourses.belongsTo(Course, {
  foreignKey: "courseID",
  onDelete: "CASCADE",
});

export default StudentsCourses;

//reusable queries =========================================================================

// Create a new student-course relationship
export const createStudentCourseRelationship = async (studentID, courseID) => {
  const studentCourseRelationship = await StudentsCourses.create({
    studentID: studentID,
    courseID: courseID,
  });

  return studentCourseRelationship;
};

// Read all student-course relationships
export const getAllStudentCourseRelationships = async () => {
  const relationships = await StudentsCourses.findAll({
    include: [
      {
        model: Student,
        include: [
          {
            model: User,
            exclude: ["password"],
          },
        ],
      },
      {
        model: Course,
        attributes: [
          "courseID",
          "courseName",
          "teacherID",
          "facultyID",
          "year",
        ],
        include: [
          {
            model: Faculty,
          },
        ],
      },
    ],
  });

  return relationships;
};

export const getAllStudentCourseRelationshipsByUserID = async (id) => {
  const relationships = await StudentsCourses.findAll({
    where: {
      studentID: id,
    },
    include: [
      {
        model: Course,

        include: [
          {
            model: Faculty,
          },
        ],
      },
    ],
  });

  return relationships;
};
// Read student-course relationship by IDs
export const getStudentCourseRelationshipByIds = async (
  studentID,
  courseID
) => {
  const relationship = await StudentsCourses.findOne({
    where: { studentID: studentID, courseID: courseID },

    include: [
      {
        model: Student,
        include: [
          {
            model: User,
            exclude: ["password"],
          },
        ],
      },
      {
        model: Course,

        include: [
          {
            model: Faculty,
          },
        ],
      },
    ],
  });

  return relationship;
};

// Update student-course relationship by IDs
export const updateStudentCourseRelationshipByIds = async (
  studentID,
  courseID,
  updates
) => {
  const relationship = await StudentsCourses.findOne({
    where: { studentID: studentID, courseID: courseID },
  });

  if (!relationship) {
    throw new Error("Student-course relationship not found");
  }

  await relationship.update(updates);

  return relationship;
};

// Delete student-course relationship by IDs
export const deleteStudentCourseRelationshipByIds = async (
  studentID,
  courseID
) => {
  const relationship = await StudentsCourses.findOne({
    where: { studentID: studentID, courseID: courseID },
  });

  if (!relationship) {
    throw new Error("Student-course relationship not found");
  }

  await relationship.destroy();

  return relationship;
};
