import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from './config/dynamodb.js';

// Sample data for Users table
const sampleUsers = [
  {
    username: 'customer1',
    name: 'John Doe',
    password: 'password123',
    type: 'Customer'
  },
  {
    username: 'employee1',
    name: 'Jane Smith',
    password: 'password123',
    type: 'Employee'
  }
];

// Sample data for Menu table
const sampleMenu = [
  {
    id: '1',
    name: 'Burger',
    description: 'Delicious beef burger with cheese',
    price: 9.99
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Margherita pizza with fresh basil',
    price: 12.99
  },
  {
    id: '3',
    name: 'Salad',
    description: 'Fresh garden salad with vinaigrette',
    price: 7.99
  }
];

// Sample data for Orders table
const sampleOrders = [
  {
    id: '1',
    order: [
      {
        name: 'Burger',
        description: 'Delicious beef burger with cheese',
        price: 9.99,
        qty: 2
      },
      {
        name: 'Salad',
        description: 'Fresh garden salad with vinaigrette',
        price: 7.99,
        qty: 1
      }
    ],
    status: 'Processing',
    total: 27.97,
    user: 'customer1'
  }
];

// Function to add sample data to Users table
const addSampleUsers = async () => {
  console.log('Adding sample users...');
  for (const user of sampleUsers) {
    const params = {
      TableName: 'Users',
      Item: user
    };
    
    try {
      await docClient.send(new PutCommand(params));
      console.log(`Added user: ${user.username}`);
    } catch (error) {
      console.error(`Error adding user ${user.username}:`, error);
    }
  }
};

// Function to add sample data to Menu table
const addSampleMenu = async () => {
  console.log('Adding sample menu items...');
  for (const item of sampleMenu) {
    const params = {
      TableName: 'Menu',
      Item: item
    };
    
    try {
      await docClient.send(new PutCommand(params));
      console.log(`Added menu item: ${item.name}`);
    } catch (error) {
      console.error(`Error adding menu item ${item.name}:`, error);
    }
  }
};

// Function to add sample data to Orders table
const addSampleOrders = async () => {
  console.log('Adding sample orders...');
  for (const order of sampleOrders) {
    const params = {
      TableName: 'Orders',
      Item: order
    };
    
    try {
      await docClient.send(new PutCommand(params));
      console.log(`Added order: ${order.id}`);
    } catch (error) {
      console.error(`Error adding order ${order.id}:`, error);
    }
  }
};

// Main function to add all sample data
const addAllSampleData = async () => {
  try {
    await addSampleUsers();
    await addSampleMenu();
    await addSampleOrders();
    console.log('All sample data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};

// Run the script
addAllSampleData();

console.log('\nTo run this sample data script:');
console.log('node sample-data.js');