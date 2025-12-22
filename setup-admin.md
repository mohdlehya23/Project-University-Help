# 🔧 Setup Script - Create Default Admin

This script creates an initial admin account in the database.

## Option 1: Using API Endpoint

After starting the backend server, run this PowerShell command:

```powershell
$body = @{
    username = "admin"
    password = "admin123"
    email = "admin@gaza-uni.com"
    role = "super_admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/register" -Method POST -Body $body -ContentType "application/json"
```

Or using curl:
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","email":"admin@gaza-uni.com","role":"super_admin"}'
```

## Option 2: Using MongoDB Compass/Shell

1. Open MongoDB Compass or Mongo Shell
2. Connect to your database
3. Select `gaza_uni_portal` database
4. Run this command:

```javascript
// Generate hashed password (bcrypt hash of "admin123")
// Hash: $2a$10$rQ3X5vH8HVj.9MkZQKVYN.xj9JYY1kR3TmHJQBFGKqH5QYN6fFdQO

db.admins.insertOne({
  username: "admin",
  password: "$2a$10$rQ3X5vH8HVj.9MkZQKVYN.xj9JYY1kR3TmHJQBFGKqH5QYN6fFdQO",
  email: "admin@gaza-uni.com",
  role: "super_admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Verification

Test login with:
- **Username**: `admin`
- **Password**: `admin123`

## Security Notes

⚠️ **IMPORTANT**: Change the default password after first login!

To create a new admin with a custom password, use the `/api/admin/register` endpoint.
