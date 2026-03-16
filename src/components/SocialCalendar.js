export function SocialCalendar(items) {
  return `
    <section class="panel">
      <h3>Content Calendar / List</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Title</th><th>Platform</th><th>Category</th><th>Status</th><th>Schedule</th></tr></thead>
          <tbody>
            ${items
              .map(
                (item) => `<tr>
                <td>${item.title}</td>
                <td>${item.platforms.join(', ')}</td>
                <td>${item.category}</td>
                <td><span class="pill ${item.status}">${item.status}</span></td>
                <td>${item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : '-'}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}
