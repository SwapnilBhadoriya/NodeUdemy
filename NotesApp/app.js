const yargs = require("yargs");
const notes = require("./notes");

yargs.command({
  command: "add",
  description: "Add a note ",
  builder: {
    title: {
      describe: "Note title ",
      demandOption: true,
      type: "string",
    },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string",
    },
  },
  handler: function (argv) {
    notes.addNote(argv);
  },
});

yargs.command({
  command: "remove",
  description: "Remove a note ",
  builder: {
    title: {
      demandOption: true,
      type: "string",
    },
  },

  handler: function (argv) {
    notes.removeNote(argv);
  },
});
yargs.command("test", true);
yargs.command({
  command: "list",
  description: "List notes",
  handler: function () {
    notes.listNotes();
  },
});
yargs.command({
  command: "read",
  description: "Read a note",
  builder: {
    title: {
      describe: "Note title ",
      type: "string",
      demandOption: true,
    },
  },
  handler: function (argv) {
    notes.readNote(argv);
  },
});

yargs.parse();
