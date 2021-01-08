const express = require("express");
const redis = require('redis')
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize'); 
const domain = process.env.REACT_APP_DOMAIN;
const apiDomain = process.env.REACT_APP_API_DOMAIN;
//const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// https://docs.redislabs.com/latest/rs/references/client_references/client_nodejs/#opening-a-connection-to-redis-using-node-redis
let RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient(process.env.REDISCLOUD_PORT, process.env.REDISCLOUD_HOSTNAME, {no_ready_check: true});
redisClient.auth(process.env.REDISCLOUD_PASSWORD, function (err) {
    if (err) throw err;
});
 
app.use(helmet({
   frameguard: false
}));

app.use(mongoSanitize());

app.use(cors({
   credentials: true,
   // origin: `${domain}`
   origin: function (origin, callback) {
      if (origin == domain || !origin || origin == process.env.REACT_APP_DOMAIN) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}));

app.use(cookieParser('nintendo switch'));//no longer needed for the express-session

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'nintendo switch',
    resave: false,
    saveUninitialized: false,
    cookie: {
       maxAge: 60 * 1000 * 30,
      //  httpOnly: true,
      //  secure: true,
       sameSite: "none",
    }
  })
)
app.use(express.json());

const configMiddleware = require("./middleware");
configMiddleware(app);

const configRoute = require("./routes");
configRoute(app);

app.listen(process.env.PORT || 4000, process.env.IP, (req, res) => {
   console.log("express start!");
   console.log(`${process.env.REACT_APP_API_DOMAIN}:${process.env.PORT} || ${apiDomain}:${process.env.PORT}`);
});

// const io = require('socket.io')(server);
// const chat = io.of('/chat');

// chat.on('connect', (socket) => {
//    socket.on('join', ({ name, room }) => {
//       this.socket_userName = name;
//       this.socket_room = room;
//       socket.join(room);
//       socket.emit('message', { user: 'Admin', text: `You have join the room ${room}.` });
//       socket.broadcast.to(room).emit('message', { user: 'Admin', text: `${name} has joined this room!` });
//    });

//    socket.on('message', ({ name, room, message }) => {
//       chat.to(room).emit('message', { user: name, text: message });
//    });

//    socket.on('disconnect', () => {
//       socket.leave(this.socket_room);
//       chat.to(this.socket_room).emit('message', { user: 'Admin', text: `${this.socket_userName} has left this room.` });
//    })
// });
