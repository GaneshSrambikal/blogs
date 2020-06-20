const GoogleStrategy = require("passport-google-oauth2").Strategy;

const mongoose = require("mongoose");
const User = require("../model/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken ,refreshToken,profile,done) =>{
        console.log(profile)
    }
    )

  );
};
