import './LegalPages.css'

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <a className="legal-back" href="/">← Back to 3D Data Visualization</a>

      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: 27 November 2026</p>

      <p>
        These terms apply to your use of 3D Data Visualization ("the
        application"). By using the application, you agree to these terms.
      </p>

      <h2>Purpose of the application</h2>
      <p>
        The application is provided as a data visualization demonstration. It
        allows users to sign in with Google and view spreadsheet data in a
        table and 3D visualization.
      </p>

      <h2>Google account and spreadsheet access</h2>
      <ul>
        <li>You choose whether to sign in with a Google account.</li>
        <li>You must have permission to access any Google Sheet used with the application.</li>
        <li>The application requests read-only access to spreadsheet data and is not intended to edit your Google Sheets.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse the application, attempt to disrupt its
        operation, or use it to access data without authorization.
      </p>

      <h2>Availability and changes</h2>
      <p>
        The application is provided for demonstration and evaluation purposes.
        Features may change, become unavailable, or be discontinued without
        notice.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The application is provided "as is" without warranties of any kind.
        The developer is not responsible for decisions made solely on the
        basis of information displayed by the visualization. Always verify
        important data against its original source.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact the application developer
        using the contact details provided by the project owner.
      </p>
    </main>
  )
}
