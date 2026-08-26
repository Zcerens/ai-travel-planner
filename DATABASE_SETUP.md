# Database Setup Guide

## Overview
The AI Travel Planner backend now supports PostgreSQL database integration while maintaining JSON fallback for development.

## Architecture

### Current Setup
- **Backend**: Java 21
- **Database**: PostgreSQL (recommended) or JSON (fallback)
- **Driver**: PostgreSQL JDBC 42.6.0
- **Deployment**: Railway with automatic PostgreSQL addon

### How It Works

1. **DatabaseConnection.java**: Manages PostgreSQL connection
   - Reads `DATABASE_URL` from Railway environment
   - Falls back to local development if not configured
   - Graceful error handling if database unavailable

2. **DatabaseDataStore.java**: Extends DataStore with SQL queries
   - Auto-creates tables on first run
   - Imports JSON data into PostgreSQL on first connection
   - Falls back to JSON parsing if database unavailable
   - All queries are parameterized (SQL injection safe)

3. **Main.java**: Uses DatabaseDataStore instead of plain DataStore
   - Automatic PostgreSQL/JSON selection
   - Zero code changes needed for production

## Railway Setup

### Step 1: Add PostgreSQL to Railway Project
1. Open Railway dashboard: https://railway.app
2. Go to your `ai-travel-planner` project
3. Click "+ Create" button
4. Select "PostgreSQL"
5. Railway will automatically set these environment variables:
   - `DATABASE_URL` (connection string)
   - `PGUSER` (database user)
   - `PGPASSWORD` (database password)

### Step 2: Deploy
Just push your code - Railway handles the rest:
```bash
git push origin main
```

The deployment will:
1. Build Docker image
2. Download PostgreSQL JDBC driver
3. Start backend with database connection
4. Auto-initialize tables
5. Import JSON data on first run

## Local Development

### Option A: Use JSON (No Setup Required)
- Backend runs with JSON files automatically
- No database needed
- Perfect for development

### Option B: Use Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql@15  # macOS
# or
sudo apt install postgresql  # Linux

# Start PostgreSQL
brew services start postgresql@15

# Create database
psql -U postgres -c "CREATE DATABASE ai_travel;"

# Environment variables
export DATABASE_URL="jdbc:postgresql://localhost:5432/ai_travel"
export PGUSER="postgres"
export PGPASSWORD="postgres"

# Run backend
cd backend
javac -d out src/com/ai_travel/*.java
java -cp .:lib/postgresql-42.6.0.jar com.ai_travel.Main
```

## Database Schema

### places table
```sql
CREATE TABLE places (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  category VARCHAR(50),
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  city VARCHAR(100),
  description TEXT,
  entrance_fee INTEGER,
  student_fee INTEGER,
  museum_card_valid BOOLEAN,
  opening_hours VARCHAR(100),
  estimated_visit_duration INTEGER,
  google_rating DECIMAL(3, 1),
  review_count INTEGER,
  highlights TEXT
);
```

### restaurants table
```sql
CREATE TABLE restaurants (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  city VARCHAR(100),
  lat DECIMAL(10, 6),
  lng DECIMAL(10, 6),
  cuisine VARCHAR(100),
  price_level INTEGER,
  google_rating DECIMAL(3, 1),
  review_count INTEGER,
  opening_hours VARCHAR(100),
  average_duration INTEGER,
  highlights TEXT
);
```

## Monitoring

### Check Database Status
```bash
# In Railway dashboard or CLI
railway status

# Or via psql (if local)
psql -U postgres -d ai_travel -c "SELECT COUNT(*) FROM places;"
```

### Troubleshooting

**Database connection fails?**
- Check Railway PostgreSQL addon is created
- Verify environment variables are set
- Check backend logs for connection errors

**Tables not created?**
- Check PostgreSQL is running
- Verify user has create table permissions
- Check logs for SQL errors

**Data not imported?**
- Backend imports on first connection
- Check JSON files exist in `data/` folder
- Verify format is correct

## Future Improvements

- [ ] Add data migration tools
- [ ] Implement connection pooling (HikariCP)
- [ ] Add query caching for better performance
- [ ] Create admin API for database management
- [ ] Add backups to S3
- [ ] Implement real-time sync for data updates

## Migration from JSON to PostgreSQL

No migration needed! The system automatically:
1. Detects if database is available
2. Creates tables if needed
3. Imports JSON data on first run
4. Uses database for all future queries

To force re-import:
```sql
-- In PostgreSQL
TRUNCATE TABLE places;
TRUNCATE TABLE restaurants;
-- Backend will re-import on next startup
```
