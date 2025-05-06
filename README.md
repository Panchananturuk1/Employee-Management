# Angular-14-CRUD-with-.NET-6-Web-API  
**Project Name: Employee Management System**  

## 📌 Overview  
The **Employee Management System** is a full-stack web application built using **Angular 14** for the frontend and **.NET 6 Web API** for the backend. It provides CRUD (Create, Read, Update, Delete) operations to manage employees efficiently.

---

## 🚀 Features  
✅ Add, edit, delete, and view employee records  
✅ RESTful API built with .NET 6  
✅ Angular 14 for a responsive and interactive UI  
✅ PostgreSQL database integration via Supabase  
✅ Validation for input fields  
✅ Error handling and notifications  

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

### **Backend Deployment (Render)**

1. **Root Directory:** `backend`
2. **Build Command:** `dotnet publish -c Release`
3. **Start Command:** `dotnet ./Fullstack.API/bin/Release/net8.0/publish/Fullstack.API.dll`

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
