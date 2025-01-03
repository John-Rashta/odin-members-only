const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require("./db/pool");
const pgSession = require('connect-pg-simple')(session);
const indexRouter = require("./routes/indexRouter");
const clubRouter = require("./routes/clubRouter");
const joinRouter = require("./routes/joinRouter");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionStore = new pgSession({
  pool: pool,
});

app.use(session({
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/club", clubRouter);
app.use("/join", joinRouter);

app.use((err, req, res, next) => {
    console.error(err);
    // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
    res.status(err.statusCode || 500).send(err.message);
  });
  
app.listen(8080);