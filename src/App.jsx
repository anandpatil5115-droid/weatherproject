import { useState, useEffect } from 'react'
import { weatherApi } from './services/weatherApi'
import { Search, Wind, Droplets, Thermometer, MapPin, Calendar, Anchor } from 'lucide-react'
import { format } from 'date-fns'

function App() {
  const [city, setCity] = useState('New York')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('current') // current, history, marine
  const [historyDate, setHistoryDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const fetchWeather = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await weatherApi.getCurrent(city)
      if (data.error) throw new Error(data.error.info)
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchWeather()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="glass-panel w-full max-w-4xl p-8 z-10 min-h-[600px] flex flex-col items-center">

        {/* Header & Search */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            Weather<span className="text-white/60 font-light">Stack</span>
          </h1>

          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search City..."
              className="glass-input w-full py-3 px-5 pr-12 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-black/10 p-1 rounded-xl backdrop-blur-sm">
          {['current', 'history', 'marine'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white/20 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full flex-1 flex items-center justify-center">
          {loading && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          )}

          {error && !loading && (
            <div className="text-red-300 bg-red-500/20 px-6 py-4 rounded-xl border border-red-500/30">
              Error: {error}
            </div>
          )}

          {!loading && !error && weather && tab === 'current' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-fade-in">
              {/* Main Weather Card */}
              <div className="bg-white/5 rounded-3xl p-8 flex flex-col items-center justify-center border border-white/10 shadow-inner">
                <div className="text-xl font-medium text-white/80 mb-2 flex items-center gap-2">
                  <MapPin size={18} /> {weather.location?.name}, {weather.location?.country}
                </div>
                <div className="text-8xl font-bold mb-4 tracking-tighter drop-shadow-lg">
                  {weather.current?.temperature}°
                </div>
                <div className="text-2xl font-light text-white/90 capitalize mb-6 bg-white/10 px-4 py-1 rounded-full border border-white/5 shadow-sm">
                  {weather.current?.weather_descriptions?.[0]}
                </div>
                <img
                  src={weather.current?.weather_icons?.[0]}
                  alt="icon"
                  className="w-24 h-24 drop-shadow-2xl filter brightness-110"
                />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailCard icon={<Wind />} label="Wind" value={`${weather.current?.wind_speed} km/h`} sub={weather.current?.wind_dir} />
                <DetailCard icon={<Droplets />} label="Humidity" value={`${weather.current?.humidity}%`} />
                <DetailCard icon={<Thermometer />} label="Feels Like" value={`${weather.current?.feelslike}°`} />
                <DetailCard icon={<Calendar />} label="Local Time" value={weather.location?.localtime.split(' ')[1]} />
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="text-center text-white/70 bg-white/5 p-12 rounded-2xl border border-white/10 w-full">
              <h3 className="text-xl font-bold mb-4">Historical Data</h3>
              <p className="mb-6">Select a date to view past weather conditions.</p>
              <input
                type="date"
                value={historyDate}
                onChange={(e) => setHistoryDate(e.target.value)}
                className="glass-input px-4 py-2 mb-4"
              />
              <div className="mt-4 p-4 border border-dashed border-white/20 rounded-lg">
                <p className="text-sm">Historical API requires paid plan or specific setup. <br />Placeholder for: <strong>{historyDate}</strong></p>
              </div>
            </div>
          )}

          {tab === 'marine' && (
            <div className="text-center text-white/70 bg-white/5 p-12 rounded-2xl border border-white/10 w-full flex flex-col items-center">
              <Anchor size={48} className="mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-4">Marine Weather</h3>
              <p>Advanced ocean data for surfing and sailing.</p>
              <div className="mt-4 px-4 py-2 bg-yellow-500/20 text-yellow-200 border border-yellow-500/30 rounded-lg text-sm">
                Requires Standard Plan or higher
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-white/30 w-full text-center border-t border-white/10 pt-4">
          Powered by Weatherstack API • Glassmorphism UI
        </div>
      </div>
    </div>
  )
}

function DetailCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex flex-col items-start justify-center shadow-lg">
      <div className="text-white/60 mb-2">{icon}</div>
      <div className="text-sm text-white/50 font-medium uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-white mt-1">{value}</div>
      {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
    </div>
  )
}

export default App
