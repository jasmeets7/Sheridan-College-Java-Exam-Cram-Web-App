const express = require('express');

const path = require('path');

const app = express();
var body_parser = require("body-parser");
var flash = require("connect-flash");
var session = require('express-session');
const login = require('./routes/login');
const admin = require('./routes/admin');
const examCram = require('./routes/examCram');
const questions = require('./routes/questions');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(body_parser.urlencoded({extended: true}));
app.use(session({
    secret: 'examcram',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(function (req, res, next) {
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));


// ########  ROUTES #############
app.use(login.routes);
app.use(admin.routes);
app.use(examCram.routes);
app.use(questions.routes);
// ###############################

app.get("*", function (req, res) {
    res.redirect("/");
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("SERVER STARTED !");
});