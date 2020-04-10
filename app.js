var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var multer = require("multer");
var config = require("config");
var app = express();
const port = process.env.PORT || 8000;
var Router = require("./routes/index");

//MongoDB Connection

const mongoose = require("mongoose");
const uri = config.get("mongoURI");
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("The MongoDB Server is Running Successfully!!"))
  .catch(err => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("views", "views");
app.options("*", cors());
app.use(cors({}));

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 10000
  })
);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(express.static(path.join("public")));
app.use(
  session({
    secret: "asdf;lkj",
    resave: false,
    saveUninitialized: false,
    cookie: {}
  })
);

// app.set(multer({ dest: "./uploads" }));

Router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, function() {
  console.log("Server Running on Port : " + port);
});

module.exports = app;
