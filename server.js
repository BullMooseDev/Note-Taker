const express = require('express');
const path = require('path');
const fs = require('fs');
const { handle } = require('express/lib/application');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//refer to the title and note text
const $titleOfNote = getElementsByClassName('note-title');
const $textAreaNote = getElementsByClassName('note-textarea');

//note addition
const handleNoteTitleSubmission = event => {
    event.preventDefault();
    
    const noteTitleEl = $titleOfNote.innerHTML.value;
    const noteTextEl = $textAreaNote.innerHTML.value;
    
    const noteObject = {noteTitleEl, noteTextEl};

    fetch('/notes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteObject)
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          alert('Oopsie-Doopsie! We made a FUCKY WUCKY!');
          throw new Error (response.statusText);
        })
        .then(postResponse => {
          console.log(postResponse);
          alert('Thank you for adding a note!');
        });
};

$titleOfNote.addEventListener('submit', handleNoteTitleSubmission);
$textAreaNote.addEventListener('submit', handleNoteTitleSubmission);

//routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        const notes = JSON.parse(data);

        res.json(notes)
    })
});

function findById(id, notes) {
    const result = notes.filter((notes) => notes.id === id)[0];
    return result;
  };

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
});


/* use filter, splice or map for removing based on id, also use a for loop
app.delete('/api/notes/:?', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
}) */

//run our server
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log("we livin'")
});



/* MAKE USE OF NETWORK TAB / PUSH NEW NOTES INTO DB.JSON ARRAY */