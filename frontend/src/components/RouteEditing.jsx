import { useState } from 'react'

export default function RouteEditing({ dayPlan, isOpen, onClose, onSave }) {
  const [itinerary, setItinerary] = useState(dayPlan?.itinerary || [])
  const [editingIndex, setEditingIndex] = useState(null)

  if (!isOpen || !dayPlan) return null

  const handleRemovePlace = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index))
  }

  const handleUpdatePlace = (index, field, value) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const handleSave = () => {
    onSave?.({ ...dayPlan, itinerary })
    onClose()
  }

  const getIcon = (type) => {
    const icons = {
      'breakfast': '🥐',
      'lunch': '🍽️',
      'dinner': '🍷',
      'coffee': '☕',
      'historical': '🏛️',
      'archaeological_site': '⛩️',
      'museum': '🎨',
      'nature': '🌄',
      'beach': '🏖️',
      'departure': '🚀',
      'arrival': '📍',
    }
    return icons[type] || '📌'
  }

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Modal Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#1a1a2e',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#fff' }}>✏️ Rotayı Düzenle</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Day Info */}
          <div style={{ backgroundColor: '#0f3460', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
              {dayPlan.date} | {dayPlan.from} → {dayPlan.to}
            </p>
          </div>

          {/* Itinerary List */}
          <div style={{ marginBottom: '20px' }}>
            {itinerary.map((place, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#0f3460',
                  borderLeft: '3px solid #667eea',
                  padding: '12px',
                  marginBottom: '12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', color: '#667eea', fontSize: '12px', fontWeight: 'bold' }}>
                      {getIcon(place.type)} {place.type.toUpperCase()}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                      {place.title || place.name}
                    </p>
                    <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>
                      {place.time?.slice(11, 16)} • {place.duration} dk
                    </p>
                  </div>
                  {place.type !== 'departure' && place.type !== 'arrival' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemovePlace(idx)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '0',
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {/* Edit Form */}
                {editingIndex === idx && place.type !== 'departure' && place.type !== 'arrival' && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1a1a2e' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                        ⏱️ Süre (dakika)
                      </label>
                      <input
                        type="number"
                        value={place.duration}
                        onChange={(e) => handleUpdatePlace(idx, 'duration', parseInt(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#1a1a2e',
                          border: '1px solid #667eea',
                          borderRadius: '4px',
                          color: '#fff',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {place.price && (
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ color: '#999', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                          💰 Fiyat (TL)
                        </label>
                        <input
                          type="number"
                          value={place.price}
                          onChange={(e) => handleUpdatePlace(idx, 'price', parseInt(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            backgroundColor: '#1a1a2e',
                            border: '1px solid #667eea',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingIndex(null)
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#667eea',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Tamam
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info */}
          <div
            style={{
              backgroundColor: '#0f3460',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#999',
            }}
          >
            💡 Yerleri tıklayarak süre ve fiyatlarını düzenleyebilir, ya da sil butonuyla çıkarabilirsiniz.
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '12px',
                backgroundColor: '#0f3460',
                color: '#667eea',
                border: '1px solid #667eea',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
