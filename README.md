# VTECHSOFT Technology — Backend API

Express.js + MongoDB Atlas backend for VTECHSOFT Technology, providing authentication and blog APIs.

## Stack

- **Node.js** + **Express**
- **MongoDB Atlas** (Mongoose ODM)
- **JWT** for authentication
- **bcryptjs** for password hashing

## Setup

### 1. Install dependencies

```bash
cd vtechsoft-backend
npm install
```

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (free M0 tier is fine)
3. In **Database Access**, create a database user with password
4. In **Network Access**, add your IP address (or `0.0.0.0/0` for development)
5. Click **Connect** on your cluster and get the connection string

### 3. Create `.env` file

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/vtechsoft?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Important:** Generate a strong random string for `JWT_SECRET` in production.

### 4. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on **http://localhost:5000** by default.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| GET | `/api/auth/me` | Get current user | Bearer Token |

### Blog

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/blog` | Get all published posts | Public |
| GET | `/api/blog/:id` | Get single post | Public |
| POST | `/api/blog` | Create post | Admin |
| PUT | `/api/blog/:id` | Update post | Admin |
| DELETE | `/api/blog/:id` | Delete post | Admin |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/api/health` | Health check |

## Request/Response Examples

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Blog Posts

```bash
GET /api/blog
```

### Create Blog Post (Admin only)

```bash
POST /api/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "excerpt": "A short summary...",
  "content": "Full article content here...",
  "category": "Development",
  "readTime": "5 min read"
}
```

## Project Structure

```
vtechsoft-backend/
├── config/
│   └── db.js           # MongoDB connection
├── middleware/
│   └── auth.js         # JWT authentication middleware
├── models/
│   ├── User.js         # User schema
│   └── Blog.js         # Blog post schema
├── routes/
│   ├── auth.js         # Auth routes (register, login, me)
│   └── blog.js         # Blog CRUD routes
├── .env.example        # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js           # Entry point
```

## Making a User Admin

To make a user admin, connect to your MongoDB Atlas cluster and run:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass GUI to edit the user document.
