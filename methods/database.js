const ObjectId = require('mongodb').ObjectID;
const methods = {};
const MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/students";

// if (process.env.PORT)
    url = "mongodb+srv://examcramuser:javaexamcramuser123@examcram-jho6d.mongodb.net/test?retryWrites=true&w=majority";

methods.createNewExamCram = function (name,pass) {
    MongoClient.connect(url, (err, db) => {
        if (err) {
            console.error(err);
        }
        const dbo = db.db("students");
        const myobj = {
            exam_cram_name: name,
            password:pass,
            questions: [ {type:ObjectId,ref: "questions"}],
            active: false
        };
        dbo.collection("examCrams").insertOne(myobj, function (err, res) {
            if (err) {
                console.error(err);
                return false;
            }
            db.close();
            console.log("NEW EXAM CRAM " + name + " CREATED");
            return true;
        });
    });
};

methods.insertStudent = function (firstName, lastName, studentID, campus) {
    MongoClient.connect(url, (err, db) => {
        if (err) {
            console.error(err);
        }
        const dbo = db.db("students");
        const myobj = {
            first_name: firstName,
            last_name: lastName,
            student_id: studentID,
            campus: campus
        };
        dbo.collection("registration").insertOne(myobj, function (err, res) {
            if (err) {
                console.error(err);
                return false;
            }
            db.close();
            return true;
        });
    });
};


methods.getAllStudents = function () {
    let promise = new Promise((resolve, reject) => {
        let davisStudents = [];
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
            }
            var dbo = db.db("students");
            dbo.collection("registration").find({}).toArray(function (err, result) {
                if (err) {
                    console.error(err);
                }
                davisStudents = result;
                db.close();
                resolve(davisStudents);
            });
        });
    });
    return promise;
};


methods.getAllExamCrams = function () {
    let promise = new Promise(function (resolve, reject) {
        let examCrams = [];
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject([]);
            }
            var dbo = db.db("students");
            dbo.collection("examCrams").find({}).toArray(function (err, result) {
                if (err) {
                    console.error(err);
                }
                examCrams = result;
                db.close();
                resolve(examCrams);
            });
        });
    });
    return promise;
};


methods.createQuestion = (queObj, cramID) => {
    let queID=0;
    let promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("questions").insertOne(queObj, function (err, res) {
                if (err) {
                    console.error(err);
                    return false;
                }
                queID=res.ops[0]._id;
                console.log("QUE ID : "+queID);
                db.close();
                console.log("QUE ID : "+queID);
                methods.insertQueToExamCram(cramID, queID);
                resolve(true);
            });
        });
    });

    return promise;
};

methods.insertQueToExamCram = (cramID, questionID) => {
    MongoClient.connect(url, (err, db) => {
        if (err) {
            console.error(err);
            reject(false);
        }
        const dbo = db.db("students");
        dbo.collection("examCrams").findOneAndUpdate({"_id": ObjectId(cramID)}, {$push: {"questions": ObjectId(questionID)}}, function (err, res) {
            if (err) {
                console.error(err);
                return false;
            }
            console.log(cramID + " " + questionID);
            console.log("INSERTING QUE TO CRAM ");
            console.log(res.value.questions);
            db.close();
        });
    });
};

methods.deleteExamCram = (cramID) => {
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("examCrams").findOneAndDelete({"_id": ObjectId(cramID)}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};


methods.getAllQuestion=(cramID)=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("examCrams").aggregate(
                [
                    {
                        $match :{ "_id":ObjectId(cramID)}
                    },
                    { $lookup:
                            {
                                from: "questions",
                                localField: "questions",
                                foreignField: "_id",
                                as: "questions"
                            }
                    }
                ],function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }

                res.toArray().then((data)=>{
                    db.close();
                   resolve(data);
                }).catch(()=>{
                    console.log("ERROR IN RETRIEVING IN DB IN CRAMS");
                });
            });
        });
    });
    return promise;
};

methods.activateExamCram=(cramID)=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            console.log(cramID);
            dbo.collection("examCrams").findOneAndUpdate({"_id": ObjectId(cramID)},{$set: {"active":true}}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};

methods.deactivateExamCram=(cramID)=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            console.log(cramID);
            dbo.collection("examCrams").findOneAndUpdate({"_id": ObjectId(cramID)},{$set: {"active":false}}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};

methods.findActiveExamCram=()=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("examCrams").findOne({"active": true}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                console.log(res);
                resolve(res);
            });
        });
    });
    return promise;
};

methods.deleteQuestion = (questionID) => {
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("questions").findOneAndDelete({"_id": ObjectId(questionID)}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};



methods.getOneQuestion=(queID)=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("questions").findOne({"_id": ObjectId(queID)}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                console.log(res);
                resolve(res);
            });
        });
    });
    return promise;
};


methods.editQuestion=(queID,queObj)=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");

            dbo.collection("questions").findOneAndUpdate({"_id": ObjectId(queID)},{$set: queObj}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};


methods.findOneStudent=(stdID)=>{
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("registration").findOne({"student_id": stdID}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                console.log(res);
                resolve(res);
            });
        });
    });
    return promise;
};


methods.deleteStudent = (objID) => {
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("registration").findOneAndDelete({"_id": ObjectId(objID)}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};

methods.deleteAllStudents = (campusName) => {
    let promise = new Promise((resolve,reject)=>{
        MongoClient.connect(url, (err, db) => {
            if (err) {
                console.error(err);
                reject(false);
            }
            const dbo = db.db("students");
            dbo.collection("registration").remove({"campus": campusName}, function (err, res) {
                if (err) {
                    console.error(err);
                    reject(false);
                    return false;
                }
                db.close();
                resolve(true);
            });
        });
    });
    return promise;
};
module.exports = methods;