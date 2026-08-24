# 🧭 AI Seyahat Planla - Akıllı Turist Rehberi

Kullanıcıya girdiği başlangıç şehri, hedefler, kalkış saati ve ilgilerine göre saat-saat detaylı bir seyahat planı oluşturan **AI destekli tur rehberi** uygulaması.

## 🎯 Ana Özellikler

- **Saat-Saat Planlaması**: Kalkış saatinden varış saatine kadar her dakika planlanmış güzergâh
- **Akıllı Durak Önerisi**: Yol üzerinde kahvaltı, mola, öğle yemeği ve kahve noktaları otomatik eklenir
- **Antik Kent & Müze Verileri**: Gümrük ücretleri, açılış saatleri, ziyaret süreleri
- **Google Puan & Yorumlar**: Her önerilen yerin puanı ve vurgulanan özelikleri
- **Dinamik Harita**: Leaflet entegre rota gösterimi
- **Responsive Design**: Mobil, tablet ve desktop'ta mükemmel görünüm

## 🏗️ Proje Yapısı

```
ai-travel-planner/
├── backend/
│   ├── src/com/ai_travel/
│   │   ├── Main.java                # Backend giriş noktası
│   │   ├── DataStore.java           # Veritabanı yönetimi
│   │   ├── TravelPlanner.java       # Planlama algoritması
│   │   └── TripPlannerHandler.java  # HTTP handler
│   ├── data/
│   │   ├── places.json              # Antik kentler, müzeler
│   │   └── restaurants.json         # Restoranlar, mola noktaları
│   ├── Dockerfile
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TripForm.jsx         # Seyahat form
│   │   │   ├── TripPlan.jsx         # Plan sonuçları
│   │   │   ├── Itinerary.jsx        # Zaman çizelgesi
│   │   │   └── Map.jsx              # Harita gösterimi
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env.development
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## 🚀 Kurulum

### Backend

```bash
cd backend
javac -d out src/com/ai_travel/*.java
java -cp out com.ai_travel.Main
```

Backend başlayacak: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend başlayacak: `http://localhost:5173`

## 📝 API Endpoints

### POST /api/plan-trip
Seyahat planı oluştur.

**Request:**
```json
{
  "startCity": "Ankara",
  "departureTime": "2024-12-20T08:00",
  "destinations": ["Denizli", "Antalya"],
  "interests": ["history", "nature"]
}
```

**Response:**
```json
{
  "status": "success",
  "totalPlaces": 24,
  "estimatedDuration": 259200000,
  "dailyPlans": [
    {
      "from": "Ankara",
      "to": "Denizli",
      "date": "2024-12-20",
      "itinerary": [...],
      "estimatedArrivalTime": 1703164800000,
      "totalDistance": "385 km",
      "estimatedDrivingTime": "2 hours"
    }
  ]
}
```

## 🛠️ Teknolojiler

**Backend:**
- Java 21 + JDK HttpServer (0 harici dependency)
- Özel JSON parser/serializer
- RESTful API

**Frontend:**
- React 18
- Vite 5 (fast bundler)
- Leaflet (haritalar - entegrasyon devam ediyor)
- CSS3 (responsive)

**Deployment:**
- Railway (backend)
- Vercel (frontend)

## 📦 Deployment

### Backend (Railway)

```bash
# Railway CLI'ı yükle
# https://railway.app

# Repo'yu push et
git push origin main

# Railway otomatik Dockerfile'ı bulur ve deploy eder
```

### Frontend (Vercel)

```bash
# Vercel'e git
# https://vercel.com

# GitHub repo'yu bağla
# Environment variable'ı ekle:
# VITE_API_URL=<Railway backend URL>

# Deploy otomatik yapılır
```

## 🗺️ Veritabanı Yapısı

### places.json - Antik Kentler & Müzeler

```json
{
  "id": "myra",
  "name": "Myra Antik Kenti",
  "type": "historical",
  "category": "archaeological_site",
  "lat": 36.2683,
  "lng": 29.6456,
  "city": "Antalya",
  "entrance_fee": 300,
  "museum_card_valid": true,
  "opening_hours": {...},
  "estimated_visit_duration": 120,
  "google_rating": 4.6,
  "review_count": 7800,
  "highlights": [...]
}
```

### restaurants.json - Restoranlar & Mola Noktaları

```json
{
  "id": "myra-fish",
  "name": "Myra Balık Restoran",
  "type": "lunch",
  "city": "Antalya",
  "lat": 36.27,
  "lng": 29.65,
  "cuisine": "Seafood",
  "price_level": 3,
  "google_rating": 4.7,
  "opening_hours": "12:00-23:00",
  "average_duration": 75
}
```

## 🔄 Planlama Algoritması

1. **Başlangıç**: Kullanıcı kalkış saati ve şehri
2. **Rota Hesaplama**: Şehirler arası mesafe & süresi
3. **Kahvaltı Molası**: Saat 06:00-09:00'da otomatik eklenir
4. **İlgi Tabanlı Öneriler**: Antik kentler, müzeler seçilir
5. **Mola Noktaları**: Yemek, kahve, dinlenme yerleri
6. **Varış Saati**: Tahmini varış saati hesaplanır

## 🎨 UI/UX

- Dark tema (mor-lacivert gradient)
- Timeline görünümü (zaman çizelgesi)
- Gün seçici tab'ları
- Responsive grid layout

## 📋 TODO (Gelişime Açık)

- [ ] OpenStreetMap & OSRM entegre (gerçek mesafe & süre)
- [ ] Google Places API entegre (yorumlar & puanlar)
- [ ] Web scraping (TripAdvisor, Wikipedia)
- [ ] Leaflet harita tam entegrasyonu
- [ ] Durak ekleme/çıkarma dinamik yeniden hesaplama
- [ ] Gerçek zamanlı trafik verileri
- [ ] Kullanıcı kayıt sistemi
- [ ] Planları kaydetme & paylaşma
- [ ] Türkçe/İngilizce multi-dil desteği
- [ ] Offline modu

## 📄 Lisans

MIT

---

**Geliştirici:** zck  
**Başlangıç:** Aralık 2024
