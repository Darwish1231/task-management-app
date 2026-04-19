# TaskHub - Contextual Task Management System

TaskHub is a modern, full-stack task management application that intelligently enriches your workflow by integrating with GitHub issues and providing architectural insights from Hacker News.

## 🚀 Project Overview

Most task managers are isolated silos. TaskHub bridges the gap between your TODO list and your external development ecosystem. 
- **GitHub Sync**: Automatically adjust task status and priority by linking to a GitHub issue path.
- **Contextual Insights**: Get real-time architectural news and stories related to your task's subject matter.
- **Glassmorphism UI**: A premium, responsive design focused on productivity and aesthetics.

---

## 🛠 Tech Stack

### Backend
- **Node.js & Express**: Fast, unopinionated web framework.
- **MongoDB & Mongoose**: Flexible NoSQL database with schema-based modeling.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Express-Validator**: Clean, schema-based request validation.
- **Axios**: Promised-based HTTP client for external API integrations.

### Frontend
- **React (Vite)**: Modern frontend library with a lightning-fast build tool.
- **React Context API**: Centralized state management for authentication.
- **Vanilla CSS**: Bespoke styling with CSS variables for a custom design system.
- **Lucide React**: Clean and consistent iconography.

---

## 📂 Folder Structure

The project follows a modular, service-oriented architecture for maximum separation of concerns:

### Backend (`/backend`)
- `src/controllers/`: Orchestrates request handling and response formatting.
- `src/services/`: Contains core business logic and external API integrations.
- `src/validators/`: Defines strict schemas for input validation.
- `src/models/`: Mongoose schemas and database models.
- `src/middleware/`: Global error handling and security (Auth).
- `src/utils/`: Shared utilities like the memory cache.

### Frontend (`/frontend`)
- `src/pages/`: Main application views (Dashboard, Login, Register).
- `src/components/`: Reusable UI elements (TaskCard, Navbar, TaskForm).
- `src/context/`: Authentication and global state provider.
- `src/services/`: API client configuration for backend communication.

---

## ⚙️ How to Run

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas Cluster)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Run the server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Run the development server:
```bash
npm run dev
```


---

## 🌐 External APIs Used

1. **GitHub API**: Used to fetch issue metadata (status, labels, title).
   - *Why*: To allow developers to link their tasks directly to their code repository issues, enabling automatic status updates in TaskHub when an issue is closed on GitHub.
2. **Algolia HackerNews API**: Used to fetch relevant architectural stories.
   - *Why*: To provide "contextual enrichment." If a user creates a task about "PostgreSQL Optimization," the app suggests reading contemporary articles on that specific topic to help them work better.

---

## ⚠️ Known Limitations
- **Memory Cache**: The backend uses an in-memory cache for API results. This cache is cleared whenever the server restarts.
- **Stateless Auth**: Uses basic JWT. In a production environment, Refresh Tokens and Revocation Lists would be recommended.
- **Limited Offline Support**: Requires a persistent connection for external API enrichment.

---

## 🔮 Future Improvements (With More Time)
- **Redis Integration**: Move from memory-cache to Redis for persistent, distributed caching.
- **Real-time Updates**: Implement Socket.io to reflect changes across multiple tabs instantly.
- **Unit & Integration Testing**: Expand coverage for services and controllers using Jest.
- **Team Collaboration**: Add the ability to share tasks and projects with other users.
- **PWA Support**: Transform the app into a Progressive Web App for true mobile-native experience.
