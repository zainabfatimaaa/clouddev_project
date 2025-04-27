
# Exam 3 - MERN

For this exam you will be coding a **Restaurant Management System**.

Firstly, you should create the boiler for a MERN stack application with JavaScript for the backend and TypeScript for the frontend however you wish. This has already been covered in class as well as the assignment.

Quick link to Vite for the frontend [here](https://vitejs.dev/guide/).

Since the course is not meant to teach you the styling of a web page, a very bare-bones design guide with the `html` and `css` for the different pages and components in the frontend have been provided in the `Design` folder. You are responsible for splitting them into components for use in your app. These should be enough. However, if you want to add your own styling and/or components, feel free to do so. For those of you more experienced in web dev, feel free to use Tailwind CSS if you want to make any edits.

**Note:** Any `css` styling put in `index.css` in the React setup is global and applies across the app, so you may need to change some CSS class names in order to avoid clashes.

# Set Up

You can set up the backend and frontend structure however you like. You should be familiar with this after the assignment. You may also choose to consult the internet and pick up the boiler code from there.

# Restaurant Management System

The app will serve as a platform for the restaurant employees to manage orders as well as for customers to be able to order food from the restaurant.

It will consist of two user groups: **Customer** and **Employee**.
They will have their own respective page routes.

The app consists of the following pages:

- Home
- Sign Up
- Login
- Menu
- Profile
- Orders
- My Order

Of the above pages, both the **Customer** and **Employee** will see: Home, Login, Profile, and Menu where only the Profile page will have separate details.

The **My Order** and **Sign Up** pages are exclusive to **Customer**.
The **Orders** page is exclusive to **Employee**

The user groups should only be able to see their relevant pages.

A Navbar will be shown on top of each page except Login and Sign Up.

Make sure to display only the relevant options according to the scenario:

- Only Login and Sign Up buttons should be shown when the user is Logged Out.
- Login and Sign Up buttons should be hidden and the rest should be displayed (according to the user) when the user is Logged In.
- Orders button should only be shown to an Employee.

The design for all screens and the Navbar is provided in the design guide.

Unlike the assignment, the user will land on the Home page when they open the app and should **not be able to access the other pages** without signing up (for customers) or logging in (for both customers and employees).

### Home

This will be the landing page of the website before and after logging in or signing up. Every user will land here when they open the app.

### Sign Up

Only **Customer** will need to sign up for the application with their full name, password, and a unique username. The Customer will also have a **Role** field which will default to "Customer" or any other identifier you choose to indicate a Customer. The details need to be stored in MongoDB using Mongoose.

The username should be unique, and the user should be prompted to re-enter if it is not.

For ease, accounts for the **Employees** will be manually entered directly in the Database. They will have the exact same fields as the **Customer** with only the **Role** different.

### Login

Both **Customer** and **Employee** should be able to log in using their username and password.

### Menu

This page will contain a list of all the items of the menu. A JSON object with all the items is provided. The menu must be stored in the Database beforehand and fetched from there when this page is loaded.
The item cards will have a plus and a minus button used to control the quantity in the **shopping cart maintained using Redux**. Make sure that the minus button does not result in negative items in the shopping cart. The Customer should also not be able to post an order with an empty shopping cart.

### Profile

This page will show all the details of a user.

The following will be shown for both **Customers** and **Employees**: Name, Username, and Role.

The **Customer** will also be shown a list of all their orders, past and present regardless of the order's status.

### Orders

This page will **only be shown to Employees**. It will contain a list of all **currently pending** orders (i.e. Processing, Preparing, and Ready). Their list of statuses is given at the end.

This page will use sockets to receive all orders in real-time and update the status of an Order in real-time as well.

The Employee should be able to update the status of the order directly from the list.

### My Order

This page will **only be shown to Customers**. It will be displayed when they click on an order from their **Profile** with the complete details of their order (list of data given at the end). This page should use sockets to check for updates in the order's status in real-time.

## Necessary Details to Store in MongoDB

The list given here is the only data that will carry marks. You can, however, choose to add more fields for your implementation. But note that no additional marks will be given for that.

- User
	- Name
	- Username
	- Password
	- Role

- Menu
	- Item Name
	- Description
	- Price

- Order
	- All Menu Items and their quantities
	- Status (can be one of these 4: Processing, Preparing, Ready, Delivered)
	- Total Price
    - Ordered By (Should reference to Mongoose object of User)

The exact structure of the models is up to your discretion.

## Rules and Restrictions

- A shopping cart for the **Customer** must be maintained using Redux.
- Profile information except the Password should also be stored in Redux **for all users**.
- The shopping cart should reset after an order has been sent.
- Sockets must be used where mentioned.
- Some form of route protection for the user groups is necessary. It can be as simple as sending the username to the backend in every request to as complex as maintaining tokens.

**Failure to adhere to these rules will result in a deduction of marks**

## Grading Breakdown

- Correct sequence of pages - **5 Marks**
- Sign Up for Customers (Employee will incur deduction) - **10 Marks**
- Login for both Customers and Employees - **10 Marks**
- Some form of route protection for user groups - **5 Marks**
- Shopping Cart using Redux - **10 Marks**
- Checks on shopping cart - **5 Marks**
- Profile info using Redux (storing Password will incur deduction) - **5 Marks**
- Required Data stored in Database - **10 Marks**
- Correct usage of sockets in Orders page - **20 Marks**
- Correct usage of sockets in My Order page - **20 Marks**

**Total Marks: 100**

# Final Remarks

- After reading this manual, start by looking at the different pages provided in the Design Guide and understanding the workflow. This should resolve most questions.

- Feel free to change the frontend if you want to.

-----------------------------------------------------------------------------

And as always, **Happy Coding**!
