const express = require("express")
const path = require("path")
//process.env.PORT  is for deployment to heroku so Heroku can assigned a port number to identify the server
const PORT = process.env.PORT || 3001
const fs = require("fs"); 

const app = express()
const route =require("./routes/index")
 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


// modularized(put in separate files) the api routes
//http://localhost:3001/api
app.use("/api",route)




 




//html routes stay in server.js unmodularized
app.get("/notes",(req,res)=>{
  res.sendFile( path.join(__dirname,"./public/notes.html") )
})

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    const notes = JSON.parse(data);
    newNote.id = notes.length ? notes[notes.length - 1].id + 1 : 1; // Add a unique id to the note
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

//html routes
//http://localhost:3001/*
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})


 

app.listen(PORT, () => {
    console.log("App is listening at PORT: http://localhost:" + PORT)
})






