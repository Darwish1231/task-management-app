# FlowTask - Intelligent Task Management

## 📖 Project Overview
FlowTask is a full-stack, responsive task management platform designed with technical users in mind. It securely facilitates creating, tracking, and prioritizing tasks (Todo, Doing, Done). Beyond standard CRUD operations, FlowTask stands out by intelligently bridging internal tasks with external data spaces. Entering a GitHub Issue linkage into a task will dynamically auto-resolve its priority and status based on the real-world Repository state, whilst seamlessly fetching insightful HackerNews architecture articles specific to your task's custom terminology.

## 🛠 Tech Stack Explanation
- **Frontend**: `React` (Functional Components + Hooks) powered by `Vite` for lightning-fast HMR and optimized builds. View state transitions safely through Context API.
- **Backend / API**: `Node.js` & `Express.js` implementing a strictly separated Service / Controller enterprise architecture.
- **Database**: `MongoDB Atlas` (Cloud) utilizing `Mongoose` schema validations for rigid data consistency and persistent scalable storage.
- **Security**: Stateless JSON Web Tokens (`JWT`) handle custom Route Protection limits and inject via Axios Interceptors.
- **Styling**: Vanilla modern CSS leveraging root variables and striking "Glassmorphism" design standards, ensuring clean scaling without bloated tailwind configurations.

## 🚀 Environment Setup & Execution

### How to run the Backend
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Establish your environment: Create a `.env` file in the `backend` folder containing:
   ```env
   PORT=5001
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=your_mongodb_atlas_connection_string
   ```
4. Start the Node.js server:
   ```bash
   npm run dev
   ```
*(The backend will be actively listening on `http://localhost:5001`)*

### How to run the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*(Access the interface securely natively at `http://localhost:5173`)*

## 🔗 External APIs Used and Why
To fulfill the complex intelligent logic constraint, the system integrates concurrent communication with two distinct APIs.
1. **GitHub API (`api.github.com/repos/...`)**:
   - **Why**: Used to enforce "Deep Sync" priority workflow mechanics.
   - **Impact**: When an issue link is attached to a task, the platform checks its state and tags. If the issue is marked as 'Closed' online, our MongoDB Backend instantly automatically updates the Task Status permanently to `Done`. If the issue possesses 'Bug/Urgent/Critical' tags, the Task automatically elevates forcefully to `High` Priority.
2. **Algolia HackerNews API (`hn.algolia.com`)**:
   - **Why**: To provide "Meaningful Contextual Insights". Developer tasks are historically knowledge-intensive and context relies on external sources.
   - **Impact**: Based on clever keyword algorithms extracting values from the Task Title (ignoring generic stop words implicitly), the app fetches and rigidly maps the top 3 contextual tech articles. By strictly mapping properties, it enforces "Data Normalization", storing only strictly needed `{ headline, url }` pairs preventing dump clustering entirely.

*All APIs benefit from native LRU **In-Memory Caching** (`utils/cache.js`) preventing rate limit exhaustions, and utilize **Graceful Fallbacks** ensuring 5xx Upstream errors never crash the task creation application endpoints.*

## 📂 Folder Structure Explanation

```text
Graded-Technical-Assignment/
├── docker-compose.yml       # Orchestrates the container instances
├── backend/                 # Node.js Express API Area
│   ├── src/
│   │   ├── controllers/     # Abstract Route logic handling (Clean separation)
│   │   ├── middleware/      # Auth validation & Centralized Error Handlers
│   │   ├── models/          # Mongoose DB schemas definitions
│   │   ├── routes/          # Express API route configurations
│   │   ├── services/        # External logic isolation (GitHub, News scraping)
│   │   ├── utils/           # Native utility algorithms (In-Memory LRU Cache)
│   │   └── server.js        # Core App & DB Pipeline initialization
│   ├── tests/               # Jest Unit Testing environment suite
│   ├── Dockerfile           # Backend container blueprint
│   └── package.json         # Package definitions
├── frontend/                # React Vite UI Area
│   ├── src/
│   │   ├── components/      # Reusable functional blocks (TaskCard, Navbar)
│   │   ├── context/         # Auth Provider state tracking logic
│   │   ├── pages/           # Modular view layouts (Login, Register, Dashboard)
│   │   ├── services/        # Axios configurations & Core Interceptors bindings
│   │   ├── App.jsx          # Protected dynamic routing logic entrypoint
│   │   └── index.css        # Theme Variables and Glassmorphism styling
│   ├── Dockerfile           # Optimized multi-stage NGINX logic format
│   └── package.json         # Packages
```

## ⚠️ Known Limitations
- The JWT implementation operates seamlessly statelessly without an active dedicated Redis-based blacklist logic schema, preventing robust server-controlled global session revocation logouts across infinite devices before baseline expiration.
- To optimally preserve rapid execution speed mitigating GitHub/Algolia rate limits natively, endpoints are highly cached safely natively. Very fast-changing breaking technical trends context might experience a localized buffer delay of ~10 minutes.
- Automated API state syncing logic operates responsively upon user-facing Data Requests (`getTasks`), rather than through global Background Node.js Cronjobs.

## 🚀 What I would improve with more time
1. **GitHub App Webhook Streaming**: Transition GitHub synchronous polling mechanics to an active GitHub App Webhook Integration. Instead of implicitly updating task priorities conditionally upon generic GET requests blindly, it would push Real-Time MongoDB status mutations instantly accurately when a foreign Issue is closed independently.
2. **Refresh Token Mechanics Pipeline**: Introduce advanced robust short-lived Access Tokens paired intimately with robust long-lived HTTPOnly Cookie Refresh Tokens maximizing comprehensive scaling security vectors.
3. **Advanced Optimistic Drag-and-Drop (DnD)**: Refactor the traditional fluid Dashboard UI configuration utilizing vertical Kanban columns structurally, safely integrating `react-beautiful-dnd` to powerfully permit intuitively dragging generic task cards fluidly between Status sections.
4. **CI/CD Integration Action Engines**: Formally utilize generic Docker containers paired beautifully natively with actual temporary localized dummy databases initialized using `mongodb-memory-server` uniformly for Jest coverage assertions securely executed natively within GitHub Actions on branches.
