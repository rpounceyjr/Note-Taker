//Requiring in express and path
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes
// app.get("/api/notes", function (req, res) {
//     const notes = fs.readFile(__dirname + "/Develop/db/db.json", function (err) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("File read.")
//         }
//     })
//     return res.json(notes);
// });

//This is the server listener
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
