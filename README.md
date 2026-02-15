# 🎫 BellCrop Event Management Platform

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

> A modern, full-stack application for discovering, hosting, and managing events seamlessly. Built with the robust MERN stack, offering real-time search, secure authentication, and a personalized user dashboard.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About the Project

**BellCrop Event Management** is a comprehensive platform designed to bridge the gap between event organizers and attendees. Whether you're looking for a local music festival, a tech workshop, or a food tasting event, BellCrop provides an intuitive interface to browse, filter, and register for experiences that matter to you.

The application focuses on performance, user experience, and secure data handling, ensuring a smooth journey from "Discovery" to "Registration".

---

## ✨ Key Features

### 🔍 **Smart Discovery**
*   **Real-time Search:** Instantly find events by name, location, or keyword.
*   **Dynamic Filtering:** Filter events by category (Music, Tech, Workshops, etc.) and date.
*   **Responsive Grid:** Beautifully designed event cards with hover effects and key details.

### 🔐 **Secure & Personalized**
*   **User Authentication:** Secure Sign Up and Login using **JWT** and **BCrypt**.
*   **Protected Routes:** Only authenticated users can access registration features.
*   **User Dashboard:** A personalized hub to view:
    *   **Upcoming Events:** Track what's next on your calendar.
    *   **Past History:** A digital memory lane of attended events.

### ⚡ **Event Management**
*   **Registration System:** Real-time capacity checks ensure events don't get overbooked.
*   **Cancellation:** Users can easily cancel registrations, freeing up spots for others.
*   **Visual Status:** Progress bars indicating how full an event is (e.g., "Sold Out", "80% Full").

---

## 🛠 Tech Stack

This project uses the **MERN** architecture for a unified JavaScript development experience.

| Area | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React.js (Vite)** | High-performance UI rendering |
| | **Tailwind CSS** | Utility-first styling for responsive design |
| | **Framer Motion** | Silky smooth animations and transitions |
| | **Lucide React** | Modern, consistent iconography |
| **Backend** | **Node.js** | Scalable server-side execution |
| | **Express.js** | RESTful API framework |
| | **JSON Web Token** | Stateless authentication |
| **Database** | **MongoDB** | NoSQL database for flexible data schemas |
| | **Mongoose** | ODM for rigorous data modeling |

---

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
*   Node.js (v14 or higher)
*   npm or yarn
*   MongoDB Atlas Account (or local MongoDB)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://https://github.com/Gudapavansai/BellcorpEventManagementApplication.git
    cd BellcorpEventManagementApplication
    ```

2.  **Install Dependencies**
    *   **Server:**
        ```bash
        cd server
        npm install
        ```
    *   **Client:**
        ```bash
        cd ../client
        npm install
        ```

3.  **Configure Environment Variables**
    Create a `.env` file in the `server` directory (see [Environment Variables](#-environment-variables)).

4.  **Run the Application**
    *   **Start Backend:**
        ```bash
        cd server
        npm start
        ```
        *(Server runs on port 5001)*

    *   **Start Frontend:**
        ```bash
        cd client
        npm run dev
        ```
        *(Client runs on port 5173 or similar)*

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `server` folder:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bellcrop_db
JWT_SECRET=your_super_secret_key_123
```

> **Note:** Never commit your `.env` file to version control.

---

## 📡 API Endpoints

The backend exposes the following RESTful endpoints:

### Auth
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Authenticate user & get token
*   `GET /api/auth/me` - Get current user details

### Events
*   `GET /api/events` - Get all events (supports query params: search, category, etc.)
*   `GET /api/events/:id` - Get single event details
*   `POST /api/events` - Create a new event (Admin)

### Registrations
*   `POST /api/events/:id/register` - Register for an event
*   `DELETE /api/events/registration/:eventId` - Cancel registration
*   `GET /api/events/user/my-registrations` - Get logged-in user's registrations

---

## 🚀 Deployment Guide

This application is designed for a split-deployment model using **Vercel** for the frontend and **Render** for the backend.

### 1. Backend (Render)
1.  Connect your GitHub repository to [Render](https://render.com).
2.  Create a new **Web Service**.
3.  Set **Root Directory** to `server`.
4.  **Build Command:** `npm install`
5.  **Start Command:** `node server.js`
6.  **Environment Variables:**
    *   `MONGO_URI`: Your MongoDB Connection String.
    *   `JWT_SECRET`: A secure random string.
    *   `JWT_EXPIRE`: `30d`
    *   `NODE_ENV`: `production`

### 2. Frontend (Vercel)
1.  Connect your repository to [Vercel](https://vercel.com).
2.  **Framework Preset:** Vite
3.  **Root Directory:** `.` (Keep it at the base of the monorepo)
4.  **Build Command:** `npm run build`
5.  **Output Directory:** `client/dist`
6.  **Deployment Config:** Ensure `vercel.json` exists in the root folder as provided.

---

## 📂 Project Structure

```bash
BellcorpEventManagementApplication/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/          # Full page views (Home, Dashboard, Login)
│   │   ├── context/        # Context API (AuthContext)
│   │   └── App.jsx         # Main Application Component
│   └── ...
├── server/                 # Express Backend
│   ├── models/             # Mongoose Schemas (User, Event, Registration)
│   ├── routes/             # API Route Definitions
│   ├── middleware/         # Auth Middleware
│   ├── seeder.js           # Database Seeding Script
│   └── server.js           # Entry Point
└── README.md               # Project Documentation
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by Gudapavansai
</p>