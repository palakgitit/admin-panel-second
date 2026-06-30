const User = require("../model/userModel");

const isAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "Please login first.");

    return res.redirect("/login");

};

const isGuest = (req, res, next) => {

    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }

    next();

};

module.exports = {
    isAuthenticated,
    isGuest,
};