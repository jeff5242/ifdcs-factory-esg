# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IFDCS (Invasion Free Data Capture System) is a smart factory non-invasive data collection system for manufacturing facilities. It monitors equipment performance, energy consumption, and production metrics without requiring modifications to existing machinery.

**Current Status**: Frontend HTML prototypes implemented. The pages are standalone HTML files with Tailwind CSS via CDN.

**Factory Location**: 宜蘭廠區 (Yilan Factory)

**Project Location**: `/Users/jef/CodeRepository/ifdcs-frontend`

## Development Progress

| 日期 | 進度 | 說明 |
|------|------|------|
| 2026-02-06 | ✅ Dashboard 頁面完成 | 戰情中心頁面已輸出完成 |
| 2026-02-06 | ✅ 電流監控單獨頁面完成 | 參考溫度監控單獨頁面的介面設計 |
| 2026-02-09 | ✅ 電壓監控頁面完成 | 產線監控、單獨裝置、校正設定三個頁面 |
| 2026-02-10 | ✅ 共用側邊欄元件 | 抽取 sidebar.js，全部 10 個頁面統一使用 |
| 2026-02-10 | ✅ 電流監控重構 | current_monitor.html 改為多裝置卡片總覽架構 |
| 2026-02-10 | ✅ 電流啟動分析功能 | current_monitor_single.html 新增操作次數與臨界值分析 |
| 2026-02-10 | ✅ 異常告警中心頁面完成 | 動態篩選、Tab 切換、處理/查看互動功能 |
| 2026-02-10 | ✅ 生產力分析頁面完成 | OEE、UPH 趨勢圖、停機原因分析 |
| 2026-02-10 | ✅ 碳盤查 ESG 頁面完成 | Dark mode FUI、碳排 KPI、Combo Chart、工單碳足跡、淨零儀表 |
| 2026-02-11 | ✅ 共用資料來源 data.js | 集中管理製程/產線/裝置資料，支援動態下拉選單 |
| 2026-02-11 | ✅ 動態下拉選單實作 | 溫度/電流/電壓監控頁面改為動態讀取 data.js |

### 下一步 (Next Steps)
- [ ] **系統設定頁面** - 討論並實作系統設定功能（待規劃具體需求）

## Implemented Frontend Pages

| File | Description | Status |
|------|-------------|--------|
| `index.html` | 入口頁面 - 自動重導向至 dashboard.html | ✅ Redirect |
| `dashboard.html` | 戰情中心 - Main dashboard with KPIs, alerts, production status | ✅ Interactive |
| `energy-monitor.html` | 電力監控 - Power consumption monitoring | ✅ Static |
| `temperature_monitor.html` | 溫度監控 - All devices temperature overview | ✅ Interactive |
| `temperature_monitor_single.html` | 單一裝置溫度監控 - Single device detailed view with chart | ✅ Interactive |
| `temperature_calibration.html` | 溫度校正設定 - Calibration form with linear regression (y=ax+b) | ✅ Interactive |
| `current_monitor.html` | 電流監控 - Multi-device card overview with filters | ✅ Interactive |
| `current_monitor_single.html` | 單一裝置電流監控 - Chart + 啟動分析（操作次數/臨界值） | ✅ Interactive |
| `voltage_monitor.html` | 電壓監控 - All devices voltage overview | ✅ Interactive |
| `voltage_monitor_single.html` | 單一裝置電壓監控 - Single device detailed voltage view with chart | ✅ Interactive |
| `voltage_calibration.html` | 電壓校正設定 - Calibration form with linear regression (y=ax+b) | ✅ Interactive |
| `alerts.html` | 異常告警中心 - Alert center with filters, tabs, resolve/view actions | ✅ Interactive |
| `oee_analysis.html` | 生產力分析 (OEE) - UPH chart, downtime analysis, line picker | ✅ Interactive |
| `carbon_monitor.html` | 碳盤查 ESG - Dark mode FUI, carbon KPIs, combo chart, Net Zero gauge | ✅ Interactive |

### Shared Components

| File | Description |
|------|-------------|
| `sidebar.js` | 共用側邊欄元件 - 所有頁面的 sidebar 由此檔案統一渲染 |

## Technology Stack (Frontend)

