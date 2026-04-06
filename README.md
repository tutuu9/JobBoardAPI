# Job Board API

Simple backend for a job board platform.

## Features

- JWT authentication
- User & Company roles
- Create / update / delete jobs
- Apply to jobs
- Get own applications
- Job filtering (search, salary, location)
- Pagination

## Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- bcrypt

## Setup

```bash
git clone https://github.com/tutuu9/JobBoardAPI.git
cd JobBoardAPI
npm install
```
Create .env file:
```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
```

Run:
```bash
npm run dev
```
API routes:

```
Auth:
POST /api/auth/register
POST /api/auth/login

Jobs:
GET /api/jobs
POST /api/jobs
PUT /api/jobs/:id
DELETE /api/jobs/:id

Applications:
POST /api/jobs/:id/apply
GET /api/applications/my
GET /api/jobs/:id/applications
```