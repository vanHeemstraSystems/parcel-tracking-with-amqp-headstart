# 100 - AMQP Service

## 100 - Service Setup



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

If it is not verion 7 or higher

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

After above execution open ```localhost:8000``` in a browser. If the "Welcome to AMQP Service" message comes up on the page it means Express.js installation was successful.

Let's continue.

Create a file called ```Dockerfile.dev``` in the ```amqp``` directory.

```
$ cd containers/app/amqp
$ touch Dockerfile.dev
```

Add the following content to this ```Dockerfile.dev``` file:

```
ARG IMAGE_REPOSITORY
# pull official base image
FROM ${IMAGE_REPOSITORY}/node:13.12.0-alpine

# See https://stackoverflow.com/questions/29261811/use-docker-compose-env-variable-in-dockerbuild-file
ARG PROXY_USER
ARG PROXY_PASSWORD
ARG PROXY_FQDN
ARG PROXY_PORT

ENV HTTP_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"
ENV HTTPS_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
```
containers/app/amqp/Dockerfile.dev

***Note***: if you are ***not*** behind a proxy, comment out the following lines in Dockerfile.dev, like so:

```
# See https://stackoverflow.com/questions/29261811/use-docker-compose-env-variable-in-dockerbuild-file
# ARG PROXY_USER
# ARG PROXY_PASSWORD
# ARG PROXY_FQDN
# ARG PROXY_PORT

# ENV HTTP_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"
# ENV HTTPS_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"
```
containers/app/amqp/Dockerfile.dev

Create a file called ```.dockerignore``` inside the ```amqp``` directory.

```
$ cd containers/app/amqp
$ touch .dockerignore 
```

Add the following content to ```.dockerignore```:

```
node_modules
.dockerignore
Dockerfile.dev
Dockerfile.prod
```
containers/app/amqp/.dockerignore

Now let us add the ```amqp``` service to ```sample.docker-compose.dev.yml``` by this entry:

```
...
service:
...
  amqp:
    build:
      context: ./amqp
      dockerfile: Dockerfile.dev
      args: # from env_file
        IMAGE_REPOSITORY: ${IMAGE_REPOSITORY}
        PROXY_USER: ${PROXY_USER}
        PROXY_PASSWORD: ${PROXY_PASSWORD}
        PROXY_FQDN: ${PROXY_FQDN}
        PROXY_PORT: ${PROXY_PORT}
    env_file:
      - .env
    container_name: amqp-dev      
    ports:
      - "8000:8000"
    volumes:
      - ./amqp:/app
      - /app/node_modules       
...

```
containers/app/sample.docker-compose.dev.yml

Now it is time to build the development Docker Image and run the development Docker Container for our app, now inluding the ```amqp``` service.

```
$ cd containers/app
$ docker-compose --file docker-compose.dev.yml up --build -d
```

Fingers crossed ... !

If successful, you can browse to the start page of the new React App, which will look like below:

![137897955-908a2483-66c2-4ab8-a22a-a8a06ca6b325](https://user-images.githubusercontent.com/12828104/138059887-319fd743-228e-4634-9d57-8e55e9c5e5ba.png)

http://localhost:8080

Now check if we can also see the ```amqp``` server at http://localhost:8000

== WE ARE HERE =
