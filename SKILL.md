# SKILL.md - 開發流程與互動規範

本文件定義 Claude Code 在本專案中的開發互動模式，減少重複溝通，加速開發節奏。

## 1. Git 提交規範

### Commit Message 格式
```
<type>: <簡述（中文或英文皆可）>
```

| Type | 用途 | 範例 |
|------|------|------|
| `feat` | 新功能 | `feat: 新增電壓監控頁面` |
| `fix` | 修復 Bug | `fix: 修正側邊欄連結順序` |
| `style` | 樣式調整（不影響邏輯） | `style: 統一卡片圓角大小` |
| `refactor` | 重構（不改變行為） | `refactor: 抽取共用側邊欄元件` |
| `docs` | 文件更新 | `docs: 更新 CLAUDE.md 開發進度` |
| `deploy` | 部署相關 | `deploy: 同步至 AWS S3` |
| `chore` | 雜項維護 | `chore: 清理未使用檔案` |

### 原子化提交原則
- 每完成一個獨立功能或修復，立即提交
- 不要累積多個不相關的變更在同一次 commit
- Commit message 寫「為什麼改」而非「改了什麼」

## 2. 分支策略

```
main (正式版)
 └── feature/xxx  (功能開發)
 └── fix/xxx      (問題修復)
```

- **不直接在 main 上開發**（除非是緊急修復）
- 開發流程：`checkout -b feature/xxx` → 開發 → commit → push → PR → merge
- 分支命名：`feature/voltage-monitor`、`fix/sidebar-links`

## 3. 部署流程

### AWS S3 靜態網站
- **S3 Bucket**: `ifdcs-frontend-jeff-2026`
- **Region**: `ap-northeast-1`
- **URL**: `http://ifdcs-frontend-jeff-2026.s3-website-ap-northeast-1.amazonaws.com/`
- **AWS CLI**: `/usr/local/bin/aws`

### 部署指令（直接執行，不需確認）
```bash
# 上傳共用元件（JS 檔案）
/usr/local/bin/aws s3 cp sidebar.js s3://ifdcs-frontend-jeff-2026/sidebar.js
/usr/local/bin/aws s3 cp data.js s3://ifdcs-frontend-jeff-2026/data.js

# 上傳所有 HTML 檔案
for f in *.html; do
  /usr/local/bin/aws s3 cp "$f" "s3://ifdcs-frontend-jeff-2026/$f" --content-type "text/html"
done
```

### 部署後驗證
```bash
# 批次檢查所有頁面 HTTP 200
BASE="http://ifdcs-frontend-jeff-2026.s3-website-ap-northeast-1.amazonaws.com"
for page in index.html dashboard.html energy-monitor.html temperature_monitor.html current_monitor.html voltage_monitor.html sidebar.js data.js; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/$page")
  echo "$STATUS  $page"
done
```

### 部署檢查清單
- [ ] 所有頁面側邊欄連結一致
- [ ] 所有頁面 HTTP 200 回應正常
- [ ] 不上傳 `server/`、`node_modules/`、`.env` 等非前端檔案

## 4. 開發日常流程

```
開工前  → git pull origin main
開發中  → 頻繁 git add + git commit（小步快跑）
完工後  → git push origin <branch>
驗收時  → 確認 GitHub 頁面上的 diff 無誤
部署時  → 執行 S3 上傳，驗證所有頁面可存取
```

## 5. Claude Code 互動規範

### 直接執行（不需詢問）
- 部署到 AWS S3（已有固定流程）
- 修復側邊欄一致性問題
- 更新 CLAUDE.md 開發進度
- 執行 `git pull` / `git push`

### 需要確認
- 刪除檔案或分支
- 修改資料庫 schema
- 變更 AWS 設定（IAM、Bucket Policy 等）
- 新增第三方套件依賴

### 頁面開發標準檢查
新增或修改頁面時，自動檢查：
1. 側邊欄連結是否與標準一致（見下方）
2. 麵包屑格式：`總部 > 宜蘭廠區 > [頁面名稱]`
3. 字型載入：JetBrains Mono + Geist
4. 圖示：Material Symbols Sharp
5. 配色遵循 Design System

