/**
 * IFDCS 共用側邊欄元件
 * 所有頁面引入此檔案，sidebar 自動渲染，確保一致性。
 *
 * 使用方式：
 * 1. HTML 中放置 <aside id="sidebar" data-active="溫度監控"></aside>
 * 2. 在 aside 後面引入 <script src="sidebar.js"></script>
 * 3. 自動渲染，不需手動呼叫
 */

const SIDEBAR_SECTIONS = [
  {
    title: '主選單',
    items: [
      { label: '戰情中心', icon: 'dashboard', href: 'dashboard.html' },
      { label: '碳盤查', icon: 'eco', href: 'carbon_monitor.html' },
      { label: '電力監控', icon: 'bolt', href: 'energy-monitor.html' },
      { label: '生產數據', icon: 'precision_manufacturing', href: 'oee_analysis.html' },
    ]
  },
  {
    title: '數據監控',
    items: [
      { label: '溫度監控', icon: 'device_thermostat', href: 'temperature_monitor.html' },
      { label: '電流監控', icon: 'electric_meter', href: 'current_monitor.html' },
      { label: '電壓監控', icon: 'power', href: 'voltage_monitor.html' },
      { label: '異常通知', icon: 'notifications', href: 'alerts.html' },
      { label: '系統設定', icon: 'settings', href: '#' },
    ]
  }
];

function renderSidebar(activeLabel) {
  const aside = document.getElementById('sidebar');
  if (!aside) return;

  const sectionsHTML = SIDEBAR_SECTIONS.map(section => {
    const items = section.items.map(item => {
      const isActive = item.label === activeLabel;
      const cls = isActive
        ? 'flex items-center gap-4 px-4 py-3 rounded-full bg-sidebar-accent text-sidebar-primary'
        : 'flex items-center gap-4 px-4 py-3 rounded-full text-muted-foreground hover:bg-sidebar-accent transition-colors';
      return `<a href="${item.href}" class="${cls}">
              <span class="material-symbols-sharp">${item.icon}</span>
              <span class="text-base">${item.label}</span>
            </a>`;
    }).join('\n            ');

    return `<div class="flex flex-col gap-2">
          <span class="px-4 text-sm text-muted-foreground font-primary">${section.title}</span>
          <div class="flex flex-col">
            ${items}
          </div>
        </div>`;
  }).join('\n        ');

  aside.innerHTML = `
      <div class="flex items-center gap-2 h-[88px] px-8 py-6 border-b border-border">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#FF8400"/>
        </svg>
        <span class="font-primary text-lg font-bold text-primary leading-none">IFDCS</span>
      </div>
      <nav class="flex-1 flex flex-col gap-6 px-4 py-6">
        ${sectionsHTML}
      </nav>
      <div class="flex items-center gap-2 px-8 py-6">
        <div class="flex-1 flex flex-col gap-1">
          <span class="text-base text-sidebar-primary">系統管理員</span>
          <span class="text-base text-muted-foreground">admin@factory.com</span>
        </div>
        <span class="material-symbols-sharp text-muted-foreground">keyboard_arrow_down</span>
      </div>`;
}

// Auto-render: 讀取 aside#sidebar 的 data-active 屬性自動渲染
(function() {
  const aside = document.getElementById('sidebar');
  if (aside && aside.dataset.active) {
    renderSidebar(aside.dataset.active);
  }
})();
