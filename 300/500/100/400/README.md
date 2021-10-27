# 600 - Publisher and Consumer Creation

In these steps, we are going to create our first ```Publisher``` and ```Consumer```. 

- A **Publisher** will publish a message, send it to an exchange which is inside a RabbitMQ message broker and the exhange will send the message to the message queue.

- A **Consumer** listens to the messages which it cares about in the queue, it will take the message and will do what we want it to do.

For now, we will log to the console the message which we get via the ```Consumer```. 

## Create Publishers

Let’s create a folder named ```publishers``` inside the existing folder called ```amqp```.

```
$ cd containers/app/amqp
$ mkdir publishers
```
### Shipping Publisher

In the ```publishers``` folder, create a file named ```shippingPublisher.js```.

```
$ cd containers/app/amqp/publishers
$ touch shippingPublisher.js
```

Write this code down to the ```shippingPublisher.js``` file:

```
import Tortoise from "tortoise";
import dotenv from "dotenv";

dotenv.config();

const tortoise = new Tortoise(process.env.AMQP_URL);

const shippingPublisher = (name) =>
  new Promise((resolve, reject) => {
    tortoise
      .exchange("parcel-tracking", "topic", { durable: false })
      .publish("parcel.shipping", { name, status: "shipping" });
    resolve(tortoise);
  });

export default shippingPublisher;  
```
containers/app/amqp/publishers/shippingPublisher.js

### OnRoad Publisher

In the ```publishers``` folder, create a file named ```onroadPublisher.js```.

```
$ cd containers/app/amqp/publishers
$ touch onroadPublisher.js
```

Write this code down to the ```onroadPublisher.js``` file:

```
import Tortoise from "tortoise";
import dotenv from "dotenv";

dotenv.config();

const tortoise = new Tortoise(process.env.AMQP_URL);

const onroadPublisher = (name) =>
  new Promise((resolve, reject) => {
    tortoise
      .exchange("parcel-tracking", "topic", { durable: false })
      .publish("parcel.onroad", { name, status: "onroad" });
    resolve(tortoise);
  });

export default onroadPublisher;  
```
containers/app/amqp/publishers/onroadPublisher.js

### Delivered Publisher

In the ```publishers``` folder, create a file named ```deliveredPublisher.js```.

```
$ cd containers/app/amqp/publishers
$ touch deliveredPublisher.js
```

Write this code down to the ```deliveredPublisher.js``` file:

```
import Tortoise from "tortoise";
import dotenv from "dotenv";

dotenv.config();

const tortoise = new Tortoise(process.env.AMQP_URL);

const deliveredPublisher = (name) =>
  new Promise((resolve, reject) => {
    tortoise
      .exchange("parcel-tracking", "topic", { durable: false })
      .publish("parcel.delivered", { name, status: "delivered" });
    resolve(tortoise);
  });

export default deliveredPublisher;  
```
containers/app/amqp/publishers/deliveredPublisher.js

## Create Consumers

Now, let’s write the consumer which is going to take the message which is sent to the message broker by the publisher. 

Let’s create a folder named ```consumers``` inside the existing folder called ```amqp```.

```
$ cd containers/app/amqp
$ mkdir consumers
```

### Shipping Consumer

In the ```consumers``` folder, create a file named ```shippingConsumer.js```.

```
$ cd containers/app/amqp/consumers
$ touch shippingConsumer.js
```

To do this write this code down to the ```shippingConsumer.js``` file:

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

const tortoise = new Tortoise(process.env.AMQP_URL);
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

### OnRoad Consumer

In the ```consumers``` folder, create a file named ```onroadConsumer.js```.

```
$ cd containers/app/amqp/consumers
$ touch onroadConsumer.js
```

To do this write this code down to the ```onroadConsumer.js``` file:

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

const tortoise = new Tortoise(process.env.AMQP_URL);
tortoise
  .queue("", { durable: false })
  .exchange("parcel-tracking", "topic", "*.onroad", { durable: false })
  .prefetch(1)
  .json()
  .subscribe(async (msg, ack, nack) => {
    const onroadParcel = await Track.updateOne(
      { name: msg.name },
      { status: msg.status },
      (err, parcel) => {
        if (err) throw err;
        else return parcel;
      }
    );
    console.log("parcel is on road:", onroadParcel);
    ack();
  });
