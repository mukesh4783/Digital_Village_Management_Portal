# GramSetu — Digital Village Management Portal (MERN)

A submission-ready MERN Stack academic project using React for the frontend, Node.js + Express.js for REST APIs, and MongoDB with Mongoose for persistence.

## Features
- JWT authentication with Admin and Citizen roles
- Dashboard statistics
- Citizen and household management
- Public service requests with comments and status workflow
- Welfare schemes and applications
- Certificate applications
- Notifications and village resources
- Admin user list and audit log
- MongoDB-backed reports and analytics
- Demo seed data for presentation

## Project Structure
- `client/` — React frontend (Vite is only the build/dev tool)
- `server/` — Node.js + Express.js backend
- MongoDB — database through Mongoose models

## Setup
1. Install MongoDB locally or create a MongoDB Atlas database.
2. In `server/`, copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Run `npm install` inside both `server/` and `client/`.
4. Optional demo data: run `npm run seed` inside `server/`.
5. Start backend: `npm run dev` in `server/`.
6. Start frontend: `npm run dev` in `client/`.
7. Open the local URL printed by Vite.

## Demo Accounts after seeding
- Admin: `admin@gramsetu.local` / `Admin@123`
- Citizen: `citizen@gramsetu.local` / `Citizen@123`

Change demo passwords before any real deployment.

## API Overview
`/api/auth`, `/api/dashboard`, `/api/citizens`, `/api/households`, `/api/services`, `/api/welfare`, `/api/certificates`, `/api/notifications`, `/api/resources`, `/api/reports`, `/api/admin`.
