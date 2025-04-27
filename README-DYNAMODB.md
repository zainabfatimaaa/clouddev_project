# Restaurant Management System - DynamoDB Migration

This document outlines the migration of the Restaurant Management System from MongoDB to Amazon DynamoDB.

## Overview

The application has been updated to use Amazon DynamoDB instead of MongoDB for data storage. DynamoDB is a NoSQL database service that provides low-latency, high-throughput performance at any scale, making it ideal for this restaurant management system.

## Changes Made

1. Replaced MongoDB/Mongoose models with DynamoDB models
2. Updated the application logic to work with DynamoDB
3. Added setup scripts for DynamoDB tables
4. Updated dependencies to include AWS SDK

## Database Structure

The following DynamoDB tables have been created:

### Users Table
- Primary Key: `username` (String)
- Attributes:
  - `name` (String)
  - `password` (String)
  - `type` (String) - "Customer" or "Employee"

### Menu Table
- Primary Key: `id` (String)
- Attributes:
  - `name` (String)
  - `description` (String)
  - `price` (Number)

### Orders Table
- Primary Key: `id` (String)
- Attributes:
  - `order` (List) - Contains order items with name, description, price, and quantity
  - `status` (String) - One of: "Processing", "Preparing", "Ready", "Delivered"
  - `total` (Number)
  - `user` (String) - References the username in the Users table

## Setup Instructions

### Prerequisites

1. AWS CLI installed and configured with appropriate credentials
2. Node.js and npm installed

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create DynamoDB tables:
   ```
   node setup-dynamodb.js
   ```

3. Start the application:
   ```
   npm run dev
   ```

### AWS CLI Commands for Table Creation

Alternatively, you can create the tables directly using AWS CLI:

```bash
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
```

## DynamoDB Features Used

- **On-demand and auto-scaling mode**: Handles peak requests and orders efficiently
- **Global Secondary Index (GSI) and Local Secondary Index (LSI)**: Enables efficient searching for orders and customers
- **Continuous backups**: Ensures data safety in case of failures

## API Endpoints

The API endpoints remain the same as before, but now they interact with DynamoDB instead of MongoDB:

- POST `/login` - User login
- POST `/signup` - User registration (Customer only)
- POST `/order` - Place a new order
- GET `/my-orders/:username` - Get orders for a specific user
- GET `/all-orders/` - Get all orders (for Employees)
- GET `/menu` - Get the restaurant menu