# 100 - Introduction

In the development process, besides specify which technologies are going to be used, it is important to determine how the project architecture is going to be. These days, the most common project architecture is microservice architecture. One of the basic features of the microservice architecture is that every service can be deployed separately. Thanks to this feature, every single service can use a different protocol(s) in the project. It means a project can contain both HTTP, AMQP, and WS connection protocols.

Here, we are going to build a service that uses both HTTP, AMQP, and WS. In this service we are going to use these technologies:

- Express.js
- MongoDB
- Socket.IO
- RabbitMQ
- ReactJS

We will use the Express.js library to handle HTTP requests. When HTTP requests are received we will execute ```publishers``` which publish a message about the event to the RabbitMQ message broker. We will also create consumers to listen to the messages which are sent to the RabbitMQ message broker by the publishers, and save them to the MongoDB database. At last, we will use Socket.IO in order to track every change in MongoDB and to provide rendering those changes in the frontend built by using React, without refreshing the page.
