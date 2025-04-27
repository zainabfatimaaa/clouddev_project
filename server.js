import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import { createTables } from './models/dynamodb-models.js';


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  },
});

config({
  path: "./config.env",
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  socket.on('my-orders-req', async ({ username }) => {
    console.log(username, " wants his orders")
    try {
      const response = await fetch(`http://localhost:8000/my-orders/${username}`);
      if (response.ok) 
      {
          const data = await response.json();
          // console.log("My orders: ", data.orders)
          let yourOrders = data.orders
          socket.emit('orders-rec', { yourOrders });
      } 
      else {
          console.error('Failed to fetch orders:', response.statusText);
      }
    } catch (error) {
        console.error('Failed to fetch auctions:', error);
    }
  });
  socket.on('orders', async ({ username }) => {
    console.log(username, " wants his orders")
    try {
      const response = await fetch(`http://localhost:8000/all-orders`);
      if (response.ok) 
      {
          const data = await response.json();
          // console.log("All orders: ", data.orders)
          let allOrders = data.orders
          socket.emit('all-orders', { allOrders });
      } 
      else {
          console.error('Failed to fetch orders:', response.statusText);
      }
    } catch (error) {
        console.error('Failed to fetch auctions:', error);
    }
  });
});

const PORT = 8000;

// Initialize DynamoDB tables before starting the server
createTables()
  .then(() => {
    console.log('DynamoDB tables initialized');
  })
  .catch(err => {
    console.error('Error initializing DynamoDB tables:', err);
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
