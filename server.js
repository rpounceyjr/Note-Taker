//Requiring in express and path
const express = require("express");
const path = require("path");
const fs = require("fs");
// const util = require("util");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routes
//API route for getting notes
app.get("/api/notes", function (req, res) {

    fs.readFile(__dirname + "/db/db.json", "utf-8", function (err, data) {
        console.log(data)
        if (err) {
            console.log(err);
        } else {
            console.log("Notes obtained");
            res.send(JSON.parse(data));
        }
    })
    
})

//API route for posting notes
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    newNote.id = Date.now().toString();
    const notesArrayForPost = [];

    console.log(newNote);

    fs.readFile(__dirname + "/db/db.json", "utf-8", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let formattedDataForPost = JSON.parse(data)
            for (let i = 0; i < formattedDataForPost.length; i++) {
                notesArrayForPost.push(formattedDataForPost[i]);
            }
        }
        notesArrayForPost.push(newNote);
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesArrayForPost), function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Note taken")
            }
        })
        res.json(newNote);
    });

})

//API route for deleting a note
app.delete("/api/notes/:id", function (req, res) {
    let id = req.params.id;
    let noteToDelete;
    let notesToKeepArray = [];

    fs.readFile(__dirname + "/db/db.json", "utf-8", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let formattedDataForDelete = JSON.parse(data);
            for (let i = 0; i < formattedDataForDelete.length; i++) {               
                if (id === formattedDataForDelete[i].id) {
                    noteToDelete = formattedDataForDelete[i];
                } else {
                    notesToKeepArray.push(formattedDataForDelete[i])
                }
            }
        }
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesToKeepArray), function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Note removed")
                res.json(notesToKeepArray);
            }
        })
    });

})
//HTML route for index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
});
//HTML route for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/notes.html"));
});
//HTML route for index.html for everything other than /
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"))
});

//This is the server listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
})