import { Menu, createTables } from './models/dynamodb-models.js';
import { v4 as uuidv4 } from 'uuid';

// Sample menu items to add
const menuItems = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99
  },
  {
    name: "Pepperoni Pizza",
    description: "Traditional pizza with tomato sauce, mozzarella, and pepperoni",
    price: 14.99
  },
  {
    name: "Veggie Burger",
    description: "Plant-based patty with lettuce, tomato, and special sauce",
    price: 10.99
  },
  {
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, cheese, and special sauce",
    price: 11.99
  },
  {
    name: "Caesar Salad",
    description: "Romaine lettuce, croutons, parmesan cheese with Caesar dressing",
    price: 8.99
  },
  {
    name: "Greek Salad",
    description: "Tomatoes, cucumbers, olives, feta cheese with olive oil",
    price: 9.99
  },
  {
    name: "Chocolate Cake",
    description: "Rich chocolate cake with chocolate frosting",
    price: 6.99
  },
  {
    name: "Cheesecake",
    description: "New York style cheesecake with graham cracker crust",
    price: 7.99
  }
];

// Function to add menu items
async function addMenuItems() {
  try {
    console.log("Ensuring DynamoDB tables exist...");
    await createTables();
    
    console.log("Adding menu items...");
    for (const item of menuItems) {
      const id = uuidv4();
      await Menu.create({
        id,
        name: item.name,
        description: item.description,
        price: item.price
      });
      console.log(`Added menu item: ${item.name}`);
    }
    
    console.log("All menu items added successfully!");
  } catch (error) {
    console.error("Error adding menu items:", error);
  }
}

// Run the function
addMenuItems(); 