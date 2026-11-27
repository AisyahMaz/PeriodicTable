
import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import './App.css'
import PeriodicTable3D from './components/PeriodicTable3D'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'

type GoogleUser = {
  name: string
  email: string
  picture: string
}


function getNetWorthColor(networth: number) {
  if (networth < 100000) {
    return '#ff4444'
  }

  if (networth <= 200000) {
    return '#ff9800'
  }

  return '#4caf50'
}


function App() {
  const [profileOpen, setProfileOpen] = useState(false)
  
  // const [user, setUser] = useState<GoogleUser | null>(null)
  const [user, setUser] = useState<GoogleUser | null>(() => {
  const savedUser = localStorage.getItem('googleUser')

  if (!savedUser) return null

  try {
    return JSON.parse(savedUser) as GoogleUser
  } catch {
    localStorage.removeItem('googleUser')
    return null
  }
})
  const [data, setData] = useState<string[][]>(() => {
  const savedData = localStorage.getItem('googleSheetData')

  if (!savedData) return []

  try {
    return JSON.parse(savedData) as string[][]
  } catch {
    localStorage.removeItem('googleSheetData')
    return []
  }
})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useGoogleLogin({
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/spreadsheets.readonly'
    ].join(' '),

     prompt: 'consent',

 

    onSuccess: async (tokenResponse) => {
      
 console.log('Granted scopes:', tokenResponse.scope)
      setLoading(true)
      setError('')

      try {
        const token = tokenResponse.access_token

        // 1. Get Google User Profile
        const profileResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!profileResponse.ok) {
          throw new Error('Failed to retrieve Google profile')
        }

        const profile = await profileResponse.json()

       const userData: GoogleUser = {
  name: profile.name,
  email: profile.email,
  picture: profile.picture
}

setUser(userData)
localStorage.setItem('googleUser', JSON.stringify(userData))

        // 2. Get Google Sheet Data
        const spreadsheetId =
          '1GNipLvDkcPUtqwXa_ImeKCDEXRX1nARmNqx4AejeLJo'

        const range = "'Data Template'!A:Z"

        const url =
          `https://sheets.googleapis.com/v4/spreadsheets/` +
          `${spreadsheetId}/values/${encodeURIComponent(range)}`

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error?.message || 'Failed to retrieve Google Sheet'
          )
        }

        const sheetData = result.values ?? []

setData(sheetData)
localStorage.setItem('googleSheetData', JSON.stringify(sheetData))

        console.log('Google Profile:', profile)
        console.log('Google Sheet Data:', result.values)

      } catch (err) {
        console.error(err)
        setError(
          err instanceof Error ? err.message : 'Something went wrong'
        )
      } finally {
        setLoading(false)
      }
    },

    onError: () => {
      setError('Google authorization failed')
    }
  })

 const handleLogout = () => {
  setUser(null)
  setData([])
  setError('')
  setProfileOpen(false)

  localStorage.removeItem('googleUser')
  localStorage.removeItem('googleSheetData')
}
  // const headers = data[0] ?? []
  const rows = data.slice(1)


type Person = {
  name: string
  photo: string
  age: number
  country: string
  interest: string
  networth: number
}

const people: Person[] = rows.map((row) => ({
  name: row[0] ?? '',
  photo: row[1] ?? '',
  age: Number(row[2]) || 0,
  country: row[3] ?? '',
  interest: row[4] ?? '',
  networth: Number(
    String(row[5] ?? '0').replace(/[$,\s]/g, '')
  ) || 0
}))

console.log('People:', people)
console.log(
  'Net Worth Colors:',
  people.map(person => ({
    country: person.country,
    networth: person.networth,
    color: getNetWorthColor(person.networth)
  }))
)

const currentPath = window.location.pathname

if (currentPath === '/privacy') {
  return <PrivacyPolicy />
}

if (currentPath === '/terms') {
  return <TermsOfService />
}

  return (
    <div className="app-container">

      {/* <h1>3D Data Visualization</h1> */}

      {!user ? (
      
  <div className="login-page">
    <div className="login-background">
      <div className="login-glow glow-one"></div>
      <div className="login-glow glow-two"></div>
    </div>

    <div className="login-card">

      <div className="login-logo">
        <div className="logo-icon">
          <span>✦</span>
        </div>
        <span>DataViz 3D</span>
      </div>

      <div className="login-content">

        <div className="login-illustration">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="orbit-center">
            <span>✧</span>
          </div>
        </div>

        <h1>Explore Data in a New Dimension</h1>

        <p className="login-description">
          Transform your data into an interactive
          3D visualization experience.
        </p>

        <div className="login-divider"></div>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to access your visualization dashboard.
        </p>

        <button
          className="google-login-btn"
          onClick={() => login()}
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
          />

          <span>Continue with Google</span>
        </button>

        <p className="login-security">
          <span>🔒</span> Secure authentication powered by Google
        </p>

      </div>

      <div className="login-footer">
        <span>© 2026 DataViz 3D</span>
        <div>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>

    </div>
  </div>

      ) : (
        <div className="dashboard-header">
  <div className="dashboard-brand">
    <div className="brand-icon">P</div>
    <div>
      <h2>Periodic Dashboard</h2>
      <p>Google Sheets Visualization</p>
    </div>
  </div>

  <div className="profile-wrapper">
    <button
      className="profile-button"
      onClick={() => setProfileOpen(!profileOpen)}
    >
      <img
        src={user.picture}
        alt="Profile"
        className="profile-avatar"
      />

      <div className="profile-info">
        <span className="profile-name">{user.name}</span>
        <span className="profile-email">{user.email}</span>
      </div>

      <span className="profile-arrow">
        {profileOpen ? '▲' : '▼'}
      </span>
    </button>

    {profileOpen && (
      <div className="profile-dropdown">
        <div className="dropdown-user">
          <img
            src={user.picture}
            alt="Profile"
            className="dropdown-avatar"
          />

          <div>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="dropdown-divider" />

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Sign out
        </button>
      </div>
    )}
  </div>
</div>
      )}

      {loading && <p>Loading Google Sheet data...</p>}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {data.length > 0 && (
        <div className="sheet-container">
           <PeriodicTable3D people={people} />
        </div>
      )}

    </div>
  )
}

export default App
