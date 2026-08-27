import { useState } from 'react'
import TripForm from './components/TripForm'
import TripPlan from './components/TripPlan'

export default function App() {
  const [currentStep, setCurrentStep] = useState('discover') // discover, personalize, results, share, analytics
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userPreferences, setUserPreferences] = useState(null)

  const handlePlanTrip = async (formData) => {
    setLoading(true)
    setError(null)
    setUserPreferences(formData)

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Seyahat planı oluşturulamadı')
      const data = await response.json()
      setPlan(data)
      setCurrentStep('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPlan(null)
    setCurrentStep('discover')
    setUserPreferences(null)
    setError(null)
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {!plan ? (
        <>
          {currentStep === 'discover' && (
            <DiscoveryHub onNext={() => setCurrentStep('personalize')} />
          )}
          {currentStep === 'personalize' && (
            <div className="full-height">
              <TripForm
                onSubmit={handlePlanTrip}
                loading={loading}
                onBack={() => setCurrentStep('discover')}
              />
            </div>
          )}
        </>
      ) : (
        <div className="results-container">
          <div className="results-tabs">
            <button
              className={`tab ${currentStep === 'results' ? 'active' : ''}`}
              onClick={() => setCurrentStep('results')}
            >
              📅 Günlük Plan
            </button>
            <button
              className={`tab ${currentStep === 'share' ? 'active' : ''}`}
              onClick={() => setCurrentStep('share')}
            >
              📱 Paylaş
            </button>
            <button
              className={`tab ${currentStep === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentStep('analytics')}
            >
              💰 Bütçe
            </button>
            <button
              className="tab reset-btn"
              onClick={handleReset}
              title="Yeni plan oluştur"
            >
              ← Yeni Plan
            </button>
          </div>

          {currentStep === 'results' && <TripPlan plan={plan} />}
          {currentStep === 'share' && <ShareScreen plan={plan} preferences={userPreferences} />}
          {currentStep === 'analytics' && <AnalyticsScreen plan={plan} />}
        </div>
      )}
    </div>
  )
}

function DiscoveryHub({ onNext }) {
  return (
    <div className="discovery-hub">
      <header className="hero-header">
        <div className="hero-content">
          <h1>Merhaba! 👋</h1>
          <p>Nereyi keşfetmek istersin?</p>
        </div>
        <div className="hero-icons">
          <button className="icon-btn">🔔</button>
          <button className="icon-btn">👤</button>
        </div>
      </header>

      <div className="discovery-container">
        <div className="search-box">
          <input type="text" placeholder="Şehir veya deneyim ara..." />
        </div>

        <div className="map-preview">
          🗺️ Türkiye Haritası<br />
          <small>52+ Şehir, 52+ Müze, 62+ Restoran</small>
        </div>

        <div className="categories">
          <h3>Kategoriler</h3>
          <div className="category-chips">
            <button className="chip active">Tümü</button>
            <button className="chip">🏛️ Tarih</button>
            <button className="chip">🌿 Doğa</button>
            <button className="chip">🍽️ Yemek</button>
            <button className="chip">🎨 Kültür</button>
          </div>
        </div>

        <div className="featured">
          <h3>Öne Çıkanlar</h3>
          <div className="card-grid">
            <div className="experience-card">
              <div className="card-image">🏛️</div>
              <h4>Topkapi Sarayı</h4>
              <p>İstanbul • 2-3 saat</p>
              <span className="rating">⭐ 4.8</span>
            </div>
            <div className="experience-card">
              <div className="card-image">🏰</div>
              <h4>Kapadokya</h4>
              <p>Nevsehir • Tam gün</p>
              <span className="rating">⭐ 4.9</span>
            </div>
            <div className="experience-card">
              <div className="card-image">🍜</div>
              <h4>Antep Mutfağı</h4>
              <p>Gaziantep • 1-2 saat</p>
              <span className="rating">⭐ 4.7</span>
            </div>
          </div>
        </div>

        <button className="cta-button" onClick={onNext}>
          Seyahat Planı Oluştur →
        </button>
      </div>
    </div>
  )
}

function ShareScreen({ plan, preferences }) {
  const tripTitle = plan?.days?.[0]?.destination || 'Seyahat Planım'
  const tripDays = plan?.days?.length || 1

  return (
    <div className="share-screen">
      <div className="share-header">
        <h2>Seyahatini Paylaş</h2>
        <p>Arkadaşlarınla bu harika planı paylaş</p>
      </div>

      <div className="share-preview">
        <div className="preview-image">✈️</div>
        <div className="preview-content">
          <h3>{tripTitle} Macerası</h3>
          <p>{tripDays} günlük unutulmaz seyahat. Tarih, sanat ve müthiş mutfak bekliyorum! 🏛️🍷</p>
          <small>ai-travel-planner.vercel.app • Gezio</small>
        </div>
      </div>

      <div className="share-section">
        <h4>Nereye Paylaşacaksınız?</h4>
        <div className="social-buttons">
          <button className="social-btn instagram">📸 Instagram</button>
          <button className="social-btn twitter">𝕏 X/Twitter</button>
          <button className="social-btn facebook">f Facebook</button>
          <button className="social-btn whatsapp">💬 WhatsApp</button>
        </div>
      </div>

      <div className="copy-link-section">
        <div className="link-icon">🔗</div>
        <div>
          <p className="link-title">Planı Arkadaşlarla Paylaş</p>
          <p className="link-url">gezio.app/share/trip/{Math.random().toString(36).substr(2, 9)}</p>
        </div>
        <button className="copy-btn">Kopyala</button>
      </div>
    </div>
  )
}

function AnalyticsScreen({ plan }) {
  // Basit bütçe hesaplama
  const totalBudget = Math.random() * 5000 + 2000
  const foodBudget = totalBudget * 0.42
  const activitiesBudget = totalBudget * 0.28
  const accommodationBudget = totalBudget * 0.21
  const transportBudget = totalBudget * 0.09

  return (
    <div className="analytics-screen">
      <div className="budget-header">
        <h2>Bütçe & Analizler</h2>
      </div>

      <div className="budget-card">
        <div className="budget-amount">
          ₺{totalBudget.toFixed(0)}
        </div>
        <p className="budget-label">Toplam Bütçe</p>
        <p className="budget-detail">3 gün • Kişi başına: ₺{(totalBudget / 3).toFixed(0)}</p>
      </div>

      <div className="categories-grid">
        <div className="category-item">
          <span className="icon">🍽️</span>
          <p>Yemek & İçecek</p>
          <p className="amount">₺{foodBudget.toFixed(0)}</p>
          <p className="percent">42%</p>
        </div>
        <div className="category-item">
          <span className="icon">🏛️</span>
          <p>Aktiviteler</p>
          <p className="amount">₺{activitiesBudget.toFixed(0)}</p>
          <p className="percent">28%</p>
        </div>
        <div className="category-item">
          <span className="icon">🏨</span>
          <p>Konaklama</p>
          <p className="amount">₺{accommodationBudget.toFixed(0)}</p>
          <p className="percent">21%</p>
        </div>
        <div className="category-item">
          <span className="icon">🚕</span>
          <p>Ulaşım</p>
          <p className="amount">₺{transportBudget.toFixed(0)}</p>
          <p className="percent">9%</p>
        </div>
      </div>

      <div className="tips-box">
        <p>💡 <strong>Bütçe İpuçları:</strong> Müzeye gitmeden birkaç gün önce bilet satın alırsan %10 indirim elde edebilirsin.</p>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary">📥 PDF İndir</button>
        <button className="btn-primary">✏️ Düzenle</button>
      </div>
    </div>
  )
}
