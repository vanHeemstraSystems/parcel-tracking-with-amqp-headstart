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

Add a script entry inside ```package.json``` as follows:

```
...
  "scripts": {
    "start": "node index.js"
  }
...
```
containers/app/amqp/package.json

Because by default the main file in package.json is named ```index.js```, create a file by that name in the ```amqp``` directory:

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

Add npm packages used for development only by the following command:

```
$ cd containers/app/amqp
$ npm i --save-dev @babel/core @babel/preset-env babel-loader
```

After above command, verify if the packages have been mentioned inside ```package.json```:

```
...


...
```


Create a file called ```Dockerfile.dev``` in the ```amqp``` directory.

```
$ cd containers/app/amqp
$ touch Dockerfile.dev
```

Add the following content to this Dockerfile.dev:

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