```
containers/app/amqp/consumers/onroadConsumer.js

### Delivered Consumer

In the ```consumers``` folder, create a file named ```deliveredConsumer.js```.

```
$ cd containers/app/amqp/consumers
$ touch deliveredConsumer.js
```

To do this write this code down to the ```deliveredConsumer.js``` file:

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

const tortoise = new Tortoise(process.env.AMQP_URL);
tortoise
  .queue("", { durable: false })
  .exchange("parcel-tracking", "topic", "*.delivered", { durable: false })
  .prefetch(1)
  .json()
  .subscribe(async (msg, ack, nack) => {
    const deliveredParcel = await Track.updateOne(
      { name: msg.name },
      { status: msg.status },
      (err, parcel) => {
        if (err) throw err;
        else return parcel;
      }
    );
    console.log("parcel was delivered:", deliveredParcel);
    ack();
  });
```
containers/app/amqp/consumers/deliveredConsumer.js

## Configure RabbitMQ

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

Add a ```.gitignore``` file to the ```amqp``` folder.

```
$ cd containers/app/amqp
$ touch .gitignore
```

Add the following to the .gitignore file.

```
.env
```
containers/app/amqp/.gitignore

Now create a directory called 'models'.

```
$ cd containers/app/amqp
$ mkdir models
```

Inside the ```models``` directory create a file called ```Tracking.js```:

```
$ cd containers/app/amqp/models
$ touch Tracking.js
```
containers/app/amqp/Tracking.js

Add the following content to the ```Tracking.js``` file:

```
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
  name: String,
  status: String,
});

const Track = mongoose.model("Track", trackingSchema);

export default Track;
```
containers/app/amqp/models/Tracking.js

## Configure MongoDB

Setup a database connection, here using ***MongoDB***.

To configure MongoDB, let’s create an account in [mongodb.com/cloud](mongodb.com/cloud). 

