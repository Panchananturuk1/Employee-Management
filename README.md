# Employee Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_App-blue?style=for-the-badge)](https://employee-management-jelx.onrender.com/)

**A modern, interactive employee management dashboard built with Angular 14 and .NET 6**

## 📌 Overview  
The **Employee Management System** is a comprehensive full-stack web application designed to streamline workforce management. Built with **Angular 14** for the frontend and **.NET 6 Web API** for the backend, it offers a responsive and intuitive interface to manage employee records efficiently.

The system features a modern dashboard with data visualization, filterable employee lists, and a clean, user-friendly design. It leverages PostgreSQL via Supabase for reliable data storage and provides a complete CRUD (Create, Read, Update, Delete) functionality through a RESTful API.

---

## 🚀 Features  
✅ Interactive dashboard with employee statistics and data visualization  
✅ Advanced filtering and sorting of employee records  
✅ Add, edit, delete, and view employee details with a modern UI  
✅ RESTful API built with .NET 6 Web API  
✅ Responsive design that works on desktop and mobile devices  
✅ PostgreSQL database integration via Supabase  
✅ Form validation with visual feedback  
✅ Error handling and user notifications  

---

## 🛠️ Tech Stack  
### **Frontend (Angular 14)**  
- TypeScript  
- Angular CLI  
- Bootstrap / TailwindCSS (Optional)  
- Angular Material (Optional)  

### **Backend (.NET 6 Web API)**  
- ASP.NET Core Web API  
- Entity Framework Core  
- PostgreSQL (via Supabase)  
- Dependency Injection  
- Swagger for API documentation  

---

## 📁 Project Structure
The project follows a clean separation of concerns with a frontend and backend folder:

- `/frontend` - Angular application
- `/backend` - .NET Core API

---

## 🎯 Installation & Setup  

### **1️⃣ Clone the repository**  
```sh
git clone https://github.com/your-username/Angular-14-CRUD-with-.NET-6-Web-API.git
cd Angular-14-CRUD-with-.NET-6-Web-API
```

### **2️⃣ Setting up the Backend**
```sh
cd backend
dotnet restore
dotnet run
```

### **3️⃣ Setting up the Frontend**
```sh
cd frontend
npm install
ng serve
```

Navigate to `http://localhost:4200/` to view the application.

---

## 📝 API Endpoints

- GET `/api/employees` - Retrieve all employees
- GET `/api/employees/{id}` - Retrieve a specific employee
- POST `/api/employees` - Add a new employee
- PUT `/api/employees/{id}` - Update an employee
- DELETE `/api/employees/{id}` - Delete an employee

---

## 🚀 Deployment

### **Frontend Deployment (Render)**

1. **Root Directory:** `frontend`
2. **Build Command:** `npm install && npm run build --prod`
3. **Publish Directory:** `dist/fullstack.ui`
4. **Live URL:** [https://employee-management-jelx.onrender.com/](https://employee-management-jelx.onrender.com/)

### **Backend Deployment (Render)**

1. **Root Directory:** `backend`
2. **Build Command:** `dotnet publish -c Release`
3. **Start Command:** `dotnet ./Fullstack.API/bin/Release/net8.0/publish/Fullstack.API.dll`
4. **API URL:** [https://employee-management-backend-25gg.onrender.com](https://employee-management-backend-25gg.onrender.com)

### **Database Setup (Supabase)**

1. Create a new PostgreSQL database in Supabase
2. Create a table named `Employees` with the following schema:
   - `Id` (UUID) - Primary Key
   - `Name` (Text)
   - `Email` (Text)
   - `Phone` (Numeric)
   - `Salary` (Numeric)
   - `Department` (Text)

3. Get your PostgreSQL connection string from Supabase dashboard:
   ```
   Host=db.YOUR_SUPABASE_PROJECT_ID.supabase.co;Database=postgres;Username=postgres;Password=YOUR_DATABASE_PASSWORD;Port=5432;SSL Mode=Require;Trust Server Certificate=true
   ```

4. Add this connection string as an environment variable in Render:
   - Key: `ConnectionStrings__SupabaseConnectionString`
   - Value: Your Supabase PostgreSQL connection string

---

## 👨‍💻 Contributors
Your contributions are welcome!