- **CSS Framework**: Tailwind CSS (via CDN)
- **Charts**: Chart.js 4.4.1 (via CDN)
- **Fonts**:
  - Primary: JetBrains Mono (monospace, for data/numbers)
  - Secondary: Geist (sans-serif, for UI text)
- **Icons**: Material Symbols Sharp (Google Fonts)

## Design System

### Color Palette
```javascript
colors: {
  'background': '#F2F3F0',
  'foreground': '#111111',
  'card': '#FFFFFF',
  'card-foreground': '#111111',
  'border': '#CBCCC9',
  'muted': '#F2F3F0',
  'muted-foreground': '#666666',
  'primary': '#FF8400',        // Orange - brand color
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
}
```

### Component Patterns

#### Sidebar (Shared via `sidebar.js`)
- **實作方式**：所有頁面透過 `sidebar.js` 統一渲染，不再各自維護 sidebar HTML
- Width: 280px
- Logo: Orange diamond SVG + "IFDCS" text
- Menu items with Material Icons
- Active state: `bg-sidebar-accent text-sidebar-primary`（由 `data-active` 屬性控制）
- Hover state: `hover:bg-sidebar-accent`
- Footer: User info (系統管理員, admin@factory.com)

**使用方式**：
```html
<aside id="sidebar" class="flex flex-col w-[280px] h-full bg-sidebar border-r border-border" data-active="溫度監控"></aside>
<script src="sidebar.js"></script>
```

#### Sidebar Links（定義於 sidebar.js 的 SIDEBAR_MENU）
```
戰情中心     → dashboard.html        (icon: dashboard)
碳盤查       → carbon_monitor.html    (icon: eco)
電力監控     → energy-monitor.html    (icon: bolt)
生產數據     → oee_analysis.html      (icon: precision_manufacturing)
溫度監控     → temperature_monitor.html (icon: device_thermostat)
電流監控     → current_monitor.html   (icon: electric_meter)
電壓監控     → voltage_monitor.html   (icon: power)
異常通知     → alerts.html            (icon: notifications)
系統設定     → #                      (icon: settings)
```

#### Breadcrumb
- Location: Top bar header
- Format: `總部 > 宜蘭廠區 > [Current Page]`

#### Dropdown Component
```css
.dropdown { position: relative; }
.dropdown-menu {
  position: absolute;
  top: 100%;
  z-index: 50;
  margin-top: 4px;
  background: white;
  border: 1px solid #CBCCC9;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: none;
}
.dropdown-menu.open { display: block; }
.dropdown-item.selected { background-color: #FF840020; color: #FF8400; }
```

#### Card Styles
- Background: `bg-card` (white)
- Border: `border border-border`
- Shadow: `shadow-sm`
- Border radius: `rounded`

