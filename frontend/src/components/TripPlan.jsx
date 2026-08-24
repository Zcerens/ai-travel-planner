import { useState } from 'react'
import Itinerary from './Itinerary'
import Map from './Map'

export default function TripPlan({ plan }) {
  const [selectedDay, setSelectedDay] = useState(0)

  const dayPlan = plan.dailyPlans[selectedDay]

  return (
    <div className="trip-plan">
      <div className="plan-header">
        <h2>✓ Seyahat Planınız Hazır!</h2>
        <div className="plan-stats">
          <div className="stat">
            <span className="stat-label">Toplam Yerler</span>
            <span className="stat-value">{plan.totalPlaces}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Gün Sayısı</span>
            <span className="stat-value">{plan.dailyPlans.length}</span>
          </div>
        </div>
      </div>

      <div className="plan-content">
        <div className="days-tabs">
          {plan.dailyPlans.map((day, index) => (
            <button
              key={index}
              className={`day-tab ${selectedDay === index ? 'active' : ''}`}
              onClick={() => setSelectedDay(index)}
            >
              Gün {index + 1}
              <br />
              <small>{day.from} → {day.to}</small>
            </button>
          ))}
        </div>

        <div className="plan-body">
          <div className="day-info">
            <h3>{dayPlan.date} | {dayPlan.from} → {dayPlan.to}</h3>
            <p className="day-meta">
              📍 {dayPlan.totalDistance} | 🚗 {dayPlan.estimatedDrivingTime}
            </p>
          </div>

          <Itinerary itinerary={dayPlan.itinerary} />
          <Map dayPlan={dayPlan} />
        </div>
      </div>

      <div className="plan-footer">
        <p className="info-text">
          💡 Bu plan sizin için özel olarak oluşturuldu. Durakları ekleyebilir, çıkarabilir veya değiştirebilirsiniz.
        </p>
      </div>
    </div>
  )
}
