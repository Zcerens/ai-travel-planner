package com.ai_travel;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class TravelPlanner {
    private DataStore dataStore;
    private static final double EARTH_RADIUS_KM = 6371.0;

    public TravelPlanner(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> planTrip(Map<String, Object> request) {
        String startCity = (String) request.get("startCity");
        String departureTime = (String) request.get("departureTime");
        List<String> destinations = (List<String>) request.get("destinations");
        List<String> interests = (List<String>) request.get("interests");

        // Parse departure time
        LocalDateTime currentTime = LocalDateTime.parse(departureTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> dailyPlans = new ArrayList<>();

        // Her hedef şehir için plan oluştur
        String previousCity = startCity;
        for (int dayIndex = 0; dayIndex < destinations.size(); dayIndex++) {
            String destCity = destinations.get(dayIndex);
            Map<String, Object> dayPlan = planDay(previousCity, destCity, currentTime, interests);
            dailyPlans.add(dayPlan);

            // Sonraki günün başlangıç saati = bu günün bitiş saati
            long arrivalTime = (long) dayPlan.get("estimatedArrivalTime");
            currentTime = LocalDateTime.ofInstant(
                java.time.Instant.ofEpochMilli(arrivalTime),
                java.time.ZoneId.systemDefault()
            ).plusDays(1).withHour(8).withMinute(0).withSecond(0);

            previousCity = destCity;
        }

        result.put("status", "success");
        result.put("totalPlaces", getTotalPlaces(dailyPlans));
        result.put("estimatedDuration", calculateTotalDuration(dailyPlans));
        result.put("dailyPlans", dailyPlans);

        return result;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> planDay(String from, String to, LocalDateTime startTime, List<String> interests) {
        Map<String, Object> dayPlan = new LinkedHashMap<>();
        dayPlan.put("from", from);
        dayPlan.put("to", to);
        dayPlan.put("date", startTime.toLocalDate().toString());

        // Güzergâh oluştur
        List<Map<String, Object>> itinerary = new ArrayList<>();
        LocalDateTime currentTime = startTime;

        // Başlangıç
        Map<String, Object> startStop = new LinkedHashMap<>();
        startStop.put("time", currentTime.toString());
        startStop.put("type", "departure");
        startStop.put("location", from);
        startStop.put("title", from + "'dan hareket");
        startStop.put("duration", 0);
        itinerary.add(startStop);

        // Kahvaltı (06:00-09:00 arasında)
        if (currentTime.getHour() >= 6 && currentTime.getHour() < 9) {
            currentTime = addStop(itinerary, currentTime, "breakfast", from, 45);
        }

        // Mola noktaları ve yerler
        List<Map<String, Object>> attractions = selectAttractions(to, from, interests);

        // İlk aktiviteye seyahat süresi ekle (başlangıç şehrinden hedefe)
        String lastActivityCity = from;
        if (!attractions.isEmpty()) {
            String firstActivityCity = (String) attractions.get(0).get("city");
            double travelDistToFirst = calculateDistance(from, firstActivityCity);
            long travelMinsToFirst = (long) Math.ceil(travelDistToFirst / 100.0 * 60);
            currentTime = currentTime.plusMinutes(travelMinsToFirst);
        }

        // Günlük aktiviteler
        for (int i = 0; i < attractions.size(); i++) {
            Map<String, Object> attraction = attractions.get(i);
            String type = (String) attraction.get("type");
            String activityCity = (String) attraction.get("city");
            int estimatedDuration = ((Number) attraction.get("estimated_visit_duration")).intValue();

            // Öğle yemeği (12:00-13:30)
            if (currentTime.getHour() >= 11 && currentTime.getHour() < 12) {
                currentTime = addStop(itinerary, currentTime, "lunch", to, 60);
            }

            // Aktivite ekle
            Map<String, Object> activity = new LinkedHashMap<>();
            activity.put("time", currentTime.toString());
            activity.put("type", type);
            activity.put("title", (String) attraction.get("name"));
            activity.put("location", activityCity);
            activity.put("duration", estimatedDuration);
            activity.put("price", attraction.get("entrance_fee"));
            activity.put("rating", attraction.get("google_rating"));
            activity.put("highlights", attraction.get("highlights"));
            // Harita için koordinatlar
            activity.put("lat", attraction.get("lat"));
            activity.put("lng", attraction.get("lng"));
            itinerary.add(activity);

            currentTime = currentTime.plusMinutes(estimatedDuration);
            lastActivityCity = activityCity;

            // Kahve molası
            if (Math.random() > 0.6 && currentTime.getHour() >= 15 && currentTime.getHour() < 17) {
                currentTime = addStop(itinerary, currentTime, "coffee", to, 20);
            }

            // Sonraki aktiviteye seyahat süresi ekle
            if (i < attractions.size() - 1) {
                String nextActivityCity = (String) attractions.get(i + 1).get("city");
                double travelDistToNext = calculateDistance(activityCity, nextActivityCity);
                long travelMinsToNext = (long) Math.ceil(travelDistToNext / 100.0 * 60);
                currentTime = currentTime.plusMinutes(travelMinsToNext);
            }
        }

        // Akşam yemeği
        if (currentTime.getHour() >= 17 && currentTime.getHour() < 19) {
            currentTime = addStop(itinerary, currentTime, "dinner", to, 75);
        }

        // Varış - son aktivite/şehrinden hedefe seyahat süresi
        double distance = calculateDistance(lastActivityCity, to);
        long travelMinutes = (long) Math.ceil(distance / 100.0 * 60); // 100km/saat = 1 dakika/km
        currentTime = currentTime.plusMinutes(travelMinutes);

        Map<String, Object> endStop = new LinkedHashMap<>();
        endStop.put("time", currentTime.toString());
        endStop.put("type", "arrival");
        endStop.put("location", to);
        endStop.put("title", to + "'ye varış");
        endStop.put("duration", 0);
        itinerary.add(endStop);

        dayPlan.put("itinerary", itinerary);
        dayPlan.put("estimatedArrivalTime", currentTime.atZone(java.time.ZoneId.systemDefault()).toInstant().toEpochMilli());
        dayPlan.put("totalDistance", (long)distance + " km");
        dayPlan.put("estimatedDrivingTime", (travelMinutes / 60) + " saat " + (travelMinutes % 60) + " dakika");

        return dayPlan;
    }

    @SuppressWarnings("unchecked")
    private LocalDateTime addStop(List<Map<String, Object>> itinerary, LocalDateTime currentTime,
                                   String type, String city, int duration) {
        List<Map<String, Object>> restaurants = dataStore.getRestaurantsByCity(city);
        if (restaurants.isEmpty()) {
            return currentTime;
        }

        // Türe uygun restoran bul
        Map<String, Object> selectedRestaurant = restaurants.stream()
            .filter(r -> type.equals(r.get("type")))
            .findFirst()
            .orElse(restaurants.get(0));

        Map<String, Object> stop = new LinkedHashMap<>();
        stop.put("time", currentTime.toString());
        stop.put("type", type);
        stop.put("title", (String) selectedRestaurant.get("name"));
        stop.put("location", (String) selectedRestaurant.get("city"));
        stop.put("duration", duration);
        stop.put("rating", selectedRestaurant.get("google_rating"));
        stop.put("price_level", selectedRestaurant.get("price_level"));
        // Harita için koordinatlar
        stop.put("lat", selectedRestaurant.get("lat"));
        stop.put("lng", selectedRestaurant.get("lng"));
        itinerary.add(stop);

        return currentTime.plusMinutes(duration);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> selectAttractions(String city, String fromCity, List<String> interests) {
        List<Map<String, Object>> cityPlaces = dataStore.getPlacesByCity(city);
        List<Map<String, Object>> selected = new ArrayList<>();

        // İlgilere göre yerler seç
        for (Map<String, Object> place : cityPlaces) {
            String category = (String) place.get("category");

            // İlgiyle eşleş
            boolean matches = interests.stream().anyMatch(interest ->
                category.contains(interest.toLowerCase()) ||
                ((String) place.get("name")).toLowerCase().contains(interest.toLowerCase())
            );

            if (matches && selected.size() < 3) {
                selected.add(place);
            }
        }

        // En az 1 yer ekle
        if (selected.isEmpty() && !cityPlaces.isEmpty()) {
            selected.add(cityPlaces.get(0));
        }

        return selected;
    }

    private double calculateDistance(String from, String to) {
        // Türkiye'deki ana şehirler arası gerçek mesafeler (km)
        Map<String, Double> distances = new HashMap<>();

        // Ankara rotalı
        distances.put("ankara-konya", 262.0);
        distances.put("ankara-antalya", 480.0);
        distances.put("ankara-denizli", 520.0);
        distances.put("ankara-fethiye", 620.0);
        distances.put("ankara-kaş", 675.0);
        distances.put("ankara-demre", 660.0);
        distances.put("ankara-nevşehir", 230.0);
        distances.put("ankara-istanbul", 450.0);
        distances.put("ankara-izmir", 550.0);
        distances.put("ankara-bursa", 380.0);
        distances.put("ankara-safranbolu", 280.0);

        // Konya rotalı
        distances.put("konya-nevşehir", 187.0);
        distances.put("konya-denizli", 315.0);
        distances.put("konya-antalya", 350.0);
        distances.put("konya-fethiye", 450.0);
        distances.put("konya-ankara", 262.0);

        // Nevşehir rotalı
        distances.put("nevşehir-denizli", 385.0);
        distances.put("nevşehir-antalya", 480.0);
        distances.put("nevşehir-ankara", 230.0);
        distances.put("nevşehir-konya", 187.0);

        // Denizli rotalı
        distances.put("denizli-antalya", 320.0);
        distances.put("denizli-fethiye", 320.0);
        distances.put("denizli-kaş", 380.0);
        distances.put("denizli-demre", 360.0);
        distances.put("denizli-ankara", 520.0);
        distances.put("denizli-izmir", 230.0);
        distances.put("denizli-istanbul", 650.0);

        // Antalya bölgesi
        distances.put("antalya-fethiye", 280.0);
        distances.put("antalya-kaş", 340.0);
        distances.put("antalya-demre", 280.0);
        distances.put("antalya-ankara", 480.0);
        distances.put("antalya-mersin", 370.0);
        distances.put("fethiye-kaş", 54.0);
        distances.put("kaş-demre", 48.0);
        distances.put("fethiye-demre", 105.0);

        // İstanbul rotalı
        distances.put("istanbul-ankara", 450.0);
        distances.put("istanbul-izmir", 580.0);
        distances.put("istanbul-bursa", 240.0);
        distances.put("istanbul-çanakkale", 320.0);

        // İzmir rotalı
        distances.put("izmir-ankara", 550.0);
        distances.put("izmir-istanbul", 580.0);
        distances.put("izmir-kuşadası", 95.0);
        distances.put("izmir-bodrum", 280.0);
        distances.put("izmir-marmaris", 390.0);
        distances.put("izmir-pergamon", 100.0);

        // Batı Anadolu
        distances.put("bursa-istanbul", 240.0);
        distances.put("bursa-ankara", 380.0);
        distances.put("bursa-izmir", 350.0);
        distances.put("safranbolu-ankara", 280.0);
        distances.put("safranbolu-istanbul", 380.0);

        // Ege
        distances.put("kuşadası-izmir", 95.0);
        distances.put("bodrum-izmir", 280.0);
        distances.put("bodrum-marmaris", 120.0);
        distances.put("marmaris-fethiye", 140.0);

        // Kuzey Anadolu
        distances.put("çanakkale-istanbul", 320.0);
        distances.put("çanakkale-troia", 30.0);
        distances.put("troia-çanakkale", 30.0);

        // Güney
        distances.put("adana-mersin", 35.0);
        distances.put("adana-antalya", 400.0);

        String key = from.toLowerCase() + "-" + to.toLowerCase();
        return distances.getOrDefault(key, 350.0);
    }

    @SuppressWarnings("unchecked")
    private int getTotalPlaces(List<Map<String, Object>> dailyPlans) {
        int total = 0;
        for (Map<String, Object> day : dailyPlans) {
            List<Map<String, Object>> itinerary = (List<Map<String, Object>>) day.get("itinerary");
            total += itinerary.size();
        }
        return total;
    }

    @SuppressWarnings("unchecked")
    private long calculateTotalDuration(List<Map<String, Object>> dailyPlans) {
        if (dailyPlans.isEmpty()) return 0;
        Map<String, Object> lastDay = dailyPlans.get(dailyPlans.size() - 1);
        return (long) lastDay.get("estimatedArrivalTime");
    }
}
