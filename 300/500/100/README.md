# 100 - AMQP Service

Create a subdirectory for the AMQP service.

```
$ cd containers/app
$ mkdir amqp
```

Inside the newly created subdirectory ```amqp``` run the following command to initialise npm:

```
$ cd containers/app/amqp
$ npm init -y
```

As a result of above initialization, the following files will have been created in the ```amqp``` subdirectory:

- package.json

Because by default the main file is named ```index.js```, create a file by that name in the ```amqp``` directory:

```
$ cd containers/app/amqp
$ touch index.js
```

Add the following content to ```index.js```:

```
import express from "express"              
const app = express()              
app.use("/", (req, res) => {                
  res.send("Welcome to AMQP Service")              
})      
app.listen(8000, () => console.log(`Server listening on 8000`))
```
containers/app/amqp/index.js

Add npm packages by the following command:

```
$ cd containers/app/amqp
$ npm i --save express dotenv tortoise mongoose socket.io nodemon
```

After above command, verify if the packages have been mentioned inside ```package.json```:

```
...
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "mongoose": "^6.0.11",
    "socket.io": "^4.3.1",
    "tortoise": "^1.0.1"
  }
...
```
containers/app/amqp/package.json

