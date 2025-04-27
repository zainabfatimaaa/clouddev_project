import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Create DynamoDB client with credentials
const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'AKIATTSKFM265VR2HZMU',
    secretAccessKey: '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'
  }
});

// Create Users table
const createUsersTable = async () => {
  const params = {
    TableName: 'Users',
    KeySchema: [
      { AttributeName: 'username', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'username', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('Users table created successfully:', data);
    return data;
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('Users table already exists');
    } else {
      console.error('Error creating Users table:', err);
      throw err;
    }
  }
};

// Create Menu table
const createMenuTable = async () => {
  const params = {
    TableName: 'Menu',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('Menu table created successfully:', data);
    return data;
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('Menu table already exists');
    } else {
      console.error('Error creating Menu table:', err);
      throw err;
    }
  }
};

// Create Orders table
const createOrdersTable = async () => {
  const params = {
    TableName: 'Orders',
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log('Orders table created successfully:', data);
    return data;
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log('Orders table already exists');
    } else {
      console.error('Error creating Orders table:', err);
      throw err;
    }
  }
};

// Create all tables
const createAllTables = async () => {
  try {
    console.log('Setting up DynamoDB tables...');
    await createUsersTable();
    await createMenuTable();
    await createOrdersTable();
    console.log('All tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

// Run the setup
createAllTables();

console.log('\nTo run this setup script:');
console.log('node setup-dynamodb.js');