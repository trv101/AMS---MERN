import asyncHandler from "express-async-handler";
import generateToken from "../Utils/generateToken.js";

import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import User, {
  createUser,
  deleteUserById,
  findAllUsers,
  finduserByEmail,
  getUserById,
  unapprovedUsers,
} from "../models/userModel.js";
import CustomValidator from "../Utils/validator.js";
import NonAcademicStaff, {
  deleteNonAcademicStaffById,
  getStaffByUserID,
  getStaffList,
} from "../models/nonAcademicStaffModel.js";
import Teacher, {
  deleteTeacherById,
  getTeacherByUserId,
  getTeacherList,
} from "../models/teacherModel.js";
import Student, {
  delteStudentByUserId,
  getStudentByUserId,
  getStudentList,
} from "../models/studentModel.js";
import Faculty, { findFacultyByDepartment } from "../models/facultyModel.js";
import { NONAC, TEACHER, STUDENT } from "../config/constants.js";
import db from "../config/db.js";

// @desc  Auth user & get token
// @route POST /api/users/login/:role
// @access Public
const authUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!["NONAC", "STUDENT", "TEACHER"].includes(req.params.role)) {
      res.status(400);
      throw new Error("Invalid user Type");
    }
    if (!email || !password) {
      res.status(400);
      throw new Error("Fields can not be empty");
    }

    if (!CustomValidator.validateEmail(email)) {
      res.status(400);
      throw new Error("Invalid Email");
    }

    if (!CustomValidator.validatePassword(password)) {
      res.status(400);
      throw new Error("Invalid Password");
    }

    const user = await finduserByEmail(email);

    if (!user) {
      res.status(400);
      throw new Error("User does not exists");
    }

    if (!user.isApproved) {
      res.status(400);
      throw new Error("Your account is pending for admin approval");
    }

    const bcryptPW = user.password;

    if (await bcrypt.compare(password, bcryptPW)) {
      let userData;

      // Fetch role-specific data
      if (req.params.role === "STUDENT") {
        userData = await getStudentByUserId(user.userID);
      } else if (req.params.role === "TEACHER") {
        userData = await getTeacherByUserId(user.userID);
      } else if (req.params.role === "NONAC") {
        userData = await getStaffByUserID(user.userID);
      }

      // Check if role-specific data is found
      if (userData) {
        return res.status(200).json({
          userData,
          role: req.params.role,
          token: generateToken(user.userID),
        });
      } else {
        res.status(400);
        throw new Error("Can not find a user");
      }
    } else {
      res.status(400);
      throw new Error("Invalid Password");
    }
  } catch (err) {
    next(err);
  }
};

// @desc  Register a new User
// @route POST /api/users/
// @access Public

const registerUser = async (req, res, next) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400);
      throw new Error("Fields can not be empty");
    }

    if (!CustomValidator.validateEmail(email)) {
      res.status(400);
      throw new Error("Invalid Email");
    }

    if (!CustomValidator.validatePassword(password)) {
      res.status(400);
      throw new Error("Invalid Password");
    }

    const existingUser = await finduserByEmail(email);

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    let userID = uuidv4();

    const salt = await bcrypt.genSalt(10);

    const hashedPW = await bcrypt.hash(password, salt);

    await createUser(firstName, userID, lastName, email, hashedPW);

    res.status(201).json({ msg: "Successfull Registration!" });
  } catch (err) {
    next(err);
  }
};

// @desc  list all users
// @route GET /api/users/
// @access admin

const getUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// @desc  list all users
// @route GET /api/users/unapproved
// @access admin

