/**
 * IFDCS 主題切換元件
 * 支援淺色（白色）與深色（碳排放風格）兩種主題。
 * 載入方式：在 <head> 中 tailwind CDN 之後、tailwind.config 之前引入。
 *
 * <script src="https://cdn.tailwindcss.com"></script>
 * <script src="theme.js"></script>
 * <script> tailwind.config = { ... colors 使用 var(--color-xxx) ... } </script>
 */

const IFDCS_THEMES = {
  light: {
    'background': '#F2F3F0',
    'foreground': '#111111',
    'card': '#FFFFFF',
    'card-foreground': '#111111',
    'border': '#CBCCC9',
    'muted': '#F2F3F0',
    'muted-foreground': '#666666',
    'primary': '#FF8400',
    'primary-foreground': '#111111',
    'secondary': '#E7E8E5',
    'secondary-foreground': '#111111',
    'sidebar': '#E7E8E5',
    'sidebar-accent': '#CBCCC9',
    'sidebar-foreground': '#666666',
    'sidebar-primary': '#18181b',
    'error': '#E5DCDA',
    'error-foreground': '#8C1C00',
    'warning': '#E9E3D8',
    'warning-foreground': '#804200',
    'success': '#DFE6E1',
    'success-foreground': '#004D1A',
    'info': '#DFDFE6',
    'info-foreground': '#000066',
  },
  dark: {
    'background': '#0B1120',
    'foreground': '#E2E8F0',
    'card': '#0F172A',
    'card-foreground': '#E2E8F0',
    'border': 'rgba(255,255,255,0.08)',
    'muted': '#1E293B',
    'muted-foreground': '#94A3B8',
    'primary': '#FF8400',
    'primary-foreground': '#FFFFFF',
    'secondary': '#1E293B',
    'secondary-foreground': '#E2E8F0',
    'sidebar': '#0F172A',
    'sidebar-accent': '#1E293B',
    'sidebar-foreground': '#94A3B8',
    'sidebar-primary': '#E2E8F0',
    'error': '#2D1618',
    'error-foreground': '#FF4444',
    'warning': '#2D2414',
    'warning-foreground': '#FFAA00',
    'success': '#0A2E1A',
    'success-foreground': '#00FF88',
    'info': '#0F1A2E',
    'info-foreground': '#00D4FF',
  }
};

// ============ 核心函式 ============

function getTheme() {
  return localStorage.getItem('ifdcs-theme') || 'light';
}

function applyTheme(theme) {
  const colors = IFDCS_THEMES[theme];
  const root = document.documentElement;
  Object.keys(colors).forEach(key => {
    root.style.setProperty('--color-' + key, colors[key]);
  });
  root.setAttribute('data-theme', theme);
  localStorage.setItem('ifdcs-theme', theme);
}

function toggleTheme() {
  const next = getTheme() === 'light' ? 'dark' : 'light';
  applyTheme(next);
  updateToggleButton(next);
}

// ============ 切換按鈕 ============

function updateToggleButton(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  const icon = btn.querySelector('.material-symbols-sharp');
  if (icon) {
    icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    icon.style.color = 'var(--color-foreground)';
  }
  btn.title = theme === 'light' ? '切換深色模式' : '切換淺色模式';
}

function injectThemeToggle() {
  // 嘗試找到 header 右側區塊
  const header = document.querySelector('main > header');
  if (!header) {
    // auth 頁面沒有 main > header，嘗試其他位置
    injectAuthThemeToggle();
    return;
  }

  const rightSection = header.querySelector(':scope > .flex.items-center.gap-4');
  if (!rightSection) return;

  const theme = getTheme();
  const btn = document.createElement('button');
  btn.id = 'theme-toggle-btn';
  btn.className = 'flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-secondary transition-colors';
  btn.title = theme === 'light' ? '切換深色模式' : '切換淺色模式';
  btn.innerHTML = '<span class="material-symbols-sharp icon-20" style="color:var(--color-foreground)">' + (theme === 'light' ? 'dark_mode' : 'light_mode') + '</span>';
  btn.onclick = toggleTheme;

  // 插入在第一個子元素前面
  rightSection.insertBefore(btn, rightSection.firstChild);
}

