const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("../src/utils/users");

const { generateMessage } = require("../src/utils/message");

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat application .")
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${user.username} has joined .`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "newMessage",
      generateMessage(user.username, message)
    );
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage("Admin", `${user.username} has left the chat .`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("sendLocation", ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateMessage(
        user.username,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    callback("Location shared ");
  });
});
httpServer.listen(port, () => {
  console.log("Server is running on port ", port);
});
