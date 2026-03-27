# 🌟 Complaint Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

A comprehensive, full-stack digital platform designed to streamline the process of submitting, tracking, and resolving complaints. This system provides a transparent and efficient workflow for users, officers, and administrators, ensuring timely resolution and data-driven insights.

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🚀 Usage](#-usage)
- [🖼️ Screenshots / Demo](#️-screenshots--demo)
- [🔌 API Integration](#-api-integration)
- [🔮 Future Improvements](#-future-improvements)
- [👤 Author](#-author)

---

## ✨ Features

- **🔐 Secure Authentication**: Role-based access control (User, Officer, Admin) using JWT and Bcrypt encryption.
- **📝 User Portal**: 
    - Submit detailed complaints with title, description, category, and priority levels.
    - Real-time status tracking of submitted complaints.
    - View personal complaint history.
- **👮 Officer Dashboard**:
    - Dedicated queue for assigned complaints.
    - Update complaint status (Pending, In Progress, Resolved, Closed).
    - Manage workload efficiently.
- **📊 Admin Panel**:
    - **Global Overview**: Monitor all complaints across the system.
    - **User Management**: View and manage all registered users and their roles.
    - **Analytics**: Visualized data insights including complaints by category, status, and priority.
- **📱 Responsive UI**: Modern and clean interface built with React and custom CSS, optimized for various screen sizes.
- **📁 Efficient Data Storage**: Lightweight and fast data management using SQLite.

---

## 🛠️ Technologies Used

### Frontend
- **React.js (v19)**: Component-based UI development.
- **Vite**: Ultra-fast build tool and development server.
- **React Router DOM**: Declarative routing for the application.
- **CSS3**: Custom styling for a professional look and feel.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework for building the RESTful API.
- **Better-SQLite3**: Fast and reliable SQLite3 driver for Node.js.
- **JWT (JSON Web Tokens)**: Secure user authentication and session management.
- **Bcrypt.js**: Password hashing for enhanced security.

---

## 📂 Project Structure

```text
.
├── client/                 # Frontend React Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth and Global State context
│   │   ├── pages/          # Page views (Dashboard, Admin, etc.)
│   │   ├── services/       # API service layers
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Authentication and error handlers
│   │   ├── routes/         # API endpoints (Auth, Complaints, etc.)
│   │   └── index.js        # Server entry point
│   ├── package.json
├── data/                   # SQLite Database storage
└── README.md               # Project Documentation
```

---

## ⚙️ Installation & Setup

Follow these steps to get the project running locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (Node Package Manager)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/Complaint-Management-Process.git
cd Complaint-Management-Process
```

### Step 2: Backend Setup
```bash
cd server
npm install
```

### Step 3: Frontend Setup
```bash
cd ../client
npm install
```

---

## 🚀 Usage

### Running the Project

1. **Start the Backend Server**:
   ```bash
   # From the 'server' directory
   npm start
   ```
   The server will start on `http://localhost:3001`.

2. **Start the Frontend Development Server**:
   ```bash
   # From the 'client' directory
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Default Roles & Access
- **User**: Can submit and track their own complaints.
- **Officer**: Can view and manage assigned complaints.
- **Admin**: Has full access to user management and analytics.

---

## 🖼️ Screenshots / Demo

### 🖥️ Desktop View
> ![Landing Page Placeholder](https://via.placeholder.com/800x450?text=Landing+Page+Preview)
> *The modern landing page welcoming users to the platform.*

### 📊 Analytics Dashboard
> ![Admin Dashboard Placeholder](https://via.placeholder.com/800x450?text=Admin+Analytics+Preview)
> *Comprehensive analytics for administrators to monitor system performance.*

---

## 🔌 API Integration

The system uses a custom RESTful API for all operations:

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Complaints**: `/api/complaints` (GET, POST, PUT, DELETE)
- **Dashboard**: `/api/dashboard/stats`, `/api/dashboard/by-status`, `/api/dashboard/by-category`

All protected routes require a valid JWT token in the `Authorization` header:
`Authorization: Bearer <your_token>`

---

## 🔮 Future Improvements

- **📧 Email Notifications**: Automated alerts for status updates and new assignments.
- **📎 File Attachments**: Support for uploading images or documents with complaints.
- **💬 Real-time Chat**: Direct communication between users and officers within a complaint.
- **📱 Mobile App**: Dedicated mobile application for on-the-go complaint submission.
- **🔍 Advanced Search**: Robust filtering and search capabilities for large datasets.

---

## 👤 Author

**Atharv Pokale**
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/atharv-pokale-dev/)

---

> 💡 **Tip**: Make sure to check the console for any server-side errors during setup. Ensure both the client and server are running simultaneously for the full experience.

