
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
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [data, setData] = useState<string[][]>([])
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

        setUser({
          name: profile.name,
          email: profile.email,
          picture: profile.picture
        })

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

        setData(result.values ?? [])

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
  }

  const headers = data[0] ?? []
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

      <h1>3D Data Visualization</h1>

      {!user ? (
        <button onClick={() => login()}>
          Sign in with Google
        </button>
      ) : (
        <div className="user-profile">
          <img
            src={user.picture}
            alt="Profile"
            width="60"
            style={{ borderRadius: '50%' }}
          />

          <h3>Welcome, {user.name}!</h3>
          <p>{user.email}</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {loading && <p>Loading Google Sheet data...</p>}

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {data.length > 0 && (
        <div className="sheet-container">
           <PeriodicTable3D people={people} />

          <h2>Google Sheet Data</h2>

          <p>Total records: {rows.length}</p>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>

             
<tbody>
  {people.map((person, rowIndex) => (
    <tr
      key={rowIndex}
      style={{
        backgroundColor: getNetWorthColor(person.networth),
        color: '#ffffff'
      }}
    >
      

      <td>{person.name}</td>
      <td>
        <img
          src={person.photo}
          alt={person.name}
          width="50"
          height="50"
          style={{
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </td>
      <td>{person.age}</td>
      <td>{person.country}</td>
      <td>{person.interest}</td>
      <td>${person.networth.toLocaleString()}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>

        </div>
      )}

    </div>
  )
}

export default App
