# 200 - Docker for Development Environment

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

IMAGE OF AMQP SERVER GOES HERE WITH: Welcome to AMQP Service

http://localhost:8000

Bring down the container before moving on:

```
$ docker-compose --file docker-compose.dev.yml stop
```
