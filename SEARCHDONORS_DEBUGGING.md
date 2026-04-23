# SearchDonors Debugging Guide

## Issue: No Data Showing on Frontend

### Potential Root Causes

#### 1. **User Collection Schema Mismatch** ⚠️ MOST LIKELY
The server queries `userCollection` but the user documents may not have the fields:
- `role: 'donor'`
- `bloodGroup`
- `region`
- `district`
- `phone`

**Solution:** Check what fields exist in your user documents

```javascript
// Check user collection structure
db.collection('users').findOne({ role: 'donor' })

// Should return something like:
{
  _id: ObjectId,
  email: String,
  name: String,
  role: 'donor',
  bloodGroup: 'A+',        // ← MUST EXIST
  region: 'Dhaka',          // ← MUST EXIST
  district: 'Dhaka Sadar',  // ← MUST EXIST
  phone: '01234567890',
  photoURL: String,
  status: 'active'
}
```

#### 2. **Server Filter Logic**
The server builds a filter with `role: 'donor'`:
```javascript
const filter = { role: 'donor' };
if (bloodGroup) filter.bloodGroup = bloodGroup;
if (region) filter.region = region;
if (district) filter.district = district;
```

**Check:** Are you storing donor profile info in the users collection?

---

## Debugging Steps

### Step 1: Check Frontend Console
Open browser DevTools (F12) → Console tab
Look for these logs:

```javascript
Frontend search request: {
  bloodGroup: "A+",
  region: "Dhaka",
  district: "Dhaka Sadar",
  queryString: "bloodGroup=A%2B&region=Dhaka&district=Dhaka+Sadar"
}

Frontend received donors: [...]  // Should have data
```

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Click "Search Donors"
3. Look for `/search-donors?...` request
4. Check Response:
   - Should show array of donor objects
   - If error: Check the error message

### Step 3: Check Server Console
Server should log:
```
Search filter: { role: 'donor', bloodGroup: 'A+', region: 'Dhaka', district: 'Dhaka Sadar' }
Donors found: 5
```

If "Donors found: 0" → No matching records in database

### Step 4: Query Database Directly
```javascript
// In MongoDB shell or Compass
use your_database

// Check if any donors exist
db.users.find({ role: 'donor' }).count()

// Check donors with blood group
db.users.find({ role: 'donor', bloodGroup: 'A+' }).count()

// Check all donor fields
db.users.find({ role: 'donor' }).limit(1).pretty()
```

---

## Solutions Based on Issue Type

### Solution A: User Data Doesn't Have Donor Profile Fields
If users don't have `bloodGroup`, `region`, `district`:

**Option 1:** Add these fields when user registers/updates profile
```javascript
// User Registration
const userDoc = {
  email: user.email,
  name: user.displayName,
  role: 'donor',  // Add this
  bloodGroup: 'A+',  // Add this
  region: 'Dhaka',  // Add this
  district: 'Dhaka Sadar',  // Add this
  phone: '01234567890',  // Add this
  status: 'active',
  createdAt: new Date()
};
```

**Option 2:** Create separate Donors collection
```javascript
// Server code modification
const donors = await donorCollection.find(filter).toArray();
// Instead of userCollection
```

### Solution B: Data Exists but Query Parameters Wrong
Check if field names match database exactly:
```javascript
// Frontend sends:
?bloodGroup=A+&region=Dhaka&district=Dhaka%20Sadar

// Server expects (case-sensitive):
filter.bloodGroup = 'A+'
filter.region = 'Dhaka'
filter.district = 'Dhaka Sadar'
```

### Solution C: Authorization Issue
The `axiosSecure` sends JWT token. Check if:
1. User is logged in
2. Token is valid
3. Backend accepts the token

**Check frontend:**
```javascript
// In browser console
const token = await firebase.auth().currentUser.getIdToken()
console.log('Token:', token)
```

---

## Quick Test

### Test 1: Verify Backend Works
Use Postman or curl:
```bash
curl "https://blooddonation-gold.vercel.app/search-donors?bloodGroup=A+"
```

Should return array of donors

### Test 2: Frontend Search with All Filters
1. Select: Blood Group = A+
2. Select: Region = Dhaka
3. Select: District = Dhaka Sadar
4. Click Search
5. Check browser console for logs

### Test 3: Search with One Filter
Try with just Blood Group (no region/district)

---

## Enhanced Frontend Debugging

The updated SearchDonors component now logs:

**Before Search:**
```javascript
handleSearch called with: {
  bloodGroup: "A+",
  region: "Dhaka",
  district: "Dhaka Sadar"
}
```

**During Query:**
```javascript
Frontend search request: {
  bloodGroup: "A+",
  region: "Dhaka",
  district: "Dhaka Sadar",
  queryString: "bloodGroup=A%2B&region=Dhaka&district=Dhaka+Sadar"
}
```

**After Response:**
```javascript
Frontend received donors: [
  { _id: "...", bloodGroup: "A+", region: "Dhaka", ... },
  { _id: "...", bloodGroup: "A+", region: "Dhaka", ... }
]
```

**On Error:**
```javascript
Error searching donors: Error message will show in alert
```

---

## Recommended Next Steps

1. **Check Database Schema**
   - Verify `bloodGroup`, `region`, `district` exist in users collection
   - Check if donors have these fields populated

2. **Test Backend API**
   - Use Postman to test `/search-donors` endpoint directly
   - Verify it returns data

3. **Check Logs**
   - Open browser DevTools Console
   - Look for the logs listed above
   - Share error messages if any

4. **Verify User Data**
   - Make sure at least one user has:
     - `role: 'donor'`
     - `bloodGroup` field
     - `region` field
     - `district` field

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "No donors found" | Users don't have donor fields | Add bloodGroup, region, district to user docs |
| Empty results | Mismatched data format | Check field names case-sensitivity |
| Loading forever | Authorization error | Check JWT token validity |
| 401/403 error | Not authenticated | User must be logged in |
| 500 error | Server error | Check server console logs |

---

## Sample Donor Document

For reference, a complete donor user document should look like:

```javascript
{
  "_id": ObjectId("..."),
  "email": "donor@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "role": "donor",
  "status": "active",
  "bloodGroup": "A+",
  "region": "Dhaka",
  "district": "Dhaka Sadar",
  "phone": "01712345678",
  "createdAt": ISODate("2024-04-20T..."),
  "updatedAt": ISODate("2024-04-20T...")
}
```

If your user documents don't have the bloodGroup, region, district fields, that's the problem!
