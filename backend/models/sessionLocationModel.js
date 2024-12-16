// Import necessary modules
import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Faculty from "./facultyModel.js";

// Define SessionLocation model
const SessionLocation = db.define("session_location", {
  locationID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  facultyID: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

SessionLocation.belongsTo(Faculty, {
  foreignKey: "facultyID",
  onDelete: "CASCADE",
});

export default SessionLocation;

// reusable queries =================================================================

// Create a new session location
export const createSessionLocation = async (locationID, name, facultyID) => {
  const sessionLocation = await SessionLocation.create({
    locationID,
    name: name,
    facultyID: facultyID,
  });

  return sessionLocation;
};

// Read all session locations
export const getAllSessionLocations = async () => {
  const sessionLocations = await SessionLocation.findAll({
    include: [
      {
        model: Faculty,
      },
    ],
  });

  return sessionLocations;
};

// Read session location by ID
export const getSessionLocationById = async (id) => {
  const sessionLocation = await SessionLocation.findByPk(id, {
    include: [
      {
        model: Faculty,
      },
    ],
  });

  return sessionLocation;
};

// Update session location by ID
export const updateSessionLocationById = async (id, updates) => {
  const sessionLocation = await SessionLocation.findByPk(id);

  if (!sessionLocation) {
    throw new Error("Session location not found");
  }

  await sessionLocation.update(updates);

  return sessionLocation;
};

// Delete session location by ID
export const deleteSessionLocationById = async (id) => {
  const sessionLocation = await SessionLocation.findByPk(id);

  if (!sessionLocation) {
    throw new Error("Session location not found");
  }

  await sessionLocation.destroy();

  return sessionLocation;
};
