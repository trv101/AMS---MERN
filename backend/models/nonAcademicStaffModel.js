import { DataTypes } from "sequelize";
import db from "../config/db.js";
import User from "./userModel.js";
import Faculty from "./facultyModel.js";

const NonAcademicStaff = db.define("non_academic_staff", {
  staffID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  hireDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  facultyID: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

NonAcademicStaff.belongsTo(User, { foreignKey: "userID", onDelete: "CASCADE" });

NonAcademicStaff.belongsTo(Faculty, {
  foreignKey: "facultyID",
  onDelete: "CASCADE",
});

export default NonAcademicStaff;

// resuable query======================================================

export const createNonAcademicStaff = async (userID, facultyID) => {
  const nonAcademicStaff = await NonAcademicStaff.create({
    staffID: uuidv4(),
    userID: userID,
    facultyID: facultyID,
  });

  return nonAcademicStaff;
};

export const getStaffList = async () => {
  const staff = await NonAcademicStaff.findAll({
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

  return staff;
};

export const getStaffByUserID = async (userID) => {
  const staff = await NonAcademicStaff.findOne({
    where: { userID: userID },

    include: [
      {
        model: User,
        attributes: ["userID", "firstName", "lastName", "email", "isAdmin"],
      },
    ],
  });

  return staff;
};

// Update non-academic staff by ID
export const updateNonAcademicStaffById = async (id, updates) => {
  const staff = await NonAcademicStaff.findByPk(id);

  if (!staff) {
    throw new Error("Non-academic staff not found");
  }
  d;
  await staff.update(updates);

  return staff;
};

// Delete non-academic staff by ID
export const deleteNonAcademicStaffById = async (userID) => {
  const deletedStudent = await Student.destroy({
    where: { userID: userID },
  });
  return deletedStudent;
};
