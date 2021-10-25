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