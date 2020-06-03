const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const socket = require('socket.io');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");

const server = http.createServer(app);
let io = socket(server);
io.on('connection', (socket) => {
    
    io.to(socket.id).emit('id', socket.id);

    socket.on('chat', (data) => {
        io.to(data.partner).emit('chat', data);
        socket.emit('mymsg', data);
    });
});
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);