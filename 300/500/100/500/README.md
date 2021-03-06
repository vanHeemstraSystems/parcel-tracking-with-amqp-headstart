# 500 - Rendering Real-time Data With WebSocket

To rendering real-time data with WebSocket, we are going to use the Socket.IO library. Each time consumers are making changes in the database, new records will be rendered on the front page of the application without refreshing the page.

First update the ```sample.env``` file with this new entry.

```
...
SOCKET_PORT="8001"
...
```
containers/app/amqp/sample.env

Now copy the ```sample.env``` file.

```
$ cd containers/app/amqp
$ cp sample.env .env
```

To do this let’s create folder named socket in the ```amqp``` folder.

```
$ cd containers/app/amqp
$ mkdir sockets
```

Create a file named ```trackerSocket.js```inside the ```sockets``` directory.

```
$ cd containers/app/amqp/sockets
$ touch trackerSocket.js
```

Add the following content to ```trackerSocket.js```.

```
import socketIo from "socket.io";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import Track from "../models/Tracking";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.SOCKET_PORT || 8001;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to database"));

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let interval;

const findParcel = async (socket) => {
  const parcel = await Track.find({}, (err, parcel) => {
    if (err) throw err;
    console.log(parcel);
    return parcel;
  });
  socket.emit("parcel", parcel);
};

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => findParcel(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
```
containers/app/amqp/sockets/trackerSocket.js

Now in a separate terminal, run below command.

```
$ cd containers/app/amqp
$ nodemon ./sockets/trackerSocket --exec babel-node -e js
```

If you see the messages ```Listening on port 8001``` and ```Connected to database``` output of the command, it means the command is running successfully.

Next, we will create a so-called "client" that will use also Socket.IO to query the MongoDB database for live updates. However, to practise the clean code policies and to separate concerns, this will be created in a separate GitHub repository named "[parcel-tracking-client-headstart](https://github.com/vanHeemstraSystems/parcel-tracking-client-headstart)". So go visit this repository for instructions, please.
