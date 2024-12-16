// models/users.model.js

import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Adjust the path based on your actual file structure

const User = db.define("user", {
  userID: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;

// resuable queries =============================================================

export const finduserByEmail = async (email) => {
  const user = await User.findOne({ where: { email: email } });
  return user;
};

export const createUser = async (
  firstName,
  userID,
  lastName,
  email,
  password
) => {
  const user = await User.create({
    firstName: firstName,
    userID: userID,
    lastName: lastName,
    email: email,
    password: password,
  });
  return user;
};

export const findAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  return users;
};

export const unapprovedUsers = async () => {
  const users = await User.findAll({
    where: { isApproved: false },
    attributes: { exclude: ["password"] },
  });
  return users;
};

export const getUnapprovedUsersCount = async () => {
  const count = await User.count({
    where: { isApproved: false },
  });
  return count;
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    exclude: ["password"],
  });

  if (!user) {
    throw new Error("User not found");
  }

  //   // const [user] = await db.query('SELECT * FROM users WHERE userID = (:id)', {
  //   //   replacements: { id: req.params.id },
  //   //   type: db.QueryTypes.SELECT,
  //   // });

  return user;
};

export const deleteUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new Error("User not found");
  }

  await user.destroy();

  return user;
};
