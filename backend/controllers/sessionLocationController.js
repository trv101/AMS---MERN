import { v4 as uuidv4 } from "uuid";
import {
  createSessionLocation,
  getAllSessionLocations,
  getSessionLocationById,
  updateSessionLocationById,
  deleteSessionLocationById,
} from "../models/sessionLocationModel.js";
import { findFacultyByDepartment } from "../models/facultyModel.js";

// @desc Create a new session location
// @route POST /api/session-location
// @access admin

const createSessionLocationHandler = async (req, res, next) => {
  try {
    const { locationName, facultyName } = req.body;

    if (!locationName || !facultyName) {
      res.status(400);
      throw new Error("Fields cannot be empty");
    }

    const faculty = await findFacultyByDepartment(facultyName);

    const sessionLocation = await createSessionLocation(
      uuidv4(),
      locationName,
      faculty.facultyID
    );
    res.status(201).json(sessionLocation);
  } catch (error) {
    next(error);
  }
};

// @desc View all session locations
// @route GET /api/session-location
// @access admin

const getAllSessionLocationsHandler = async (req, res, next) => {
  try {
    const sessionLocations = await getAllSessionLocations();
    res.status(200).json(sessionLocations);
  } catch (error) {
    next(error);
  }
};

// @desc View single session location
// @route GET /api/session-location/:id
// @access admin

const getSessionLocationByIdHandler = async (req, res, next) => {
  try {
    const sessionLocation = await getSessionLocationById(req.params.id);
    res.status(200).json(sessionLocation);
  } catch (error) {
    next(error);
  }
};

// @desc Update session location
// @route PUT /api/session-location/:id
// @access admin

const updateSessionLocationByIdHandler = async (req, res, next) => {
  const { locationName: name, facultyID } = req.body;

  try {
    const updates = { name, facultyID };
    const sessionLocation = await updateSessionLocationById(
      req.params.id,
      updates
    );
    res.status(200).json(sessionLocation);
  } catch (error) {
    next(error);
  }
};

// @desc Delete session location
// @route DELETE /api/session-location/:id
// @access admin

const deleteSessionLocationByIdHandler = async (req, res, next) => {
  try {
    await deleteSessionLocationById(req.params.id);
    res.status(200).json({ msg: "Delete success" });
  } catch (error) {
    next(error);
  }
};

export {
  createSessionLocationHandler,
  getAllSessionLocationsHandler,
  getSessionLocationByIdHandler,
  updateSessionLocationByIdHandler,
  deleteSessionLocationByIdHandler,
};
