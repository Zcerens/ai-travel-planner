import { useState, useMemo } from 'react'

const CITIES = [
  'Adana', 'Ankara', 'Antalya', 'Aydın', 'Bodrum', 'Bursa', 'Çanakkale', 'Dalyan',
  'Denizli', 'Gaziantep', 'İstanbul', 'İzmir', 'Kapadokya', 'Kaş', 'Konya', 'Kuşadası',
  'Kütahya', 'Marmaris', 'Mersin', 'Muğla', 'Nevşehir', 'Pamukkale', 'Pergamon', 'Safranbolu', 'Troia'
].sort()

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

  // Rastgele şehir seç
  const getRandomCities = (count) => {
    const shuffled = [...CITIES].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const [startCity, setStartCity] = useState(() => getRandomCities(1)[0])
  const [departureTime, setDepartureTime] = useState(getTodayDateTime())
  const [destinations, setDestinations] = useState(() => getRandomCities(2))
  const [returnLocation, setReturnLocation] = useState(() => getRandomCities(1)[0])
  const [tripDays, setTripDays] = useState(2)
  const [selectedInterests, setSelectedInterests] = useState(['history', 'nature'])
  const [startCitySearch, setStartCitySearch] = useState('')
  const [returnCitySearch, setReturnCitySearch] = useState('')
  const [showStartDropdown, setShowStartDropdown] = useState(false)
  const [showReturnDropdown, setShowReturnDropdown] = useState(false)

  // Şehir arama filtresi
  const filteredStartCities = useMemo(() => {
    return CITIES.filter(city => city.toLowerCase().includes(startCitySearch.toLowerCase()))
  }, [startCitySearch])

  const filteredReturnCities = useMemo(() => {
    return CITIES.filter(city => city.toLowerCase().includes(returnCitySearch.toLowerCase()))
  }, [returnCitySearch])

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
      returnLocation,
      tripDays,
      interests: selectedInterests,
    })
  }

  return (
    <div className="trip-form">
      <h2>Seyahatinizi Planlayalım</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nereden Başlıyorsunuz?</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Şehir ara..."
              value={startCitySearch || startCity}
              onChange={(e) => {
                setStartCitySearch(e.target.value)
                setShowStartDropdown(true)
              }}
              onFocus={() => setShowStartDropdown(true)}
              onBlur={() => setTimeout(() => setShowStartDropdown(false), 200)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
            {showStartDropdown && filteredStartCities.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10
              }}>
                {filteredStartCities.map(city => (
                  <div
                    key={city}
                    onClick={() => {
                      setStartCity(city)
                      setStartCitySearch('')
                      setShowStartDropdown(false)
                    }}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      backgroundColor: startCity === city ? '#f0f0f0' : '#fff',
                      borderBottom: '1px solid #eee',
                      ':hover': { backgroundColor: '#f5f5f5' }
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = startCity === city ? '#f0f0f0' : '#fff'}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Kaç Gün Gitmek İstiyorsunuz?</label>
          <select value={tripDays} onChange={(e) => setTripDays(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <option key={day} value={day}>{day} Gün</option>
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
          <label>Nereye Dönmek İstiyorsunuz?</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Şehir ara..."
              value={returnCitySearch || returnLocation}
              onChange={(e) => {
                setReturnCitySearch(e.target.value)
                setShowReturnDropdown(true)
              }}
              onFocus={() => setShowReturnDropdown(true)}
              onBlur={() => setTimeout(() => setShowReturnDropdown(false), 200)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
            {showReturnDropdown && filteredReturnCities.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 10
              }}>
                {filteredReturnCities.map(city => (
                  <div
                    key={city}
                    onClick={() => {
                      setReturnLocation(city)
                      setReturnCitySearch('')
                      setShowReturnDropdown(false)
                    }}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      backgroundColor: returnLocation === city ? '#f0f0f0' : '#fff',
                      borderBottom: '1px solid #eee',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = returnLocation === city ? '#f0f0f0' : '#fff'}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
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
