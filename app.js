const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const auth = require("./routes/auth");
//config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

//start db connection
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//session
app.use(
  session({
    secret: "cookies dof",
    resave: false,
    saveUninitialized: false,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", routes);
app.use("/auth", auth);

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode at port ${PORT}`)
);
