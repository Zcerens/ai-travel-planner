package com.ai_travel;

import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        String portEnv = System.getenv("PORT");
        if (portEnv != null) {
            try {
                port = Integer.parseInt(portEnv);
            } catch (NumberFormatException ignored) {}
        }

        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 0);

        // Load data
        String placesData = new String(Files.readAllBytes(Paths.get("data/places.json")));
        String restaurantsData = new String(Files.readAllBytes(Paths.get("data/restaurants.json")));

        // Try to use PostgreSQL, fallback to JSON if not available
        DataStore dataStore = new DatabaseDataStore(placesData, restaurantsData);
        TravelPlanner planner = new TravelPlanner(dataStore);

        // Routes
        server.createContext("/api/plan-trip", new TripPlannerHandler(planner));
        server.createContext("/api/health", exchange -> {
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
        });

        server.setExecutor(null);
        server.start();
        System.out.println("✓ AI Travel Planner backend started on http://0.0.0.0:" + port);
    }
}
