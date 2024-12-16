import { v4 as uuidv4 } from "uuid";
import {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  updateFacultyById,
  deleteFacultyById,
} from "../models/facultyModel.js";

// @desc crate faculty
// @route POST /api/faculty
// @access admin

const createFacultyHandler = async (req, res, next) => {
  try {
    const { department } = req.body;

    if (!department) {
      res.status(400);
      throw new Error("Fields can not be empty");
    }

    const faculty = await createFaculty(department, uuidv4());
    res.status(201).json(faculty);
  } catch (error) {
    next(error);
  }
};

// @desc view single faculty
// @route GET /api/faculty/:id
// @access admin

const getFacultyByIdHandler = async (req, res, next) => {
  try {
    const faculty = await getFacultyById(req.params.id);
    res.status(200).json(faculty);
  } catch (error) {
    next(error);
  }
};

// @desc update faculty
// @route PUT /api/faculty/:id
// @access admin

const updateFacultyByIdHandler = async (req, res, next) => {
  const { department } = req.body;

  try {
    const faculty = await updateFacultyById(req.params.id, { department });

    res.status(200).json(faculty);
  } catch (error) {
    next(error);
  }
};

// @desc get all faculties
// @route GET /api/faculty
// @access admin

const getAllFacultiesHandler = async (req, res, next) => {
  try {
    const faculties = await getAllFaculties();

    res.status(200).json(faculties);
  } catch (error) {
    next(error);
  }
};

// @desc delete faculty
// @route DELETE /api/faculty
// @access admin

const deleteFacultyByIdHandler = async (req, res, next) => {
  try {
    await deleteFacultyById(req.params.id);

    res.status(200).json({ msg: "delete success" });
  } catch (error) {
    next(error);
  }
};

export {
  createFacultyHandler,
  getFacultyByIdHandler,
  updateFacultyByIdHandler,
  getAllFacultiesHandler,
  deleteFacultyByIdHandler,
};
