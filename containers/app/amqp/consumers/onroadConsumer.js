import Tortoise from "tortoise";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Track from "../models/Tracking";
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
    try {      
      const onroadParcel = await Track.updateOne(
        { name: msg.name },
        { status: msg.status },
        (err, parcel) => {
          if (err) {
            throw err;
          } 
          else {
            console.log("parcel is on road:", onroadParcel);
            return parcel;
          }
        }
      );
      ack();
    } catch (err) {
      console.log('error', err)
    }
  });
