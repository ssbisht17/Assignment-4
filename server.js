/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Sachin Singh Bisht     Student ID: 147996235       Date: 7 July, 2024
*
*  Online (vercel) Link: 
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const bodyParser = require('body-parser');

const app = express();

// Middleware to serve static files from the views directory
app.use(express.static(path.join(__dirname, "Public")));

// GET /students route
app.get("/students", async (req, res) => {
    try {
        if (req.query.course) {
            const data = await collegeData.getStudentsByCourse(parseInt(req.query.course));
            res.json(data);
        } else {
            const data = await collegeData.getAllStudents();
            res.json(data);
        }
    } catch (err) {
        errorHandler(res, "Error retrieving students");
    }
});

// GET /tas route
app.get("/tas", async (req, res) => {
    try {
        const data = await collegeData.getTAs();
        res.json(data);
    } catch (err) {
        errorHandler(res, "Error retrieving TAs");
    }
});

// GET /courses route
app.get("/courses", async (req, res) => {
    try {
        const data = await collegeData.getCourses();
        res.json(data);
    } catch (err) {
        errorHandler(res, "Error retrieving courses");
    }
});

// GET /student/:num route
app.get("/student/:num", async (req, res) => {
    try {
        const data = await collegeData.getStudentByNum(parseInt(req.params.num));
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (err) {
        errorHandler(res, "Error retrieving student");
    }
});

// GET / route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// GET /about route
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// GET /htmlDemo route
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// Route to display the form for adding a new student
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addstudent.html"));
});

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));

// Route to handle form submission for adding a new student
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students'); // Redirect to the students page after adding student
        })
        .catch(err => {
            console.error('Error adding student:', err);
            res.status(500).send('Error adding student');
        });
});

// 404 route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize data and start server
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on port: ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.log(`Failed to initialize data: ${err}`);
    });