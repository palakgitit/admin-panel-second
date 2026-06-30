const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const passport = require("passport");


const getRegisterPage = (req, res) => {
    res.render("samples/register", {
        error: [],
        success: [],
        warning: [],
        info: [],
        formData: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            mobile: "",
            city: "",
            dob: "",
            hobby: "",
            gender: "",
            address: "",
            role: "",
            bio: ""
        }
        
    });
};



const getLoginPage = (req, res) => {
    res.render("samples/login");
};



const getForgotPasswordPage = (req, res) => {
    res.render("samples/forgot-password");
};



const getDashboard = (req, res) => {
    res.render("index", { user: req.user });
};

const getChangePasswordPage = (req, res) => {

    res.render("change-password", {
        error: [],
        success: [],
        warning: [],
        info: [],
    });

};

const registerUser = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            username,
            email,
            password,
            mobile,
            city,
            dob,
            hobby,
            gender,
            address,
            role,
            bio
        } = req.body;

        const renderRegister = (message) => {
            return res.render("samples/register", {
                error: [message],
                success: [],
                warning: [],
                info: [],
                formData: {
                    firstName,
                    lastName,
                    username,
                    email,
                    mobile,
                    city,
                    dob,
                    hobby,
                    gender,
                    address,
                    role,
                    bio
                },
            });
        };

        if (!firstName || !lastName || !username || !email || !password) {
            return renderRegister("All required fields must be filled.");
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
            return renderRegister(
                "Username can only contain letters, numbers and underscores (_)."
            );
        }

        if (password.trim().length < 6) {
            return renderRegister(
                "Password must be at least 6 characters long."
            );
        }

        if (mobile && !/^[0-9]{10}$/.test(mobile.trim())) {
            return renderRegister(
                "Mobile number must contain exactly 10 digits."
            );
        }

        if (bio && bio.trim().length > 300) {
            return renderRegister(
                "Bio cannot exceed 300 characters."
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingUser) {

            if (existingUser.email === normalizedEmail) {
                return renderRegister("Email already exists.");
            }

            return renderRegister("Username already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({

            firstName: firstName.trim(),

            lastName: lastName.trim(),

            username: normalizedUsername,

            email: normalizedEmail,

            password: hashedPassword,

            mobile: mobile ? mobile.trim() : "",

            city: city ? city.trim() : "",

            dob: dob || null,

            hobby: hobby ? hobby.trim() : "",

            gender: gender || "",

            address: address ? address.trim() : "",

            role: role || "User",

            bio: bio ? bio.trim() : "",

            avatar: "default.png"

        });

        await newUser.save();

        req.flash("success", "Registration successful. Please login.");

        return res.redirect("/login");

    } catch (error) {

        console.error(error);

        return res.render("samples/register", {
            error: ["Registration failed. Please try again."],
            success: [],
            warning: [],
            info: [],
            formData: req.body
        });

    }
};





const loginUser = (req, res, next) => {

    passport.authenticate("local", (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {

            req.flash("error", info.message);

            return res.redirect("/login");

        }

        req.logIn(user, (err) => {

            if (err) {
                return next(err);
            }

            req.flash("success", "Login successful.");

            return res.redirect("/dashboard");

        });

    })(req, res, next);

};

const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            req.flash("error", "All fields are required");
            return res.redirect("/forgot-password");
        }

        if (newPassword.trim().length < 6) {
            req.flash("error", "Password must be at least 6 characters long");
            return res.redirect("/forgot-password");
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/forgot-password");
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        req.flash("success", "Password updated successfully");
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        req.flash("error", "Password reset failed");
        return res.redirect("/forgot-password");
    }
};
const logoutUser = (req, res) => {

    req.logout(function (err) {

        if (err) {
            console.log(err);
            return res.redirect("/dashboard");
        }

        req.session.destroy(() => {

            res.clearCookie("connect.sid");

            req.flash("success", "Logged out successfully.");

            return res.redirect("/login");

        });

    });

};
const getAddUserPage = (req, res) => {

    res.render("add-user", {

        error: [],

        success: [],

        warning: [],

        info: [],

        formData: {

            firstName: "",

            lastName: "",

            username: "",

            email: "",

            mobile: "",

            city: "",

            dob: "",

            hobby: "",

            gender: "",

            address: "",

            role: "User",

            bio: ""

        }

    });

};

