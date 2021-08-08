const express = require('express');
const router = express.Router();
var databaseMethods = require("../methods/database");
router.get("/logout", (req, res) => {
    req.session.destroy(function (err, r) {
        if (err) {
            console.log(err);
            res.redirect("/admin");
        } else {
            res.redirect("/admin");
        }
    });
});
router.post('/admin', (request, response, next) => {
    if (request.body.password === "Java@examcram123") {
        let sess = request.session;
        sess.loggedIn = "admin";
        response.redirect("/admin");
    } else {
        request.flash("error", "Wrong password");
        response.render('adminLogin', {pageTitle: "Admin Login"});
    }

});
router.get("/admin", (request, response, next) => {
    // if (request.body.password === "1111") {
    if (request.session.loggedIn) {
        let students = [];
        let studentPromise = databaseMethods.getAllStudents();
        studentPromise.then((sdata) => {
            students = sdata;
            console.log(students);
            let davisStudents = getDavis(students); //davis students array
            let trafStudents = getTraf(students);// traf array
            let promise = databaseMethods.getAllExamCrams();
            promise.then((data) => {
                request.session.examCrams = data;
                response.render("admin", {
                    pageTitle: "Admin Portal", davisStudents: davisStudents,
                    trafStudents: trafStudents, examCrams: data
                });
            }).catch(() => {
                console.error("ERROR in getting exam crams");
            });
        }).catch(() => {
            console.error("ERROR in getting students");
        });
    } else {
        response.render('adminLogin', {pageTitle: "Admin Login"});
    }
});

function getDavis(student) {
    let davisArray = [];
    student.forEach(function (currentStudent) {
        if (currentStudent.campus === "davis")
            davisArray.push(currentStudent);
    });
    return davisArray;
}

function getTraf(student) {
    let trafArray = [];
    student.forEach(function (currentStudent) {
        if (currentStudent.campus === "trafalgar")
            trafArray.push(currentStudent);
    });
    return trafArray;
}

exports.routes = router;