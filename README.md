# Employee Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-blue?style=for-the-badge)](https://employeemanagement-0.web.app)

**A modern, interactive employee management dashboard built with Angular 14, .NET 6, and Firebase**

## 📌 Overview  
The **Employee Management System** is a comprehensive full-stack web application designed to streamline workforce management. It utilizes a **Hybrid Architecture**:
- **Frontend**: Built with **Angular 14**, it connects directly to **Firebase Firestore** for high-speed, real-time data access, eliminating server cold-start delays.
- **Backend API**: A robust **.NET 6 Web API** that also integrates with Firestore, providing a RESTful interface for external integrations and server-side logic.

The system features a modern dashboard with data visualization, filterable employee lists, and a clean, user-friendly design.

---

## 🚀 Features  
✅ Interactive dashboard with employee statistics and data visualization  
✅ Advanced filtering and sorting of employee records  
✅ Add, edit, delete, and view employee details with a modern UI  
✅ **Hybrid Data Layer**: Direct Firebase SDK access + .NET 6 REST API  
✅ Responsive design that works on desktop and mobile devices  
✅ Real-time database updates via Firestore  
✅ Form validation with visual feedback  

---

## 🛠️ Tech Stack  
### **Frontend (Angular 14)**  
- TypeScript & Angular CLI  
- Bootstrap 5  
- Firebase SDK for real-time data  

### **Backend API (.NET 6)**  
- ASP.NET Core Web API  
- Google Cloud Firestore .NET SDK  
- Dependency Injection  
- Swagger UI for API testing  

### **Infrastructure**  
- **Database**: Firebase Firestore (NoSQL)  
- **Hosting**: Firebase Hosting  
- **CI/CD**: GitHub Actions  

---

## 📁 Project Structure
The project is organized into two main components:

- `/frontend` - Angular application with Firebase integration
- `/backend` - .NET 6 Web API for RESTful access
- `.github/workflows` - Automated CI/CD pipeline

---

## 🎯 Installation & Setup  

### **1️⃣ Clone the repository**  
```sh
git clone https://github.com/your-username/Angular-14-CRUD-with-.NET-6-Web-API.git
cd Angular-14-CRUD-with-.NET-6-Web-API
```

### **2️⃣ Setting up the Backend API (.NET)**
```sh
cd backend/Fullstack.API
dotnet restore
dotnet run
```
The API will be available at `https://localhost:7047` (or similar), with Swagger documentation at `/swagger`.

### **3️⃣ Setting up the Frontend (Angular)**
```sh
cd frontend
npm install
ng serve
```
Navigate to `http://localhost:4200/` to view the application.

---

## 🚀 Deployment

### **Frontend & Database (Firebase)**
1. **Build & Deploy:** Automated via GitHub Actions on every push to `main`.
2. **Live URL:** [https://employeemanagement-0.web.app](https://employeemanagement-0.web.app)

### **Backend API (.NET)**
The .NET backend can be containerized using the included `Dockerfile` and deployed to services like **Google Cloud Run** or **Render**.

### **Database Setup (Firebase Firestore)**

1. **Create Project:** Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. **Firestore Database:** Enable Firestore in "Production Mode" or "Test Mode".
3. **Security Rules:** Update your Firestore rules to allow authenticated (or public for dev) access:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Change to auth != null for production
       }
     }
   }
   ```
4. **Environment Variables:** Add your Firebase configuration to `frontend/src/app/firebase.config.ts`.

---

## 👨‍💻 Contributors
Your contributions are welcome!
