export function EmailInbox(messages) {
  return `
    <section class="panel">
      <h3>Email Inbox</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Sender</th><th>Subject</th><th>Type</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>
            ${messages
              .map(
                (m) => `<tr data-open-email="${m.id}">
                <td>${m.senderName}</td>
                <td>${m.subject}</td>
                <td>${m.classification}</td>
                <td><span class="pill ${m.priority}">${m.priority}</span></td>
                <td>${m.status}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
