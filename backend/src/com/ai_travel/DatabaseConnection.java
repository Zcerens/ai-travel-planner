package com.ai_travel;

import java.sql.*;

public class DatabaseConnection {
    private static DatabaseConnection instance;
    private Connection connection;

    private DatabaseConnection() {
        try {
            // PostgreSQL JDBC driver
            Class.forName("org.postgresql.Driver");

            // Railway PostgreSQL connection - USE PRIVATE URL
            String dbUrl = System.getenv("DATABASE_PRIVATE_URL");
            
            if (dbUrl == null || dbUrl.isEmpty()) {
                // Fallback to local development
                dbUrl = "jdbc:postgresql://localhost:5432/ai_travel";
            }

            String dbUser = System.getenv("PGUSER");
            if (dbUser == null) dbUser = "postgres";

            String dbPassword = System.getenv("PGPASSWORD");
            if (dbPassword == null) dbPassword = "postgres";

            this.connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
            System.out.println("✓ Connected to PostgreSQL database");
        } catch (ClassNotFoundException e) {
            System.out.println("⚠ PostgreSQL JDBC driver not found - will use JSON fallback");
        } catch (SQLException e) {
            System.out.println("⚠ Database connection failed - will use JSON fallback: " + e.getMessage());
        }
    }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    public Connection getConnection() {
        return connection;
    }

    public boolean isConnected() {
        try {
            return connection != null && !connection.isClosed();
        } catch (SQLException e) {
            return false;
        }
    }

    public void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            System.out.println("Error closing database connection: " + e.getMessage());
        }
    }
}
