//Requiring in express and path
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//This code fixed an error that caused an html page to load as the js page
app.use(express.static("public"));

//Routes
//API route for getting notes
//this route is called upon page load and notes are appended to the left side of the
//notes page
app.get("/api/notes", function (req, res) {
    //fs.readFile is used to get the data from the JSON file
    fs.readFile(__dirname + "/db/db.json", "utf-8", function (err, data) {
        console.log(data)
        if (err) {
            console.log(err);
        } else {
            console.log("Notes obtained.");
            res.send(JSON.parse(data));
        }
    })
    
})

//API route for posting notes
//this is the route that is used when the user saves a note
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    //this line creates a unique ID for the new notes
    newNote.id = Date.now().toString();
    //information from the JSON file is read and pushed to this array
    const notesArrayForPost = [];

    fs.readFile(__dirname + "/db/db.json", "utf-8", function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let formattedDataForPost = JSON.parse(data);
            //after reading the data, each entry in the JSON is pushed to 
            //the notesArrayForPost array
            for (let i = 0; i < formattedDataForPost.length; i++) {
                notesArrayForPost.push(formattedDataForPost[i]);
            }
        }
        notesArrayForPost.push(newNote);
        //notesArrayForPost is written to db.json
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
            //if the id matches the id of a note in storage, that note is saved to 
            //the variable noteToDelete
            for (let i = 0; i < formattedDataForDelete.length; i++) {               
                if (id === formattedDataForDelete[i].id) {     
                    noteToDelete = formattedDataForDelete[i];
                } else {
             //if the id doesn't match the id of a stored note, that not is pushed
             //to the notesToKeepArray to be written back to the db.json
                    notesToKeepArray.push(formattedDataForDelete[i])
                }
            }
        }
        //notesToKeepArray is written back to the db.json
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