//Requiring in express and path
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
//HTML route for index.html
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
});

//HTML route for notes.html
app.get("/notes.html", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/notes.html"))
});

//API route for getting notes
app.get("/api/notes", function (req, res) {

    fs.readFile("/db/db.json", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Notes obtained");
        }
        return res.json(data);

    })
})
//API route for posting notes
app.post("/api/notes", function (req, res) {
    var newNote = req.body;

    console.log(newNote);
    fs.appendFile(__dirname + "/db/db.json", JSON.stringify(newNote), function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Note taken")
        }
    })
    return res.json(newNote);
});

//This is the server listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
})