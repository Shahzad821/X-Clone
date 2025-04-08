# Twitter Clone

This is a full-stack Twitter clone featuring modern frontend and backend technologies. It includes user authentication, real-time messaging, notifications, and more.

---

## Project Structure

### Backend (`api/`)

Built with **Node.js**, **Express**, and **MongoDB**, this backend provides RESTful APIs and real-time functionalities.

**Key Features:**
- User authentication (JWT-based)
- Post creation, liking, commenting
- Real-time chat with Socket.io
- Notifications system
- File uploads with Cloudinary

**Folder Structure:**
```
api/
├── server.js                  # Entry point
├── config/
│   └── db.js                  # MongoDB config
├── controllers/              # API logic
│   ├── auth.controller.js
│   ├── conversation.controller.js
│   ├── notification.controller.js
│   ├── post.controller.js
│   └── user.controller.js
├── middleware/
│   ├── errorMiddleware.js    # Error handler
│   └── verifyUser.js         # Auth middleware
├── models/                   # Mongoose schemas
│   ├── auth.model.js
│   ├── post.model.js
│   ├── conversation.model.js
│   ├── message.model.js
│   └── notification.model.js
├── routers/                  # Express routes
│   ├── auth.router.js
│   ├── post.router.js
│   ├── user.router.js
│   ├── notification.router.js
│   └── message.router.js
├── socket/
│   └── socket.js             # Socket.io logic
└── utils/
    ├── cloudinary.js         # Cloudinary config
    ├── emailTemplate.js      # Email formatting
    └── errorhandler.js       # Error utilities
```

### Frontend (`client/`)

Built with **React**, **Vite**, and **TailwindCSS**, this frontend provides a clean and responsive interface.

**Key Features:**
- Modern and responsive UI
- Redux Toolkit for state management
- Axios for API calls
- React Query for data fetching
- Real-time chat and notifications

**Folder Structure:**
```
client/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── public/
│   ├── avatar-placeholder.png
│   ├── avatars/
│   └── posts/
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    ├── AuthProvider/
    ├── components/
    ├── Hooks/
    ├── pages/
    ├── ReduxStore/
    ├── Store/
    └── utils/
```

---

## Features Overview

### Backend
- 🔐 JWT Authentication
- 📝 Post CRUD + Likes + Comments
- 🔔 Notifications (real-time)
- 💬 Real-Time Chat (Socket.io)
- ☁️ Cloudinary File Uploads

### Frontend
- 💻 Fully Responsive Design (TailwindCSS)
- 🔄 Global State Management (Redux Toolkit)
- 🌐 API Integration with Axios
- 🚀 Real-Time Updates (React Query + Socket.io)

---

## Installation Guide

### Prerequisites
- Node.js (LTS)
- MongoDB (local or cloud)
- Cloudinary account

### Backend Setup
```bash
cd api
npm install
```
Create a `.env` file inside the `api/` folder:
```env
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend Setup
```bash
cd client
npm install
```
To start the development server:
```bash
npm run dev
```

---