### 標準側邊欄順序
```
戰情中心      → dashboard.html        (icon: dashboard)
碳盤查        → #                      (icon: eco)
電力監控      → energy-monitor.html    (icon: bolt)
生產數據      → #                      (icon: precision_manufacturing)
溫度監控      → temperature_monitor.html (icon: device_thermostat)
電流監控      → current_monitor.html   (icon: electric_meter)
電壓監控      → voltage_monitor.html   (icon: power)
異常通知      → #                      (icon: notifications)
系統設定      → #                      (icon: settings)
```

## 6. 檔案結構規範

```
ifdcs-frontend/
├── index.html          # 入口（自動重導向至 dashboard.html）
├── dashboard.html      # 戰情中心
├── energy-monitor.html # 電力監控
├── temperature_*.html  # 溫度監控系列（monitor / single / calibration）
├── current_*.html      # 電流監控系列（monitor / single）
├── voltage_*.html      # 電壓監控系列（monitor / single / calibration）
├── sidebar.js          # 共用側邊欄元件（所有頁面引用）
├── CLAUDE.md           # 專案說明與開發進度
├── SKILL.md            # 開發流程規範（本文件）
├── ifdcs.pen           # UI/UX 設計稿
├── server/             # 後端 API（不部署到 S3）
│   ├── index.js
│   ├── routes/
│   └── prisma/
└── 報價資料/            # 規格文件
```

## 7. 頁面架構模式（Reference Templates）

本專案的監控頁面遵循三種固定架構，新增頁面時應以對應模板為參考：

### 7.1 多裝置總覽頁（Overview Page）
**參考模板**：`temperature_monitor.html`
**同架構頁面**：`current_monitor.html`、`voltage_monitor.html`

```
頁面結構：
├── Sidebar（sidebar.js）
├── Top Bar（麵包屑）
├── Page Header（標題 + 說明）
├── Filter Section（產線 / 狀態 / 搜尋）
├── Statistics Cards（4 張：裝置數 / 平均值 / 最高值 / 最低值）
├── Device Cards Grid（3 列，每張卡片包含即時數值 + 狀態燈號）
└── Real-time Updates（setInterval, 每 3 秒）
```

**關鍵模式**：
- 點擊裝置卡片 → `sessionStorage.setItem('selectedLine', ...)` + `sessionStorage.setItem('selectedDevice', ...)` → 跳轉至 single 頁面
- 篩選邏輯：產線下拉 + 狀態下拉 + 文字搜尋，三者交集
- 無結果時顯示 empty state

### 7.2 單一裝置詳細頁（Single Device Page）
**參考模板**：`temperature_monitor_single.html`
**同架構頁面**：`current_monitor_single.html`、`voltage_monitor_single.html`

```
頁面結構：
├── Sidebar（sidebar.js）
├── Top Bar（麵包屑含裝置名稱）
├── Page Header + 刷新 / 匯出按鈕
├── Filter Section（產線下拉 + 裝置下拉）
│   └── 「全部產線」或「全部裝置」→ 導回總覽頁
├── Device Info Row
│   ├── 當前數值卡片（大字體 + 狀態燈號）
│   └── 統計卡片（平均 / 峰值 / 最低，24h）
├── Chart Card
│   ├── Chart.js 折線圖
│   ├── Resolution Selector（1s / 10s / 1min / 5min / Auto）
│   ├── Time Range Picker Modal
│   └── Draggable Range Slider（24h 時間軸）
└── Real-time Updates（setInterval, 每 3 秒）
```

**關鍵模式**：
- `sessionStorage.getItem('selectedLine/selectedDevice')` 讀取後立即 `removeItem`
- Chart.js datasets: 實際值(orange) + 警戒值(red dashed) + 標準值(green dashed)
- 即時更新：`chart.data.datasets[0].data.push(new) / .shift()` + `chart.update('none')`

### 7.3 校正設定頁（Calibration Page）
**參考模板**：`temperature_calibration.html`
**同架構頁面**：`voltage_calibration.html`

```
頁面結構：
├── Sidebar（sidebar.js）
├── Top Bar（麵包屑：... > 監控 > 校正設定）
├── Filter Section（產線 + 裝置聯動下拉）
├── Calibration Inputs（5 組量測值 vs 實際值）
├── Calculation Result（y = ax + b, R² 值）
└── Save Button（含確認提示）
```

