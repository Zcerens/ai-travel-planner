import { useState } from 'react'

const CITIES = [
  'Ankara', 'İstanbul', 'İzmir', 'Antalya', 'Konya', 'Nevşehir',
  'Denizli', 'Muğla', 'Adana', 'Gaziantep'
]

const INTERESTS = [
  { id: 'history', label: 'Tarih ve Kültür', emoji: '🏛️' },
  { id: 'nature', label: 'Doğa ve Outdoor', emoji: '🌲' },
  { id: 'beach', label: 'Plaj ve Deniz', emoji: '🌊' },
  { id: 'food', label: 'Gurme ve Yemek', emoji: '🍽️' },
  { id: 'archaeology', label: 'Arkeoloji', emoji: '🏺' },
]

export default function TripForm({ onSubmit, loading }) {
  // Bugünün tarihini al ve formatla (YYYY-MM-DDTHH:mm)
  const getTodayDateTime = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T08:00`
  }

  const [startCity, setStartCity] = useState('Ankara')
  const [departureTime, setDepartureTime] = useState(getTodayDateTime())
  const [destinations, setDestinations] = useState(['Denizli', 'Antalya'])
  const [selectedInterests, setSelectedInterests] = useState(['history', 'nature'])

  const handleDestinationChange = (index, value) => {
    const newDests = [...destinations]
    newDests[index] = value
    setDestinations(newDests)
  }

  const addDestination = () => {
    setDestinations([...destinations, 'Antalya'])
  }

  const removeDestination = (index) => {
    setDestinations(destinations.filter((_, i) => i !== index))
  }

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      startCity,
      departureTime,
      destinations,
      interests: selectedInterests,
    })
  }

  return (
    <div className="trip-form">
      <h2>Seyahatinizi Planlayalım</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nereden Başlıyorsunuz?</label>
          <select value={startCity} onChange={(e) => setStartCity(e.target.value)}>
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Kalkış Saati</label>
          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nereye Gidiyorsunuz? (Hedefler)</label>
          {destinations.map((dest, index) => (
            <div key={index} className="destination-input">
              <select
                value={dest}
                onChange={(e) => handleDestinationChange(index, e.target.value)}
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {destinations.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDestination(index)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={addDestination}
          >
            + Yeni Hedef Ekle
          </button>
        </div>

        <div className="form-group">
          <label>Nelerden Hoşlanıyorsunuz?</label>
          <div className="interests-grid">
            {INTERESTS.map(interest => (
              <label key={interest.id} className="interest-checkbox">
                <input
                  type="checkbox"
                  checked={selectedInterests.includes(interest.id)}
                  onChange={() => toggleInterest(interest.id)}
                />
                <span>{interest.emoji} {interest.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Planlama yapılıyor...' : '🚀 Seyahatimi Planla'}
        </button>
      </form>
    </div>
  )
}
