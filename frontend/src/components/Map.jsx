import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function Map({ dayPlan, onPlaceClick }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [selectedPlace, setSelectedPlace] = useState(null)

  // Türkiye'deki şehirlerin koordinatları
  const cityCoords = {
    'ankara': [39.9334, 32.8597],
    'istanbul': [41.0082, 28.9784],
    'izmir': [38.4161, 27.1330],
    'antalya': [36.9271, 30.7133],
    'konya': [37.8727, 32.4844],
    'nevşehir': [38.6142, 34.7247],
    'denizli': [37.7764, 29.0865],
    'muğla': [37.2153, 28.3636],
    'adana': [36.9909, 35.3213],
    'gaziantep': [37.0662, 37.3833],
    'demre': [36.2683, 29.6456],
    'fethiye': [36.6206, 29.1167],
    'kaş': [36.2017, 29.6383],
    'bursa': [40.1955, 29.1738],
    'safranbolu': [40.7401, 32.6885],
    'kapadokya': [38.7435, 34.8313],
    'kuşadası': [37.8603, 27.2613],
    'bodrum': [37.0339, 27.4280],
    'marmaris': [37.2349, 28.2739],
    'çanakkale': [40.1553, 26.4089],
    'troia': [39.9597, 26.2404],
    'pergamon': [39.1302, 27.1108],
    'kütahya': [39.4167, 29.9833],
    'pamukkale': [37.9200, 29.1208],
    'dalyan': [37.2683, 28.5711],
    'mersin': [36.8121, 34.6415],
    'aydın': [37.8442, 27.8458]
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Harita başlat
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([38.5, 31], 6)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)
    }

    // Önceki markerları temizle
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current.removeLayer(layer)
      }
    })

    const fromCoords = cityCoords[dayPlan.from.toLowerCase()] || [38.5, 31]
    const toCoords = cityCoords[dayPlan.to.toLowerCase()] || [38.5, 31]

    // Başlangıç marker'ı (yeşil)
    L.marker(fromCoords, {
      icon: L.divIcon({
        html: `<div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; cursor: pointer;">🚀</div>`,
        iconSize: [30, 30],
        className: 'custom-marker',
      }),
    })
      .bindPopup(`<b>${dayPlan.from}</b><br>Başlangıç`)
      .addTo(map.current)

    // Bitiş marker'ı (kırmızı)
    L.marker(toCoords, {
      icon: L.divIcon({
        html: `<div style="background: #ef4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-weight: bold; cursor: pointer;">📍</div>`,
        iconSize: [30, 30],
        className: 'custom-marker',
      }),
    })
      .bindPopup(`<b>${dayPlan.to}</b><br>Varış`)
      .addTo(map.current)

    // Rota çizgisi - başlangıçtan bitiş noktasına tüm aktiviteleri geçerek
    const routePoints = [fromCoords]
    dayPlan.itinerary.forEach((item) => {
      if (item.type !== 'departure' && item.type !== 'arrival' && item.lat && item.lng) {
        routePoints.push([item.lat, item.lng])
      }
    })
    routePoints.push(toCoords)

    // Polyline çiz (mavi çizgi)
    if (routePoints.length > 1) {
      L.polyline(routePoints, {
        color: '#667eea',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 5',
      }).addTo(map.current)
    }

    // Aktivite marker'ları (itinerary'deki yerler) - sıra numarası ile
    let activityIndex = 1
    dayPlan.itinerary.forEach((item, index) => {
      if (item.type !== 'departure' && item.type !== 'arrival') {
        // Gerçek koordinatları kullan, fallback olarak şehrin koordinatını kullan
        const coords = (item.lat && item.lng) ? [item.lat, item.lng] : (cityCoords[item.location.toLowerCase()] || fromCoords)

        const iconHTML = {
          'breakfast': '🥐',
          'lunch': '🍽️',
          'dinner': '🍷',
          'coffee': '☕',
          'historical': '🏛️',
          'archaeological_site': '⛩️',
          'museum': '🎨',
          'nature': '🌄',
          'beach': '🏖️',
        }[item.type] || '📌'

        const marker = L.marker(coords, {
          icon: L.divIcon({
            html: `<div style="background: #667eea; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; font-size: 18px; cursor: pointer; position: relative;">
              <div style="font-size: 14px; position: absolute; top: -8px; right: -8px; background: #10b981; color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">${activityIndex}</div>
              ${iconHTML}
            </div>`,
            iconSize: [36, 36],
            className: 'custom-marker',
          }),
        })
          .bindPopup(`<b>#${activityIndex}. ${item.title}</b><br>${item.time}<br>${item.duration} min`)
          .addTo(map.current)

        marker.on('click', () => {
          setSelectedPlace(item)
          onPlaceClick?.(item)
        })

        activityIndex++
      }
    })

    // Harita view'ı ayarla
    const bounds = L.latLngBounds([fromCoords, toCoords])
    map.current.fitBounds(bounds, { padding: [50, 50] })
  }, [dayPlan, onPlaceClick])

  return (
    <div className="map-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>🗺️ Rota Haritası</h3>
      <div ref={mapContainer} className="map" style={{
        flex: 1,
        height: '100%',
        borderRadius: '12px',
        marginBottom: '0'
      }} />
    </div>
  )
}
