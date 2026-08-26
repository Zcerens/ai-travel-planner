# Test Plan for PostgreSQL Integration

## Pre-Production Tests

### 1. Local JSON Test (Already Working)
```bash
cd backend
javac -d out src/com/ai_travel/*.java
java -cp . com.ai_travel.Main
```
✓ Should start successfully with JSON fallback
✓ Should log "⚠ PostgreSQL JDBC driver not found"

### 2. Docker Build Test
```bash
docker build -f backend/Dockerfile -t ai-travel-backend .
docker run -p 8080:8080 ai-travel-backend
```
✓ Should download PostgreSQL JDBC driver
✓ Should compile successfully
✓ Should start on port 8080

### 3. Railway Deployment Test
After pushing to GitHub and adding PostgreSQL addon:

**Deployment Checklist:**
- [ ] Git commits pushed to GitHub
- [ ] Railway detects new commits
- [ ] Docker build starts
- [ ] PostgreSQL addon is created
- [ ] Environment variables are set:
  - [ ] DATABASE_URL
  - [ ] PGUSER
  - [ ] PGPASSWORD
- [ ] Backend builds successfully
- [ ] Backend starts with PostgreSQL
- [ ] Tables are created automatically
- [ ] JSON data is imported

### 4. API Tests

**Trip Planning Endpoint:**
```bash
curl -X POST http://localhost:8080/api/plan-trip \
  -H "Content-Type: application/json" \
  -d '{
    "startCity": "Ankara",
    "departureTime": "2024-08-26T08:00",
    "destinations": ["Denizli", "Antalya"],
    "returnLocation": "Ankara",
    "tripDays": 3,
    "interests": ["history", "nature"]
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "totalPlaces": 15,
  "tripDays": 3,
  "returnLocation": "Ankara",
  "dailyPlans": [
    {
      "from": "Ankara",
      "to": "Denizli",
      "date": "2024-08-26",
      "itinerary": [...]
    }
  ]
}
```

### 5. Variety Test (Run Multiple Times)

Run the same API request 5 times with same parameters:
```bash
for i in {1..5}; do
  echo "Request $i:"
  curl -s -X POST http://localhost:8080/api/plan-trip \
    -H "Content-Type: application/json" \
    -d '{"startCity":"Istanbul","departureTime":"2024-08-26T08:00","destinations":["Ankara"],"interests":["history"]}'
  echo ""
done
```

**Expected Behavior:**
- ✓ Each request returns different attractions
- ✓ Different restaurants for meals
- ✓ No duplicate "350km 3 hour 30 min" pattern
- ✓ All variations use interest filtering (mostly history)

### 6. Database Verification

Once running with PostgreSQL, verify data:
```sql
-- Connect to Railway PostgreSQL
PGPASSWORD=<password> psql -h <host> -U <user> -d postgres -c "
SELECT COUNT(*) as total_places FROM places;
SELECT COUNT(*) as total_restaurants FROM restaurants;
SELECT DISTINCT city FROM places ORDER BY city;
"
```

Expected counts:
- `total_places`: 52
- `total_restaurants`: 62
- `cities`: 16

### 7. Fallback Test

If PostgreSQL is unavailable:
- [ ] Backend should log "⚠ Database connection failed"
- [ ] Backend should continue running with JSON
- [ ] All API endpoints should work normally
- [ ] Response quality should be identical to normal operation

## Performance Metrics

### Before (JSON)
- Startup time: ~100ms
- Per-request latency: ~50ms
- Memory: ~50MB
- Data queries: In-memory filtering

### After (PostgreSQL)
- Startup time: ~500ms (initial import)
- Per-request latency: ~100ms (after caching)
- Memory: ~100MB (query result caching)
- Data queries: SQL indexed lookups

## Rollback Plan

If PostgreSQL causes issues:
1. Remove DATABASE_URL environment variable
2. Backend automatically falls back to JSON
3. No code changes needed
4. No data loss

## Success Criteria

✅ All tests pass
✅ No increase in error rate
✅ Response times acceptable (<500ms)
✅ Database automatically initialized
✅ Data variety confirmed (different results per request)
✅ Graceful fallback works
✅ No breaking changes to API
