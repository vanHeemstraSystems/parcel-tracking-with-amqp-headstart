# 300 - Docker for Production Environment

Let's add our amqp service to the separate docker-compose file in production called ***sample.docker-compose.prod.yml***.

```
version: "3.7"

# See https://stackoverflow.com/questions/29261811/use-docker-compose-env-variable-in-dockerbuild-file
services:

  ... 

  amqp:
    build:
      context: ./amqp
      dockerfile: Dockerfile.prod
      args: # from env_file
        IMAGE_REPOSITORY: ${IMAGE_REPOSITORY}
        PROXY_USER: ${PROXY_USER}
        PROXY_PASSWORD: ${PROXY_PASSWORD}
        PROXY_FQDN: ${PROXY_FQDN}
        PROXY_PORT: ${PROXY_PORT}
    env_file:
      - .env      
    container_name: amqp-prod  
    ports:
      - "8000:8000"
```
containers/app/sample.docker-compose.prod.yml

***Notice*** the difference in port number (dev: 8000, prod: 8000) and overall size of the docker-compose files (dev: long, prod: short) between ***dev*** and ***prod***.

Copy the sample.docker-compose.prod.yml:

```
$ cp sample.docker-compose.prod.yml docker-compose.prod.yml
```

Let's also create a separate Dockerfile for use in production called ***Dockerfile.prod***:

```
ARG IMAGE_REPOSITORY
# development environment: pull official base image for node development
FROM ${IMAGE_REPOSITORY}/node:13.12.0-alpine as build

# See https://stackoverflow.com/questions/29261811/use-docker-compose-env-variable-in-dockerbuild-file
# ARG PROXY_USER
# ARG PROXY_PASSWORD
# ARG PROXY_FQDN
# ARG PROXY_PORT

# ENV HTTP_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"
# ENV HTTPS_PROXY="http://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_FQDN}:${PROXY_PORT}"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# build app
RUN npm run build

# production environment
FROM ${IMAGE_REPOSITORY}/nginx:stable-alpine

# install build
COPY --from=build /app/build /usr/share/nginx/html

# expose port
EXPOSE 8000

# start app
CMD ["nginx", "-g", "daemon off;"]
```
containers/app/amqp/Dockerfile.prod

Here, we take advantage of the [multistage build](https://docs.docker.com/engine/userguide/eng-image/multistage-build/) pattern to create a temporary image used for building the artifact – the production-ready React static files – that is then copied over to the production image. The temporary build image is discarded along with the original files and folders associated with the image. This produces a lean, production-ready image.

NOTE: Check out the [Builder pattern vs. Multi-stage builds in Docker](https://blog.alexellis.io/mutli-stage-docker-builds/) blog post for more info on multistage builds.

Using the production docker-compose file, build and tag the Docker image and run the Docker container:

```
$ cd containers/app
$ docker-compose --file docker-compose.prod.yml up --build -d
```

If successful, browse to http://localhost:8000 to see the production version of the app.

IMAGE OF AMQP SERVER GOES HERE: "Welcome to AMQP Service".

http://localhost:8000

== WE ARE HERE ==