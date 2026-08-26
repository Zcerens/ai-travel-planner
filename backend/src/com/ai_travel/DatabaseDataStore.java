package com.ai_travel;

import java.sql.*;
import java.util.*;

public class DatabaseDataStore extends DataStore {
    private Connection connection;
    private boolean isAvailable;

    public DatabaseDataStore(String placesJson, String restaurantsJson) {
        super(placesJson, restaurantsJson);

        DatabaseConnection dbConn = DatabaseConnection.getInstance();
        this.connection = dbConn.getConnection();
        this.isAvailable = dbConn.isConnected();

        if (this.isAvailable) {
            initializeTables();
        }
    }

    private void initializeTables() {
        try {
            // Create tables if not exists
            String createPlacesTable = "CREATE TABLE IF NOT EXISTS places (\n" +
                "id VARCHAR(100) PRIMARY KEY,\n" +
                "name VARCHAR(255) NOT NULL,\n" +
                "type VARCHAR(50),\n" +
                "category VARCHAR(50),\n" +
                "lat DECIMAL(10, 6),\n" +
                "lng DECIMAL(10, 6),\n" +
                "city VARCHAR(100),\n" +
                "description TEXT,\n" +
                "entrance_fee INTEGER,\n" +
                "student_fee INTEGER,\n" +
                "museum_card_valid BOOLEAN,\n" +
                "opening_hours VARCHAR(100),\n" +
                "estimated_visit_duration INTEGER,\n" +
                "google_rating DECIMAL(3, 1),\n" +
                "review_count INTEGER,\n" +
                "highlights TEXT\n" +
                ");";

            String createRestaurantsTable = "CREATE TABLE IF NOT EXISTS restaurants (\n" +
                "id VARCHAR(100) PRIMARY KEY,\n" +
                "name VARCHAR(255) NOT NULL,\n" +
                "type VARCHAR(50),\n" +
                "city VARCHAR(100),\n" +
                "lat DECIMAL(10, 6),\n" +
                "lng DECIMAL(10, 6),\n" +
                "cuisine VARCHAR(100),\n" +
                "price_level INTEGER,\n" +
                "google_rating DECIMAL(3, 1),\n" +
                "review_count INTEGER,\n" +
                "opening_hours VARCHAR(100),\n" +
                "average_duration INTEGER,\n" +
                "highlights TEXT\n" +
                ");";

            Statement stmt = connection.createStatement();
            stmt.execute(createPlacesTable);
            stmt.execute(createRestaurantsTable);
            stmt.close();

            // Check if data exists
            Statement checkStmt = connection.createStatement();
            ResultSet rs = checkStmt.executeQuery("SELECT COUNT(*) FROM places;");
            rs.next();
            int placeCount = rs.getInt(1);
            rs.close();
            checkStmt.close();

            // If tables are empty, import from JSON
            if (placeCount == 0) {
                importDataFromMemory();
            }

            System.out.println("✓ Database tables initialized with " + placeCount + " places");
        } catch (SQLException e) {
            System.out.println("⚠ Error initializing database tables: " + e.getMessage());
            this.isAvailable = false;
        }
    }

    @SuppressWarnings("unchecked")
    private void importDataFromMemory() {
        try {
            // Clear existing data
            Statement clearStmt = connection.createStatement();
            clearStmt.execute("DELETE FROM places;");
            clearStmt.execute("DELETE FROM restaurants;");
            clearStmt.close();

            // Import places
            List<Map<String, Object>> places = getPlaces();
            String insertPlace = "INSERT INTO places (id, name, type, category, lat, lng, city, description, entrance_fee, student_fee, museum_card_valid, opening_hours, estimated_visit_duration, google_rating, review_count, highlights) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            PreparedStatement placeStmt = connection.prepareStatement(insertPlace);
            for (Map<String, Object> place : places) {
                placeStmt.setString(1, (String) place.get("id"));
                placeStmt.setString(2, (String) place.get("name"));
                placeStmt.setString(3, (String) place.get("type"));
                placeStmt.setString(4, (String) place.get("category"));
                placeStmt.setObject(5, place.get("lat"));
                placeStmt.setObject(6, place.get("lng"));
                placeStmt.setString(7, (String) place.get("city"));
                placeStmt.setString(8, (String) place.get("description"));
                placeStmt.setObject(9, place.get("entrance_fee"));
                placeStmt.setObject(10, place.get("student_fee"));
                placeStmt.setObject(11, place.get("museum_card_valid"));
                placeStmt.setString(12, (String) place.get("opening_hours"));
                placeStmt.setObject(13, place.get("estimated_visit_duration"));
                placeStmt.setObject(14, place.get("google_rating"));
                placeStmt.setObject(15, place.get("review_count"));

                List<String> highlights = (List<String>) place.get("highlights");
                String highlightsStr = highlights != null ? String.join(", ", highlights) : "";
                placeStmt.setString(16, highlightsStr);

                placeStmt.addBatch();
            }
            placeStmt.executeBatch();
            placeStmt.close();

            // Import restaurants
            List<Map<String, Object>> restaurants = getRestaurants();
            String insertRestaurant = "INSERT INTO restaurants (id, name, type, city, lat, lng, cuisine, price_level, google_rating, review_count, opening_hours, average_duration, highlights) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            PreparedStatement restStmt = connection.prepareStatement(insertRestaurant);
            for (Map<String, Object> rest : restaurants) {
                restStmt.setString(1, (String) rest.get("id"));
                restStmt.setString(2, (String) rest.get("name"));
                restStmt.setString(3, (String) rest.get("type"));
                restStmt.setString(4, (String) rest.get("city"));
                restStmt.setObject(5, rest.get("lat"));
                restStmt.setObject(6, rest.get("lng"));
                restStmt.setString(7, (String) rest.get("cuisine"));
                restStmt.setObject(8, rest.get("price_level"));
                restStmt.setObject(9, rest.get("google_rating"));
                restStmt.setObject(10, rest.get("review_count"));
                restStmt.setString(11, (String) rest.get("opening_hours"));
                restStmt.setObject(12, rest.get("average_duration"));

                List<String> highlights = (List<String>) rest.get("highlights");
                String highlightsStr = highlights != null ? String.join(", ", highlights) : "";
                restStmt.setString(13, highlightsStr);

                restStmt.addBatch();
            }
            restStmt.executeBatch();
            restStmt.close();

            System.out.println("✓ Imported " + places.size() + " places and " + restaurants.size() + " restaurants into database");
        } catch (SQLException e) {
            System.out.println("⚠ Error importing data: " + e.getMessage());
        }
    }

