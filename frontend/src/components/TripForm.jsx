import { useState, useMemo } from 'react'

const CITIES = [
  'Adana', 'Ankara', 'Antalya', 'Aydın', 'Bodrum', 'Bursa', 'Çanakkale', 'Dalyan',
  'Denizli', 'Gaziantep', 'İstanbul', 'İzmir', 'Kapadokya', 'Kaş', 'Konya', 'Kuşadası',
  'Kütahya', 'Marmaris', 'Mersin', 'Muğla', 'Nevşehir', 'Pamukkale', 'Pergamon', 'Safranbolu', 'Troia'
].sort()

const INTERESTS = [
  { id: 'history', label: 'Tarih & Arkeoloji', emoji: '🏛️' },
  { id: 'nature', label: 'Doğa & Dağcılık', emoji: '🌿' },
  { id: 'food', label: 'Gastronomi', emoji: '🍽️' },
  { id: 'art', label: 'Sanat & Tasarım', emoji: '🎨' },
  { id: 'beach', label: 'Plaj & Su Sporları', emoji: '🏖️' },
  { id: 'culture', label: 'Kültürel Etkinlikler', emoji: '🎭' },
]

export default function TripForm({ onSubmit, loading, onBack }) {
  const getTodayDateTime = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}T08:00`
  }

  const getRandomCities = (count) => {
    const shuffled = [...CITIES].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const [startCity, setStartCity] = useState(() => getRandomCities(1)[0])
  const [departureTime, setDepartureTime] = useState(getTodayDateTime())
  const [destinations, setDestinations] = useState(() => getRandomCities(2))
  const [returnLocation, setReturnLocation] = useState(() => getRandomCities(1)[0])
  const [tripDays, setTripDays] = useState(3)
  const [selectedInterests, setSelectedInterests] = useState(['history', 'art'])
  const [startCitySearch, setStartCitySearch] = useState('')
  const [returnCitySearch, setReturnCitySearch] = useState('')
  const [showStartDropdown, setShowStartDropdown] = useState(false)
  const [showReturnDropdown, setShowReturnDropdown] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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

  const totalSteps = 3
  const progressPercent = (currentStep / totalSteps) * 100

  return (
    <div className="trip-form">
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: 3,
        background: '#e8e8ed',
        borderRadius: 2,
        marginBottom: 20,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: '#0071e3',
          width: `${progressPercent}%`,
          borderRadius: 2,
          transition: 'width 0.3s'
        }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            marginBottom: 12,
            color: '#666'
          }}
        >
          ← Geri
        </button>
        <h2>İlgilerinizi Seçin</h2>
        <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
          Sizin için en iyi önerileri vermek için lütfen tercihlerinizi belirtin
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            {/* Destination Selection */}
            <div className="form-group">
              <label>Nereye Gitmek İstiyorsunuz?</label>
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

            {/* Trip Duration */}
            <div className="form-group">
              <label>Kaç Gün Gitmek İstiyorsunuz?</label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 8
              }}>
                {[1, 2, 3, 4, 5, 6, 7].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setTripDays(day)}
                    style={{
                      padding: 10,
                      border: tripDays === day ? 'none' : '1px solid #d8d8d8',
                      background: tripDays === day ? '#0071e3' : '#f5f5f7',
                      color: tripDays === day ? 'white' : '#1a1a1a',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              style={{
                width: '100%',
                padding: 14,
                background: '#0071e3',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 20
              }}
            >
              Devam Et →
            </button>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Interests Selection */}
            <div className="form-group">
              <label style={{ marginBottom: 16, display: 'block' }}>Ana Kategoriler</label>
              <div className="interests-grid">
                {INTERESTS.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    style={{
                      padding: 16,
                      border: selectedInterests.includes(interest.id)
                        ? 'none'
                        : '2px solid #e8e8ed',
                      background: selectedInterests.includes(interest.id)
                        ? '#f0f7ff'
                        : '#ffffff',
                      borderColor: selectedInterests.includes(interest.id)
                        ? '#0071e3'
                        : '#e8e8ed',
                      borderRadius: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {selectedInterests.includes(interest.id) && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        background: '#0071e3',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}
                    <span style={{ fontSize: 32 }}>{interest.emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                      {interest.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Selection */}
            <div className="form-group">
              <label>Bütçe Aralığı</label>
              <div style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap'
              }}>
                {['💸 500₺', '💵 1000₺', '💰 2000₺+'].map((budget, idx) => (
                  <button
                    key={idx}
                    type="button"
                    style={{
                      padding: 10,
                      border: '2px solid #e8e8ed',
                      background: 'white',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: '#666',
                      flex: 1,
                      minWidth: 90,
                      transition: 'all 0.2s'
                    }}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{
                  flex: 1,
                  padding: 14,
                  background: '#f5f5f7',
                  color: '#1a1a1a',
                  border: '1px solid #d8d8d8',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Geri
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 14,
                  background: loading ? '#ccc' : '#0071e3',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Planlama yapılıyor...' : '🚀 Planı Oluştur'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
