import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { getStudentByUserId } from "../models/studentModel.js";
import { getTeacherByUserId } from "../models/teacherModel.js";

const basicAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: ["userID", "email", "isAdmin"],
      });

      next();
    } catch (error) {
      res.status(401);
      next(error);
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, no token");
  }
});

const studentAccess = async (req, res, next) => {
  try {
    const data = await getStudentByUserId(req.user.userID);

    if (data || req.user.isAdmin) {
      if (data) {
        req.user.studentID = data.studentID;
      }

      next();
    } else {
      res.status(401);
      throw new Error("Not Authorized as a student");
    }
  } catch (e) {
    res.status(401);
    next(e);
  }
};

const teacherAccess = async (req, res, next) => {
  try {
    const data = await getTeacherByUserId(req.user.userID);

    if (data || req.user.isAdmin) {
      if (data) {
        req.user.teacherID = data.teacherID;
      }

      next();
    } else {
      res.status(401);
      throw new Error("Not Authorized as a Teacher");
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

const adminAccess = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    next(error);
  }
};

export { basicAuth, studentAccess, teacherAccess, adminAccess };
