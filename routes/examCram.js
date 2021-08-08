const express = require('express');
const router = express.Router();
var databaseMethods = require("../methods/database");

router.post("/deactivate/:id", (req, res) => {
    databaseMethods.deactivateExamCram(req.params.id).then(() => {
        console.log("EXAM CRAM DEACTIVATED");
        res.redirect("/admin");
    }).catch(() => {
        console.error("ERROR IN DEACTIVATING EXAM CRAM");
    });
});
router.post("/activate/:id", (req, res) => {
    databaseMethods.findActiveExamCram().then((result) => {
        if (result != null) {
            databaseMethods.deactivateExamCram(result._id).then(() => {
                console.log("exam cram deactivated");
            }).catch(() => {
                console.log("error in deactivating exam cram");
            });
        }
        let promise = databaseMethods.activateExamCram(req.params.id);
        promise.then(() => {
            console.log("EXAM CRAM ACTIVATED");
            res.redirect("/admin");

        }).catch(() => {
            console.error("ERROR IN ACTIVATING EXAM CRAM ");
        });
    }).catch(() => {
        console.log("ERROR IN FINDING ACTIVE EXAM CRAM");
    });
});
router.get("/startExamCram", (req, res) => {
    if (req.session.isRegistered ) {
        databaseMethods.findActiveExamCram().then((result) => {
            if(result==null){
                res.send("NO EXAM CRAM OPEN YET !. Please come back later");
            }
            let promise = databaseMethods.getAllQuestion(result._id);
            promise.then((result) => {
                console.log("RETRIEVED EXAM CRAMS");
                console.log(result);
                res.render("startExamCram", {pageTitle: "EXAM CRAM STARTED", allQuestions: result});
            }).catch(() => {
                console.error("ERROR IN RETRIEVING QUE");
            });
        }).catch(() => {
            console.log("Error in finding active exam cram ");
        });

    } else {
        req.flash("error", "Please register to start exam cram");
        res.redirect("/register");
    }
    // res.render("startExamCram",{pageTitle:"EXAM CRAM STARTED"});
});
router.post("/createExamCram", (req, res) => {
    res.render("createExamCram", {pageTitle: "NEW EXAM CRAM", examCrams: req.session.examCrams});
});
router.post("/examCram/new", (req, res) => {
    databaseMethods.createNewExamCram(req.body.examCramName,req.body.password);
    res.redirect("/admin");
});

router.get("/viewExamCram/:name/:id", (req, res) => {
    if (req.session.loggedIn) {
        databaseMethods.getAllQuestion(req.params.id).then((result)=>{
            res.render("viewExamCram", {
                pageTitle: "VIEW EXAM CRAM",
                examCramName: req.params.name,
                examCramID: req.params.id,
                examCrams: req.session.examCrams,
                allQuestions:result
            });
        }).catch(()=>{
            console.error("Error in retrieving all questions in view exam cram page");
        });

    } else {
        res.redirect("/admin");
    }
});

router.post("/deleteExamCram/:id", (req, res) => {
    let promise = databaseMethods.deleteExamCram(req.params.id);
    promise.then(() => {
        console.log("EXAM CRAM DELETED");
        res.redirect("/admin");
    }).catch(() => {
        console.log("ERROR IN DELETING EXAM CRAM");
    });
});

router.get('/deleteStudent/:id', (req, res) => {
    databaseMethods.deleteStudent(req.params.id).then(()=>{
        res.redirect("/admin");
    }).catch(()=>{
        console.log("Error in deleting student with ID : " + req.params.id);
    });
});

router.post('/deleteAllStudents/:campusName', (req, res) => {
    databaseMethods.deleteAllStudents(req.params.campusName).then(()=>{
        res.redirect("/admin");
    }).catch(()=>{
        console.log("Error in deleting all students in : " + req.params.campusName);
    });
});
exports.routes = router;