function injectAuthThemeToggle() {
  // auth 頁面：在右上角固定一個切換按鈕
  const theme = getTheme();
  const btn = document.createElement('button');
  btn.id = 'theme-toggle-btn';
  btn.style.cssText = 'position:fixed;top:20px;right:20px;z-index:50;';
  btn.className = 'flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border hover:bg-secondary transition-colors';
  btn.title = theme === 'light' ? '切換深色模式' : '切換淺色模式';
  btn.innerHTML = '<span class="material-symbols-sharp icon-20" style="color:var(--color-foreground)">' + (theme === 'light' ? 'dark_mode' : 'light_mode') + '</span>';
  btn.onclick = toggleTheme;
  document.body.appendChild(btn);
}

// ============ 深色模式 CSS 覆寫 ============

function injectDarkModeStyles() {
  const style = document.createElement('style');
  style.id = 'ifdcs-dark-overrides';
  style.textContent = `
    /* Header glassmorphism in dark mode */
    [data-theme="dark"] header.bg-card,
    [data-theme="dark"] header.glass {
      background: rgba(15, 23, 42, 0.6) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    /* Dropdown dark mode */
    [data-theme="dark"] .dropdown-menu {
      background: #1E293B !important;
      border-color: rgba(255,255,255,0.08) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
    }
    [data-theme="dark"] .dropdown-item {
      color: #94A3B8 !important;
    }
    [data-theme="dark"] .dropdown-item:hover {
      background: rgba(255,255,255,0.05) !important;
      color: #E2E8F0 !important;
    }
    [data-theme="dark"] .dropdown-item.selected {
      background: rgba(255,132,0,0.1) !important;
      color: #FF8400 !important;
    }

    /* Sidebar border */
    [data-theme="dark"] #sidebar {
      border-color: rgba(255,255,255,0.06) !important;
    }

    /* Card hover shadow */
    [data-theme="dark"] .kpi-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    }

    /* Scrollbar */
    [data-theme="dark"] ::-webkit-scrollbar { width: 6px; }
    [data-theme="dark"] ::-webkit-scrollbar-track { background: transparent; }
    [data-theme="dark"] ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    [data-theme="dark"] ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

    /* Table row hover */
    [data-theme="dark"] tr:hover td,
    [data-theme="dark"] .wo-row:hover {
      background: rgba(255,255,255,0.03) !important;
    }

    /* Input / Select dark mode */
    [data-theme="dark"] input,
    [data-theme="dark"] select,
    [data-theme="dark"] textarea {
      background-color: #1E293B !important;
      border-color: rgba(255,255,255,0.08) !important;
      color: #E2E8F0 !important;
    }
    [data-theme="dark"] input::placeholder,
    [data-theme="dark"] textarea::placeholder {
      color: #94A3B8 !important;
    }
    [data-theme="dark"] input:focus,
    [data-theme="dark"] select:focus,
    [data-theme="dark"] textarea:focus {
      border-color: #FF8400 !important;
      outline: none;
    }

    /* Modal dark mode */
    [data-theme="dark"] .modal-content,
    [data-theme="dark"] [class*="bg-white"] {
      background-color: #0F172A !important;
      color: #E2E8F0 !important;
    }
    [data-theme="dark"] .modal-overlay {
      background: rgba(0, 0, 0, 0.6) !important;
    }

    /* Auth pages glass card */
    [data-theme="dark"] .glass-card {
      background: rgba(15, 23, 42, 0.8) !important;
      border-color: rgba(255,255,255,0.06) !important;
    }

    /* Tab / Toggle buttons in dark mode */
    [data-theme="dark"] .tab-btn:not(.active),
    [data-theme="dark"] .filter-btn:not(.active) {
      color: #94A3B8;
    }

    /* Progress bars dark background */
    [data-theme="dark"] .progress-bg {
      background: rgba(255,255,255,0.06) !important;
    }

    /* Resolution selector / time range buttons */
    [data-theme="dark"] .res-btn:not(.active) {
      background: #1E293B !important;
      color: #94A3B8 !important;
      border-color: rgba(255,255,255,0.08) !important;
    }

    /* Chart container */
    [data-theme="dark"] canvas {
      filter: none;
    }
  `;
  document.head.appendChild(style);
}

// ============ 初始化 ============

// 立即套用主題（避免 FOUC 閃爍）
applyTheme(getTheme());

// 注入深色模式 CSS 覆寫
injectDarkModeStyles();

// DOM 載入後注入切換按鈕
document.addEventListener('DOMContentLoaded', injectThemeToggle);
