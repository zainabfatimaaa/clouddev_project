import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

// Configure DynamoDB client with credentials
const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIATTSKFM265VR2HZMU',
    secretAccessKey: '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'
  }
});

const docClient = DynamoDBDocumentClient.from(client);

// Users model
export const Users = {
  // Create a new user
  async create(userData) {
    // Check if the Users table exists
    try {
      // Validate required fields
      if (!userData.username) {
        throw new Error('Username is required');
      }
      if (!userData.password) {
        throw new Error('Password is required');
      }
      if (!userData.type) {
        throw new Error('User type is required');
      }
      
      const params = {
        TableName: 'Users',
        Item: {
          username: userData.username,
          name: userData.name || '',
          password: userData.password,
          type: userData.type
        },
        // Ensure the username doesn't already exist
        ConditionExpression: 'attribute_not_exists(username)'
      };
      
      await docClient.send(new PutCommand(params));
      return { success: true };
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error(`Username '${userData.username}' already exists`);
      }
      console.error('Error creating user:', error);
      throw error;
    }
  },
  
  // Find a user by username and type
  async findOne(criteria) {
    // First try to get the user by the primary key (username)
    const getParams = {
      TableName: 'Users',
      Key: {
        username: criteria.username
      }
    };
    
    try {
      // First try direct get by key
      const getResult = await docClient.send(new GetCommand(getParams));
      
      // If we found a user and the type matches or no type was specified
      if (getResult.Item && (!criteria.type || getResult.Item.type === criteria.type)) {
        return getResult.Item;
      }
      
      // If direct get didn't work or type didn't match, fall back to scan
      const scanParams = {
        TableName: 'Users',
        FilterExpression: 'username = :username AND #type = :type',
        ExpressionAttributeNames: {
          '#type': 'type'
        },
        ExpressionAttributeValues: {
          ':username': criteria.username,
          ':type': criteria.type
        }
      };
      
      const scanResult = await docClient.send(new ScanCommand(scanParams));
      return scanResult.Items && scanResult.Items.length > 0 ? scanResult.Items[0] : null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
};

// Menu model
export const Menu = {
  // Create a new menu item
  async create(menuData) {
    const params = {
      TableName: 'Menu',
      Item: {
        id: Date.now().toString(), // Generate a unique ID
        name: menuData.name,
        description: menuData.description,
        price: menuData.price
      }
    };
    
    try {
      await docClient.send(new PutCommand(params));
      return { success: true };
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },
  
  // Find all menu items
  async find() {
    const params = {
      TableName: 'Menu'
    };
    
    try {
      const result = await docClient.send(new ScanCommand(params));
      return result.Items || [];
    } catch (error) {
      console.error('Error finding menu items:', error);
      throw error;
    }
  }
};

// Orders model
export const Orders = {
  // Create a new order
  async create(orderData) {
    const params = {
      TableName: 'Orders',
      Item: {
        id: Date.now().toString(), // Generate a unique ID
        order: orderData.order, // Array of order items with name, description, price, qty
        status: orderData.status || 'Processing',
        total: orderData.total,
        user: orderData.user
      }
    };
    
    try {
      await docClient.send(new PutCommand(params));
      return { success: true };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Find orders by username
  async find(criteria = {}) {
    console.log('Orders.find called with criteria:', JSON.stringify(criteria));
    
    try {
      let params;
      
      if (criteria && criteria.user) {
        // Find orders for a specific user
        console.log('Searching for orders by user:', criteria.user);
        params = {
          TableName: 'Orders',
          FilterExpression: '#usr = :user',
          ExpressionAttributeNames: {
            '#usr': 'user'
          },
          ExpressionAttributeValues: {
            ':user': criteria.user
          }
        };
      } else {
        // Find all orders
        console.log('Searching for all orders');
        params = {
          TableName: 'Orders'
        };
      }
      
      console.log('DynamoDB params:', JSON.stringify(params));
      const result = await docClient.send(new ScanCommand(params));
      console.log('DynamoDB result:', JSON.stringify(result));
      
      // Check if Items is undefined or null
      const items = result.Items || [];
      console.log(`Found ${items.length} orders`);
      
      return items;
    } catch (error) {
      console.error('Error in Orders.find:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      // Return empty array instead of throwing to make the API more resilient
      // We'll log the error but prevent it from crashing the API
      return [];
    }
  },
  
  // Update order status
  async updateStatus(orderId, newStatus) {
    console.log(`Updating order ${orderId} status to ${newStatus}`);
    
    try {
      // First, check if the order exists
      console.log(`Checking if order ${orderId} exists`);
      const getParams = {
        TableName: 'Orders',
        Key: {
          id: orderId
        }
      };
      
      const existingOrder = await docClient.send(new GetCommand(getParams));
      
      if (!existingOrder.Item) {
        console.error(`Order ${orderId} not found`);
        return null;
      }
      
      console.log(`Order found:`, existingOrder.Item);
      
      // Now update the order
      const params = {
        TableName: 'Orders',
        Key: {
          id: orderId
        },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': newStatus
        },
        ReturnValues: 'ALL_NEW'
      };
      
      console.log(`Sending update command with params:`, JSON.stringify(params));
      const result = await docClient.send(new UpdateCommand(params));
      console.log(`Update command result:`, JSON.stringify(result));
      
      return result.Attributes;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      console.error(`Error name: ${error.name}, message: ${error.message}`);
      
      // Return the error details to help with debugging
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }
};

// Function to create DynamoDB tables if they don't exist
export const createTables = async () => {
  console.log('Note: Tables should be created using AWS CLI or AWS Console');
  console.log('Example AWS CLI commands to create tables:');
  console.log(`
  # Create Users table
  aws dynamodb create-table \
    --table-name Users \
    --attribute-definitions AttributeName=username,AttributeType=S \
    --key-schema AttributeName=username,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

  # Create Menu table
  aws dynamodb create-table \
    --table-name Menu \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

  # Create Orders table
  aws dynamodb create-table \
    --table-name Orders \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
  `);
};