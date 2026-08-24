export default function Itinerary({ itinerary, onPlaceClick }) {
  const getIcon = (type) => {
    const icons = {
      departure: '🚗',
      arrival: '📍',
      breakfast: '🥐',
      lunch: '🍽️',
      dinner: '🍷',
      coffee: '☕',
      historical: '🏛️',
      museum: '🏺',
      nature: '🌲',
      beach: '🏖️',
      archaeological_site: '🏛️',
      default: '📌'
    }
    return icons[type] || icons.default
  }

  const getTypeLabel = (type) => {
    const labels = {
      departure: 'Hareket',
      arrival: 'Varış',
      breakfast: 'Kahvaltı',
      lunch: 'Öğle Yemeği',
      dinner: 'Akşam Yemeği',
      coffee: 'Kahve Molası',
      historical: 'Tarihi Yer',
      museum: 'Müze',
      nature: 'Doğa',
      archaeological_site: 'Antik Kent',
      default: 'Durak'
    }
    return labels[type] || labels.default
  }

  return (
    <div className="itinerary">
      <h3>📋 Günlük Programa</h3>
      <div className="timeline">
        {itinerary.map((stop, index) => {
          // Sonraki aktiviteyi bul (departure/arrival değil)
          let nextStop = null
          let nextActivityIndex = -1
          for (let i = index + 1; i < itinerary.length; i++) {
            if (itinerary[i].type !== 'arrival') {
              nextStop = itinerary[i]
              nextActivityIndex = i
              break
            }
          }

          // Zaman hesapla
          const currentTime = new Date(stop.time.replace(' ', 'T'))
          const departureTime = new Date(currentTime.getTime() + stop.duration * 60000)

          let travelTime = null
          let nextArrivalTime = null
          if (nextStop && nextStop.time) {
            nextArrivalTime = new Date(nextStop.time.replace(' ', 'T'))
            travelTime = Math.round((nextArrivalTime - departureTime) / 60000)
          }

          const formatTime = (date) => {
            return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          }

          return (
            <div
              key={index}
              className="timeline-item"
              onClick={() => onPlaceClick?.(stop)}
              style={{ cursor: 'pointer' }}
            >
              <div className="timeline-dot">
                <span className="timeline-icon">{getIcon(stop.type)}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-time">{stop.time?.replace('T', ' ')}</span>
                  <span className="timeline-type">{getTypeLabel(stop.type)}</span>
                </div>
                <h4>{stop.title}</h4>
                <p className="timeline-location">📍 {stop.location}</p>

                {/* Aktivite bilgileri */}
                {stop.duration > 0 && (
                  <p className="timeline-duration">⏱️ {stop.duration} dakika</p>
                )}
                {stop.price && (
                  <p className="timeline-price">💰 ₺{stop.price}</p>
                )}
                {stop.rating && (
                  <p className="timeline-rating">⭐ {stop.rating}/5</p>
                )}

                {/* Detaylı zaman planı (departure/arrival değil ise göster) */}
                {stop.type !== 'departure' && stop.type !== 'arrival' && (
                  <div style={{
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    padding: '10px',
                    borderRadius: '6px',
                    marginTop: '10px',
                    fontSize: '13px',
                    borderLeft: '3px solid #667eea'
                  }}>
                    <p style={{ margin: '0 0 6px 0', color: '#667eea', fontWeight: 'bold' }}>
                      📍 Varış: {stop.time?.replace('T', ' ')}
                    </p>
                    <p style={{ margin: '0 0 6px 0', color: '#ccc' }}>
                      ⏱️ Tavsiye edilen geçirilecek zaman: {stop.duration} dakika
                    </p>
                    <p style={{ margin: '0 0 6px 0', color: '#10b981', fontWeight: 'bold' }}>
                      🚗 Yola tekrar çıkış: {formatTime(departureTime)}
                    </p>
                    {nextStop && travelTime && (
                      <>
                        <p style={{ margin: '0 0 6px 0', color: '#ccc' }}>
                          📏 Sonraki rotaya mesafe: ~{Math.round(travelTime / 60 * 100)}km
                        </p>
                        <p style={{ margin: 0, color: '#ccc' }}>
                          ⏱️ Tahmini süresi: {Math.floor(travelTime / 60)} saat {travelTime % 60} dakika
                        </p>
                      </>
                    )}
                  </div>
                )}

                {stop.highlights && (
                  <ul className="timeline-highlights">
                    {stop.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
              {index < itinerary.length - 1 && <div className="timeline-line" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
