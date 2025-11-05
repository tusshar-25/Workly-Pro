🚀 WorklyPro – Complete Company Management System

WorklyPro is a modern full-stack Company Management Platform designed to simplify operations, boost productivity, and connect Admins and Employees under one efficient system.

🏢 Project Overview

WorklyPro provides a unified workspace where Admins can manage employees,      meetings, and tasks — while Employees can view their salary, assigned          tasks, meetings, and performance in one sleek dashboard.

This system enhances collaboration, productivity tracking, and organizational efficiency across any company.

💻 Register Company

You can register a company that will have a admin profile where you can add, delete, update (Employees, Tasks, Meetings) 
then you also have employee profile after adding their you can see employees info (Salary, Tasks, Meetings, Performance, etc)

⚙️ Key Features
  
  👨‍💼 Admin Features
      Register company with unique Company Code
      Add, update, and delete employees
      Assign and track tasks with due dates
      Schedule and manage meetings
      Manage salary and bonus details
      View performance stats, upcoming deadlines, and company analytics
      Track all recent employee activities

  👩‍💻 Employee Features
      Login using company name, code, and password
      View assigned tasks and their progress
      Access meeting schedules
      See salary and bonus info
      Track personal productivity and performance analytics

🧰 Tech Stack

  🎨 Frontend
    ⚡ React.js (Vite)
    💨 Tailwind CSS
    ✨ Framer Motion (Animations)
    📊 Recharts (Analytics & Charts)
    🔔 Lucide React / React Icons
  
  ⚙️ Backend
    🧠 Node.js + Express.js
    🗄️ MongoDB + Mongoose
    🔐 JWT Authentication
    🌐 RESTful APIs
    🧩 CORS & Environment Configuration
    
🗂️ Folder Structure

WorklyPro/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md

⚡ Setup Instructions
1️⃣ Clone the Repository
    git clone https://github.com/yourusername/worklypro.git
    cd worklypro

2️⃣ Install Dependencies
  Backend
    cd backend
    npm install

  Frontend
    cd ../frontend
    npm install

3️⃣ Configure Environment Variables

  Create a .env file inside the backend folder:
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key


  🧠 Run the Project
  ▶️ Start Backend
  cd backend
  npm start

  💻 Start Frontend
  cd frontend
  npm run dev


Then open http://localhost:5173/
 in your browser.

🖥️ Dashboard Overview
🧩 Admin Dashboard
    👥 Employee Summary (with DOJ & Contact)
    📝 Task Assignment & Tracking
    📅 Meeting Management
    💰 Salary and Bonus Overview
    📈 Performance Charts
    🕒 Upcoming Deadlines (Next 15)
    🗞️ Announcements (Auto from Meetings)
    📋 Recent Activities (Employee Updates)

👨‍🔧 Employee Dashboard
    💵 Salary & Bonus card
    ✅ Task progress overview
    🗓️ Meetings schedule
    📊 Weekly performance analytics

💎 UI Highlights
    🖤 Modern dark-mode glassmorphism UI
    💨 Tailwind-powered gradient components
    ⚡ Framer Motion smooth animations
    📱 Fully responsive layout
    🧠 Organized modular structure
    🧾 License

This project is open-source and available under the MIT License.

🧑‍💻 Developed By

Tushar Rathore
🚀 Full-Stack Developer | MERN Enthusiast
📧 Email: [tusharrathore853@gmail.com]
🌐 GitHub: [https://github.com/tusshar-25]

