# 🗄️ Database Migration Guide - Local to MongoDB Atlas

This guide explains how to migrate your local MongoDB data to MongoDB Atlas (online database).

---

## 📋 Database Structure

### Database Name
**Recommended**: `gaza_uni_portal`

### Collections (Total: 4)

#### 1. **universities**
- Stores university information
- Fields: `key`, `name`, `color`, `type`
- Example document:
```json
{
  "_id": "ObjectId(...)",
  "key": "iu",
  "name": "الجامعة الإسلامية",
  "color": "#10b981",
  "type": "public",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. **colleges**
- Stores college/faculty information
- Fields: `key`, `name`, `universityKey`
- Example document:
```json
{
  "_id": "ObjectId(...)",
  "key": "engineering",
  "name": "كلية الهندسة",
  "universityKey": "iu",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 3. **majors**
- Stores academic major/program information
- Fields: `name`, `universityKey`, `collegeKey`, `description`, `academic_field`, `study_info`, `admission_requirements`, `plan_url`
- Example document:
```json
{
  "_id": "ObjectId(...)",
  "name": "هندسة البرمجيات",
  "universityKey": "iu",
  "collegeKey": "engineering",
  "description": "تخصص هندسة البرمجيات...",
  "academic_field": "engineering",
  "plan_url": "https://example.com/plan.pdf",
  "study_info": {
    "duration_years": 4,
    "credit_hours": 132,
    "credit_hour_price": 50
  },
  "admission_requirements": {
    "min_gpa": 85
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 4. **admins** ⭐ NEW
- Stores admin user credentials (with bcrypt hashed passwords)
- Fields: `username`, `password`, `email`, `role`
- Example document:
```json
{
  "_id": "ObjectId(...)",
  "username": "admin",
  "password": "$2a$10$...", 
  "email": "admin@gaza-uni.com",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**⚠️ IMPORTANT**: See `setup-admin.md` for instructions on creating the initial admin account!

---

## 🚀 Migration Methods

### Method 1: Using MongoDB Compass (Recommended - GUI)

**Step 1: Export from Local**
1. Open **MongoDB Compass**
2. Connect to local: `mongodb://localhost:27017`
3. Select database `gaza_uni_portal`
4. For each collection (universities, colleges, majors):
   - Click on the collection
   - Click **Export Collection**
   - Choose format: **JSON**
   - Save as: `universities.json`, `colleges.json`, `majors.json`

**Step 2: Import to Atlas**
1. In MongoDB Compass, connect to Atlas using your connection string
2. Create database: `gaza_uni_portal` (if not exists)
3. For each collection:
   - Click **CREATE COLLECTION**
   - Name: `universities`, `colleges`, or `majors`
   - Click **Import Data**
   - Select the corresponding JSON file
   - Click **Import**

---

### Method 2: Using mongodump & mongorestore (Command Line)

**Step 1: Export from Local**
```powershell
# Navigate to a directory where you want to save the backup
cd C:\backup

# Export entire database
mongodump --uri="mongodb://localhost:27017/gaza_uni_portal" --out=./gaza_uni_backup
```

**Step 2: Import to Atlas**
```powershell
# Replace <USERNAME>, <PASSWORD>, <CLUSTER> with your Atlas credentials
mongorestore --uri="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/gaza_uni_portal" ./gaza_uni_backup/gaza_uni_portal
```

---

### Method 3: Using mongoexport & mongoimport (JSON)

**Step 1: Export Collections**
```powershell
# Export universities
mongoexport --uri="mongodb://localhost:27017/gaza_uni_portal" --collection=universities --out=universities.json

# Export colleges
mongoexport --uri="mongodb://localhost:27017/gaza_uni_portal" --collection=colleges --out=colleges.json

# Export majors
mongoexport --uri="mongodb://localhost:27017/gaza_uni_portal" --collection=majors --out=majors.json
```

**Step 2: Import to Atlas**
```powershell
# Replace with your Atlas connection string
$ATLAS_URI = "mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/gaza_uni_portal"

# Import universities
mongoimport --uri=$ATLAS_URI --collection=universities --file=universities.json --jsonArray

# Import colleges
mongoimport --uri=$ATLAS_URI --collection=colleges --file=colleges.json --jsonArray

# Import majors
mongoimport --uri=$ATLAS_URI --collection=majors --file=majors.json --jsonArray
```

---

## 🔧 MongoDB Atlas Setup

### 1. Create Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up for free tier (M0)

### 2. Create Cluster
- Click **Build a Cluster**
- Choose **FREE tier (M0)**
- Select region closest to you
- Cluster name: `Cluster0` (default)

### 3. Create Database User
- Go to **Database Access**
- Click **Add New Database User**
- Username: `gaza_uni_admin` (or your choice)
- Password: Generate or create strong password
- Role: **Atlas admin** or **Read and write to any database**

### 4. Whitelist IP Address
- Go to **Network Access**
- Click **Add IP Address**
- Option A: **Add Current IP Address**
- Option B: **Allow Access from Anywhere** (0.0.0.0/0) - **Not recommended for production**

### 5. Get Connection String
- Go to **Clusters** → Click **Connect**
- Choose **Connect your application**
- Copy connection string:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gaza_uni_portal?retryWrites=true&w=majority
```

### 6. Update .env File
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gaza_uni_portal?retryWrites=true&w=majority
```

**Important**: Replace `<username>` and `<password>` with actual credentials!

---

## ✅ Verification Checklist

After migration, verify:

- [ ] Backend connects successfully (check console logs)
- [ ] All 3 collections exist in Atlas
- [ ] Universities collection has data
- [ ] Colleges collection has data
- [ ] Majors collection has data
- [ ] Frontend can fetch and display data
- [ ] Search functionality works
- [ ] Filters work (university type, academic field)
- [ ] Admin panel can add/edit/delete data

---

## 🐛 Common Issues & Solutions

### Issue 1: Connection Timeout
**Solution**: Check Network Access whitelist in Atlas

### Issue 2: Authentication Failed
**Solution**: Verify username and password are correct in connection string

### Issue 3: Database Not Found
**Solution**: Ensure database name `gaza_uni_portal` is specified in connection string

### Issue 4: Empty Collections
**Solution**: Re-import data using one of the methods above

### Issue 5: Duplicate Data
**Problem**: You ran import twice
**Solution**: 
```javascript
// In MongoDB Atlas or Compass, run this to clean duplicates
db.majors.aggregate([
  { $group: { _id: "$name", uniqueIds: { $addToSet: "$_id" }, count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
// Then manually delete duplicates
```

---

## 📊 Data Cleanup (Important!)

### Remove Duplicate "طب بشري" Entry

After migration, check for duplicate majors:

**Using MongoDB Compass:**
1. Open `majors` collection
2. Filter: `{ name: "طب بشري" }`
3. You should see **2 documents**:
   - One with `academic_field: "engineering"` ❌ **DELETE THIS**
   - One with `academic_field: "medical"` ✓ **KEEP THIS**

**Using Mongo Shell:**
```javascript
// Find duplicates
db.majors.find({ name: "طب بشري" })

// Delete the wrong one (replace with actual _id)
db.majors.deleteOne({ 
  name: "طب بشري", 
  academic_field: "engineering" 
})
```

---

## 🔐 Security Best Practices

1. **Never commit .env file** (already in .gitignore)
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Rotate credentials** regularly
5. **Use environment variables** for sensitive data

---

## 📝 Notes

- Migration is **one-time** - after this, all changes happen in Atlas
- Local database can be kept as **backup**
- Consider setting up **automated backups** in Atlas
- Free tier (M0) has **512MB storage limit**
- Monitor usage in Atlas dashboard

---

## 🆘 Need Help?

If you encounter issues:
1. Check Atlas logs in the dashboard
2. Check backend console logs
3. Verify connection string format
4. Test connection using MongoDB Compass
5. Contact MongoDB Atlas support

---

**Last Updated**: 2025-12-21  
**Migration Status**: Pending ⏳
