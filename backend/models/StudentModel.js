import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./userModel.js";
import Faculty from "./facultyModel.js";

const Student = db.define("student", {
  studentID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  facultyID: {
    type: DataTypes.UUID,
    allowNull: true, // Assuming a student may not always be associated with a faculty
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3, 4]],
    },
  },
});

// Define association with User model
Student.belongsTo(User, { foreignKey: "userID", onDelete: "CASCADE" });

// Define association with Faculty model
Student.belongsTo(Faculty, { foreignKey: "facultyID", onDelete: "CASCADE" });

export default Student;

// resuable queries =============================================================

export const getStudentList = async () => {
  const students = await Student.findAll({
    include: [
      {
        model: User,
        // attributes: [ 'firstName', 'lastName', 'email', 'role', 'isAdmin', 'isApproved'],
        exclude: ["password"],
      },
      {
        model: Faculty,
        // attributes: ['facultyID', 'department'],
      },
    ],
  });

  return students;
};

export const getStudentCount = async () => {
  const count = await Student.count();

  return count;
};

export const getStudentByUserId = async (userID) => {
  const student = await Student.findOne({
    where: { userID: userID },
    include: [
      {
        model: User,
        exclude: ["password"],
      },
    ],
  });

  return student;
};
export const getStudentByPK = async (studentID) => {
  const student = await Student.findByPk(studentID, {
    include: [
      {
        model: User,
        attributes: { exclude: ["password"] },
      },
    ],
  });

  return student;
};

export const createStudent = async (studentData) => {
  const createdStudent = await Student.create(studentData);
  return createdStudent;
};

export const updateStudent = async (studentID, updatedData) => {
  const updatedStudent = await Student.update(updatedData, {
    where: { studentID: studentID },
  });
  return updatedStudent;
};

export const delteStudentByUserId = async (userID) => {
  const deletedStudent = await Student.destroy({
    where: { userID: userID },
  });
  return deletedStudent;
};
