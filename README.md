# SnapCart 🛒

SnapCart is a full-stack e-commerce and delivery management platform built with **Next.js 15**, **MongoDB**, and **Socket.io**. It features real-time order tracking, role-based access control (Admin, User, Delivery Boy), and live location updates.

## 🚀 Features

### 🌟 Core Features
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Manage products, view orders, assign deliveries.
  - **User**: Browse products, add to cart, place orders, track delivery.
  - **Delivery Boy**: Accept/reject delivery tasks, update live location.
- **Real-Time Updates**: Powered by `Socket.io` for instant order status changes and location tracking.
- **Authentication**: Secure login/signup using `NextAuth.js` (Credentials & Google Provider).
- **Live Location Tracking**: Real-time delivery tracking using Leaflet maps.

### 🛠 Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, Framer Motion, Lucide React.
- **Backend**: Next.js API Routes, MongoDB (Mongoose).
- **Real-Time Server**: Node.js, Express, Socket.io.
- **State Management**: Redux Toolkit.
- **Maps**: Leaflet, React-Leaflet.

---

## 📂 Project Structure

The project consists of two main parts:
1. **`snapcart`**: The main Next.js application (Frontend + Backend API).
2. **`socketServer`**: A separate Node.js server for handling real-time WebSocket connections.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Database (Local or Atlas)

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd snapCartFolder
```

### 2️⃣ Setup Socket Server
Navigate to the `socketServer` directory and install dependencies:
```bash
cd socketServer
npm install
```

Create a `.env` file in `socketServer/` and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the socket server:
```bash
npm run dev
```
> The socket server will run on `http://localhost:4000`.

### 3️⃣ Setup Main Application (SnapCart)
Open a new terminal, navigate to the `snapcart` directory, and install dependencies:
```bash
cd snapcart
npm install
```

Create a `.env.local` file in `snapcart/` and add your environment variables:
```env
# Database
MONGO_URI=your_mongodb_connection_string

# Auth
AUTH_SECRET=your_auth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Socket & API
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:3000

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Start the Next.js application:
```bash
npm run dev
```
> The application will run on `http://localhost:3000`.

---

## 🔑 Usage Guide

### 1. Admin Setup
There are **no hardcoded admin credentials**. To become an admin:
1. Register a new account at `/register`.
2. If no admin exists in the database, you will be prompted to select a role.
3. Choose **Admin** and complete the setup.

### 2. User & Delivery Boy
- **Users** can sign up and start shopping immediately.
- **Delivery Boys** can be assigned by the Admin or select the role during signup if enabled.

### 3. Real-Time Flow
- When a User places an order, the Admin receives a notification.
- The Admin assigns a Delivery Boy.
- The Delivery Boy receives a request to Accept/Reject.
- Once accepted, the User can track the Delivery Boy's location in real-time.

---

## 📜 Scripts

### `snapcart` (Next.js)
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Starts the production server.
- `npm run lint`: Runs ESLint.

### `socketServer` (Node.js)
- `npm run dev`: Starts the socket server with Nodemon.

---

## 🤝 Contributing
Feel free to submit issues and pull requests to improve the project!
