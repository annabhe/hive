const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// set up cors config
const corsOptions = {
    origin: "http://localhost:4200"
};

// sockets
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: corsOptions
});

// track players currently in game
let players = {}

io.on('connection', (socket) => {
    console.log(`Socket id ${socket.id} connected`);
    
    // create a new player and add it to players object

    // players[socket.id].avatar = selectedCharacter
    players[socket.id] = {
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 700) + 50,
        playerId: socket.id,
        avatar: socket.request._query.avatar
    }

    // send players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players about the new player
    socket.broadcast.emit('newPlayer', players[socket.id])

    // disconnect
    socket.on('disconnect', () => {
        console.log(`Socket id ${socket.id} disconnected`)
        // remove player from players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.sockets.emit('destroy', socket.id);
    })

    // when a player moves update player data
    socket.on('playerMovement', (movementData) => {
        players[socket.id].x = movementData.x
        players[socket.id].y = movementData.y
        // emit a message to all players to say player moved
        socket.broadcast.emit('playerMoved', players[socket.id])
    })
})

// use cors
app.use(cors(corsOptions));

// set up mongoose
const mongoose = require('mongoose');
const { DB_HOST, DB_PORT, DB_NAME } = require('./config/db.config.js');
const mongoConnectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose.connect(mongoConnectionString);

// parse requests of content-type application/json
app.use(express.json());

// auth route
const authController = require("./controllers/authController");
app.use('/auth', authController);

// avatar route
const avatarController = require("./controllers/avatarController");
app.use('/avatar', avatarController);

// pet route
const petController = require("./controllers/petController");
app.use('/pet', petController);

// adjusted for sockets
httpServer.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});