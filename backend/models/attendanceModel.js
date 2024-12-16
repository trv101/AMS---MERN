import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Student from "./studentModel.js";
import Session from "./sessionsModel.js";
import User from "./userModel.js";
import Course from "./courseModel.js";

const Attendance = db.define("attendance", {
  studentID: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  sessionID: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },

  isPresent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  // Add other attendance-related fields as needed
});

// Define associations with Student and Session models
Attendance.belongsTo(Student, { foreignKey: "studentID", onDelete: "CASCADE" });
Attendance.belongsTo(Session, { foreignKey: "sessionID", onDelete: "CASCADE" });

export default Attendance;

// resuable queries =============================================================

export const getAttendanceList = async () => {
  const attendanceList = await Attendance.findAll({
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
        model: Session,
        include: [
          {
            model: Course,
          },
        ],
      },
    ],
  });
  return attendanceList;
};

export const getAttendanceListforSingleStudent = async (id) => {
  const attendanceList = await Attendance.findAll({
    where: {
      studentID: id,
    },
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
        model: Session,
        include: [
          {
            model: Course,
          },
        ],
      },
    ],
  });
  return attendanceList;
};

export const getAttendanceById = async (studentID, sessionID) => {
  const attendance = await Attendance.findOne({
    where: { studentID: studentID, sessionID: sessionID },
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
        model: Session,
        include: [
          {
            model: Course,
          },
        ],
      },
    ],
  });
  return attendance;
};

export const createAttendance = async (attendanceData) => {
  const createdAttendance = await Attendance.create(attendanceData);
  return createdAttendance;
};

export const updateAttendance = async (studentID, sessionID, updatedData) => {
  const updatedAttendance = await Attendance.update(updatedData, {
    where: { studentID, sessionID },
  });
  return updatedAttendance;
};

export const deleteAttendance = async (studentID, sessionID) => {
  const deletedAttendance = await Attendance.destroy({
    where: { studentID, sessionID },
  });
  return deletedAttendance;
};