    @Override
    public List<Map<String, Object>> getPlacesByCity(String city) {
        if (!isAvailable) {
            return super.getPlacesByCity(city);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        try {
            String query = "SELECT * FROM places WHERE city = ? ORDER BY google_rating DESC;";
            PreparedStatement stmt = connection.prepareStatement(query);
            stmt.setString(1, city);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, Object> place = new LinkedHashMap<>();
                place.put("id", rs.getString("id"));
                place.put("name", rs.getString("name"));
                place.put("type", rs.getString("type"));
                place.put("category", rs.getString("category"));
                place.put("lat", rs.getDouble("lat"));
                place.put("lng", rs.getDouble("lng"));
                place.put("city", rs.getString("city"));
                place.put("description", rs.getString("description"));
                place.put("entrance_fee", rs.getInt("entrance_fee"));
                place.put("student_fee", rs.getInt("student_fee"));
                place.put("museum_card_valid", rs.getBoolean("museum_card_valid"));
                place.put("opening_hours", rs.getString("opening_hours"));
                place.put("estimated_visit_duration", rs.getInt("estimated_visit_duration"));
                place.put("google_rating", rs.getDouble("google_rating"));
                place.put("review_count", rs.getInt("review_count"));

                String highlightsStr = rs.getString("highlights");
                List<String> highlights = new ArrayList<>();
                if (highlightsStr != null && !highlightsStr.isEmpty()) {
                    highlights = Arrays.asList(highlightsStr.split(", "));
                }
                place.put("highlights", highlights);

                result.add(place);
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("⚠ Error querying places: " + e.getMessage());
            return super.getPlacesByCity(city);
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> getRestaurantsByCity(String city) {
        if (!isAvailable) {
            return super.getRestaurantsByCity(city);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        try {
            String query = "SELECT * FROM restaurants WHERE city = ? ORDER BY google_rating DESC;";
            PreparedStatement stmt = connection.prepareStatement(query);
            stmt.setString(1, city);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Map<String, Object> rest = new LinkedHashMap<>();
                rest.put("id", rs.getString("id"));
                rest.put("name", rs.getString("name"));
                rest.put("type", rs.getString("type"));
                rest.put("city", rs.getString("city"));
                rest.put("lat", rs.getDouble("lat"));
                rest.put("lng", rs.getDouble("lng"));
                rest.put("cuisine", rs.getString("cuisine"));
                rest.put("price_level", rs.getInt("price_level"));
                rest.put("google_rating", rs.getDouble("google_rating"));
                rest.put("review_count", rs.getInt("review_count"));
                rest.put("opening_hours", rs.getString("opening_hours"));
                rest.put("average_duration", rs.getInt("average_duration"));

                String highlightsStr = rs.getString("highlights");
                List<String> highlights = new ArrayList<>();
                if (highlightsStr != null && !highlightsStr.isEmpty()) {
                    highlights = Arrays.asList(highlightsStr.split(", "));
                }
                rest.put("highlights", highlights);

                result.add(rest);
            }

            rs.close();
            stmt.close();
        } catch (SQLException e) {
            System.out.println("⚠ Error querying restaurants: " + e.getMessage());
            return super.getRestaurantsByCity(city);
        }

        return result;
    }
}
