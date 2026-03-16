export function ContactsTable(contacts) {
  return `
    <section class="panel">
      <h3>Contacts & Leads</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Organization</th><th>Tag</th><th>Follow-up</th></tr></thead>
          <tbody>
            ${contacts
              .map(
                (c) => `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.phone || '-'}</td><td>${c.organization || '-'}</td><td>${c.categoryTag}</td><td>${c.followUpStatus}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
