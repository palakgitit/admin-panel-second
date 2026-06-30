const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {

    getRegisterPage,
    registerUser,
    getLoginPage,
    loginUser,
    getForgotPasswordPage,
    forgotPassword,
    logoutUser,
    getDashboard,

    getAddUserPage,
    createUser,
    getAllUsers,
    getUserDetails,
    getEditUserPage,
    updateUser,
    deleteUser,

    getChangePasswordPage,
    changePassword,
} = require("../controllers/userController");

const {

    isAuthenticated,
    isGuest,

} = require("../middleware/authMiddleware");


// ===============================
// Authentication Routes
// ===============================

router.get("/register", isGuest, getRegisterPage);
router.post("/register", isGuest, registerUser);

router.get("/login", isGuest, getLoginPage);
router.post("/login", loginUser);

router.get("/forgot-password", getForgotPasswordPage);
router.post("/forgot-password", forgotPassword);

router.get("/logout", isAuthenticated, logoutUser);




router.get("/dashboard", isAuthenticated, getDashboard);



router.get("/add-user", isAuthenticated, getAddUserPage);

router.post(
    "/add-user",
    isAuthenticated,
    upload.single("avatar"),
    createUser
);

router.get("/views", isAuthenticated, getAllUsers);

router.get("/view-user/:id", isAuthenticated, getUserDetails);

router.get("/edit-user/:id", isAuthenticated, getEditUserPage);

router.post(
    "/update-user/:id",
    isAuthenticated,
    upload.single("avatar"),
    updateUser
);

router.get("/delete-user/:id", isAuthenticated, deleteUser);

router.get(
    "/change-password",
    isAuthenticated,
    getChangePasswordPage
);

router.post(
    "/change-password",
    isAuthenticated,
    changePassword
);


module.exports = router;