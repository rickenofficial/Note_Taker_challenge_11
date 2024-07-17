//importing express, creating path, api, port and app
const express = require('express');
const path = require('path');
const api = require('./routes');
const PORT = 3001;
const app = express();
const fs = require('fs');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
// setup for form use always keep at extended: true
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

// saves files to public folder
app.use(express.static('public'));

// Route for homepage index.html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Route for feedback page notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// listening in on http://localhost:3001
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);


const dbFilePath = path.join(__dirname, '/db/db.json');

// Función para leer las notas desde el archivo JSON
const readNotes = () => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de base de datos:', error);
    return [];
  }
};

// Función para escribir las notas en el archivo JSON
const writeNotes = (notes) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error('Error al escribir en el archivo de base de datos:', error);
  }
};

app.delete('/api/notes/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    console.log('ID de la nota recibida:', noteId);

    let notes = readNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      console.log('Nota no encontrada');
      return res.status(404).json({ error: 'Note not found' });
    }

    notes.splice(noteIndex, 1);
    writeNotes(notes);

    console.log('Nota eliminada');
    res.status(204).end(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

