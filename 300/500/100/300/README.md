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
    volumes:
      - ./amqp:/app
      - /app/node_modules
```
containers/app/sample.docker-compose.prod.yml

Copy the sample.docker-compose.prod.yml:

```
$ cp sample.docker-compose.prod.yml docker-compose.prod.yml
```

Let's also create a separate Dockerfile for use in production called ***Dockerfile.prod***:

```
ARG IMAGE_REPOSITORY
# development environment: pull official base image for node development
FROM ${IMAGE_REPOSITORY}/node:13.12.0-alpine

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

# add app
COPY . ./

EXPOSE 8000

# start app
CMD ["npm", "start"]
```
containers/app/amqp/Dockerfile.prod

Using the production docker-compose file, build and tag the Docker image and run the Docker container:

```
$ cd containers/app
$ docker-compose --file docker-compose.prod.yml up --build -d
```

If successful, browse to http://localhost:8000 to see the production version of the app.

![Screenshot 2021-10-25 at 10 54 43](https://user-images.githubusercontent.com/1499433/138665819-59233cc8-65bd-489f-8a31-da4667fb11d2.png)

http://localhost:8000
