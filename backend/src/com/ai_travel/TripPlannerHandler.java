package com.ai_travel;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

public class TripPlannerHandler implements HttpHandler {
    private TravelPlanner planner;

    public TripPlannerHandler(TravelPlanner planner) {
        this.planner = planner;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String origin = exchange.getRequestHeaders().getFirst("Origin");

        // CORS headers
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().add("Content-Type", "application/json");

        if ("OPTIONS".equals(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(200, -1);
            exchange.close();
            return;
        }

        if ("POST".equals(exchange.getRequestMethod())) {
            try {
                byte[] body = exchange.getRequestBody().readAllBytes();
                String requestBody = new String(body);

                // Basit JSON parse
                @SuppressWarnings("unchecked")
                Map<String, Object> request = parseRequest(requestBody);

                // Planı oluştur
                Map<String, Object> plan = planner.planTrip(request);

                // JSON response oluştur
                String response = mapToJson(plan);

                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } catch (Exception e) {
                String error = "{\"error\":\"" + e.getMessage() + "\"}";
                exchange.sendResponseHeaders(400, error.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(error.getBytes());
                os.close();
            }
        } else {
            String error = "{\"error\":\"Method not allowed\"}";
            exchange.sendResponseHeaders(405, error.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(error.getBytes());
            os.close();
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseRequest(String json) {
        // TODO: Basit JSON parser - DataStore'deki gibi
        Map<String, Object> map = new java.util.LinkedHashMap<>();

        // Dummy parse
        if (json.contains("\"startCity\"")) {
            int idx = json.indexOf("\"startCity\":\"") + 13;
            int end = json.indexOf("\"", idx);
            map.put("startCity", json.substring(idx, end));
        }

        if (json.contains("\"departureTime\"")) {
            int idx = json.indexOf("\"departureTime\":\"") + 17;
            int end = json.indexOf("\"", idx);
            map.put("departureTime", json.substring(idx, end));
        }

        if (json.contains("\"destinations\"")) {
            // Array parse
            int idx = json.indexOf("\"destinations\":[") + 16;
            int end = json.indexOf("]", idx);
            String arrStr = json.substring(idx, end);
            java.util.List<String> dests = new java.util.ArrayList<>();
            for (String item : arrStr.split(",")) {
                item = item.trim();
                if (item.startsWith("\"") && item.endsWith("\"")) {
                    dests.add(item.substring(1, item.length() - 1));
                }
            }
            map.put("destinations", dests);
        }

        if (json.contains("\"interests\"")) {
            int idx = json.indexOf("\"interests\":[") + 13;
            int end = json.indexOf("]", idx);
            String arrStr = json.substring(idx, end);
            java.util.List<String> interests = new java.util.ArrayList<>();
            for (String item : arrStr.split(",")) {
                item = item.trim();
                if (item.startsWith("\"") && item.endsWith("\"")) {
                    interests.add(item.substring(1, item.length() - 1));
                }
            }
            map.put("interests", interests);
        }

        if (json.contains("\"returnLocation\"")) {
            int idx = json.indexOf("\"returnLocation\":\"") + 18;
            int end = json.indexOf("\"", idx);
            map.put("returnLocation", json.substring(idx, end));
        }

        if (json.contains("\"tripDays\"")) {
            int idx = json.indexOf("\"tripDays\":") + 11;
            int end = json.indexOf(",", idx);
            if (end == -1) end = json.indexOf("}", idx);
            String value = json.substring(idx, end).trim();
            try {
                map.put("tripDays", Integer.parseInt(value));
            } catch (NumberFormatException e) {
                map.put("tripDays", 2);
            }
        }

        return map;
    }

    private String mapToJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");

        int count = 0;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (count > 0) sb.append(",");
            sb.append("\"").append(entry.getKey()).append("\":");
            sb.append(valueToJson(entry.getValue()));
            count++;
        }

        sb.append("}");
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private String valueToJson(Object value) {
        if (value == null) {
            return "null";
        } else if (value instanceof String) {
            return "\"" + escapeJson((String) value) + "\"";
        } else if (value instanceof Number) {
            return value.toString();
        } else if (value instanceof Boolean) {
            return value.toString();
        } else if (value instanceof Map) {
            return mapToJson((Map<String, Object>) value);
        } else if (value instanceof java.util.List) {
            java.util.List<?> list = (java.util.List<?>) value;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(valueToJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        }
        return "\"" + value.toString() + "\"";
    }

    private String escapeJson(String str) {
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}