const getUnapprovedUsers = async (req, res, next) => {
  try {
    const users = await unapprovedUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// @desc  updateUser
// @route PUT /api/users/:id
// @access admin

const updateUser = async (req, res, next) => {
  const t = await db.transaction(); // Assuming sequelize is your ORM instance

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      isAdmin,
      isApproved,
      faculty,
      role,
      date,
      year,
    } = req.body;

    // Validate email and password
    if (email && !CustomValidator.validateEmail(email)) {
      res.status(400);
      throw new Error("Invalid Email");
    }

    if (password && !CustomValidator.validatePassword(password)) {
      res.status(400);
      throw new Error("Invalid password");
    }

    const user = await getUserById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check if faculty exists
    const facultyRes = await findFacultyByDepartment(faculty);

    if (!facultyRes) {
      res.status(400);
      throw new Error("Faculty does not exist");
    }

    if (!firstName || !lastName || !email || !role || !faculty || !date) {
      res.status(400);
      throw new Error("Fill all required fields");
    }

    // Update user properties within the transaction
    const salt = await bcrypt.genSalt(10);
    user.set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      isAdmin: typeof isAdmin === "boolean" ? isAdmin : user.isAdmin,
      password: password ? await bcrypt.hash(password, salt) : user.password,
      isApproved:
        typeof isApproved === "boolean" ? isApproved : user.isApproved,
    });

    // Update role-specific information within the transaction
    const updateRoleInformation = async (
      Model,
      roleType,
      transaction,
      year
    ) => {
      const roleInstance = await Model.findOne({
        where: { userID: req.params.id },
        transaction, // Pass the transaction to the query
      });

      if (!roleInstance) {
        if (role === "STUDENT") {
          await Model.create(
            {
              userID: req.params.id,
              facultyID: facultyRes.facultyID,
              enrollmentDate: new Date(date),
              [`${roleType}ID`]: uuidv4(),
              year: year,
            },
            { transaction }
          );
        } else {
          await Model.create(
            {
              userID: req.params.id,
              facultyID: facultyRes.facultyID,
              enrollmentDate: new Date(date),
              [`${roleType}ID`]: uuidv4(),
            },
            { transaction }
          );
        }
      } else {
        const updateData = {
          facultyID: facultyRes.facultyID,
          enrollmentDate: new Date(date),
        };

        if (role === "STUDENT") {
          updateData.year = year;
        }

        await Model.update(updateData, {
          where: {
            userID: req.params.id,
          },
          transaction, // Pass the transaction to the update operation
        });

        await roleInstance.save({ transaction });
      }
    };

    // Handle role-specific updates within the transaction
    if (role === "STUDENT") {
      await updateRoleInformation(Student, "student", t, year);
    } else if (role === "TEACHER") {
      await updateRoleInformation(Teacher, "teacher", t);
    } else if (role === "NONAC") {
      await updateRoleInformation(NonAcademicStaff, "staff", t);
    }

    await user.save({ transaction: t });

    // Commit the transaction
    await t.commit();

    // Respond with updated user details
    res.status(200).json({
      userID: user.userID,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      email: user.email,
      isApproved: user.isApproved,
    });
  } catch (err) {
    // Rollback the transaction in case of an error
    await t.rollback();
    next(err);
  }
};

// @desc  get single user
// @route GET /api/users/:id
// @access ownData

const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.getUserById(req.params.id);

  // const [user] = await db.query('SELECT * FROM users WHERE userID = (:id)', {
  //   replacements: { id: req.params.id },
  //   type: db.QueryTypes.SELECT,
  // });

  if (req.user.userID === req.params.id || req.user.isAdmin) {
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

// @desc  get single teacher
// @route GET /api/users/teachers/:id
// @access ownData

const getSingleTeacher = asyncHandler(async (req, res) => {
  const user = await User.getTeacherByUserId(req.params.id);
  if (req.user.userID === req.params.id || req.user.isAdmin) {
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

// @desc  get single student
// @route GET /api/users/students/:id
// @access ownData

const getSingleStudent = asyncHandler(async (req, res) => {
  const user = await User.getTeacherByUserId(req.params.id);
  if (req.user.userID === req.params.id || req.user.isAdmin) {
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

// @desc  get single staff member
// @route GET /api/users/staff/:id
// @access ownData

const getSingleStaffMember = asyncHandler(async (req, res) => {
  const user = await User.getStaffByUserID(req.params.id);
  if (req.user.userID === req.params.id || req.user.isAdmin) {
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

// @desc  teachers list
// @route GET /api/users/teachers
// @access admin

const getTeachersList = asyncHandler(async (req, res) => {
  const teachers = await getTeacherList();

  res.status(200).json(teachers);
});

// @desc  staff list
// @route GET /api/users/staff
// @access admin

const getStaffListData = asyncHandler(async (req, res) => {
  const teachers = await getStaffList();

  res.status(200).json(teachers);
});

// @desc  studnets list
// @route GET /api/users/students
// @access admin

const studentList = asyncHandler(async (req, res) => {
  const students = await getStudentList();

  res.status(200).json(students);
});

// @desc delte user
// @route DELETE /api/users/:id
// @access admin

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.userID == req.params.id) {
    res.status(400);
    throw new Error("Can't delete currently logged in account");
  }

  await deleteUserById(req.params.id);

  res.status(200).json({
    msg: "user deleted successfully",
  });
});

// @desc  delete teacher
// @route DELETE /api/users/teachers/:id
// @access admin

const deleteTeacher = asyncHandler(async (req, res) => {
  await deleteTeacherById(req.params.id);

  res.status(200).json({
    msg: "user deleted successfully",
  });
});

// @desc  delete student
// @route DELETE /api/users/students/:id
// @access admin

const delteStudent = asyncHandler(async (req, res) => {
  await delteStudentByUserId(req.params.id);

  res.status(200).json({
    msg: "user deleted successfully",
  });
});

// @desc  delete staff memeber
// @route DELETE /api/users/staff/:id
// @access admin

const deleteStaffMemeber = asyncHandler(async (req, res) => {
  await deleteNonAcademicStaffById(req.params.id);

  res.status(200).json({
    msg: "user deleted successfully",
  });
});

export {
  authUser,
  registerUser,
  getUsers,
  updateUser,
  getSingleUser,
  studentList,
  getTeachersList,
  getUnapprovedUsers,
  getSingleTeacher,
  getSingleStudent,
  getSingleStaffMember,
  getStaffListData,
  deleteUser,
  deleteTeacher,
  delteStudent,
  deleteStaffMemeber,
};
