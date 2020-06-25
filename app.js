const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const connectDB = require("./config/db");

const routes = require("./routes/index");
const auth = require("./routes/auth");
const stories = require("./routes/stories");
//config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

//start db connection
connectDB();

const app = express();
//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//helper
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helper/hbs");

//handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//session
app.use(
  session({
    secret: "cookies dof",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set golbal var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", routes);
app.use("/auth", auth);
app.use("/stories", stories);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode at port ${PORT}`)
);
