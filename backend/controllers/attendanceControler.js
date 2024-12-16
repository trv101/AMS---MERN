import {
  getAttendanceList,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceListforSingleStudent,
} from "../models/attendanceModel.js";
import { v4 as uuidv4 } from "uuid";

// @desc Get all attendance records
// @route GET /api/attendance
// @access admin

const getAttendanceListHandler = async (req, res, next) => {
  try {
    const attendanceList = await getAttendanceList();
    res.status(200).json(attendanceList);
  } catch (error) {
    next(error);
  }
};

// @desc Get all attendance records for a student
// @route GET /api/attendance/student/:id
// @access admin

const getAttendanceForSingleStudentHandler = async (req, res, next) => {
  try {
    const attendanceList = await getAttendanceListforSingleStudent(
      req.params.id
    );

    res.status(200).json(attendanceList);
  } catch (error) {
    next(error);
  }
};

// @desc Get a single attendance record by ID
// @route POST /api/attendance/:studentID/:sessionID
// @access ownData

const getAttendanceByIdHandler = async (req, res, next) => {
  const { studentID, sessionID } = req.params;
  try {
    if (req.user.userID === req.params.id || req.user.isAdmin) {
      const attendance = await getAttendanceById(studentID, sessionID);
      if (!attendance) {
        res.status(404);
        throw new Error("Attendance not found");
      }
      res.status(200).json(attendance);
    } else {
      res.status(401);
      throw new Error("Not Authorized");
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create a new attendance record
// @route POST /api/attendance
// @access admin

const createAttendanceHandler = async (req, res, next) => {
  try {
    const { studentID, sessionID } = req.body;

    const attendance = await getAttendanceById(studentID, sessionID);
    if (attendance) {
      res.status(404);
      throw new Error("Already Marked the attendance");
    }

    if (req.user.userID === req.params.id || req.user.isAdmin) {
      const createdAttendance = await createAttendance({
        studentID,
        sessionID,
        isPresent: true,
      });
      res.status(201).json(createdAttendance);
    } else {
      res.status(401);
      throw new Error("Not Authorized");
    }
  } catch (error) {
    next(error);
  }
};

// @desc Create a new attendance record with qr
// @route get /api/attendance/qr/:studentID/:sessionID
// @access admin

const markAttendanceWithQRHandler = async (req, res, next) => {
  try {
    const { studentID, sessionID } = req.params;

    const attendance = await getAttendanceById(studentID, sessionID);
    if (attendance) {
      res.status(404);
      throw new Error("Already Marked the attendance");
    }

    if (req.user.studentID === req.params.studentID || req.user.isAdmin) {
      const createdAttendance = await createAttendance({
        studentID,
        sessionID,
        isPresent: true,
      });
      res.status(201).json(createdAttendance);
    } else {
      res.status(401);
      throw new Error("Not Authorized");
    }
  } catch (error) {
    next(error);
  }
};

// @desc Update an attendance record by ID
// @route PUT /api/attendance/:studentID/:sessionID
// @access admin

const updateAttendanceHandler = async (req, res, next) => {
  try {
    const { studentID, sessionID, isPresent } = req.body;

    const updatedAttendance = await updateAttendance(studentID, sessionID, {
      studentID,
      sessionID,
      isPresent,
    });
    res.status(200).json(updatedAttendance);
  } catch (error) {
    next(error);
  }
};

// @desc Delete an attendance record by ID
// @route DELETE /api/attendance/:studentID/:sessionID
// @access admin

const deleteAttendanceHandler = async (req, res, next) => {
  try {
    const { studentID, sessionID } = req.params;

    const deletedAttendance = await deleteAttendance(studentID, sessionID);
    res.status(200).json(deletedAttendance);
  } catch (error) {
    next(error);
  }
};

export {
  getAttendanceListHandler,
  getAttendanceByIdHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
  markAttendanceWithQRHandler,
  getAttendanceForSingleStudentHandler,
};
