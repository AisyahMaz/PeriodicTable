import './LegalPages.css'

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <a className="legal-back" href="/">← Back to 3D Data Visualization</a>

      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: 27 November 2026</p>

      <p>
        This Privacy Policy explains how 3D Data Visualization ("the
        application") handles information when you use the application.
      </p>

      <h2>Information accessed</h2>
      <p>
        If you choose to sign in with Google, the application may receive your
        name, email address, and profile picture. With your authorization, the
        application also reads data from the Google Sheet configured for this
        demonstration.
      </p>

      <h2>How information is used</h2>
      <ul>
        <li>To identify the signed-in Google account and display your profile.</li>
        <li>To retrieve authorized spreadsheet data and display it in the visualization.</li>
        <li>To operate and troubleshoot the application.</li>
      </ul>

      <h2>Google data access</h2>
      <p>
        The application requests the Google Sheets read-only permission
        (spreadsheets.readonly). It uses this permission to read spreadsheet
        values for visualization. The application does not use this permission
        to edit spreadsheet content.
      </p>
      <p>
        Google user information and Google API access are handled through
        Google's authentication and authorization services. Your use of
        Google services is also subject to Google's privacy policy:
        {' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Google Privacy Policy
        </a>.
      </p>

      <h2>Sharing and selling</h2>
      <p>
        The application developer does not sell personal information. The
        application does not intentionally share Google account information
        with third parties, except where needed to use Google services or where
        required by law.
      </p>

      <h2>Data retention and security</h2>
      <p>
        The application is designed to use the Google access token to make
        authorized requests during the session. Do not use this demonstration
        with confidential or sensitive spreadsheet information. No online
        service can guarantee absolute security.
      </p>

      <h2>Your choices</h2>
      <p>
        You can choose not to sign in, sign out of the application, or revoke
        the application's Google account access through your Google Account
        security settings.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about this policy, contact the application developer
        using the contact details provided by the project owner.
      </p>
    </main>
  )
}
