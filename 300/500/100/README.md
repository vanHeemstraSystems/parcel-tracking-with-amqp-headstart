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

Because by default the main file is named ```index.js```, create a file by that name in the ```amqp``` directyory:

```
$ cd containers/app/amqp
$ touch index.js
```

Add the following content to ```index.js```:

```
import express from "express"              
const app = express()              
app.use("/", (req, res) => {                
res.send("Welcome to parcel tracking system")              
})              
app.listen(8000, () => console.log(`Server listening on 8000`))
```
containers/app/amqp/index.js
