# 600 - Publisher and Consumer Creation

In these steps, we are going to create our first ```Publisher``` and ```Consumer```. 

- A **Publisher** will publish a message, send it to an exchange which is inside a RabbitMQ message broker and the exhange will send the message to the message queue.

- A **Consumer** listens to the messages which it cares about in the queue, it will take the message and will do what we want it to do.

For now, we will log to the console the message which we get via the ```Consumer```. 

To do that let’s create two folders named ```publishers``` and ```consumers``` inside the existing folder called ```amqp```.

```
$ cd containers/app/amqp
$ mkdir publishers
$ mkdir consumers
```

In the ```publishers``` folder, create a file named ```shippingPublisher.js```.

```
$ cd containers/app/amqp/publishers
$ touch shippingPublisher.js
```

And in the ```consumers``` folder, create a file named ```shippingConsumer.js```.


```
$ cd containers/app/amqp/consumers
$ touch shippingConsumer.js
```

Write this code down to the ```shippingPublisher.js``` file:

```
import Tortoise from "tortoise"          
import dotenv from "dotenv";

dotenv.config()

const tortoise = new Tortoise(process.env.AMQP_URL)    
  tortoise      
    .exchange("parcel-tracking", "topic", { durable: false })      
    .publish("parcel.shipping", { name: "test", status: "shipping" });
```
containers/app/amqp/publishers/shippingPublisher.js


== WE ARE HERE ==