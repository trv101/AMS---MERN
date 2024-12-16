import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Faculty = db.define("faculty", {
  facultyID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Faculty;

// resuable queries =============================================================

export const createFaculty = async (department, facultyID) => {
  const faculty = await Faculty.create({ department, facultyID });
  return faculty;
};

export const findFacultyByDepartment = async (faculty) => {
  const facultyRes = await Faculty.findOne({
    where: { department: faculty },
  });
  return facultyRes;
};

export const getAllFaculties = async () => {
  const faculties = await Faculty.findAll({
    attributes: ["facultyID", "department"],
  });

  return faculties;
};

export const getAllFacultiesCount = async () => {
  const count = await Faculty.count();

  return count;
};

export const getFacultyById = async (id) => {
  const faculty = await Faculty.findByPk(id, {
    attributes: ["facultyID", "department"],
  });

  return faculty;
};

export const updateFacultyById = async (id, updates) => {
  const faculty = await Faculty.findByPk(id);

  if (!faculty) {
    throw new Error("Faculty not found");
  }

  await faculty.update(updates);

  return faculty;
};

export const deleteFacultyById = async (id) => {
  const faculty = await Faculty.findByPk(id);

  if (!faculty) {
    throw new Error("Faculty not found");
  }

  await faculty.destroy();

  return faculty;
};
