-- Insert dummy data into employees table
INSERT INTO "Employees" ("Id", "Name", "Email", "Phone", "Salary", "Department")
VALUES 
    (gen_random_uuid(), 'John Smith', 'john.smith@company.com', 9876543210, 75000, 'Engineering'),
    (gen_random_uuid(), 'Sarah Johnson', 'sarah.j@company.com', 9876543211, 82000, 'Marketing'),
    (gen_random_uuid(), 'Michael Brown', 'michael.b@company.com', 9876543212, 68000, 'Sales'),
    (gen_random_uuid(), 'Emily Davis', 'emily.d@company.com', 9876543213, 90000, 'Engineering'),
    (gen_random_uuid(), 'David Wilson', 'david.w@company.com', 9876543214, 78000, 'HR'),
    (gen_random_uuid(), 'Lisa Anderson', 'lisa.a@company.com', 9876543215, 85000, 'Finance'),
    (gen_random_uuid(), 'Robert Taylor', 'robert.t@company.com', 9876543216, 72000, 'Sales'),
    (gen_random_uuid(), 'Jennifer Martinez', 'jennifer.m@company.com', 9876543217, 95000, 'Engineering'),
    (gen_random_uuid(), 'William Thomas', 'william.t@company.com', 9876543218, 88000, 'Marketing'),
    (gen_random_uuid(), 'Elizabeth White', 'elizabeth.w@company.com', 9876543219, 92000, 'Finance'); 