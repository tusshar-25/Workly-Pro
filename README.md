# 🧠 Workly Pro

### A Smart Workforce Management System

**Workly Pro** is a modern full-stack workforce management platform that helps organizations efficiently manage employees, tasks, meetings, and performance — all in one place.  
It provides a clean dashboard interface for both **Admin** and **Employees**, ensuring smooth workflow tracking, attendance management, and collaboration with real-time updates.

---


## 🔐 Login Credentials

| Company Name       | Company Code | Employee/Admin        | Password |
| ------------------ | ------------ | --------------------- | -------- |
| TechCorp Solutions | COMP-8768    | Select Admin/Employee | 123456   |
| InnovaSoft Systems | COMP-9451    | Select Admin/Employee | 123456   |

---

✅ **Instructions for testing:**

1. Go to **Company Login** and enter the **Company Name** and **Company Code**.
2. Proceed to **Employee/Admin Login**.
3. Select a user from the dropdown, enter **password 1223456**, and click **Login**.
4. You should be redirected to the dashboard (Admin or Employee based on role).

---

## 🌐 Live Links

| Platform               | URL                                                                          |
| ---------------------- | ---------------------------------------------------------------------------- |
| **Frontend (Netlify)** | [https://workly-pro.netlify.app](https://workly-pro.netlify.app)             |
| **Backend (Render)**   | [https://workly-pro-xo10.onrender.com](https://workly-pro-xo10.onrender.com) |

✅ **Usage:**

- Frontend: Use the login credentials provided above to test the app.
- Backend: The API endpoints are live at the Render URL. Frontend is already configured to use this backend.

---
## 🚀 Tech Stack

### 🌐 Frontend
- **Framework:** React.js (v19.1.1) with **Vite**
- **UI Libraries:**
  - Chakra UI (v3.27.1)
  - Material-UI (v7.3.4)
  - Tailwind CSS (v4.1.16)
  - Emotion (v11.14.0)
- **Animations:** Framer Motion (v12.23.24)
- **Icons:** Lucide React (v0.548.0)
- **Routing:** React Router DOM (v7.9.4)
- **HTTP Client:** Axios (v1.12.2)
- **State Management:** React Context API
- **Data Visualization:** Recharts (v3.3.0)
- **Real-time Communication:** Socket.IO Client (v4.8.1)

### ⚙️ Backend
- **Runtime:** Node.js (with ES Modules)
- **Framework:** Express.js (v5.1.0)
- **Database:** MongoDB with Mongoose (v8.19.1)
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** bcryptjs (v3.0.2)
- **CORS Handling:** cors (v2.8.5)
- **Real-time Communication:** Socket.IO (v4.8.1)
- **Email Service:** Nodemailer (v7.0.9)
- **Environment Management:** dotenv (v17.2.3)

### 🧰 Development Tools
- **Build Tool:** Vite (v7.1.7)
- **Linting:** ESLint (v9.36.0)
- **Package Manager:** npm

---

## ✨ Key Features

✅ **Admin Dashboard**
- Manage employees, meetings, and tasks  
- View company statistics and real-time analytics  
- Assign or remove employees, update roles  

✅ **Employee Dashboard**
- View assigned tasks and meetings  
- Real-time status updates via Socket.IO  
- Track performance and manage schedules  

✅ **Authentication**
- Secure JWT-based login system  
- Passwords encrypted using bcryptjs  

✅ **Notifications**
- Real-time event and task updates  

✅ **Email System**
- Sends verification and update emails via Nodemailer  

✅ **Modern UI**
- Fully responsive with Tailwind + Chakra + Material-UI blend  
- Smooth animations and transitions using Framer Motion  

---

## 🖼️ Screenshots

| Section | Preview |
|----------|----------|
| **Welcome Screen** | ![Welcome Screen](./screenshots/welcomeScreen.png) |
| **Main Dashboard** | ![Main Dashboard](./screenshots/MainDashboard.png) |
| **Admin Dashboard** | ![Admin Dashboard](./screenshots/AdminDashboard.png) |
| **Employees** | ![Employees](./screenshots/Employees.png) |
| **Meetings** | ![Meetings](./screenshots/Meetings.png) |
| **Tasks** | ![Tasks](./screenshots/Tasks.png) |
| **Subscription** | ![Subscription](./screenshots/subscription.png) |
| **Logo** | ![Logo](./screenshots/mainLogo.png) |

---

## ⚡ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/tusshar-25/Workly-Pro.git
cd Workly-Pro
````

### 2️⃣ Setup Backend

```bash
cd backend
npm install
node server.js
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```


## 🧑‍💻 Developed By

**👤 Tushar Rathod**
📧 [tusharrathore853@gmail.com](mailto:tusharrathore853@gmail.com)
📞 +91 99938 02243
🔗 [LinkedIn Profile](https://www.linkedin.com/in/tusharrathore25)

---

## ❤️ Acknowledgments

Special thanks to all open-source libraries and tools that made this project possible.

--
