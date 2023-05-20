import express from "express";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import { Server, Socket } from "socket.io";

const app = express();

const server = app.listen(8080, () => {
  console.log("escuchando..");
});

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", viewsRouter);

const io = new Server(server);

const messages = [];

io.on("connection", (socket) => {
  console.log("nuevo socket conectado");
  socket.emit("logs", messages);
  socket.on("message", (data) => {
    messages.push(data);
    console.log(data);
    io.emit("logs", messages);
  });
  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });
});
