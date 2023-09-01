const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageInput = document.querySelector("#message");
const $messageButton = document.querySelector("#send");
const $locationButton = document.querySelector("#sendLocation");

const $messages = document.querySelector("#messages");
//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("locationMessage", ({ username, message: url, createdAt }) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    username,
    url,
    createdAt: moment(createdAt).format("h:m A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
socket.on("newMessage", ({ username, message, createdAt }) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
    username,
    createdAt: moment(createdAt).format("h:m A"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  console.log(room, users);
  const html = Mustache.render(sidebarTemplate, { room, users });
  document.querySelector("#sidebar").innerHTML = html;
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  $messageButton.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", $messageInput.value, () => {
    $messageButton.removeAttribute("disabled");
    $messageInput.value = "";
    $messageInput.focus();
  });
});

$locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geo location is not supported in your browser .");
  }
  $locationButton.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((pos) => {
    // console.log(pos);
    socket.emit(
      "sendLocation",
      {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
      (ack) => {
        console.log(ack);
        $locationButton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
