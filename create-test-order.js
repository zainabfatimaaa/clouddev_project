import { Orders, createTables } from './models/dynamodb-models.js';

// Username to create the order for
const username = 'testuser';

// Sample order data
const orderData = {
  order: [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 12.99,
      qty: 1
    },
    {
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan cheese with Caesar dressing',
      price: 8.99,
      qty: 1
    }
  ],
  status: 'Processing',
  total: 21.98, // 12.99 + 8.99
  user: username
};

// Function to create a test order
async function createTestOrder() {
  try {
    console.log('Ensuring DynamoDB tables exist...');
    await createTables();
    
    console.log('Creating test order for user:', username);
    const result = await Orders.create(orderData);
    
    if (result.success) {
      console.log('Test order created successfully!');
      console.log('Order details:', JSON.stringify(orderData, null, 2));
    } else {
      console.error('Failed to create test order');
    }
  } catch (error) {
    console.error('Error creating test order:', error);
  }
}

// Run the function
createTestOrder(); 