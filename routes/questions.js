const express = require('express');
const router = express.Router();
var databaseMethods = require("../methods/database");

router.get("/createQuestion/:name/:id", (req, res) => {
    if (req.session.loggedIn) {
        res.render("newQuestion", {
            pageTitle: "CREATE NEW QUESTION",
            examCramName: req.params.name,
            examCramID: req.params.id,
            examCrams: req.session.examCrams
        });
    } else
        res.redirect("/admin");
});
router.post("/newQuestion/:name/:id/:questionType", (req, res) => {
    let queObj = {};
    if (req.params.questionType == 0) {
        // MCQ/TRUE FALSE QUESTION
        let optionArray = [req.body.option1, req.body.option2];
        if (req.body.option3.trim() !== "")
            optionArray.push(req.body.option3);
        if (req.body.option4.trim() !== "")
            optionArray.push(req.body.option4);
        queObj = {
            question: req.body.question,
            answer: req.body.answer,
            options: optionArray
        };

    } else {
        queObj = {
            question: req.body.question,
            answer: req.body.answer
        }
        // SHORT/LONG QUESTIONS
    }
    let promise = databaseMethods.createQuestion(queObj, req.params.id);
    promise.then(() => {
        console.log("fulfilled");
        req.flash("success", "Question inserted");
        res.redirect("/createQuestion/" + req.params.name + "/" + req.params.id);
    }).catch(() => {
        res.redirect("/createQuestion/" + req.params.name + "/" + req.params.id);
    });

});

router.post("/deleteQuestion/:id",(req,res)=>{
    if(req.session.loggedIn) {
        databaseMethods.deleteQuestion(req.params.id).then(()=>{
            res.redirect("/viewExamCram/"+req.query.examCramName+"/"+req.query.examCramID);
        }).catch(()=>{
            console.error("Error in deleting question ");
        });

    }else {
        req.flash("error","Please log in first to perform this action");
        res.redirect("/viewExamCram/"+req.query.examCramName+"/"+req.query.examCramID);
    }
});

router.get("/editQuestion/:id/:type",(req,res)=>{
    if(req.session.loggedIn) {
        databaseMethods.getOneQuestion(req.params.id).then((result) => {
            console.log(result);
            if (req.params.type == 0) {
                res.render("editMcq", {
                    pageTitle: "Edit Question",
                    examCramID: req.params.id,
                    examCrams: req.session.examCrams,
                    question: result.question,
                    answer: result.answer,
                    options: result.options
                });
            } else {
                res.render("editShort", {
                    pageTitle: "Edit Question",
                    examCramID: req.params.id,
                    examCrams: req.session.examCrams,
                    question: result.question,
                    answer: result.answer,
                });
            }
        }).catch(() => {
            console.error("error in retrieving question");
        });
    }else {
        req.flash("error","Please log in to perform this action");
        res.redirect("/admin");
    }
});

router.post("/editQuestion/:id/:type",(req,res)=>{
    let queObj = {};
    if (req.params.type == 0) {
        // MCQ/TRUE FALSE QUESTION
        let optionArray = [req.body.option1, req.body.option2];
        if (req.body.option3.trim() !== "")
            optionArray.push(req.body.option3);
        if (req.body.option4.trim() !== "")
            optionArray.push(req.body.option4);
        queObj = {
            question: req.body.question,
            answer: req.body.answer,
            options: optionArray
        };

    } else {
        queObj = {
            question: req.body.question,
            answer: req.body.answer
        }
        // SHORT/LONG QUESTIONS
    }
    databaseMethods.editQuestion(req.params.id,queObj).then(()=>{
        res.redirect("/admin");
    }).catch(()=>{
        console.error("error in updating question");
    })
});
exports.routes = router;