## 8. 共用元件規範

### sidebar.js — 側邊欄單一來源

**設計原則**：所有頁面的側邊欄由 `sidebar.js` 的 `SIDEBAR_MENU` 陣列統一管理，避免新增頁面時造成不一致。

**新增側邊欄項目流程**：
1. 編輯 `sidebar.js` 的 `SIDEBAR_MENU` 陣列，加入新項目
2. 所有頁面自動生效，無需逐一修改
3. 部署時確保 `sidebar.js` 也上傳至 S3

**新增頁面使用 sidebar 的方式**：
```html
<aside id="sidebar" class="flex flex-col w-[280px] h-full bg-sidebar border-r border-border" data-active="頁面名稱"></aside>
<script src="sidebar.js"></script>
```
- `data-active` 值必須與 `SIDEBAR_MENU` 中的 `label` 完全一致

### 跨頁面資料傳遞 — sessionStorage

總覽頁 → 單一裝置頁使用 `sessionStorage`：
```javascript
// 寫入（總覽頁，點擊卡片時）
sessionStorage.setItem('selectedLine', 'line1');
sessionStorage.setItem('selectedDevice', 'A1');
window.location.href = 'xxx_single.html';

// 讀取（單一裝置頁，init 時）
const savedLine = sessionStorage.getItem('selectedLine');
const savedDevice = sessionStorage.getItem('selectedDevice');
// 使用後立即清除
sessionStorage.removeItem('selectedLine');
sessionStorage.removeItem('selectedDevice');
```

## 9. 開發經驗與常見陷阱

### 已解決的問題

| 問題 | 原因 | 解法 |
|------|------|------|
| 側邊欄不一致 | 每個頁面各自維護 sidebar HTML | 抽取為 `sidebar.js` 共用元件 |
| S3 根目錄 404 | 缺少 `index.html` | 建立 redirect 頁面 `<meta http-equiv="refresh">` |
| 新頁面缺少連結 | 手動複製 sidebar 遺漏 | `sidebar.js` 的 `SIDEBAR_MENU` 為單一來源 |
| 部署遺漏 JS 檔 | 部署指令只上傳 `*.html` | 部署指令加入 `sidebar.js` 上傳 |

### 新增監控頁面的標準流程

新增一個監控類型（如「振動監控」）時，按以下順序：

1. **建立總覽頁**：複製 `temperature_monitor.html`，修改資料結構（裝置清單、數值欄位、單位）
2. **建立單一裝置頁**：複製 `temperature_monitor_single.html`，修改圖表 datasets 和數值顯示
3. **（選用）建立校正頁**：複製 `temperature_calibration.html`
4. **更新 sidebar.js**：在 `SIDEBAR_MENU` 加入新頁面連結
5. **更新 CLAUDE.md**：加入新頁面至清單、Navigation Flow、Key Features
6. **部署並驗證**：上傳所有檔案，批次檢查 HTTP 200

### 功能擴展模式

在現有頁面上新增分析功能時（如電流的啟動分析）：

1. **新增 UI 卡片**：在 Device Info Row 加入新的分析卡片
2. **新增圖表 dataset**：在 Chart.js 的 datasets 陣列中加入新的參考線
3. **新增計算函數**：獨立的計算邏輯，圖表更新時自動呼叫
4. **更新 tooltip labels**：確保 tooltip callback 的 labels 陣列與 datasets 數量一致
5. **切換裝置時重設**：在 `selectDevice()` 中設定合理的預設值

## 10. Claude Code 高效互動模式

### 批次修改多個頁面
- 使用 **Task 工具的平行 Agent** 分工處理，每個 Agent 負責一批頁面
- 例：10 個頁面更新 sidebar → 拆成 2 組各 5 頁，平行執行
- 完成後用 `grep` 驗證所有頁面的修改一致性

### 頁面重構流程
1. 先 Read 參考模板頁面（如 `temperature_monitor.html`）
2. Read 要重構的目標頁面
3. Write 完整的新內容（重構時偏好完整重寫而非逐段 Edit）
4. 確認所有互動功能（篩選、即時更新、頁面跳轉）

