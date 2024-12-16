import { v4 as uuidv4 } from "uuid";
import {
  createSession,
  getAllSessions,
  getSessionById,
  updateSessionById,
  deleteSessionById,
  getSessionByCourseID,
  getParallelSessions,
  getAllActiveSessions,
} from "../models/sessionsModel.js";
import { getSessionLocationById } from "../models/sessionLocationModel.js";
import { getCourseById, getCoursesByTeacherID } from "../models/courseModel.js";
import { getAllStudentCourseRelationshipsByUserID } from "../models/studentCourseModel.js";
import { getTeacherByUserId } from "../models/teacherModel.js";

// @desc create session
// @route POST /api/session
// @access admin/teacher

const createSessionHandler = async (req, res, next) => {
  try {
    const { courseID, dateTime, minutes, locationID } = req.body;

    if (!courseID || !dateTime || !minutes || !locationID) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    const course = await getCourseById(courseID);
    if (req.user.userID != course.teacherID && !req.user.isAdmin) {
      throw new Error("This subject does not belong to you!");
    }
    const checkDateTime = new Date(dateTime);
    const currentTime = new Date();

    if (checkDateTime < currentTime) {
      res.status(400);
      throw new Error("Session must be in a future time");
    }

    const results = await getParallelSessions(dateTime, minutes);

    if (results.length > 0) {
      const [locationInfo, courseInfo] = await Promise.all([
        getSessionLocationById(locationID),
        getCourseById(courseID),
      ]);

      const teacherCourses = await getCoursesByTeacherID(courseInfo.teacherID);

      const teacherIDsArray = teacherCourses.map((course) => course.teacherID);

      for (const item of results) {
        if (
          courseInfo.year === item.course.year &&
          courseInfo.facultyID === item.course.facultyID
        ) {
          res.status(400);
          throw new Error(
            "Cant have multiple sessions at same time for students which are in same faculty and same year"
          );
        }

        if (item.session_location.locationID === locationInfo.locationID) {
          res.status(400);
          throw new Error("Cant have multiple sessions at same location");
        }

        const techerexists = teacherIDsArray.includes(item.course.teacherID);

        if (techerexists) {
          res.status(400);
          throw new Error("The teacher has a another session at the time");
        }
      }

      const session = await createSession(
        uuidv4(),
        courseID,
        dateTime,
        minutes,
        locationID
      );
      res.status(201).json(session);
      return;
    }

    const session = await createSession(
      uuidv4(),
      courseID,
      dateTime,
      minutes,
      locationID
    );
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc view single session
// @route GET /api/session/:id
// @access ownData

const getSessionByIdHandler = async (req, res, next) => {
  try {
    const session = await getSessionById(req.params.id);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc update session
// @route PUT /api/session/:id
// @access admin

const updateSessionByIdHandler = async (req, res, next) => {
  const { courseID, dateTime, minutes, locationID } = req.body;

  const course = await getCourseById(courseID);
  if (req.user.userID != course.teacherID || !req.user.isAdmin) {
    throw new Error("This subject does not belong to you!");
  }

  try {
    const session = await updateSessionById(req.params.id, {
      courseID,
      dateTime,
      minutes,
      locationID,
    });

    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc get all sessions
// @route GET /api/session
// @access admin

const getAllSessionsHandler = async (req, res, next) => {
  try {
    const sessions = await getAllSessions();

    res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// @desc get all sessions
// @route GET /api/session/student/:id
// @access admin

const getAllSessionsRelatedToStudentHandler = async (req, res, next) => {
  try {
    let resultarr = [];
    const studentcourses = await getAllStudentCourseRelationshipsByUserID(
      req.user.studentID
    );
    for (let course of studentcourses) {
      const sessionforcourse = await getSessionByCourseID(course.courseID);
      resultarr.push(...sessionforcourse);
    }

    res.status(200).json(resultarr);
  } catch (error) {
    next(error);
  }
};

// @desc delete session
// @route DELETE /api/session/:id
// @access admin

const deleteSessionByIdHandler = async (req, res, next) => {
  try {
    const session = await getSessionById(req.params.id);
    const course = await getCourseById(session.courseID);
    if (req.user.userID != course.teacherID) {
      throw new Error("This subject does not belong to you!");
    }

    await deleteSessionById(req.params.id);

    res.status(200).json({ msg: "delete success" });
  } catch (error) {
    next(error);
  }
};

// @desc get upcoming sessions
// @route DELETE /api/session/teacher
// @access teacher

const getTeacherSessionsHandler = async (req, res, next) => {
  try {
    const sessions = await getAllActiveSessions();
    const teacher = await getTeacherByUserId(req.user.userID);
    let sessionArr = [];

    for (let session of sessions) {
      if (session.course.teacher.teacherID === teacher.teacherID) {
        sessionArr.push(session);
      }
    }

    res.status(200).json(sessionArr);
  } catch (error) {
    next(error);
  }
};

// @desc get all teacher sessions
// @route DELETE /api/session/teacher/all
// @access teacher

const getAllsessionsTeacherHandler = async (req, res, next) => {
  try {
    const sessions = await getAllActiveSessions();
    const teacher = await getTeacherByUserId(req.user.userID);
    let sessionArr = [];

    for (let session of sessions) {
      if (session.course.teacher.teacherID === teacher.teacherID) {
        sessionArr.push(session);
      }
    }

    res.status(200).json(sessionArr);
  } catch (error) {
    next(error);
  }
};

export {
  createSessionHandler,
  getSessionByIdHandler,
  updateSessionByIdHandler,
  getAllSessionsHandler,
  getAllSessionsRelatedToStudentHandler,
  deleteSessionByIdHandler,
  getTeacherSessionsHandler,
  getAllsessionsTeacherHandler,
};
