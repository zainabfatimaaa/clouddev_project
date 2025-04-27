import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Create DynamoDB client
const client = new DynamoDBClient({ region: 'us-east-1' });

// Create DynamoDB Document client (provides a higher-level abstraction)
const docClient = DynamoDBDocumentClient.from(client);

export { docClient };