#!/bin/bash

# Restaurant Management System - DynamoDB Setup Script

echo "===== Restaurant Management System - DynamoDB Setup ====="
echo "This script will help you set up the DynamoDB environment for the restaurant management system."

# Function to handle errors
handle_error() {
  echo "Error: $1"
  exit 1
}

# Install dependencies
echo -e "\n[1/4] Installing dependencies..."
npm install || handle_error "Failed to install dependencies"

# Create DynamoDB tables
echo -e "\n[2/4] Creating DynamoDB tables..."
npm run setup-db || handle_error "Failed to create DynamoDB tables"

# Load sample data
echo -e "\n[3/4] Loading sample data..."
npm run load-sample-data || handle_error "Failed to load sample data"

# Start the application
echo -e "\n[4/4] Starting the application..."
echo "The application will now start. Press Ctrl+C to stop it."
echo -e "\nAccess the application at: http://localhost:5000"
npm run dev