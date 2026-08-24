import { useState } from 'react'
import TripForm from './components/TripForm'
import TripPlan from './components/TripPlan'

export default function App() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePlanTrip = async (formData) => {
    setLoading(true)
    setError(null)

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🧭 AI Seyahat Planı</h1>
          <p>Akıllı turist rehberi - Sizin için mükemmel bir seyahat planlayalım</p>
        </div>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        {!plan ? (
          <>
            <TripForm onSubmit={handlePlanTrip} loading={loading} />
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => setPlan(null)}>
              ← Yeni Plan Oluştur
            </button>
            <TripPlan plan={plan} />
          </>
        )}
      </div>
    </div>
  )
}
