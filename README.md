# QuickTasks

**QuickTasks** is a Trello-inspired team task management app designed to help users organize and track their tasks using drag-and-drop lists. It emphasizes board ownership, user permissions, and flexible task organization.

Built to practice full-stack development with authentication, access control, real-time-like task movement, and relational data modeling.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [API Overview](#api-overview)
* [Frontend Overview](#frontend-overview)
* [Backend Overview](#backend-overview)
* [Challenges Faced](#challenges-faced)
* [Future Improvements](#future-improvements)

---

## Features

* **Board Ownership**: Users can create boards and invite others with customizable permissions (edit/delete).
* **Nested Structure**: Boards → Lists → Tasks, with ordered positioning logic.
* **Role-Based Permissions**: Board owners, editors, and viewers can only perform actions they are allowed to.
* **Task Management**: Create, rename, move, delete tasks and lists.
* **Drag-and-Drop (dnd-kit)**: Tasks can be reordered within lists using a smooth drag-and-drop UI.
* **API Testing**: Backend endpoints tested using Postman.

---

## Tech Stack

### Frontend

* **React** (with **TypeScript**)
* **dnd-kit** – for drag-and-drop task reordering
* **Axios** – for making HTTP requests

### Backend

* **Node.js** + **Express** (with **TypeScript**)
* **Prisma ORM** – database access
* **Zod** – server-side input validation
* **JWT** – authentication system
* **CORS**, **bcrypt** for cross-origin and password hashing

### Database & Tools

* **PostgreSQL** (via Docker)
* **Docker** – containerized Postgres + dev environment
* **Postman** – for backend API testing and debugging

---

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/milljo3/quicktasks.git
   cd quicktasks/server
   ```

2. Create a `.env` file:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/quicktasks"
   JWT_SECRET=your-jwt-secret
   PORT=5003
   POSTGRES_USER=username
   POSTGRES_PASSWORD=password
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start PostgreSQL in Docker:

   ```bash
   docker-compose up
   ```

5. Run migrations and seed:

   ```bash
   npx prisma migrate dev
   ```

6. Start the backend:

   ```bash
   npm run dev
   ```

### Frontend Setup

1. Go to the client directory:

   ```bash
   cd ../client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

The app should be available at `http://localhost:5173`.

---

## API Overview

### Board Routes

* `GET /api/boards/` – Get boards current user has access to
* `POST /api/boards/` – Create a board
* `PATCH /api/boards/:boardId` – Update board title
* `DELETE /api/boards/:boardId` – Delete board (owner only)
* `POST /api/boards/:boardId/lists` – Create list in board
* `GET /api/boards/:boardId` – Get board with all lists and tasks
* `GET /api/boards/:boardId/users` – Get users and permissions
* `POST /api/boards/:boardId/share` – Add user to board with permissions
* `PATCH /api/boards/:boardId/share/:userId` – Update user permissions (owner only)
* `DELETE /api/boards/:boardId/share/:userId` – Remove user from board (owner only)

### List Routes

* `PATCH /api/lists/:listId` – Rename a list
* `DELETE /api/lists/:listId` – Delete list
* `POST /api/lists/:listId/tasks` – Add task to list

### Task Routes

* `PATCH /api/tasks/:taskId/reorder` - Reorder tasks in list
* `PATCH /api/tasks/:taskId` – Edit task
* `DELETE /api/tasks/:taskId` – Delete task

---

## Frontend Overview

* Built with **React + TypeScript**
* Used **dnd-kit** to reorder tasks within a list
* API requests made using **Axios**
* Each board has a dynamic route like `/boards/:id`
* Secure JWT token stored locally for authentication

---

## Backend Overview

* **Prisma ORM** handles complex data relationships like:

  * `User ↔ BoardUser ↔ Board`
  * `Board → List → Task`
* Middleware guards routes by checking:

  * Auth token
  * Board ownership/edit access
* **Zod** validates request bodies for robust and consistent input handling

---

## Challenges Faced

* **dnd-kit**: Learning how to handle drag-and-drop in a performant and smooth way was challenging but rewarding. Keeping DOM state in sync with server-side position logic was tricky.
* **Task Positioning**: Creating a gap-based positioning system for sorting and reordering tasks/lists while avoiding re-indexing everything was an interesting logic challenge.
* **Permission Management**: Implementing and enforcing role-based access throughout the API added necessary complexity and real-world security practices.
* **Postman Testing**: Helpful for debugging and validating server logic quickly before frontend integration.

---

## Future Improvements

* **Drag Tasks Across Lists**: Right now, drag-and-drop only works within a single list.
* **Real-Time Sync**: Add WebSocket support for collaborative updates.
* **UI Enhancements**: Add better theming, animations, and mobile responsiveness.
* **Task Labels & Deadlines**: Add richer metadata to tasks.
* **Search and Filtering**: Search across tasks or filter by board/list.
* **Error handling**: Handle rollback logic for all api calls and let users know why an action they took was canceled.
* **Testing**: Introduce unit and integration tests for backend routes and frontend behavior.

---

## Conclusion

**QuickTasks** was a significant step forward in building a structured, team-friendly productivity tool with real-world architecture. It demonstrates full-stack competency in authentication, relational DB modeling, permissions, and frontend interactivity.

> I learned a lot through this project — especially about drag-and-drop mechanics, permission systems, and backend organization using Express and Prisma.
