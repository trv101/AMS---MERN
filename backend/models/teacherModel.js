import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./userModel.js";
import Faculty from "./facultyModel.js";

const Teacher = db.define("teacher", {
  teacherID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  hireDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  facultyID: {
    type: DataTypes.UUID,
    allowNull: true, // Assuming a teacher may not always be associated with a faculty
  },
});

// Define association with User model
Teacher.belongsTo(User, { foreignKey: "userID", onDelete: "CASCADE" });

// Define association with Faculty model
Teacher.belongsTo(Faculty, { foreignKey: "facultyID", onDelete: "CASCADE" });

export default Teacher;

// resuable queries =============================================================

export const getTeacherList = async () => {
  const teachers = await Teacher.findAll({
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

  return teachers;
};

export const getTeacherCount = async () => {
  const count = await Teacher.count();

  return count;
};

export const getTeacherByUserId = async (userID) => {
  const teacher = await Teacher.findOne({
    where: { userID: userID },
    include: [
      {
        model: User,
        exclude: ["password"],
      },
    ],
  });

  return teacher;
};

export const updateTeacher = async (teacherID, updatedData) => {
  const updatedTeacher = await Teacher.update(updatedData, {
    where: { teacherID: teacherID },
  });
  return updatedTeacher;
};

export const deleteTeacherById = async (userID) => {
  const deletedTeacher = await Teacher.destroy({
    where: { userID: userID },
  });
  return deletedTeacher;
};

export const createTeacher = async (teacherData) => {
  const createdTeacher = await Teacher.create(teacherData);
  return createdTeacher;
};
