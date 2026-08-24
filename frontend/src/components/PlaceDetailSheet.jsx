import { useState } from 'react'

export default function PlaceDetailSheet({ place, isOpen, onClose, onEdit }) {
  if (!isOpen || !place) return null

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
      {/* Overlay */}
      <div
        className="sheet-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99,
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Bottom Sheet */}
      <div
        className="place-detail-sheet"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '80vh',
          backgroundColor: '#1a1a2e',
          borderRadius: '24px 24px 0 0',
          padding: '24px',
          overflowY: 'auto',
          zIndex: 100,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Handle bar */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#667eea',
            borderRadius: '2px',
            margin: '0 auto 20px',
            cursor: 'pointer',
          }}
          onClick={onClose}
        />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {getIcon(place.type)}
            </div>
            <h2 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '20px' }}>
              {place.title || place.name}
            </h2>
            <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
              {place.location}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>

        {/* Time & Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#0f3460', padding: '12px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '12px' }}>🕐 Saat</p>
            <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
              {place.time ? place.time.replace('T', ' ').slice(11, 16) : 'N/A'}
            </p>
          </div>
          <div style={{ backgroundColor: '#0f3460', padding: '12px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '12px' }}>⏱️ Süre</p>
            <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
              {place.duration} dk
            </p>
          </div>
        </div>

        {/* Rating & Price */}
        {(place.rating || place.price || place.price_level) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {place.rating && (
              <div style={{ backgroundColor: '#0f3460', padding: '12px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '12px' }}>⭐ Puan</p>
                <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                  {place.rating} / 5.0
                </p>
              </div>
            )}
            {(place.price || place.price_level) && (
              <div style={{ backgroundColor: '#0f3460', padding: '12px', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', color: '#999', fontSize: '12px' }}>💰 Fiyat</p>
                <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                  {place.price ? `${place.price} TL` : '₺'.repeat(place.price_level || 0)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Highlights */}
        {place.highlights && place.highlights.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 12px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>
              ✨ Öne Çıkan Özellikler
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {place.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#667eea',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
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
            Kapat
          </button>
          <button
            onClick={() => onEdit?.(place)}
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
            Düzenle
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
