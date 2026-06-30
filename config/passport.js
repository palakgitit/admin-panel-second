const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../model/userModel");

module.exports = function (passport) {

    passport.use(

        new LocalStrategy(

            {
                usernameField: "email",
                passwordField: "password",
            },

            async (email, password, done) => {

                try {

                    const user = await User.findOne({
                        email: email.trim().toLowerCase(),
                    });

                    if (!user) {
                        return done(null, false, {
                            message: "User not found.",
                        });
                    }

                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isMatch) {
                        return done(null, false, {
                            message: "Invalid password.",
                        });
                    }

                    return done(null, user);

                } catch (error) {

                    return done(error);

                }

            }

        )

    );

    passport.serializeUser((user, done) => {

        done(null, user.id);

    });

    passport.deserializeUser(async (id, done) => {

        try {

            const user = await User.findById(id);

            done(null, user);

        } catch (error) {

            done(error);

        }

    });

};