/**
 * IFDCS 前端共用資料表
 * 所有製程、產線、裝置資料的統一管理
 * 方便後端 API 串接時直接替換資料來源
 */

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
  line1: {
    id: 'line1',
    name: '產線 1',
    process: 'process1',  // 所屬製程
    description: 'A產線 - 加工製程'
  },
  line2: {
    id: 'line2',
    name: '產線 2',
    process: 'process2',  // 所屬製程
    description: 'B產線 - 組裝製程'
  },
  line3: {
    id: 'line3',
    name: '產線 3',
    process: 'process3',  // 所屬製程
    description: 'C產線 - 檢測製程'
  }
};

// ============ 裝置資料 ============
/**
 * 溫度監控裝置
 * baseTemp: 基準溫度
 * range: [最小值, 最大值] 正常範圍
 */
const TEMPERATURE_DEVICES = [
  { id: 'A1', name: '裝置 A1', line: 'line1', baseTemp: 24.5, range: [20, 30] },
  { id: 'A2', name: '裝置 A2', line: 'line1', baseTemp: 26.8, range: [20, 30] },
  { id: 'A3', name: '裝置 A3', line: 'line1', baseTemp: 25.2, range: [20, 30] },
  { id: 'B1', name: '裝置 B1', line: 'line2', baseTemp: 28.5, range: [22, 35] },
  { id: 'B2', name: '裝置 B2', line: 'line2', baseTemp: 31.2, range: [22, 35] },
  { id: 'C1', name: '裝置 C1', line: 'line3', baseTemp: 22.0, range: [18, 28] },
  { id: 'C2', name: '裝置 C2', line: 'line3', baseTemp: 23.5, range: [18, 28] },
  { id: 'C3', name: '裝置 C3', line: 'line3', baseTemp: 21.8, range: [18, 28] },
  { id: 'C4', name: '裝置 C4', line: 'line3', baseTemp: 27.2, range: [18, 28] }
];

/**
 * 電流監控裝置
 * baseCurrent: 基準電流 (A)
 * range: [最小值, 最大值] 正常範圍 (A)
 */
const CURRENT_DEVICES = [
  { id: 'A1', name: '裝置 A1', line: 'line1', baseCurrent: 24.5, range: [15, 35] },
  { id: 'A2', name: '裝置 A2', line: 'line1', baseCurrent: 26.8, range: [15, 35] },
  { id: 'A3', name: '裝置 A3', line: 'line1', baseCurrent: 25.2, range: [15, 35] },
  { id: 'B1', name: '裝置 B1', line: 'line2', baseCurrent: 30.5, range: [20, 40] },
  { id: 'B2', name: '裝置 B2', line: 'line2', baseCurrent: 32.1, range: [20, 40] },
  { id: 'C1', name: '裝置 C1', line: 'line3', baseCurrent: 18.0, range: [10, 30] },
  { id: 'C2', name: '裝置 C2', line: 'line3', baseCurrent: 20.5, range: [10, 30] },
  { id: 'C3', name: '裝置 C3', line: 'line3', baseCurrent: 19.8, range: [10, 30] },
  { id: 'C4', name: '裝置 C4', line: 'line3', baseCurrent: 22.2, range: [10, 30] }
];

/**
 * 電壓監控裝置
 * baseVoltage: 基準電壓 (V)
 * range: [最小值, 最大值] 正常範圍 (V)
 */
const VOLTAGE_DEVICES = [
  { id: 'A1', name: '裝置 A1', line: 'line1', baseVoltage: 220.5, range: [200, 240] },
  { id: 'A2', name: '裝置 A2', line: 'line1', baseVoltage: 219.8, range: [200, 240] },
  { id: 'A3', name: '裝置 A3', line: 'line1', baseVoltage: 221.2, range: [200, 240] },
  { id: 'B1', name: '裝置 B1', line: 'line2', baseVoltage: 380.5, range: [360, 400] },
  { id: 'B2', name: '裝置 B2', line: 'line2', baseVoltage: 379.1, range: [360, 400] },
  { id: 'C1', name: '裝置 C1', line: 'line3', baseVoltage: 110.0, range: [100, 120] },
  { id: 'C2', name: '裝置 C2', line: 'line3', baseVoltage: 111.5, range: [100, 120] },
  { id: 'C3', name: '裝置 C3', line: 'line3', baseVoltage: 109.8, range: [100, 120] },
  { id: 'C4', name: '裝置 C4', line: 'line3', baseVoltage: 112.2, range: [100, 120] }
];

