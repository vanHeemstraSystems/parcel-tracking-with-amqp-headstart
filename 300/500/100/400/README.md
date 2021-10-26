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
import Tortoise from "tortoise";        
import dotenv from "dotenv";

dotenv.config()

const tortoise = new Tortoise(process.env.AMQP_SERVER)
  new Promise((resolve, reject) => {  
    tortoise      
      .exchange("parcel-tracking", "topic", { durable: false })      
      .publish("parcel.shipping", { name: "test", status: "shipping" });
  });

export default shippingPublisher;  
```
containers/app/amqp/publishers/shippingPublisher.js

Now, let’s write the consumer which is going to take the message which is sent to the message broker by the publisher. To do this write this code down to the ```shippingConsumer.js``` file:

```
import Tortoise from "tortoise";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Track from "../model/Tracking";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to database"));

const tortoise = new Tortoise(process.env.AMQP_SERVER);
tortoise
  .queue("", { durable: false })
  .exchange("parcel-tracking", "topic", "*.shipping", { durable: false })
  .prefetch(1)
  .json()
  .subscribe((msg, ack, nack) => {
    const newParcel = new Track(msg);
    newParcel.save((err, parcel) => {
      if (err) throw err;
      console.log("shipped parcel:", parcel);
      return parcel;
    });
    ack();
  });
```
containers/app/amqp/consumers/shippingConsumer.js

We can prefer to install RabbitMQ on our local machine but in that case, the installation steps would be different from the operating system to the operating system and we would need to mess with some network settings. Therefore, we make this step with [cloudamqp.com](http://cloudamqp.com/). To do that let’s create an account on [cloudamqp.com](http://cloudamqp.com/). 

After you have created and account on CloudAMQP, click on the button Create New Instance and create a new message broker instance. We can name the instance as we wish (here: **Parcel Tracking**). 

For a free plan, choose the Little Lemur option. 

![Screenshot 2021-10-25 171902](https://user-images.githubusercontent.com/12828104/138869551-5da6039f-9a34-48d1-9d9d-b6f2128766a8.png)

Then press the buttons named Select Region (e.g. Amazon Web Services EU-West-3 (Paris)) > Review > Create Instance respectively. 

![Screenshot 2021-10-26 133109](https://user-images.githubusercontent.com/12828104/138869683-75013b61-dc2d-41ac-8677-909b2f57b5a2.png)

https://customer.cloudamqp.com/instance/

Go to the [page](https://customer.cloudamqp.com/instance/) where message brokers are listed and click on the name of the message broker instance we just created (here: **Parcel Tracking**). 

![Screenshot 2021-10-26 133555](https://user-images.githubusercontent.com/12828104/138869981-ab93fde5-9925-4dfe-bb4f-96f4bccbcffd.png)

https://api.cloudamqp.com/console/4307ae60-fb8b-4497-8935-44d858dd94e1/details

Copy the value of AMQP URL in the Details section of above web page. 

```
AMQP_URL="amqps://<user & vhost>:<password>@rat.rmq2.cloudamqp.com/<username>"
```
***Note***: ```<user & vhost>``` and ```<password>``` needs to be replaced by the user & vhost and password as provided on the web page in CloudAMQP shown previously.

After applying these steps, go back to the ```amqp``` folder and create a file named sample.env. 

```
$ cd containers/app/amqp
$ touch sample.env
```
Add the following content to this file:

```
AMQP_URL="amqps://<username>:<password>@<server>/..."
```
containers/app/amqp/sample.env

Now make a copy of ```sample.env```:

```
$ cd containers/app/amqp
$ cp sample.env .env
```

Write these lines down in this ```.env``` file:

```
AMQP_URL="amqps://<user & vhost>:<password>@rat.rmq2.cloudamqp.com/<username>"
```
containers/app/amqp/.env

***Note***: ```<user & vhost>``` and ```<password>``` needs to be replaced by the user & vhost and password as provided on the web page in CloudAMQP shown previously.

By this process, we create an AQMP service. 

Now it is time to run our ```publisher``` and ```consumer```. To do this, in two **separate terminals***, run these commands respectively:

```
$ cd containers/app/amqp/
$ nodemon ./consumers/shippingConsumer --exec babel-node -e js
```
Terminal One

```
$ cd containers/app/amqp/
$ nodemon ./consumers/shippingPublisher --exec babel-node -e js
```
Terminal Two

After applying these steps, we should see this message in the terminal where shippingConsumer.js is running (here Terminal One:

```
{ name: 'test', status: 'shipping' }
```

At this time we have a working service! This service is using AMQP as a communication protocol. The service has two ends; one is a publisher, and the other is a consumer. The publisher sends a message to the message broker after this process publisher’s job is done and it doesn’t wait for any reply. The consumer just cares about what the message header includes. In that case, the consumer cares about messages which have shipping statement in their header. There are nothing consumer needs except the message header.

In the next step, we are going to publish messages when an HTTP request is received.


== WE ARE HERE ==
