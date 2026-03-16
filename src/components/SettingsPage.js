export function SettingsPage() {
  return `
    <section class="panel">
      <h2>Settings & Integration Readiness</h2>
      <p>Admin authentication placeholder is enabled in client-side mode for local usage.</p>
      <ul>
        <li>AUTH_PROVIDER=placeholder</li>
        <li>META_API_TOKEN=</li>
        <li>INSTAGRAM_BUSINESS_ACCOUNT_ID=</li>
        <li>MAIL_PROVIDER=IMAP_OR_M365</li>
        <li>MAIL_API_KEY=</li>
      </ul>
      <p>No live account control is active without proper API credentials and backend integration.</p>
    </section>
  `;
}
