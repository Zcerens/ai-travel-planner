import { useEffect, useRef } from 'react'

export default function Map({ dayPlan }) {
  const mapContainer = useRef(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // TODO: Leaflet entegrasyonu
    // Şimdilik statik bir bölge göster
    mapContainer.current.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 40px;
                  border-radius: 12px;
                  text-align: center;
                  min-height: 300px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;">
        <div style="font-size: 48px; margin-bottom: 20px;">🗺️</div>
        <h3>Harita Gösterimi</h3>
        <p>🔄 Rota: ${dayPlan.from} → ${dayPlan.to}</p>
        <p>📏 Mesafe: ${dayPlan.totalDistance}</p>
        <p style="margin-top: 20px; font-size: 14px; opacity: 0.9;">
          Leaflet harita entegrasyonu yakında...
        </p>
      </div>
    `
  }, [dayPlan])

  return (
    <div className="map-container">
      <h3>🗺️ Rota Haritası</h3>
      <div ref={mapContainer} className="map" />
    </div>
  )
}
