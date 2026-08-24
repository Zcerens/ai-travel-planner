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
        {itinerary.map((stop, index) => (
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
                <span className="timeline-time">{stop.time}</span>
                <span className="timeline-type">{getTypeLabel(stop.type)}</span>
              </div>
              <h4>{stop.title}</h4>
              <p className="timeline-location">📍 {stop.location}</p>
              {stop.duration > 0 && (
                <p className="timeline-duration">⏱️ {stop.duration} dakika</p>
              )}
              {stop.price && (
                <p className="timeline-price">💰 ₺{stop.price}</p>
              )}
              {stop.rating && (
                <p className="timeline-rating">⭐ {stop.rating}/5</p>
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
        ))}
      </div>
    </div>
  )
}
