const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require("dotenv").config();
const db = require("../db/queries");


const verifyCallback = async (username, password, done) => {
    try {
      const rows = await db.searchForUser(username);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const rows = await db.searchForUserWithId(id);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  });