const createUser = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            email,
            username,
            password,
            mobile,
            city,
            dob,
            hobby,
            gender,
            address,
            role,
            bio
        } = req.body;

        const avatar = req.file ? req.file.filename : "default.png";

        const renderAddUser = (message) => {
            return res.render("add-user", {
                error: [message],
                success: [],
                warning: [],
                info: [],
                formData: {
                    firstName,
                    lastName,
                    email,
                    username,
                    mobile,
                    city,
                    dob,
                    hobby,
                    gender,
                    address,
                    role,
                    bio
                }
            });
        };

       
        if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
            return renderAddUser(
                "Username can only contain letters, numbers and underscores (_)."
            );
        }

       
        if (password.trim().length < 6) {
            return renderAddUser(
                "Password must be at least 6 characters long."
            );
        }

     
        if (mobile && !/^[0-9]{10}$/.test(mobile.trim())) {
            return renderAddUser(
                "Mobile number must contain exactly 10 digits."
            );
        }

      
        if (bio && bio.trim().length > 300) {
            return renderAddUser(
                "Bio cannot exceed 300 characters."
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingUser) {

            if (existingUser.email === normalizedEmail) {
                return renderAddUser("Email already exists.");
            }

            return renderAddUser("Username already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({

            firstName: firstName.trim(),

            lastName: lastName.trim(),

            email: normalizedEmail,

            username: normalizedUsername,

            password: hashedPassword,

            mobile: mobile ? mobile.trim() : "",

            city: city ? city.trim() : "",

            dob: dob || null,

            hobby: hobby ? hobby.trim() : "",

            gender: gender || "",

            address: address ? address.trim() : "",

            role: role || "User",

            bio: bio ? bio.trim() : "",

            avatar

        });

        await newUser.save();

        req.flash("success", "User added successfully.");

        return res.redirect("/views");

    } catch (error) {

        console.error(error);

        if (error.code === 11000) {

            return res.render("add-user", {
                error: ["Email or Username already exists."],
                success: [],
                warning: [],
                info: [],
                formData: req.body
            });

        }

        return res.render("add-user", {
            error: ["Something went wrong."],
            success: [],
            warning: [],
            info: [],
            formData: req.body
        });

    }
};

const getAllUsers = async (req, res) => {
    try {

        const users = await User.find()
            .sort({ createdAt: -1 })
            .lean();

        res.render("view-page", {
            users
        });

    } catch (error) {

        console.error(error);

        req.flash("error", "Unable to fetch users.");

        return res.redirect("/dashboard");

    }
};
const getUserDetails = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).lean();

        if (!user) {

            req.flash("error", "User not found.");

            return res.redirect("/views");

        }

        res.render("view-user", {
            user
        });

    } catch (error) {

        console.error(error);

        req.flash("error", "Something went wrong.");

        return res.redirect("/views");

    }
};




const getEditUserPage = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/views");
        }

        res.render("edit-user", {
            user,
            formData: null,
            error: [],
            success: [],
            warning: [],
            info: []
        });

    } catch (error) {

        console.log(error);

        req.flash("error", "Error loading edit page.");

        return res.redirect("/views");

    }
};  


