//Requiring in express and path
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
app.get("/api/notes", function (req, res) {
    const notes = fs.readFile(__dirname + "/db/db.json", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("File read.")
            return notes
        }
    })
    return res.json(notes);
});
// * POST `/api/notes` - Should receive a new note to save on the 
//request body, add it to the `db.json` file, and then return 
//the new note to the client.
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    
    console.log(newNote);
    fs.appendFile(__dirname + "/db/db.json", JSON.stringify(newNote), function(err){
        if(err){
            console.log(err)
        }else{
            console.log("Note taken")
        }
    } )


    res.json(newNote);
})

//This is the server listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
