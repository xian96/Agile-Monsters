const express = require("express");
const redis = require('redis')
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize'); 
const domain = process.env.DOMAIN || `https://agile-monsters.herokuapp.com`
const path = require('path');

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
   origin: `${domain}`
}))

app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
       maxAge: 60 * 1000 * 7
    }
  })
)
app.use(express.json());

// app.use(express.static(path.join(__dirname, 'build')));
// app.get('/*', (req, res) => {
//    res.sendFile(path.join(__dirname, 'build', 'index.html'));
//  });
//https://www.freecodecamp.org/news/deploy-a-react-node-app-to/
const configMiddleware = require("./middleware");
configMiddleware(app);

const configRoute = require("./routes");
configRoute(app);

const server = app.listen(process.env.PORT || 4000, process.env.IP, (req, res) => {
   console.log("express start!");
   console.log(`${domain}:${process.env.PORT}`);
});

const io = require('socket.io')(server);
const chat = io.of('/chat');

chat.on('connect', (socket) => {
   socket.on('join', ({ name, room }) => {
      this.socket_userName = name;
      this.socket_room = room;
      socket.join(room);
      socket.emit('message', { user: 'Admin', text: `You have join the room ${room}.` });
      socket.broadcast.to(room).emit('message', { user: 'Admin', text: `${name} has joined this room!` });
   });

   socket.on('message', ({ name, room, message }) => {
      chat.to(room).emit('message', { user: name, text: message });
   });

   socket.on('disconnect', () => {
      socket.leave(this.socket_room);
      chat.to(this.socket_room).emit('message', { user: 'Admin', text: `${this.socket_userName} has left this room.` });
   })
});