const updateUser = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            email,
            username,
            mobile,
            city,
            dob,
            hobby,
            gender,
            address,
            role,
            bio
        } = req.body;

        const user = await User.findById(req.params.id);

        const renderEdit = (message) => {

            return res.render("edit-user", {

                user,

                formData: req.body,

                error: [message],
                success: [],
                warning: [],
                info: []

            });

        };

        // Username Validation
        if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {

            return renderEdit(
                "Username can only contain letters, numbers and underscores (_)."
            );

        }

        // Mobile Validation
        if (mobile && !/^[0-9]{10}$/.test(mobile.trim())) {

            return renderEdit(
                "Mobile number must contain exactly 10 digits."
            );

        }

        // Bio Validation
        if (bio && bio.trim().length > 300) {

            return renderEdit(
                "Bio cannot exceed 300 characters."
            );

        }

        // Duplicate Email / Username
        const existingUser = await User.findOne({

            _id: { $ne: req.params.id },

            $or: [

                { email: email.trim().toLowerCase() },

                { username: username.trim() }

            ]

        });

        if (existingUser) {

            if (existingUser.email === email.trim().toLowerCase()) {

                return renderEdit("Email already exists.");

            }

            return renderEdit("Username already exists.");

        }

        const updateData = {

            firstName: firstName.trim(),

            lastName: lastName.trim(),

            email: email.trim().toLowerCase(),

            username: username.trim(),

            mobile: mobile ? mobile.trim() : "",

            city: city ? city.trim() : "",

            dob: dob || null,

            hobby: hobby ? hobby.trim() : "",

            gender: gender || "",

            address: address ? address.trim() : "",

            role: role || "User",

            bio: bio ? bio.trim() : ""

        };

        if (req.file) {

            updateData.avatar = req.file.filename;

        }

        await User.findByIdAndUpdate(

            req.params.id,

            updateData,

            { new: true }

        );

        req.flash("success", "User updated successfully.");

        return res.redirect("/views");

    } catch (error) {

        console.error(error);

        const user = await User.findById(req.params.id);

        return res.render("edit-user", {

            user,

            formData: req.body,

            error: ["Something went wrong while updating the user."],
            success: [],
            warning: [],
            info: []

        });

    }
};

const deleteUser = async (req, res) => {
    try {

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {

            req.flash("error", "User not found.");

            return res.redirect("/views");

        }

        req.flash("success", "User deleted successfully.");

        return res.redirect("/views");

    } catch (error) {

        console.error(error);

        req.flash("error", "Unable to delete user.");

        return res.redirect("/views");

    }
};

const changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        const renderChangePassword = (message) => {

            return res.render("change-password", {
                error: [message],
                success: [],
                warning: [],
                info: [],
            });

        };

        // All fields required
        if (!currentPassword || !newPassword || !confirmPassword) {

            return renderChangePassword("All fields are required.");

        }

        // Check current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            req.user.password
        );

        if (!isMatch) {

            return renderChangePassword("Current password is incorrect.");

        }

        // Password length
        if (newPassword.trim().length < 6) {

            return renderChangePassword(
                "New password must be at least 6 characters long."
            );

        }

        // Confirm password
        if (newPassword !== confirmPassword) {

            return renderChangePassword(
                "New Password and Confirm Password do not match."
            );

        }

        // Prevent same password
        const samePassword = await bcrypt.compare(
            newPassword,
            req.user.password
        );

        if (samePassword) {

            return renderChangePassword(
                "New password cannot be the same as the current password."
            );

        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(
            req.user._id,
            {
                password: hashedPassword,
            }
        );

        req.flash("success", "Password updated successfully.");

        return res.redirect("/dashboard");

    } catch (error) {

        console.error(error);

        return res.render("change-password", {
            error: ["Something went wrong."],
            success: [],
            warning: [],
            info: [],
        });

    }

};


module.exports = {
    getRegisterPage,
    getLoginPage,
    getForgotPasswordPage,
    getDashboard,
    registerUser,
    loginUser,
    forgotPassword,
    logoutUser,

    getAddUserPage,
    createUser,
    getAllUsers,
    getUserDetails,
    getEditUserPage,
    updateUser,
    deleteUser,

    getChangePasswordPage,
    changePassword,
};