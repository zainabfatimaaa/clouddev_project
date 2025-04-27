# Restaurant Management System - Setup Guide

This guide will help you set up the Restaurant Management System with DynamoDB.

## Prerequisites

- Node.js and npm installed
- AWS CLI installed and configured with appropriate credentials

## Setup Options

You can set up the application using one of the following methods:

### Option 1: Using Setup Scripts (Recommended)

#### For Unix/Linux/macOS:

1. Make the setup script executable:
   ```bash
   chmod +x setup.sh
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

#### For Windows:

1. Run the setup batch file:
   ```
   setup.bat
   ```

The setup scripts will:
- Install dependencies
- Create DynamoDB tables
- Load sample data
- Start the application

### Option 2: Manual Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create DynamoDB tables:
   ```
   npm run setup-db
   ```

3. Load sample data:
   ```
   npm run load-sample-data
   ```

4. Start the application:
   ```
   npm run dev
   ```

## Accessing the Application

Once the setup is complete, you can access the application at:

```
http://localhost:5000
```

The React frontend will be available at:

```
http://localhost:3000
```

## Troubleshooting

If you encounter any issues during setup:

1. Ensure AWS credentials are properly configured
2. Check that all required ports are available
3. Verify Node.js and npm are installed correctly

For more detailed information about the DynamoDB configuration, refer to the [README-DYNAMODB.md](./README-DYNAMODB.md) file.