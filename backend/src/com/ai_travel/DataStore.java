package com.ai_travel;

import java.util.*;

public class DataStore {
    private List<Map<String, Object>> places;
    private List<Map<String, Object>> restaurants;

    public DataStore(String placesJson, String restaurantsJson) {
        this.places = parseJson(placesJson);
        this.restaurants = parseJson(restaurantsJson);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseJson(String json) {
        // Basit JSON parser - places/restaurants array'ini çeker
        json = json.trim();
        if (json.startsWith("{")) {
            int arrayStart = json.indexOf("[");
            int arrayEnd = json.lastIndexOf("]");
            json = json.substring(arrayStart, arrayEnd + 1);
        }

        List<Map<String, Object>> list = new ArrayList<>();
        int depth = 0;
        int objectStart = -1;

        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '{') {
                if (depth == 0) objectStart = i;
                depth++;
            } else if (c == '}') {
                depth--;
                if (depth == 0 && objectStart != -1) {
                    String obj = json.substring(objectStart, i + 1);
                    list.add(parseObject(obj));
                }
            }
        }

        return list;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseObject(String json) {
        Map<String, Object> map = new LinkedHashMap<>();
        json = json.substring(1, json.length() - 1).trim();

        int i = 0;
        while (i < json.length()) {
            // Key'i bul
            if (json.charAt(i) == '"') {
                int keyEnd = json.indexOf('"', i + 1);
                String key = json.substring(i + 1, keyEnd);

                // Value'yu bul
                int colonIdx = json.indexOf(':', keyEnd);
                int valueStart = colonIdx + 1;
                while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
                    valueStart++;
                }

                // Value type'ını belirle
                Object value = null;
                int valueEnd = valueStart;
                char firstChar = json.charAt(valueStart);

                if (firstChar == '"') {
                    // String
                    valueEnd = json.indexOf('"', valueStart + 1);
                    value = json.substring(valueStart + 1, valueEnd);
                    valueEnd++;
                } else if (firstChar == '{') {
                    // Nested object
                    int depth = 1;
                    valueEnd = valueStart + 1;
                    while (depth > 0 && valueEnd < json.length()) {
                        if (json.charAt(valueEnd) == '{') depth++;
                        if (json.charAt(valueEnd) == '}') depth--;
                        valueEnd++;
                    }
                    value = parseObject(json.substring(valueStart, valueEnd));
                } else if (firstChar == '[') {
                    // Array
                    int depth = 1;
                    valueEnd = valueStart + 1;
                    while (depth > 0 && valueEnd < json.length()) {
                        if (json.charAt(valueEnd) == '[') depth++;
                        if (json.charAt(valueEnd) == ']') depth--;
                        valueEnd++;
                    }
                    String arrStr = json.substring(valueStart + 1, valueEnd - 1);
                    List<Object> arr = new ArrayList<>();
                    for (String item : arrStr.split(",")) {
                        item = item.trim();
                        if (item.startsWith("\"") && item.endsWith("\"")) {
                            arr.add(item.substring(1, item.length() - 1));
                        }
                    }
                    value = arr;
                } else if (firstChar == 't' || firstChar == 'f') {
                    // Boolean
                    valueEnd = json.indexOf(',', valueStart);
                    if (valueEnd == -1) valueEnd = json.length();
                    value = Boolean.parseBoolean(json.substring(valueStart, valueEnd).trim());
                } else if (Character.isDigit(firstChar) || firstChar == '-') {
                    // Number
                    valueEnd = valueStart;
                    while (valueEnd < json.length() &&
                           (Character.isDigit(json.charAt(valueEnd)) || json.charAt(valueEnd) == '.' || json.charAt(valueEnd) == '-')) {
                        valueEnd++;
                    }
                    String numStr = json.substring(valueStart, valueEnd).trim();
                    if (numStr.contains(".")) {
                        value = Double.parseDouble(numStr);
                    } else {
                        value = Long.parseLong(numStr);
                    }
                }

                map.put(key, value);

                i = valueEnd;
                while (i < json.length() && (json.charAt(i) == ',' || Character.isWhitespace(json.charAt(i)))) {
                    i++;
                }
            } else {
                i++;
            }
        }

        return map;
    }

    public List<Map<String, Object>> getPlaces() {
        return places;
    }

    public List<Map<String, Object>> getRestaurants() {
        return restaurants;
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getPlacesByCity(String city) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> place : places) {
            if (city.equals(place.get("city"))) {
                result.add(place);
            }
        }
        return result;
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRestaurantsByCity(String city) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> restaurant : restaurants) {
            if (city.equals(restaurant.get("city"))) {
                result.add(restaurant);
            }
        }
        return result;
    }
}
