const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const tweets = require('./routes/tweets')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const socket = require('socket.io');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
  if (err) {
    console.log('Ooops!! Can NOT connect to database ', err);
  } else {
    console.log('Yaaay! Connected to db: ' + config.db);
  }
});

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/clientz/dist/clientz'));
app.use('/authentication', authentication);
app.use('/tweets', tweets);

//app.get('/', (req, res) => {
app.get('*', (req, res) => {
  //res.send('<h1>Om Swastyastu World!<h1>');
  res.sendFile(path.join(__dirname + '/clientz/dist/clientz/index.html'));
});

const server = app.listen(2424, () => {
  console.log("Oit! Listening to port 2424");
});

// Socket setup & pass server
const io = socket(server);
io.on('connection', (socket) => {

  console.log('made socket connection', socket.id);

  // Handle chat event
  socket.on('chat', function(data) {
    console.log(data);
    io.sockets.emit('chat', data);
  });

  // Handle typing event
  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', data);
  });

});

// "rxjs": "^6.0.0",