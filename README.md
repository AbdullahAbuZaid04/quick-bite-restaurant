# Restaurant Ordering System (QuickBite)

<p align="center">
  <a href="https://iug-quick-bite-restaurant.vercel.app/"><strong>Explore the Live Demo »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS" />
  <img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
</p>

## Project Description  
**QuickBite** is a web-based restaurant ordering system that allows customers to browse the menu, place orders online, and track the status of their orders.

The system provides a simple and user-friendly interface where customers can select food items, add them to a cart, and confirm their orders. On the other hand, the admin can manage menu items (add, edit, delete) and monitor customer orders by updating their status (Pending, Preparing, Delivered).

The main goal of this project is to simplify the food ordering process and provide a clear and organized system for both customers and administrators.

---

## Features

### Customer Features
- **User Authentication:** Secure Login and Registration.
- **Menu Browsing:** Explore food categories and available meals.
- **Cart Management:** Add, update, or remove items easily.
- **Order Placement:** Fast checkout workflow.
- **Order Tracking:** Monitor order status in real-time.

### Admin Features
- **Dashboard:** Overview of the platform statistics.
- **Menu Control:** Full CRUD operations (Add/Edit/Delete) on categories and products.
- **Order Management:** Track and update status (Pending, Preparing, Delivered) for all clients.
- **User Management:** Monitor and delete user accounts.

---

## System Architecture

The system follows a classic **Client-Server Architecture**:

- **Frontend (Client):** Built using **React.js** and styled with **Tailwind CSS**, responsible for UI rendering and handling user interactions.
- **Backend (Server):** Built using **Node.js** and **Express.js**, managing business logic, authentication, and API endpoints.
- **Database:** **MySQL** stores relational data including users, categories, products, and orders.

*Communication between the client and server is handled via RESTful APIs.*

---

## Installation & Setup Instructions

### 1. Clone the repository  
```bash
git clone https://github.com/AbdullahAbuZaid04/quick-bite-restaurant.git
cd quick-bite-restaurant
```

### 2. Setup Backend 
1. Navigate to the folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root directory and configure your variables:
   ```env
   PORT=5000
   DB_HOST=your_db_host
   DB_PORT=your_db_port
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Setup Database  
1. Create a new database in your local MySQL instance named `quickbite_db`.
2. Import the `schema.sql` file located inside the `database` folder.
3. *(Optional)* Import `seed.sql` to populate the database with sample products and categories.

### 4. Setup Frontend  
1. Navigate to the folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

---

## Screenshots

### Auth Views

| Login Page | Register Page |
| :---: | :---: |
| <img src="screenshots/login-page.png" width="350"/> | <img src="screenshots/register-page.png" width="350"/> |

### Customer Experience

| Home Page | Menu Page |
| :---: | :---: |
| <img src="screenshots/customer-home-page.png" width="350"/> | <img src="screenshots/customer-menu-page.png" width="350"/> |

| Cart Page | Checkout Page | Order Success |
| :---: | :---: | :---: |
| <img src="screenshots/customer-cart-page.png" width="350"/> | <img src="screenshots/customer-checkout-page.png" width="350"/> | <img src="screenshots/customer-success-order-page.png" width="350"/> |

| Order Tracking |
| :---: |
| <img src="screenshots/customer-track-order-page.png" width="350"/> |

### Admin Dashboard & Management

| Analytics Dashboard | Orders Management |
| :---: | :---: |
| <img src="screenshots/admin-dashboard-page.png" width="350"/> | <img src="screenshots/admin-orders-page.png" width="350"/> |

| Products Management | Categories Management |
| :---: | :---: |
| <img src="screenshots/admin-menu-page.png" width="350"/> | <img src="screenshots/admin-categories-page.png" width="350"/> |

| Users Management |
| :---: |
| <img src="screenshots/admin-users-page.png" width="350"/> |

### CRUD Modals Overview

| Add Product | Edit Product | Delete Product |
| :---: | :---: | :---: |
| <img src="screenshots/admin-add-product-page.png" width="350"/> | <img src="screenshots/admin-edit-product-page.png" width="350"/> | <img src="screenshots/admin-delete-product-page.png" width="350"/> |

| Add Category | Edit Category | Delete Category |
| :---: | :---: | :---: |
| <img src="screenshots/admin-add-category-page.png" width="350"/> | <img src="screenshots/admin-edit-category-page.png" width="350"/> | <img src="screenshots/admin-delete-category-page.png" width="350"/> |

| Delete User Modal |
| :---: |
| <img src="screenshots/admin-delete-user-page.png" width="350"/> |

---

## Project Supervisors

This project was developed under the academic guidance and supervision of:
| **Prof. Hatem Hammad**|**Eng. Nour Saad** |
| :---: | :---: |
| Academic Supervisor | Lab & Technical Supervisor |

---

## Contributors

Our amazing team who built this project:

| <a href="https://github.com/AbdullahAbuZaid04"><img src="https://github.com/AbdullahAbuZaid04.png?size=80" width="80" height="80" alt="Abdullah AbuZaid" /></a> | <a href="https://github.com/Exception3010"><img src="https://github.com/Exception3010.png?size=80" width="80" height="80" alt="Hazem Oukal" /></a> | <a href="https://github.com/abd92003"><img src="https://github.com/abd92003.png?size=80" width="80" height="80" alt="Abdalkareem Abo Younis" /></a> | <a href="https://github.com/Abdallah0592330273"><img src="https://github.com/Abdallah0592330273.png?size=80" width="80" height="80" alt="Abdullah Al-Hindawi" /></a> |
| :---: | :---: | :---: | :---: |
| **[Abdullah AbuZaid](https://github.com/AbdullahAbuZaid04)** | **[Hazem Oukal](https://github.com/Exception3010)** | **[Abdalkareem Abo Younis](https://github.com/abd92003)** | **[Abdullah Al-Hindawi](https://github.com/Abdallah0592330273)** |
| Leader & Front-end | Back-end Developer | Back-end Developer | Database Developer |

---

<p align="center">
  <sub>Developed by QuickBite Team - © 2026 All Rights Reserved</sub>
  <br>
</p>

<p align="center">
  <a href="#restaurant-ordering-system-quickbite">
    <img src="https://img.shields.io/badge/Back%20To%20Top-⬆️-gray?style=flat-square" alt="Back to Top" />
  </a>
</p>