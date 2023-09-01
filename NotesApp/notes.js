const { default: chalk } = require("chalk");
const fs = require("fs");

const loadNotes = function () {
  try {
    const dataBuffer = fs.readFileSync("notes.json");
    const data = JSON.parse(dataBuffer.toString());
    return data;
  } catch (error) {
    return [];
  }
};
const addNote = function ({ title, body }) {
  debugger;
  const notes = loadNotes();
  const duplicateNotes = notes.filter((note) => note.title === title);
  if (duplicateNotes.length) {
    console.log(chalk.red.inverse("This note title already exists ."));
    return;
  }
  notes.push({ title, body });
  const dataString = JSON.stringify(notes);
  fs.writeFileSync("notes.json", dataString);
  console.log(chalk.green.inverse.bold("Note added successfully ."));
};
const removeNote = function ({ title }) {
  let notes = loadNotes();

  let notesToKeep = notes.filter((note) => note.title !== title);
  if (notesToKeep.length === notes.length) {
    console.log(chalk.red.inverse.bold("No note removed ."));
    return;
  }
  const dataString = JSON.stringify(notesToKeep);
  fs.writeFileSync("notes.json", dataString);
  console.log(chalk.green.inverse.bold("Note removed successfully ."));
};

const listNotes = function () {
  const notes = loadNotes();
  console.log(chalk.whiteBright.bold.inverse("Your notes"));
  notes.forEach((note) => {
    console.log("-->", note.title);
  });
};
const readNote = ({ title }) => {
  const notes = loadNotes();

  const findNote = notes.findIndex((note) => note.title === title);

  if (!findNote) {
    console.log(chalk.white.inverse(title));
    console.log(notes[findNote].body);
    return;
  }
  console.log(chalk.red.inverse("No note with this title ."));
};
module.exports = { loadNotes, addNote, removeNote, listNotes, readNote };
