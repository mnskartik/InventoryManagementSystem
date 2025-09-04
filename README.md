MERN Stack Inventory Management System 📋
This is a comprehensive full-stack Inventory Management System built with the MERN (MongoDB, Express, React, Node.js) stack. It's designed to help users efficiently manage products, track inventory, and handle invoices.

🚀 Live Demo
You can view a live version of the application here: [https://inventory-management-system-6t0cwaw97-mnskartiks-projects.vercel.app/login]

✨ Features
Dashboard Analytics: An intuitive dashboard with charts and key metrics to visualize total products, invoices, sales, and revenue.

Product Management: A robust system to add, edit, and delete products, including details like categories and prices.

Inventory Tracking: Real-time stock monitoring with low-inventory alerts to prevent stockouts.

Invoice Management: Create, edit, and delete invoices. Invoices can be previewed with dynamic calculations for subtotal, tax, and total. You can also add products to an invoice and set quantities to automatically update the totals.

User Management: Users can manage their own details within the application's settings.

Responsive UI: The application is fully responsive and works seamlessly on both desktop and mobile devices.

User Authentication: Secure user authentication is implemented using JSON Web Tokens (JWT) to protect user data.

Search & Filtering: Easily find products and invoices with powerful search, filter, and sorting options.

🔑 Demo Credentials
Email: mom@gmail.com

Password: newStrongPassword

🛠️ Setup Instructions
To run this project locally, follow these steps:

Prerequisites
Node.js (v18 or higher)

MongoDB Atlas account or local MongoDB instance

1. Clone the repository
Bash

git clone https://github.com/mnskartik/Inventory-Management-System.git
cd Inventory-Management-System
2. Backend Setup
Navigate to the backend directory, install dependencies, and create a .env file.

Bash

cd backend
npm install
Create a .env file in the backend directory and add the following environment variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
Replace your_mongodb_connection_string with your MongoDB connection URI and your_jwt_secret with a strong, random string.

Start the backend server:

Bash

npm start
3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.

Bash

cd ../frontend
npm install
Create a .env file in the frontend directory and add the following:

REACT_APP_API_URL=http://localhost:5000
Start the frontend application:

Bash

npm start
The app will now be running on http://localhost:3000.