#### Status Indicators
- Normal: `bg-success-foreground` (#004D1A) with green dot
- Warning: `bg-warning-foreground` (#804200) with orange dot
- Error: `bg-error-foreground` (#8C1C00) with red dot

## Data Structure

### Production Lines & Devices
```javascript
const productionLines = {
  line1: {
    name: '產線 1',
    devices: [
      { id: 'A1', name: '裝置 A1', baseTemp: 24.5, range: [20, 30] },
      { id: 'A2', name: '裝置 A2', baseTemp: 26.8, range: [20, 30] },
      { id: 'A3', name: '裝置 A3', baseTemp: 25.2, range: [20, 30] },
    ]
  },
  line2: {
    name: '產線 2',
    devices: [
      { id: 'B1', name: '裝置 B1', baseTemp: 28.5, range: [22, 35] },
      { id: 'B2', name: '裝置 B2', baseTemp: 30.1, range: [22, 35] },
    ]
  },
  line3: {
    name: '產線 3',
    devices: [
      { id: 'C1', name: '裝置 C1', baseTemp: 22.0, range: [18, 28] },
      { id: 'C2', name: '裝置 C2', baseTemp: 23.5, range: [18, 28] },
      { id: 'C3', name: '裝置 C3', baseTemp: 21.8, range: [18, 28] },
      { id: 'C4', name: '裝置 C4', baseTemp: 27.2, range: [18, 28] },
    ]
  }
};
```

## Navigation Flow

```
Dashboard (戰情中心)
    ├── 電力監控 → energy-monitor.html
    │
    ├── 溫度監控 → temperature_monitor.html（多裝置卡片總覽）
    │               ├── Click device card → temperature_monitor_single.html
    │               │                         └── 校正設定 → temperature_calibration.html
    │               └── Select "全部產線/全部裝置" → back to temperature_monitor.html
    │
    ├── 電流監控 → current_monitor.html（多裝置卡片總覽）
    │               ├── Click device card → current_monitor_single.html（含啟動分析）
    │               └── Select "全部產線/全部裝置" → back to current_monitor.html
    │
    ├── 電壓監控 → voltage_monitor.html（多裝置卡片總覽）
    │               ├── Click device card → voltage_monitor_single.html
    │               │                         └── 校正設定 → voltage_calibration.html
    │               └── Select "全部產線/全部裝置" → back to voltage_monitor.html
    │
    └── 異常告警 → alerts.html（告警中心）
                    ├── Tab 切換：全部 / 未處理 / 已處理
                    ├── 篩選：告警等級、來源類型、搜尋
                    └── 動作：處理（確認 Modal）/ 查看（詳情 Modal）
```

**跨頁傳遞**：overview → single 頁面使用 `sessionStorage`（selectedLine, selectedDevice）

## Key Features by Page

### Dashboard (dashboard.html)
- Real-time clock display
- 4 KPI cards with navigation links
- Alert summary (2 pending alerts demo)
- Production line status (3 lines)
- 24-hour power trend chart
- Temperature overview summary
- Carbon emission stats
- Production efficiency metrics (FPY, utilization, UPH)
- Auto-refresh every 5 seconds

### Temperature Monitor (temperature_monitor.html)
- Filter by production line, status, search
- Statistics cards (device count, avg/max/min temp)
- Device cards grid with real-time updates
- Click device to navigate to single view
- Empty state when no results

### Temperature Monitor Single (temperature_monitor_single.html)
- Dropdown with "全部產線/全部裝置" option → navigates back to list
- Current temperature with status indicator
- Statistics (avg, max, min for 24h)
- Interactive Chart.js line chart
- Resolution selector (1s, 10s, 1min, 5min, Auto)
- Time range picker modal
- Draggable range slider for 24h navigation
- Real-time updates every 3 seconds
- sessionStorage for passing selected device between pages

### Temperature Calibration (temperature_calibration.html)
- Breadcrumb: 總部 > 宜蘭廠區 > 溫度監控 > 校正設定
- Production line + device selector (linked dropdowns)
- 5 calibration point inputs (measured vs actual)
- Real-time linear regression calculation: y = ax + b
- Displays slope (a), intercept (b), R² value
- Animation on calculation update
- Save confirmation with formula display

### Current Monitor (current_monitor.html)
- **架構與 temperature_monitor.html 一致**
- Filter by production line, status, search
- Statistics cards (device count, avg/max/min current)
- Device cards grid (3x3) with real-time updates
- Click device to navigate to single view via sessionStorage
- Unit: A (ampere)

### Current Monitor Single (current_monitor_single.html)
- **架構與 temperature_monitor_single.html 一致，額外增加啟動分析**
- Dropdown with "全部產線/全部裝置" → navigates back to list
- Current value with status indicator
- Statistics (avg, peak, min for 24h)
- Interactive Chart.js line chart with 4 datasets:
  - 實際電流 (orange, filled)
  - 警戒值 (red, dashed)
  - 標準值 (green, dashed)
  - 臨界值 Threshold (indigo `#6366F1`, dashed)
- **啟動分析功能**：
  - 操作次數：計算波形超過臨界值再回落的次數
  - 臨界值 (Threshold)：可即時調整的輸入框
  - 切換裝置時自動重設為 baseCurrent + 1.5A
  - 每次圖表更新時自動重新計算

### Voltage Monitor (voltage_monitor.html)
- 架構與 temperature_monitor.html / current_monitor.html 一致
- Filter by production line, status, search
- Statistics cards (device count, avg/max/min voltage)
- Device cards grid with real-time updates
- Unit: V (volt)

### Voltage Monitor Single (voltage_monitor_single.html)
- 架構與 temperature_monitor_single.html 一致
- Chart.js line chart, resolution selector, time range picker, range slider

### Voltage Calibration (voltage_calibration.html)
- 架構與 temperature_calibration.html 一致
- Linear regression calibration: y = ax + b

### Alerts Center (alerts.html)
- Page title: 異常告警中心 / subtitle: 即時監控與歷史告警紀錄
- **篩選面板**（動態）：
  - 告警等級：全部 / 嚴重 / 警告 / 資訊（toggle buttons）
  - 來源類型：dropdown（溫度異常、電流異常、電壓異常、用電異常、設備通知）
  - 搜尋：自由文字搜尋告警內容
  - 篩選 badge 顯示啟用的篩選條件數量
- **Metrics Row**（4 張卡片）：嚴重告警、警告通知、資訊通知、今日已處理
- **Tab 切換**：全部 / 未處理 / 已處理
- **告警列表**：
  - 每列顯示等級 badge、標題、描述、時間、動作按鈕
  - 嚴重 → 橘色「處理」按鈕 → 確認 Modal
  - 警告 → 灰色「查看」按鈕 → 詳情 Modal（可標記已處理）
  - 已處理 → 半透明 + ✓ 已解決
- Metrics 即時更新處理狀態

### OEE Analysis (oee_analysis.html)
- Page title: 生產力分析 (OEE) / subtitle: 設備稼動率與生產效率監控
- **產線選擇器**：dropdown（A 產線 / B 產線 / C 產線 / 全部產線）
- **Metrics Row 1**（4 張 OEE 卡片）：
  - 整體設備效率 OEE（依數值動態顯示綠/黃/紅）
  - 平均 UPH（件/小時）
  - 今日產量達成率（%）
  - 今日停機時間（分鐘，依數值動態顯示綠/黃/紅）
- **Metrics Row 2**（4 張 ERP KPI 卡片）：
  - 生產良率 Yield = 合格品數 / 總投入數（含公式說明）
  - 生產完成率 = 實際完工數 / 工單目標數
  - 重工率 Rework = 重工次數 / 總產出數
  - 產能利用率 = 實際產能 / 理論最大產能
  - 所有 KPI 依閾值動態顯示綠/黃/紅
- **UPH 趨勢圖**：Chart.js bar chart，本週/本月切換
- **停機原因分析**：設備故障、換料/換模、品質測試、計畫停機（含進度條動畫）
- **工單追蹤**（ERP 匯入）：
  - Tab 切換：進行中 / 已完工 / 全部
  - 表格欄位：工單編號、產線、製程、投料數、完工數、入庫數、良率、進度、狀態
  - 良率依閾值變色、進度條依完成比例變色
  - 依產線篩選自動更新
- 切換產線時所有數據、圖表、工單即時更新，含數值動畫

## Architecture Notes

### Planned Technology Stack

**Backend**:
- Time Series Database: InfluxDB or TimescaleDB
- Data Collection: Modbus TCP/RTU, MQTT protocols
- API: RESTful interface
- Notifications: Email and Line messaging
- OS: Ubuntu Server 22.04 LTS (recommended)

**Frontend** (Future):
- Responsive Web Design (RWD) for desktop/tablet/mobile
- Browser support: Chrome 90+, Firefox 88+, Edge 90+

### Data Flow
```
Sensors (CT/Distance/Counter) → Industrial Gateway → Data Collection Engine → Time Series DB → Analysis Engine → REST API → Frontend
```

## Key Design Files

- `ifdcs.pen` - UI/UX mockups (Pencil design format)
- `報價資料/` - Specifications and architecture documentation in Traditional Chinese

## Hardware Integration

**Supported Sensors**:
- CT current sensors (3-phase, clip-on, Hall effect)
- Distance sensors (laser, ultrasonic)
- Counter sensors (photoelectric, proximity switch)

**Communication Protocols**:
- Modbus TCP/RTU
- MQTT

## Data Retention Policy

- Real-time data: 7 days at full precision
- Historical data: 1 year (configurable)
- Statistical reports: permanent

## Language Notes

Documentation is in Traditional Chinese (Taiwan). The system should support internationalization for multi-language deployment.
