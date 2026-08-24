import { useState } from 'react'
import Itinerary from './Itinerary'
import Map from './Map'
import PlaceDetailSheet from './PlaceDetailSheet'
import RouteEditing from './RouteEditing'

export default function TripPlan({ plan }) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [isRoutEditingOpen, setIsRouteEditingOpen] = useState(false)
  const [updatedPlan, setUpdatedPlan] = useState(plan)

  const dayPlan = updatedPlan.dailyPlans[selectedDay]

  const handlePlaceClick = (place) => {
    setSelectedPlace(place)
    setIsDetailSheetOpen(true)
  }

  const handleEditPlace = (place) => {
    setIsDetailSheetOpen(false)
    setIsRouteEditingOpen(true)
  }

  const handleSaveRouteEditing = (updatedDayPlan) => {
    const newPlan = { ...updatedPlan }
    newPlan.dailyPlans[selectedDay] = updatedDayPlan
    setUpdatedPlan(newPlan)
  }

  return (
    <div className="trip-plan">
      {/* Header */}
      <div className="plan-header">
        <h2>✓ Seyahat Planınız Hazır!</h2>
        <div className="plan-stats">
          <div className="stat">
            <span className="stat-label">Toplam Yerler</span>
            <span className="stat-value">{updatedPlan.totalPlaces}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Gün Sayısı</span>
            <span className="stat-value">{updatedPlan.dailyPlans.length}</span>
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="plan-content">
        <div className="days-tabs">
          {updatedPlan.dailyPlans.map((day, index) => (
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

        {/* Day Info */}
        <div className="day-info">
          <h3>{dayPlan.date} | {dayPlan.from} → {dayPlan.to}</h3>
          <p className="day-meta">
            📍 {dayPlan.totalDistance} | 🚗 {dayPlan.estimatedDrivingTime}
          </p>
        </div>
      </div>

      {/* Main Content - Map & Itinerary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '24px',
        marginBottom: '24px',
        minHeight: '600px'
      }}>
        {/* Left: Map */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Map dayPlan={dayPlan} onPlaceClick={handlePlaceClick} />
        </div>

        {/* Right: Itinerary */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <Itinerary itinerary={dayPlan.itinerary} onPlaceClick={handlePlaceClick} />
        </div>
      </div>

      {/* Action Button */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => setIsRouteEditingOpen(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          ✏️ Rotayı Düzenle
        </button>
      </div>

      {/* Footer Info */}
      <div className="plan-footer">
        <p className="info-text">
          💡 Bu plan sizin için özel olarak oluşturuldu. Haritadaki yerler ve timeline'ı tıklayarak detayları görebilir, rotayı düzenleyebilirsiniz.
        </p>
      </div>

      {/* Place Detail Sheet */}
      <PlaceDetailSheet
        place={selectedPlace}
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        onEdit={handleEditPlace}
      />

      {/* Route Editing Modal */}
      <RouteEditing
        dayPlan={dayPlan}
        isOpen={isRoutEditingOpen}
        onClose={() => setIsRouteEditingOpen(false)}
        onSave={handleSaveRouteEditing}
      />
    </div>
  )
}