![Screenshot 2021-10-26 164638](https://user-images.githubusercontent.com/12828104/138904041-c0c87bad-ab6e-4422-8b1f-fa0a8db606ae.png)

After having created an account, create an organization (here e.g.: 'not-applicable'), a project in the organization (here e.g.:'Parcel Tracking'). 

![Screenshot 2021-10-26 165434](https://user-images.githubusercontent.com/12828104/138905192-82a57280-cbea-41d9-9aca-d69451130eb2.png)
Organization

![Screenshot 2021-10-26 165747](https://user-images.githubusercontent.com/12828104/138905886-d0ae8cac-e201-4ac3-b0d5-2a1659f281c3.png)
Projects

![Screenshot 2021-10-26 170002](https://user-images.githubusercontent.com/12828104/138906212-773ee89a-7c70-4a81-a95f-59f0dece36bd.png)
Project "Parcel Tracking" at 

Click ***Build a Database*** in the project "Parcel Tracking":

![Screenshot 2021-10-26 170143](https://user-images.githubusercontent.com/12828104/138906922-dda92b12-b727-40cf-8e48-2a7f345098f3.png)
Database

Choose the ***Shared*** option, so your database will be for free.

![Screenshot 2021-10-26 170601](https://user-images.githubusercontent.com/12828104/138907375-d67920e2-e80d-4180-aa7c-313668f4beab.png)
Shared Database

Choose a Cloud Provider (here: Google Cloud Platform), a Region (here: GCP, Belgium europe-west1, and click ***Create Cluster***.

![Screenshot 2021-10-26 170800](https://user-images.githubusercontent.com/12828104/138907941-da954231-6c2e-45c0-b19a-3675adedfd60.png)
Create Cluster

![Screenshot 2021-10-26 171025](https://user-images.githubusercontent.com/12828104/138908109-9443b20a-ff2f-44a6-8347-4165ce4b27cd.png)
Cluster on GCP Belgium being created ...

![Screenshot 2021-10-26 171337](https://user-images.githubusercontent.com/12828104/138908665-6f5bb1d6-bd85-4131-9287-b361556ac6b1.png)
Cluster on GCP Belgium created at https://cloud.mongodb.com/v2/6178183a73828721b574c707#clusters?fastPoll=true

After the cluster is created, on the page of the cluster, click ***Database Access***. 

![Screenshot 2021-10-26 171531](https://user-images.githubusercontent.com/12828104/138909013-24861329-bec5-4f61-a503-f5b6c5896586.png)
Click ***Add New Database User*** choice there and create a database user. 

![Screenshot 2021-10-26 171812](https://user-images.githubusercontent.com/12828104/138909799-823cbbf1-1925-4dcd-a8f6-1334283f9dc6.png)

Username: ***parcel-tracking-user-001***

Password: [ S E C R E T ]

![Screenshot 2021-10-26 172335](https://user-images.githubusercontent.com/12828104/138910506-e1430c6c-8d2c-4911-ae92-9ba0eee57713.png)
User created

Next, click the Databases option on the left bar. 

![Screenshot 2021-10-26 172519](https://user-images.githubusercontent.com/12828104/138910833-89c292ca-6029-4659-877e-5ca1e9250f2d.png)

On the opened page, click the ***Connect*** button.

In Setup connection security step, choose **Allow Access from anywhere** option. 

![Screenshot 2021-10-26 172714](https://user-images.githubusercontent.com/12828104/138911167-123cc867-37c8-4b15-a499-bc8d224be4fa.png)
Allow Access from Anywhere

![Screenshot 2021-10-27 092407](https://user-images.githubusercontent.com/12828104/139019448-18dda22a-53c1-4734-b215-fae5ab261db4.png)
Add IP Addresses

***Note***: Adding the CIDR ```0.0.0.0/0``` allows access from anywhere. Ensure that strong credentials (username and password) are used for all database users when allowing access from anywhere.

Click Add for the IP address ```0.0.0.0/0``` with description ***"Allow Access from Anywhere"***.

![Screenshot 2021-10-27 092829](https://user-images.githubusercontent.com/12828104/139019902-9f3394df-4438-4ea1-8193-2ad9b62e33e9.png)
IP Address 0.0.0.0/0 Added

We previously created a database user (i.e. parcel-tracking-user-001), so we can continue.

Click ***Choose a connection method***.

![Screenshot 2021-10-27 093605](https://user-images.githubusercontent.com/12828104/139021027-92dfaef1-2fe1-42e4-b2ec-abbbe95c25c6.png)
Connect to Cluster

Then let’s click the ***Connect your application*** option.

![Screenshot 2021-10-27 093828](https://user-images.githubusercontent.com/12828104/139021355-34669a22-d8e6-494f-9c57-a685807f107b.png)
Select Driver and Version

We are OK with choosing ***Node.js*** as the Driver, and ***4.0.or later*** as the Version.

The MONGODB_URL is ```mongodb+srv://parcel-tracking-user-001:<password>@cluster0.dgxs7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority```

***Tip***: Tick the box ***Include full driver code example*** to see additional information:

![Screenshot 2021-10-27 094752](https://user-images.githubusercontent.com/12828104/139022831-d2b62b58-b028-478f-8ca2-442176d62e19.png)

```
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://parcel-tracking-user-001:<password>@cluster0.dgxs7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
```

Replace ```<password>``` with the password for the ***parcel-tracking-user-001*** user. Replace ```myFirstDatabase``` with the name of the database that connections will use by default (here: ***parceltracking***). Ensure any option params are [URL encoded](https://dochub.mongodb.org/core/atlas-url-encoding).

Copy the connection information under ```Add your connection string``` to go into your application code. 

Let’s go back to the text editor and create a variable named ```MONGODB_URL``` in the ```sample.env``` file and assign the MongoDB connection information to the variable. 

```
...
MONGODB_URL=""
...
```
containers/app/amqp/sample.env

Copy the ```sample.env```:

```
$ cd containers/app/amqp
$ cp sample.env .env
```

Copy the connection information under ```Add your connection string``` and add it the MONGODB_URL variable.

```
...
MONGODB_URL="mongodb+srv://parcel-tracking-user-001:<password>@cluster0.dgxs7.mongodb.net/parceltracking?retryWrites=true&w=majority"
...
```
containers/app/amqp/.env

Replace ```<password>``` with the password for the ***parcel-tracking-user-001*** user. Replace ```myFirstDatabase``` with the name of the database that connections will use by default (here: ***parceltracking***). Ensure any option params are [URL encoded](https://dochub.mongodb.org/core/atlas-url-encoding).

Click ***Close***.

Now it is time to run our ```publisher``` and ```consumer```. To do this, in two **separate terminals***, run these commands respectively:

```
$ cd containers/app/amqp/
$ nodemon ./consumers/shippingConsumer --exec babel-node -e js
```
Terminal One

It should prompt somewhat like below:

```
[nodemon] 2.0.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js
[nodemon] starting 'babel-node ./consumers/shippingConsumer.js'
Connected to database
```
Terminal One

```
$ cd containers/app/amqp/
$ nodemon ./publishers/shippingPublisher --exec babel-node -e js
```
Terminal Two

It should prompt somewhat like below:

```
[nodemon] 2.0.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js
[nodemon] starting 'babel-node ./publishers/shippingPublisher.js'
[nodemon] clean exit - waiting for changes before restart
```
Terminal Two

=== REMOVE START
After applying these steps, we should see this message in the terminal where shippingConsumer.js is running (here Terminal One:

```
{ name: 'test', status: 'shipping' }
```
=== REMOVE END

At this time we have a working service! This service is using AMQP as a communication protocol. The service has two ends; one is a publisher, and the other is a consumer. The publisher sends a message to the message broker after this process publisher’s job is done and it doesn’t wait for any reply. The consumer just cares about what the message header includes. In that case, the consumer cares about messages which have ```shipping``` statement in their header. There is nothing the consumer needs except for the message header.

In the next step, we are going to publish messages when an HTTP request is received.

## Configure HTTP Requests

As the server (at ```containers/app/amqp/server.js```) receives HTTP requests, publishers (at ```containers/app/amqp/publishers/```) will be executed and as these publishers send messages to the message broker, our consumers  (at ```containers/app/amqp/consumers/```) are going to listen to these messages.

Now let’s create HTTP routes. 

For the sake of best practice and clean code create a folder named ```routes``` under the ```amqp``` folder.

```
$ cd containers/app/amqp
$ mkdir routes
```

Create a file named ```index.js``` inside the ```routes``` folder. 

```
$ cd containers/app/amqp/routes
$ touch index.js
```

Next, write these lines down to the index.js file:

```
import { Router } from "express";
import shippingPublishers from "../publishers/shippingPublisher";
import onroadPublisher from "../publishers/onroadPublisher";
import deliveredPublisher from "../publishers/deliveredPublisher";

const router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to parcel tracking system");
});

router.get("/shipping/:name", async (req, res, next) => {
  const name = req.params.name;
  await shippingPublishers(name).then(res.send("shipping"));
});

router.get("/onroad/:name", async (req, res, next) => {
  const name = req.params.name;
  await onroadPublisher(name).then(res.send("onroad"));
});

router.get("/delivered/:name", async (req, res, next) => {
  const name = req.params.name;
  await deliveredPublisher(name).then(res.send("delivered"));
});

export default router;
```
containers/app/amqp/routes/index.js

After creating HTTP routes, let’s modify the server.js file like that:

```
import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import mongoose from "mongoose";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Connected to database"));
const app = express();
const port = process.env.PORT;

app.use(router);

app.listen(port, () => console.log(`Server listening on port ${port}`));
```
containers/app/amqp/server.js

Add the variable ```PORT``` to sample.env.

```
...
PORT=""
...
```
containers/app/amqp/sample.env


Copy ```sample.env```:

```
$ cd containers/app/amqp
$ cp sample.env .env
```

Add a Port Number (here: 8000) to .env for PORT:

```
...
PORT="8000"
...
```
containers/app/amqp/.env

Now, go to into the ```amqp``` folder and run these commands, each from a different terminal:

***Note***: Make sure no other services are running at the port (here: 8000) you specified for server.js.

In Terminal One type:

```
$ cd containers/app/amqp
$ nodemon ./server --exec babel-node -e js
```
Terminal One

You will be prompted somewhat like below:

```
[nodemon] 2.0.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js
[nodemon] starting `babel-node ./server.js`
Server listening on port 8000
Connected to database
```
Terminal One

In Terminal Two type:

```
$ cd containers/app/amqp
$ nodemon ./consumers/shippingConsumer --exec babel-node -e js
```
Ternminal Two

In Terminal Three type:

```
$ cd containers/app/amqp
$ nodemon ./consumers/onroadConsumer --exec babel-node -e js
```
Terminal Three

In Terminal Four type:

```
$ cd containers/app/amqp
$ nodemon ./consumers/deliveredConsumer --exec babel-node -e js
```
Terminal Four

== WE ARE HERE ==