### 部署驗證標準
- 上傳所有 HTML + JS 檔案
- `curl` 批次檢查所有頁面 HTTP 200
- 回報部署結果（頁面清單 + 狀態碼）

## 11. 資料管理與動態載入

### 11.1 共用資料來源 — data.js

**設計原則**：所有製程、產線、裝置資料由 `data.js` 集中管理，避免散落在各 HTML 頁面中。

**資料結構**：
```javascript
// ============ 製程資料 ============
const PROCESSES = {
  process1: { id: 'process1', name: '沖壓製程' },
  process2: { id: 'process2', name: '組立製程' },
  process3: { id: 'process3', name: '陽極製程' },
  process4: { id: 'process4', name: '噴砂製程' },
  process5: { id: 'process5', name: '打磨製程' },
  process6: { id: 'process6', name: 'CNC製程' }
};

// ============ 產線資料 ============
const PRODUCTION_LINES = {
  line1: { id: 'line1', name: '產線 1', process: 'process1' },
  line2: { id: 'line2', name: '產線 2', process: 'process2' },
  line3: { id: 'line3', name: '產線 3', process: 'process3' }
};

// ============ 裝置資料 ============
const TEMPERATURE_DEVICES = [...];
const CURRENT_DEVICES = [...];
const VOLTAGE_DEVICES = [...];
```

**工具函式**：
- `getProcessList()` - 取得所有製程列表
- `getProductionLineList(processId)` - 取得產線列表（可依製程過濾）
- `getDeviceList(deviceType, lineId)` - 取得裝置列表（可依產線過濾）
- `getProcessById(processId)` - 根據 ID 取得製程
- `getProductionLineById(lineId)` - 根據 ID 取得產線
- `getDeviceById(deviceType, deviceId)` - 根據 ID 取得裝置

### 11.2 動態下拉選單模式

**問題場景**：當 data.js 更新（如新增製程）時，若下拉選單是硬編碼在 HTML 中，前端無法自動反映更新。

**❌ 錯誤做法（硬編碼）**：
```html
<div class="dropdown-menu" id="process-menu">
  <div class="dropdown-item selected" data-value="all" onclick="selectProcess(this)">全部製程</div>
  <div class="dropdown-item" data-value="process1" onclick="selectProcess(this)">加工製程</div>
  <div class="dropdown-item" data-value="process2" onclick="selectProcess(this)">組裝製程</div>
  <div class="dropdown-item" data-value="process3" onclick="selectProcess(this)">檢測製程</div>
</div>
```

**✅ 正確做法（動態生成）**：

**步驟 1：清空 HTML 硬編碼選項**
```html
<div class="dropdown-menu" id="process-menu">
  <!-- 動態生成 -->
</div>

<div class="dropdown-menu" id="line-menu">
  <!-- 動態生成 -->
</div>
```

**步驟 2：新增初始化函式**
```javascript
// ============ 初始化下拉選單 ============
function initializeDropdowns() {
  // 初始化製程下拉選單
  initProcessDropdown();

  // 初始化產線下拉選單
  initLineDropdown();

  // 初始化裝置下拉選單（視頁面需求）
  updateDeviceDropdown();
}

/**
 * 初始化製程下拉選單
 */
function initProcessDropdown() {
  const processMenu = document.getElementById('process-menu');
  const processList = getProcessList(); // 使用 data.js 的工具函式

  let html = '<div class="dropdown-item selected" data-value="all" onclick="selectProcess(this)">全部製程</div>';

  processList.forEach(process => {
    html += `<div class="dropdown-item" data-value="${process.id}" onclick="selectProcess(this)">${process.name}</div>`;
  });

  processMenu.innerHTML = html;
}

/**
 * 初始化產線下拉選單
 */
function initLineDropdown() {
  const lineMenu = document.getElementById('line-menu');
  const lineList = getProductionLineList(); // 使用 data.js 的工具函式

  let html = '<div class="dropdown-item selected" data-value="all" onclick="selectLine(this)">全部產線</div>';

  lineList.forEach(line => {
    html += `<div class="dropdown-item" data-value="${line.id}" onclick="selectLine(this)">${line.name}</div>`;
  });

  lineMenu.innerHTML = html;
}
```

