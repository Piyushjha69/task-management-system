# Task Management System

A full-stack task management application with a Node.js/Express backend and Next.js frontend, using PostgreSQL as the database.

**Repository**: https://github.com/Piyushjha69/task-management-system.git

## Project Structure

```
task-management-system/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── controller/      # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API route definitions
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── service/         # Business logic
│   │   ├── utils/           # Helper utilities
│   │   └── index.ts         # Application entry point
│   ├── prisma/              # Database schema & migrations
│   ├── docker-compose.yml   # PostgreSQL setup
│   └── package.json
│
├── frontend/         # Next.js application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   └── package.json
│
└── render.yaml      # Render deployment config
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **Docker** (for local PostgreSQL, or install PostgreSQL directly)
- **Git**

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Piyushjha69/task-management-system.git
cd task-management-system
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Database Setup (PostgreSQL)

**Option A: Using Docker Compose** (Recommended)

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the following credentials:
- **Host**: localhost
- **Port**: 5432
- **Username**: app_user
- **Password**: app_password
- **Database**: task_management

**Option B: Manual PostgreSQL Installation**

If you have PostgreSQL installed locally, create a database:

```bash
createdb task_management
```

#### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://app_user:app_password@localhost:5432/task_management?schema=public"
ACCESS_TOKEN_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
PORT=5000
```

#### Generate Prisma Client

```bash
npx prisma generate
```

#### Run Database Migrations

```bash
npx prisma migrate dev --name init
```

#### Start Backend Server

```bash
npm run dev
```

The backend will run at `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will run at `http://localhost:3000`

## API Endpoints

### Authentication

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login user
- **POST** `/auth/refresh` - Refresh access token
- **POST** `/auth/logout` - Logout user

### Tasks

- **GET** `/tasks` - Get all tasks (paginated, filterable)
- **POST** `/tasks` - Create a new task
- **GET** `/tasks/:id` - Get task by ID
- **PATCH** `/tasks/:id` - Update task
- **DELETE** `/tasks/:id` - Delete task
- **PATCH** `/tasks/:id/toggle` - Toggle task status

## Scripts

### Backend

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript
npm start        # Run production build
```

### Frontend

```bash
npm run dev      # Start Next.js development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Technology Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin requests

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Database Schema

### User Model
- `id` - UUID primary key
- `name` - User's name
- `email` - Unique email
- `password` - Hashed password
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Task Model
- `id` - UUID primary key
- `title` - Task title
- `status` - Enum (PENDING, IN_PROGRESS, COMPLETED)
- `userId` - Foreign key to User
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
