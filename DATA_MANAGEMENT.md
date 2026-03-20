# IFDCS 前端資料管理說明

## 概述

`data.js` 是 IFDCS 系統的**前端共用資料表**，集中管理所有製程、產線和裝置的資料。這個設計使得未來與後端 API 整合時，只需要修改 `data.js` 即可完成資料來源的切換。

## 資料結構

### 1. 製程資料 (PROCESSES)

```javascript
const PROCESSES = {
  process1: { id: 'process1', name: '加工製程' },
  process2: { id: 'process2', name: '組裝製程' },
  process3: { id: 'process3', name: '檢測製程' }
};
```

### 2. 產線資料 (PRODUCTION_LINES)

```javascript
const PRODUCTION_LINES = {
  line1: {
    id: 'line1',
    name: '產線 1',
    process: 'process1',  // 所屬製程
    description: 'A產線 - 加工製程'
  },
  // ...
};
```

### 3. 裝置資料

#### 溫度監控裝置 (TEMPERATURE_DEVICES)
```javascript
[
  { id: 'A1', name: '裝置 A1', line: 'line1', baseTemp: 24.5, range: [20, 30] }
]
```

#### 電流監控裝置 (CURRENT_DEVICES)
```javascript
[
  { id: 'A1', name: '裝置 A1', line: 'line1', baseCurrent: 24.5, range: [15, 35] }
]
```

#### 電壓監控裝置 (VOLTAGE_DEVICES)
```javascript
[
  { id: 'A1', name: '裝置 A1', line: 'line1', baseVoltage: 220.5, range: [200, 240] }
]
```

## 工具函式

`data.js` 提供以下工具函式方便資料存取：

### 取得列表
- `getProcessList()` - 取得所有製程
- `getProductionLineList(processId)` - 取得產線列表（可依製程過濾）
- `getDeviceList(deviceType, lineId)` - 取得裝置列表（可依產線過濾）

### 取得單一資料
- `getProcessById(processId)` - 根據 ID 取得製程
- `getProductionLineById(lineId)` - 根據 ID 取得產線
- `getDeviceById(deviceType, deviceId)` - 根據 ID 取得裝置

## 使用方式

### 在 HTML 中引入

```html
<script src="data.js"></script>
```

### 在 JavaScript 中使用

```javascript
// 使用共用資料
const processes = PROCESSES;
const productionLines = PRODUCTION_LINES;

// 初始化裝置資料
const devices = TEMPERATURE_DEVICES.map(device => ({
  ...device,
  currentTemp: device.baseTemp  // 加入即時數值欄位
}));

// 使用工具函式
const processName = getProcessById('process1')?.name;
const lineName = getProductionLineById('line1')?.name;
```

## 已整合的頁面

以下頁面已整合使用 `data.js`：

- ✅ [temperature_monitor.html](temperature_monitor.html)
- ✅ [current_monitor.html](current_monitor.html)
- ✅ [voltage_monitor.html](voltage_monitor.html)

## 後端 API 整合準備

`data.js` 已預留後端 API 整合函式：

```javascript
// 從後端載入製程資料
async function loadProcessesFromAPI() {
  const response = await fetch('/api/processes');
  return await response.json();
}

// 從後端載入產線資料
async function loadProductionLinesFromAPI() {
  const response = await fetch('/api/production-lines');
  return await response.json();
}

// 從後端載入裝置資料
async function loadDevicesFromAPI(deviceType) {
  const response = await fetch(`/api/devices/${deviceType}`);
  return await response.json();
}
```

## 未來串接後端時的修改步驟

### 方式一：修改資料來源（推薦）

直接在 `data.js` 中將靜態資料替換為 API 呼叫：

```javascript
// 原本（靜態資料）
const PROCESSES = {
  process1: { id: 'process1', name: '加工製程' },
  // ...
};

// 改為（API 資料）
let PROCESSES = {};

// 在頁面載入時呼叫
async function initData() {
  PROCESSES = await loadProcessesFromAPI();
  PRODUCTION_LINES = await loadProductionLinesFromAPI();
  TEMPERATURE_DEVICES = await loadDevicesFromAPI('temperature');
  // ...
}
```

### 方式二：保留靜態資料作為預設值

```javascript
// 保留靜態資料作為預設值
const DEFAULT_PROCESSES = { /* ... */ };

// 嘗試從 API 載入，失敗時使用預設值
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

## 資料維護

### 新增製程

在 `data.js` 中新增：

```javascript
const PROCESSES = {
  // 現有製程
  process1: { id: 'process1', name: '加工製程' },
  // 新增製程
  process4: { id: 'process4', name: '包裝製程' }
};
```

### 新增產線

```javascript
const PRODUCTION_LINES = {
  // 現有產線
  line1: { id: 'line1', name: '產線 1', process: 'process1' },
  // 新增產線
  line4: { id: 'line4', name: '產線 4', process: 'process4' }
};
```

### 新增裝置

```javascript
const TEMPERATURE_DEVICES = [
  // 現有裝置
  { id: 'A1', name: '裝置 A1', line: 'line1', baseTemp: 24.5, range: [20, 30] },
  // 新增裝置
  { id: 'D1', name: '裝置 D1', line: 'line4', baseTemp: 26.0, range: [20, 30] }
];
```

## 注意事項

1. **ID 唯一性**：確保所有 ID（製程、產線、裝置）都是唯一的
2. **關聯正確性**：產線的 `process` 欄位必須對應到有效的製程 ID
3. **裝置關聯**：裝置的 `line` 欄位必須對應到有效的產線 ID
4. **資料型別**：注意數值型別（`baseTemp`, `baseCurrent`, `baseVoltage`）和陣列型別（`range`）
5. **向後相容**：修改資料結構時，確保不會影響現有頁面的運作

## 測試

修改 `data.js` 後，請測試以下頁面確保功能正常：

```bash
# 啟動本地伺服器
python3 -m http.server 8000

# 開啟瀏覽器測試
open http://localhost:8000/temperature_monitor.html
open http://localhost:8000/current_monitor.html
open http://localhost:8000/voltage_monitor.html
```

檢查項目：
- [ ] 製程下拉選單顯示正確
- [ ] 產線下拉選單顯示正確
- [ ] 裝置下拉選單顯示正確
- [ ] 過濾功能運作正常
- [ ] 裝置卡片資料顯示正確
