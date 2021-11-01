# 100 - Service Setup

## 100 - Setup the directory structure

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

Add a script entry inside ```package.json``` as follows:

```
...
  "scripts": {
    "start": "nodemon ./server.js --exec babel-node -e js"
  }
...
```
containers/app/amqp/package.json

Create a file called ```server.js``` in the ```amqp``` directory:

```
$ cd containers/app/amqp
$ touch server.js
```

Add the following content to ```server.js```:

```
import express from "express"              
const app = express()              
app.use("/", (req, res) => {                
  res.send("Welcome to AMQP Service")              
})      
app.listen(8000, () => console.log(`Server listening on 8000`))
```
containers/app/amqp/server.js

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
    "nodemon": "^2.0.14",    
    "socket.io": "^4.3.1",
    "tortoise": "^1.0.1"
  }
...
```
containers/app/amqp/package.json

Add npm packages used for development only by the following command:

```
$ cd containers/app/amqp
$ npm i --save-dev @babel/core @babel/preset-env @babel/node @babel/cli babel-loader
```

After above command, verify if the packages have been mentioned inside ```package.json```:

```
...
  "devDependencies": {
    "@babel/cli": "^7.15.7",  
    "@babel/core": "^7.15.8",
    "@babel/node": "^7.15.8",    
    "@babel/preset-env": "^7.15.8",
    "babel-loader": "^8.2.3"
  }
...
```

Create a file called ```.babelrc``` in the ```amqp``` directory.

```
$ cd containers/app/amqp
$ touch .babelrc
```

Add the following content to this ```.babelrc``` file:

```
{
  "presets": ["@babel/preset-env"]
}
```
containers/app/amqp/.babelrc

Test which version of babel you are running with commmand:

```
$ babel -V
```

If babel is not recognized or it is not verion 7 or higher

```
$ npm uninstall babel-cli -g
$ npm uninstall babel-core -g
```

And

```
$ npm install @babel/cli -g
$ npm install @babel/core -g
```

As an early trial, try to run the server.js file as to start a server with this command from within the amqp directory:

```
$ cd containers/app/amqp
$ nodemon ./server --exec babel-node -e js
```

**Note**: If you see ```command not found: nodemon``` you have to install nodeman first, globally, as follows:

```
$ sudo npm install nodemon -g
```

**Note**: If you see command not found: babel-node you have to install babel-node first, globally, as follows:

```
$ npm install @babel/node -g
```

If it is mentioned that there is already a process listening at port 8000, find the Process ID (PID) as follows:

You can try netstat
```
$ netstat -vanp tcp | grep 8000
``` 

For **macOS El Capitan and newer** (or if your netstat doesn't support -p), use lsof

```
$ lsof -i tcp:8000 
``` 
 
For **Centos 7** use:

```
$ netstat -vanp --tcp | grep 8000
```

If it returns the Process ID (PID) at which an earlier process is listening, you can kill that process as follows:

```
$ kill -9 <PID>
```

After above execution open ```localhost:8000``` in a browser. If the "Welcome to AMQP Service" message comes up on the page it means Express.js installation was successful.

![Screenshot 2021-10-25 at 10 54 43](https://user-images.githubusercontent.com/1499433/138665819-59233cc8-65bd-489f-8a31-da4667fb11d2.png)

Let's continue.