**步驟 3：在 init() 開頭呼叫初始化**
```javascript
function init() {
  // 初始化下拉選單（必須在最前面）
  initializeDropdowns();

  // 初始化裝置資料
  devices.forEach(device => {
    device.currentTemp = device.baseTemp + (Math.random() - 0.5) * 3;
  });

  renderDevices();
  startRealtimeUpdates();
}
```

### 11.3 資料更新驗證流程

當修改 `data.js` 後，驗證前端是否正確讀取：

1. **修改 data.js**（例：新增製程、改名稱）
2. **刷新瀏覽器**
3. **檢查下拉選單**：
   - 製程下拉應顯示所有最新製程
   - 產線下拉應依所屬製程正確過濾
   - 裝置下拉應依產線正確過濾

4. **測試過濾功能**：
   - 選擇不同製程 → 產線和裝置應自動更新
   - 選擇不同產線 → 裝置應自動更新
   - 所有篩選組合應正常運作

### 11.4 已整合動態載入的頁面

| 頁面 | 動態載入項目 | 狀態 |
|------|------------|------|
| `temperature_monitor.html` | 製程、產線、裝置下拉選單 | ✅ 完成 |
| `current_monitor.html` | 製程、產線、裝置下拉選單 | ✅ 完成 |
| `voltage_monitor.html` | 製程、產線、裝置下拉選單 | ✅ 完成 |

### 11.5 後端 API 整合準備

**未來串接後端時的修改步驟**（只需修改 data.js）：

**方式一：直接替換資料來源**
```javascript
// 原本（靜態資料）
const PROCESSES = { process1: {...}, process2: {...} };

// 改為（API 資料）
let PROCESSES = {};

async function initData() {
  PROCESSES = await loadProcessesFromAPI();
  PRODUCTION_LINES = await loadProductionLinesFromAPI();
  TEMPERATURE_DEVICES = await loadDevicesFromAPI('temperature');
}
```

**方式二：保留靜態資料作為備援**
```javascript
const DEFAULT_PROCESSES = { process1: {...}, process2: {...} };
let PROCESSES = DEFAULT_PROCESSES;

async function initData() {
  try {
    PROCESSES = await loadProcessesFromAPI();
  } catch (error) {
    console.warn('無法載入製程資料，使用預設值', error);
    PROCESSES = DEFAULT_PROCESSES;
  }
}
```

### 11.6 資料維護清單

| 操作 | 步驟 | 影響範圍 |
|------|------|---------|
| 新增製程 | 在 `PROCESSES` 新增項目 | 所有監控頁面的製程下拉 |
| 新增產線 | 在 `PRODUCTION_LINES` 新增項目，設定 `process` 關聯 | 所有監控頁面的產線下拉 |
| 新增裝置 | 在 `TEMPERATURE_DEVICES` / `CURRENT_DEVICES` / `VOLTAGE_DEVICES` 新增 | 對應監控頁面的裝置清單 |
| 修改名稱 | 修改對應物件的 `name` 欄位 | 立即反映到所有頁面 |

**注意事項**：
- 確保所有 ID 唯一（process ID、line ID、device ID）
- 產線的 `process` 欄位必須對應到有效的製程 ID
- 裝置的 `line` 欄位必須對應到有效的產線 ID
- 裝置的 `range` 陣列格式：`[最小值, 最大值]`

### 11.7 開發經驗總結

| 問題 | 原因 | 解法 |
|------|------|------|
| 下拉選單不同步 | HTML 硬編碼選項，修改 data.js 無效 | 改為動態生成（initProcessDropdown、initLineDropdown） |
| 新增製程無法顯示 | 前端只讀取 HTML 硬編碼的 3 個製程 | 使用 `getProcessList()` 動態取得所有製程 |
| 過濾功能失效 | 製程 ID 不一致（data.js 已改，HTML 未改） | 單一資料來源（data.js），所有頁面統一讀取 |
| 測試時需逐頁檢查 | 每個頁面各自維護資料 | 集中管理後，只需測試 data.js 即可 |

**開發流程建議**：
1. **資料變更**：只修改 `data.js`
2. **前端驗證**：刷新任一監控頁面，檢查下拉選單
3. **功能測試**：測試製程/產線/裝置篩選功能
4. **部署上傳**：記得將 `data.js` 一併上傳至 S3
