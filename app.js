import express from 'express';
import cors from 'cors';

// Importing DynamoDB models
import { Users, Menu, Orders, createTables } from './models/dynamodb-models.js';

export const app = express();

// Configure CORS with specific options - more permissive for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DynamoDB tables (this will just log the commands needed)
createTables()
  .then(() => console.log('DynamoDB setup complete'))
  .catch(err => console.log('DynamoDB setup error:', err));

// POST requests
app.post("/login", async (req, res) => {
  const { username, password, type } = req.body;
  try {
      const user = await Users.findOne({ username, type });
      
      // Check if the user exists and if the password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Authentication successful
      return res.send({ message: "Login successful", name: user.name});
  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password, type, name } = req.body;
  try {
      const existingUser = await Users.findOne({ username, type });

      if (existingUser) {
          return res.status(400).json({ message: `Username already exists as ${type}` });
      }

      await Users.create({ username, password, type, name });
      return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/order", async (req, res) => {
  const { order, status, total, user } = req.body;
  try {
      await Orders.create({ order, status, total, user });
      return res.status(201).json({ message: "Order placed" });
  } catch (error) {
      console.error("Error placing order:", error);
      return res.status(500).json({ message: "Error placing order" });
  }
});

//GET requests
app.get('/my-orders/:username', async (req, res) => {
    console.log('Fetching orders for user:', req.params.username);
    const { username } = req.params;
    try {
        console.log('Querying DynamoDB for orders with user:', username);
        const orders = await Orders.find({ user: username });
        console.log('Orders found:', orders ? orders.length : 0);
        console.log('Sample order (if available):', orders.length > 0 ? JSON.stringify(orders[0]) : 'No orders');
        res.status(200).json({ orders });
    } catch (error) {
        // Handle errors with more details
        console.error('Failed to fetch orders. Error details:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
});

app.get('/all-orders/', async (req, res) => {
  try {
      const orders = await Orders.find();
      res.status(200).json({ orders });
  } catch (error) {
      // Handle errors
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/menu', async (req, res) => {
  try {
      const menu = await Menu.find();
      let sendArr = []
      for (let x = 0; x < menu.length; x++) {
        let obj = {
            name: menu[x].name,
            price: menu[x].price,
            description: menu[x].description,
            qty: 0
        }
        sendArr.push(obj)
      }
      console.log("New Array: ", sendArr)
      res.status(200).json({ menu, sendArr });
  } catch (error) {
      console.error('Error fetching menu:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Add PUT route to update order status
app.put('/update-order-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating status for order ${orderId} to ${status}`);
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updatedOrder = await Orders.updateStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    return res.status(200).json({ 
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});