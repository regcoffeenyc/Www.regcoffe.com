export function AdminLayout({ navItems, activeView, body, federation }) {
  return `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">
          <h1>${federation.shortName}</h1>
          <p>${federation.slogan}</p>
        </div>
        <nav>
          ${navItems
            .map(
              (item) => `<button class="nav-btn ${activeView === item.key ? 'active' : ''}" data-nav="${item.key}">${item.label}</button>`
            )
            .join('')}
        </nav>
        <div class="org-meta">
          <p>${federation.website}</p>
          <p>${federation.email}</p>
          <p>${federation.phone}</p>
        </div>
      </aside>
      <main class="main-content">${body}</main>
    </div>
  `;
}
