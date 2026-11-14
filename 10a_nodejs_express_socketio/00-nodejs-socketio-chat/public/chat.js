const socket = io();
const form = document.querySelector("#chat-form");
const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message");
const messages = document.querySelector("#messages");
const notice = document.querySelector("#notice");
const connectionStatus = document.querySelector("#connection-status");

socket.on("connect", () => {
  connectionStatus.textContent = "Connected to the server.";
});

socket.on("disconnect", () => {
  connectionStatus.textContent = "Lost connection. Trying again...";
});

socket.on("chat:message", (message) => {
  const item = document.createElement("li");
  const heading = document.createElement("strong");
  const text = document.createElement("span");
  const time = document.createElement("time");

  heading.textContent = message.username;
  text.textContent = message.text;
  time.dateTime = message.sentAt;
  time.textContent = new Date(message.sentAt).toLocaleTimeString();
  item.append(heading, text, time);
  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("chat:error", (message) => {
  notice.textContent = message;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  notice.textContent = "";

  socket.emit("chat:send", {
    username: usernameInput.value,
    text: messageInput.value,
  });
  messageInput.value = "";
  messageInput.focus();
});
