# SearchDonors Frontend Integration

## Overview
The SearchDonors component has been updated to work with your backend API endpoint.

## Backend API Endpoint
```
GET /search-donors?bloodGroup=X&region=Y&district=Z
```

**Query Parameters:**
- `bloodGroup` (optional): Blood group type (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `region` (optional): Region name
- `district` (optional): District name

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Donor Name",
    "bloodGroup": "A+",
    "region": "Region Name",
    "district": "District Name",
    "phone": "0123456789",
    ...other fields
  }
]
```

## Frontend Implementation

### File: `src/Pages/SearchDonors/SearchDonors.jsx`

**Key Changes:**
1. Updated `useQuery` hook to call `/search-donors` endpoint
2. Properly builds query string from search parameters
3. Error handling with try-catch
4. Returns empty array if error occurs
5. All filter parameters are optional

**How It Works:**

```javascript
const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search-donors', searchParams],
    enabled: !!searchParams,
    queryFn: async () => {
        try {
            // Build query string from search parameters
            const queryParams = new URLSearchParams();
            if (searchParams.bloodGroup) queryParams.append('bloodGroup', searchParams.bloodGroup);
            if (searchParams.region) queryParams.append('region', searchParams.region);
            if (searchParams.district) queryParams.append('district', searchParams.district);
            
            // Call backend API with filters
            const res = await axiosSecure.get(`/search-donors?${queryParams.toString()}`);
            return res.data || [];
        } catch (error) {
            console.error('Error fetching donors:', error);
            return [];
        }
    }
});
```

## Features
✅ **Search Filters:**
- Blood Group selector
- Region dropdown (dynamic from servicecenter.json)
- District dropdown (dependent on selected region)

✅ **Results Display:**
- Card-based layout
- Donor details (name, blood group, region, district, phone)
- Contact Donor button
- 6 results per page

✅ **Pagination:**
- Previous/Next buttons
- Page numbers
- Disabled buttons at boundaries

✅ **Error Handling:**
- Try-catch block in query function
- Returns empty array on error
- Graceful fallback UI

## User Flow

1. Navigate to `/search-donors`
2. Select search criteria (at least one):
   - Blood Group
   - Region
   - District (only if region selected)
3. Click "Search Donors"
4. View results with pagination
5. Click "Contact Donor" for specific donor
6. Use "Reset" to clear filters

## API Integration Points

**Request:**
```
GET https://blooddonation-gold.vercel.app/search-donors?bloodGroup=A+&region=Dhaka
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "bloodGroup": "A+",
    "region": "Dhaka",
    "district": "Dhaka Sadar",
    "name": "John Doe",
    "phone": "01712345678"
  }
]
```

**Error Response (500):**
```json
{
  "message": "Error searching donors",
  "error": "Database connection failed"
}
```

## Query String Examples

**Search by blood group only:**
```
GET /search-donors?bloodGroup=A+
```

**Search by region only:**
```
GET /search-donors?region=Dhaka
```

**Search by all filters:**
```
GET /search-donors?bloodGroup=A+&region=Dhaka&district=Dhaka%20Sadar
```

## Database Query Structure (Backend)

The backend builds a filter object:
```javascript
const filter = {};

if (bloodGroup) {
    filter.bloodGroup = bloodGroup;
}

if (region) {
    filter.region = region;
}

if (district) {
    filter.district = district;
}

// Query: db.collection('donors').find(filter).toArray();
```

## Notes
- All parameters are optional (flexible search)
- Component uses `useAxiosSecure` for authenticated requests
- JWT token automatically included in Authorization header
- React Query caches results for performance
- Pagination handled on frontend
- No breaking changes to existing functionality