// ============ 工具函式 ============

/**
 * 取得所有製程列表（用於下拉選單）
 * @returns {Array} 製程列表
 */
function getProcessList() {
  return Object.values(PROCESSES);
}

/**
 * 取得所有產線列表（用於下拉選單）
 * @param {string} processId - 製程ID（選填，用於過濾）
 * @returns {Array} 產線列表
 */
function getProductionLineList(processId = null) {
  const lines = Object.values(PRODUCTION_LINES);
  if (processId && processId !== 'all') {
    return lines.filter(line => line.process === processId);
  }
  return lines;
}

/**
 * 取得指定產線的所有裝置
 * @param {string} deviceType - 裝置類型：'temperature', 'current', 'voltage'
 * @param {string} lineId - 產線ID（選填，用於過濾）
 * @returns {Array} 裝置列表
 */
function getDeviceList(deviceType, lineId = null) {
  let devices;
  switch (deviceType) {
    case 'temperature':
      devices = TEMPERATURE_DEVICES;
      break;
    case 'current':
      devices = CURRENT_DEVICES;
      break;
    case 'voltage':
      devices = VOLTAGE_DEVICES;
      break;
    default:
      return [];
  }

  if (lineId && lineId !== 'all') {
    return devices.filter(device => device.line === lineId);
  }
  return devices;
}

/**
 * 根據 ID 取得製程資訊
 * @param {string} processId - 製程ID
 * @returns {Object} 製程資料
 */
function getProcessById(processId) {
  return PROCESSES[processId] || null;
}

/**
 * 根據 ID 取得產線資訊
 * @param {string} lineId - 產線ID
 * @returns {Object} 產線資料
 */
function getProductionLineById(lineId) {
  return PRODUCTION_LINES[lineId] || null;
}

/**
 * 根據 ID 取得裝置資訊
 * @param {string} deviceType - 裝置類型：'temperature', 'current', 'voltage'
 * @param {string} deviceId - 裝置ID
 * @returns {Object} 裝置資料
 */
function getDeviceById(deviceType, deviceId) {
  const devices = getDeviceList(deviceType);
  return devices.find(device => device.id === deviceId) || null;
}

// ============ 後端 API 整合準備 ============

/**
 * 從後端 API 載入製程資料（未來實作）
 * @returns {Promise<Object>} 製程資料
 */
async function loadProcessesFromAPI() {
  // TODO: 串接後端 API
  // const response = await fetch('/api/processes');
  // return await response.json();
  return PROCESSES;
}

/**
 * 從後端 API 載入產線資料（未來實作）
 * @returns {Promise<Object>} 產線資料
 */
async function loadProductionLinesFromAPI() {
  // TODO: 串接後端 API
  // const response = await fetch('/api/production-lines');
  // return await response.json();
  return PRODUCTION_LINES;
}

/**
 * 從後端 API 載入裝置資料（未來實作）
 * @param {string} deviceType - 裝置類型
 * @returns {Promise<Array>} 裝置資料
 */
async function loadDevicesFromAPI(deviceType) {
  // TODO: 串接後端 API
  // const response = await fetch(`/api/devices/${deviceType}`);
  // return await response.json();
  switch (deviceType) {
    case 'temperature':
      return TEMPERATURE_DEVICES;
    case 'current':
      return CURRENT_DEVICES;
    case 'voltage':
      return VOLTAGE_DEVICES;
    default:
      return [];
  }
}
