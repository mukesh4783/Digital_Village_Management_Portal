# GramSetu — Digital Village Management Portal (MERN)

GramSetu is a comprehensive Digital Village Management Portal designed to bridge the gap between rural administration and citizens. Built using the MERN Stack (MongoDB, Express.js, React, Node.js), it digitizes the operational and administrative tasks of a village, empowering citizens with transparent access to welfare schemes, public services, and official documents, while providing administrators with a powerful dashboard to manage and audit village activities.

## Features

**For Citizens:**
- **Public Service Requests:** Request village services (e.g., sanitation, water supply) and track their real-time status with comment threads.
- **Welfare Schemes & Applications:** View available government welfare schemes and submit applications digitally.
- **Certificate Applications:** Apply for official certificates (e.g., birth, domicile, income) directly from the portal.
- **Notifications & Resources:** Receive important announcements and access shared village resources.
- **Dashboard:** Personalized dashboard to monitor active applications, requests, and notifications.

**For Administrators:**
- **Citizen & Household Management:** Maintain a centralized digital registry of households and citizens in the village.
- **Service & Welfare Management:** Process, approve, or reject public service requests and welfare applications.
- **Certificate Issuance:** Verify applications and issue certificates to citizens.
- **Reports & Analytics:** MongoDB-backed reports generation for tracking village progress and demographics.
- **System Administration:** Manage user roles, broadcast notifications, and access complete audit logs of all actions performed on the platform.

## Project Structure

- `client/` — React frontend built with Vite and Context API for state management.
- `server/` — Node.js + Express.js REST API backend providing authentication, business logic, and database interactions.
- `docker-compose.yml` — Docker configuration for easy setup of the MongoDB database and backend API.

## Requirements

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (if running locally without Docker)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (Recommended for easy setup)

---

## How to Start the Program

You can run the project either fully on your local machine using Node/npm, or utilize Docker for the backend and database. 

### Method 1: Using Docker (Recommended for Backend)

This method uses Docker Compose to automatically set up the MongoDB database and the Node.js API server.

**1. Clone the repository:**
```bash
git clone <your-repository-url>
cd gram2
```

**2. Start the Backend and Database using Docker:**
Make sure Docker Desktop (or your Docker daemon) is running.
```bash
docker-compose up -d --build
```
*This command builds the API image, starts the MongoDB container (accessible on port 27077), and starts the Node.js API server (accessible on port 5055).*

**3. Seed the Database with Demo Data (Optional but recommended):**
To populate the database with demo admin and citizen accounts, run the seed script inside the API container:
```bash
docker exec -it gramsetu_api npm run seed
```

**4. Start the Frontend (Client):**
Open a new terminal window, navigate to the `client` directory, install dependencies, and start the development server.
```bash
cd client
npm install
npm run dev
```

**5. Access the Application:**
Open your browser and navigate to the local URL printed by Vite (usually `http://localhost:5173`).

### Method 2: Running Locally (Without Docker)

If you prefer not to use Docker, you can run everything directly on your machine.

**1. Set up Environment Variables:**
Navigate to the `server/` directory and copy the `.env.example` file to create a `.env` file.
```bash
cd server
cp .env.example .env
```
Ensure your local MongoDB instance is running. By default, it will use `mongodb://localhost:27017/digital_village`. You may need to set `MONGO_URI` and `JWT_SECRET` in `.env`.

**2. Install Dependencies for Backend:**
```bash
npm install
```

**3. Seed Demo Data (Optional):**
```bash
npm run seed
```

**4. Start the Backend API:**
```bash
npm run dev
```

**5. Start the Frontend (Client):**
Open a new terminal window.
```bash
cd client
npm install
npm run dev
```

---

## Demo Accounts (After Seeding)

If you ran the seed script, you can log in with the following credentials to explore the system:

- **Admin Account:**
  - Email: `admin@gramsetu.local`
  - Password: `Admin@123`

- **Citizen Account:**
  - Email: `citizen@gramsetu.local`
  - Password: `Citizen@123`

> **Note:** Please ensure you change these demo passwords before deploying the application to a production environment.

## API Endpoints Overview

The backend API exposes several RESTful endpoints, including:
- `/api/auth` — User registration, login, and profile management
- `/api/dashboard` — Statistics and summary data for dashboards
- `/api/citizens` — Citizen registry CRUD operations
- `/api/households` — Household registry CRUD operations
- `/api/services` — Public service requests management
- `/api/welfare` — Welfare schemes and applications
- `/api/certificates` — Certificate requests and issuance
- `/api/notifications` — System-wide announcements
- `/api/resources` — Shared village files/resources
- `/api/reports` — Demographics and operational reports
- `/api/admin` — User management and system audit logs
