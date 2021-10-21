import express from "express"              
const app = express()              
app.use("/", (req, res) => {                
  res.send("Welcome to AMQP Service")              
})      
app.listen(8000, () => console.log(`Server listening on 8000`))