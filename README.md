# 🌿 GramSetu — Digital Village Management Portal

GramSetu is a modern, comprehensive Digital Village Management Portal designed to bridge the gap between rural administration and citizens. Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js), it digitizes the operational and administrative tasks of a village. It empowers citizens with transparent access to welfare schemes, public services, and official documents, while providing administrators with a powerful dashboard to manage and audit village activities seamlessly.

## 🌐 Live URLs

The project has been successfully deployed and is hosted live for production use:
- **Frontend Application (Vercel):** [https://gramsetu-portal.vercel.app](https://gramsetu-portal.vercel.app)
- **Backend API (Vercel):** [https://digital-village-management-portal.vercel.app](https://digital-village-management-portal.vercel.app)

---

## ✨ Core Features

### 👤 For Citizens
- **Public Service Requests:** Submit requests for village services (e.g., sanitation, water supply, road repair) and track their real-time progress via a timeline.
- **Welfare Schemes & Applications:** View an catalog of available government welfare schemes (like PM-KISAN, Ayushman Bharat) and submit applications digitally.
- **Certificate Applications:** Request official certificates (e.g., birth, domicile, income) and view beautifully generated printable previews.
- **Notifications & Alerts:** Receive targeted system alerts when the status of your application changes, and view global announcements on a dedicated feed.
- **Dashboard:** Personalized dashboard to monitor active applications, requests, and quickly access frequent actions.

### 🛡️ For Administrators
- **Interactive Dashboard:** View real-time analytics, charts, and aggregated system statistics powered by Chart.js.
- **Citizen & Household Registry:** Maintain a centralized digital database of all village residents and households.
- **Service & Welfare Management:** Process, approve, reject, and leave internal notes on public service requests and welfare applications.
- **Certificate Issuance:** Verify documentation and officially "Issue" certificates to citizens.
- **Audit Logs & User Management:** Assign roles (Citizen/Admin) to registered users and view a complete, un-deletable system audit log tracking every login and data modification.

---

## 🤖 GramSetu AI Chatbot

To ensure the portal is accessible to users of all technical backgrounds, GramSetu features a highly intelligent **floating AI Chatbot** embedded directly into the interface.

### How it Works
1. **Context-Aware:** The bot is strictly programmed to understand the exact architecture of the GramSetu portal. It knows the difference between a service request and a welfare scheme.
2. **Role-Based Intelligence:** It understands if the user is an Admin or a Citizen and provides answers tailored to their access level.
3. **Multilingual:** It communicates fluently in English, Hindi, and various other regional languages natively based on user input.
4. **Step-by-Step Guidance:** If a user gets lost, they can ask "How do I apply for a birth certificate?" and the bot will provide exact instructions.

### The Technology
The chatbot is powered by **Google's Gemini AI** (specifically the `gemini-2.5-flash` Large Language Model). It uses the official `@google/generative-ai` API integration on the backend to securely process chat histories and generate hyper-fast, context-specific responses using a custom System Prompt injected by the developers.

---

## 🔐 Login Credentials

If you wish to explore the live application, you can use the following pre-seeded demo accounts. 

> **Note:** If you are registering a *new* Admin account on the Registration page, you must use the Admin Secret Key: `1234`.

### Admin Accounts
| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Mukesh (Creator) | `mukesh@gramsetu.local` | `Mukesh@123` | **Admin** |
| System Admin | `admin@gramsetu.local` | `Admin@123` | **Admin** |

### Citizen Accounts
| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Demo Citizen | `citizen@gramsetu.local` | `Citizen@123` | Citizen |

*(You can also register a brand new Citizen account from the login screen and it will instantly sync with the dashboard!)*

---

## 💻 Tech Stack & Architecture

- **Frontend:** React, React Router DOM, Vite, Lucide-React (Icons), Chart.js
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas (Cloud)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Hosting:** Vercel (Serverless Functions for Backend, Static Export for Frontend)
- **AI Integration:** Google Gemini API

## 🚀 Running Locally

If you wish to run the code locally instead of using the live URLs:

**1. Clone the repository:**
```bash
git clone <repository-url>
cd gram2
```

**2. Setup Backend:**
```bash
cd server
cp .env.example .env  # Add your MONGODB_URI and GEMINI_API_KEY
npm install
npm run seed  # (Optional) Populates database with dummy data
npm run dev
```

**3. Setup Frontend:**
```bash
cd client
npm install
npm run dev
```

Open your browser to `http://localhost:5173`.
