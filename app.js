const STORAGE_KEY = "stock_mock_sim_v34";
const ADMIN_CODE = "010814";

const DEFAULT_SETTINGS = {
  initialCash: 1000000,
  supportFundAmount: 500000,
  supportFundCashLimit: 500000,
  feeRate: 0.0015,
  globalVolatility: 1,
  newsFrequency: 1,
  marketBias: 0,
  adminHighSpeedEnabled: false,
  dailyLimitEnabled: true,
  upperLimitRate: 0.30,
  lowerLimitRate: 0.30
};

const CHART_RANGES = [
  { key: "1m", label: "1분" },
  { key: "5m", label: "5분" },
  { key: "1d", label: "일" },
  { key: "1w", label: "주" },
  { key: "1y", label: "1년" },
  { key: "10y", label: "10년" },
  { key: "100y", label: "100년" }
];

const STOCK_BLUEPRINTS = [
  ["KQ001", "한강테크", "한", "AI 반도체", 48200, "mid", "momentum"],
  ["KQ002", "네오바이오", "네", "바이오 신약", 32150, "mid", "news"],
  ["KQ003", "블루모빌리티", "블", "전기차 부품", 187000, "large", "cyclical"],
  ["KQ004", "코어엔터", "코", "엔터/플랫폼", 12950, "mid", "momentum"],
  ["KQ005", "스카이로직스", "스", "물류 자동화", 85300, "mid", "stable"],
  ["KQ006", "오로라게임즈", "오", "게임/콘텐츠", 56700, "mid", "theme"],
  ["KQ007", "에코플랜트", "에", "친환경 소재", 104500, "mid", "stable"],
  ["KQ008", "미래핀테크", "미", "핀테크", 72200, "mid", "news"],
  ["KQ009", "제니스AI", "제", "초거대 AI", 243500, "large", "momentum"],
  ["KQ010", "라이트메드", "라", "헬스케어", 41550, "mid", "news"],
  ["KQ011", "웨이브로보틱스", "웨", "로봇/공장자동화", 96400, "large", "theme"],
  ["KQ012", "트리온클라우드", "트", "클라우드", 138800, "large", "stable"],
  ["KQ013", "초록에너지", "초", "신재생에너지", 16350, "mid", "theme"],
  ["KQ014", "다올반도체", "다", "메모리 반도체", 9100, "mid", "cyclical"],
  ["KQ015", "나래커머스", "나", "이커머스", 2780, "cheap", "momentum"],
  ["KQ016", "성운광학", "성", "광학장비", 506000, "expensive", "stable"],
  ["KQ017", "큐브로직", "큐", "보안 솔루션", 66900, "mid", "stable"],
  ["KQ018", "바이오엣지", "바", "유전자 분석", 1450, "cheap", "news"],
  ["KQ019", "마이크로링크", "마", "IoT 통신모듈", 860, "cheap", "momentum"],
  ["KQ020", "프라임홀딩스", "프", "지주/금융", 1023000, "premium", "stable"],
  ["KQ021", "루멘미디어", "루", "미디어/광고", 6350, "cheap", "theme"],
  ["KQ022", "하이젠소프트", "하", "기업용 소프트웨어", 199500, "large", "stable"],
  ["KQ023", "솔라트론", "솔", "태양광 장비", 118000, "large", "cyclical"],
  ["KQ024", "피닉스소재", "피", "2차전지 소재", 352000, "large", "theme"],
  ["KQ025", "유니온푸드", "유", "식품/소비재", 59000, "mid", "stable"],
  ["KQ026", "센텀칩스", "센", "팹리스", 715000, "expensive", "momentum"],
  ["KQ027", "원픽엔진", "원", "엔진/기계", 500, "cheap", "momentum"],
  ["KQ028", "엘릭서메디", "엘", "제약 플랫폼", 982000, "premium", "news"],
  ["KQ029", "제로클라우드", "제로", "AI 인프라", 425000, "expensive", "theme"],
  ["KQ030", "아틀라스모터스", "아", "미래 모빌리티", 1105000, "premium", "cyclical"]
];

const GENERIC_NEWS = {
  good: [
    "실적 기대감이 반영되며 매수세가 붙고 있어요",
    "기관 수급이 유입되면서 흐름이 단단해지고 있어요",
    "관련 업종 전반이 강해서 같이 탄력을 받고 있어요",
    "저점 매수세가 붙으면서 빠르게 되돌리는 모습이에요",
    "외국인 수급 기대가 붙으면서 시선이 모이는 구간이에요"
  ],
  bad: [
    "차익 실현 물량이 나오면서 잠깐 흔들리는 모습이에요",
    "위쪽 매물이 두꺼워져서 속도가 조금 둔해졌어요",
    "단기 급등 뒤라 변동성이 커질 수 있어 보여요",
    "매수세가 약해지면 아래쪽 확인이 나올 수 있어요",
    "장 후반 갈수록 흔들림이 커질 가능성도 있어요"
  ],
  event: [
    "오늘 관심 종목으로 자주 언급되고 있어요",
    "검색량이 빠르게 늘면서 시선이 몰리고 있어요",
    "장중 알림 빈도가 늘어날 만큼 주목받고 있어요",
    "단기 트레이더들이 많이 보는 자리예요",
    "수급이 몰리면 체감상 훨씬 빠르게 움직일 수 있어요"
  ],
  breaking: [
    "장중 수급이 몰리면서 움직임이 커지고 있어요",
    "거래량이 급격히 늘면서 변동성도 커졌어요",
    "한 번 방향이 나오면 강하게 이어질 수 있는 구간이에요",
    "시장 전체보다 훨씬 빠르게 반응 중이에요",
    "호가 공백이 빠르게 메워지며 전개가 빨라졌어요"
  ]
};

const state = {
  speed: 1,
  selectedCode: "KQ001",
  orderMode: "buy",
  sortBy: "change",
  chartRange: "1m",
  historyTab: "orders",
  isPaused: false,
  isStopped: false,
  isAdmin: false,
  settings: { ...DEFAULT_SETTINGS },
  baseline: { totalAsset: DEFAULT_SETTINGS.initialCash, startedAt: Date.now() },
  realizedProfit: 0,
  portfolio: { cash: DEFAULT_SETTINGS.initialCash, holdings: {} },
  favorites: [],
  stocks: [],
  news: [],
  alerts: [],
  orderHistory: [],
  autoSellOrders: [],
  autoBuyOrders: [],
  virtualTime: Date.now(),
  virtualDateKey: "",
  chartRenderCounter: 0
};

const els = {};
let tickTimer = null;
let saveTimer = null;

function q(sel, root = document) { return root.querySelector(sel); }
function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function byId(id) { return document.getElementById(id); }
function setText(el, value) { if (el) el.textContent = value; }
function addEvent(el, type, fn) { if (el) el.addEventListener(type, fn); }
function toNum(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function toInt(v, d = 0) { const n = Math.floor(Number(v)); return Number.isFinite(n) ? n : d; }
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

function formatKRW(v) { return `${Math.round(toNum(v)).toLocaleString("ko-KR")}원`; }
function formatSignedKRW(v) {
  const n = Math.round(toNum(v));
  return `${n >= 0 ? "+" : ""}${n.toLocaleString("ko-KR")}원`;
}
function formatSignedPct(v) {
  const n = toNum(v);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function formatQty(v) { return `${Math.max(0, toInt(v)).toLocaleString("ko-KR")}주`; }
function formatVolume(v) {
  const n = toNum(v);
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return Math.round(n).toLocaleString("ko-KR");
}
function nowTime() {
  const d = new Date(state.virtualTime || Date.now());
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
function formatVirtualDateTime() {
  const d = new Date(state.virtualTime || Date.now());
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
function dateKeyFromTime(ts) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function feeOf(amount) { return Math.round(toNum(amount) * toNum(state.settings.feeRate)); }

function makeStock([code, name, logo, theme, base, priceClass, style]) {
  const volatilityMap = { cheap: 0.045, mid: 0.022, large: 0.015, expensive: 0.011, premium: 0.009 };
  const history = [];
  let p = base;
  for (let i = 0; i < 180; i++) {
    p = Math.max(1, Math.round(p * (1 + rand(-0.01, 0.01))));
    history.push(p);
  }
  return {
    code,
    name,
    logo,
    theme,
    priceClass,
    style,
    prevClose: base,
    openPrice: base,
    currentPrice: history[history.length - 1],
    dayHigh: Math.max(...history, base),
    dayLow: Math.min(...history, base),
    volume: randInt(10000, 300000),
    history,
    historyLong: history.slice(-180),
    orderbook: [],
    volatility: volatilityMap[priceClass] || 0.02,
    momentum: rand(-0.5, 0.5),
    eventBias: 0,
    eventTicks: 0,
    flash: 0,
    haltedDirection: null
  };
}

function defaultState() {
  state.speed = 1;
  state.selectedCode = "KQ001";
  state.orderMode = "buy";
  state.sortBy = "change";
  state.chartRange = "1m";
  state.historyTab = "orders";
  state.isPaused = false;
  state.isStopped = false;
  state.isAdmin = false;
  state.settings = { ...DEFAULT_SETTINGS };
  state.baseline = { totalAsset: DEFAULT_SETTINGS.initialCash, startedAt: Date.now() };
  state.realizedProfit = 0;
  state.portfolio = { cash: DEFAULT_SETTINGS.initialCash, holdings: {} };
  state.favorites = ["KQ001", "KQ006", "KQ009"];
  state.stocks = STOCK_BLUEPRINTS.map(makeStock);
  state.news = [];
  state.alerts = [];
  state.orderHistory = [];
  state.autoSellOrders = [];
  state.autoBuyOrders = [];
  state.virtualTime = Date.now();
  state.virtualDateKey = dateKeyFromTime(state.virtualTime);
  state.chartRenderCounter = 0;
  state.stocks.forEach(buildOrderbook);
}

function safeJsonParse(raw, fallback) {
  try { return JSON.parse(raw); }
  catch { return fallback; }
}

function exportStatePayload() {
  return {
    speed: state.speed,
    selectedCode: state.selectedCode,
    orderMode: state.orderMode,
    sortBy: state.sortBy,
    chartRange: state.chartRange,
    historyTab: state.historyTab,
    settings: state.settings,
    baseline: state.baseline,
    realizedProfit: state.realizedProfit,
    portfolio: state.portfolio,
    favorites: state.favorites,
    stocks: state.stocks,
    news: state.news,
    alerts: state.alerts,
    orderHistory: state.orderHistory,
    autoSellOrders: state.autoSellOrders,
    autoBuyOrders: state.autoBuyOrders,
    virtualTime: state.virtualTime,
    virtualDateKey: state.virtualDateKey
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exportStatePayload()));
  } catch (e) {
    console.error("saveState", e);
  }
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 120);
}

function loadState() {
  defaultState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const data = safeJsonParse(raw, null);
  if (!data || typeof data !== "object") return;

  state.speed = [1,2,5,10,20,50,100,200,300].includes(toInt(data.speed, 1)) ? toInt(data.speed, 1) : 1;
  state.selectedCode = typeof data.selectedCode === "string" ? data.selectedCode : "KQ001";
  state.orderMode = data.orderMode === "sell" ? "sell" : "buy";
  state.sortBy = ["change", "volume"].includes(data.sortBy) ? data.sortBy : "change";
  state.chartRange = CHART_RANGES.some(x => x.key === data.chartRange) ? data.chartRange : "1m";
  state.historyTab = ["orders", "alerts"].includes(data.historyTab) ? data.historyTab : "orders";

  state.settings = {
    ...DEFAULT_SETTINGS,
    ...(data.settings || {})
  };
  state.settings.initialCash = Math.max(10000, toInt(state.settings.initialCash, DEFAULT_SETTINGS.initialCash));
  state.settings.supportFundAmount = Math.max(0, toInt(state.settings.supportFundAmount, DEFAULT_SETTINGS.supportFundAmount));
  state.settings.supportFundCashLimit = Math.max(0, toInt(state.settings.supportFundCashLimit, DEFAULT_SETTINGS.supportFundCashLimit));
  state.settings.feeRate = clamp(toNum(state.settings.feeRate, DEFAULT_SETTINGS.feeRate), 0, 0.1);
  state.settings.globalVolatility = clamp(toNum(state.settings.globalVolatility, 1), 0.2, 10);
  state.settings.newsFrequency = clamp(toNum(state.settings.newsFrequency, 1), 0.2, 10);
  state.settings.marketBias = clamp(toNum(state.settings.marketBias, 0), -1.5, 1.5);
  state.settings.adminHighSpeedEnabled = !!state.settings.adminHighSpeedEnabled;
  state.settings.dailyLimitEnabled = typeof state.settings.dailyLimitEnabled === "boolean" ? state.settings.dailyLimitEnabled : true;
  state.settings.upperLimitRate = clamp(toNum(state.settings.upperLimitRate, 0.3), 0.05, 1);
  state.settings.lowerLimitRate = clamp(toNum(state.settings.lowerLimitRate, 0.3), 0.05, 0.95);

  state.baseline = data.baseline && typeof data.baseline === "object"
    ? {
        totalAsset: Math.max(0, toNum(data.baseline.totalAsset, DEFAULT_SETTINGS.initialCash)),
        startedAt: toNum(data.baseline.startedAt, Date.now())
      }
    : { totalAsset: DEFAULT_SETTINGS.initialCash, startedAt: Date.now() };

  state.realizedProfit = toNum(data.realizedProfit, 0);

  const cash = Math.max(0, toNum(data?.portfolio?.cash, DEFAULT_SETTINGS.initialCash));
  const holdings = {};
  if (data?.portfolio?.holdings && typeof data.portfolio.holdings === "object") {
    Object.entries(data.portfolio.holdings).forEach(([code, item]) => {
      const qty = Math.max(0, toInt(item?.qty, 0));
      const avgPrice = Math.max(0, toNum(item?.avgPrice, 0));
      if (qty > 0) holdings[code] = { qty, avgPrice };
    });
  }
  state.portfolio = { cash, holdings };

  state.favorites = Array.isArray(data.favorites) ? data.favorites.filter(Boolean).slice(0, 50) : ["KQ001", "KQ006", "KQ009"];
  state.news = Array.isArray(data.news) ? data.news.slice(0, 120) : [];
  state.alerts = Array.isArray(data.alerts) ? data.alerts.slice(0, 180) : [];
  state.orderHistory = Array.isArray(data.orderHistory) ? data.orderHistory.slice(0, 200) : [];
  state.autoSellOrders = Array.isArray(data.autoSellOrders) ? data.autoSellOrders.slice(0, 100) : [];
  state.autoBuyOrders = Array.isArray(data.autoBuyOrders) ? data.autoBuyOrders.slice(0, 100) : [];
  state.virtualTime = Math.max(0, toNum(data.virtualTime, Date.now()));
  state.virtualDateKey = typeof data.virtualDateKey === "string" ? data.virtualDateKey : dateKeyFromTime(state.virtualTime);

  const stockMap = new Map(Array.isArray(data.stocks) ? data.stocks.map(s => [s.code, s]) : []);
  state.stocks = STOCK_BLUEPRINTS.map(def => {
    const fresh = makeStock(def);
    const old = stockMap.get(fresh.code);
    if (!old || typeof old !== "object") return fresh;
    fresh.prevClose = Math.max(1, toInt(old.prevClose, fresh.prevClose));
    fresh.openPrice = Math.max(1, toInt(old.openPrice, fresh.openPrice));
    fresh.currentPrice = Math.max(1, toInt(old.currentPrice, fresh.currentPrice));
    fresh.dayHigh = Math.max(fresh.currentPrice, toInt(old.dayHigh, fresh.dayHigh));
    fresh.dayLow = Math.max(1, Math.min(fresh.currentPrice, toInt(old.dayLow, fresh.dayLow)));
    fresh.volume = Math.max(0, toInt(old.volume, fresh.volume));
    fresh.history = Array.isArray(old.history) ? old.history.map(v => Math.max(1, toInt(v, fresh.currentPrice))).slice(-240) : fresh.history;
    fresh.historyLong = Array.isArray(old.historyLong) ? old.historyLong.map(v => Math.max(1, toInt(v, fresh.currentPrice))).slice(-3000) : fresh.historyLong;
    fresh.volatility = clamp(toNum(old.volatility, fresh.volatility), 0.002, 0.3);
    fresh.momentum = clamp(toNum(old.momentum, 0), -4, 4);
    fresh.eventBias = clamp(toNum(old.eventBias, 0), -2, 2);
    fresh.eventTicks = Math.max(0, toInt(old.eventTicks, 0));
    fresh.flash = 0;
    fresh.haltedDirection = old.haltedDirection || null;
    fresh.isFixed = !!old.isFixed;
    return fresh;
  });

  if (!state.stocks.some(s => s.code === state.selectedCode)) {
    state.selectedCode = state.stocks[0]?.code || "KQ001";
  }

  state.stocks.forEach(buildOrderbook);

  if (state.speed > 50 && !(state.isAdmin && state.settings.adminHighSpeedEnabled)) {
    state.speed = 50;
  }
}

function selectedStock() {
  return state.stocks.find(s => s.code === state.selectedCode) || state.stocks[0];
}
function holdingOf(code) {
  return state.portfolio.holdings[code] || { qty: 0, avgPrice: 0 };
}
function stockValue() {
  return Object.entries(state.portfolio.holdings).reduce((sum, [code, h]) => {
    const s = state.stocks.find(x => x.code === code);
    return sum + ((s?.currentPrice || 0) * (h?.qty || 0));
  }, 0);
}
function investedAmount() {
  return Object.values(state.portfolio.holdings).reduce((sum, h) => sum + ((h?.avgPrice || 0) * (h?.qty || 0)), 0);
}
function totalAsset() {
  return state.portfolio.cash + stockValue();
}
function baselineProfit() {
  return totalAsset() - toNum(state.baseline.totalAsset, state.settings.initialCash);
}
function baselineProfitRate() {
  const base = toNum(state.baseline.totalAsset, state.settings.initialCash);
  return base > 0 ? ((totalAsset() - base) / base) * 100 : 0;
}
function absoluteProfitRate() {
  const base = toNum(state.settings.initialCash);
  return base > 0 ? ((totalAsset() - base) / base) * 100 : 0;
}
function stockRate(stock) {
  return stock.prevClose > 0 ? ((stock.currentPrice - stock.prevClose) / stock.prevClose) * 100 : 0;
}
function stockDiff(stock) {
  return stock.currentPrice - stock.prevClose;
}
function unrealizedProfit() {
  return Object.entries(state.portfolio.holdings).reduce((sum, [code, h]) => {
    const s = state.stocks.find(x => x.code === code);
    if (!s) return sum;
    return sum + ((s.currentPrice - h.avgPrice) * h.qty);
  }, 0);
}
function hasAnyHolding() {
  return Object.values(state.portfolio.holdings).some(h => (h?.qty || 0) > 0);
}
function getUpperLimitPrice(stock) {
  return Math.max(1, Math.round(stock.prevClose * (1 + state.settings.upperLimitRate)));
}
function getLowerLimitPrice(stock) {
  return Math.max(1, Math.round(stock.prevClose * (1 - state.settings.lowerLimitRate)));
}

function buildOrderbook(stock) {
  const base = stock.currentPrice;
  const spreadFactor =
    base < 2000 ? 0.008 :
    base < 10000 ? 0.004 :
    base < 100000 ? 0.0022 :
    0.0012;

  const asks = [];
  const bids = [];
  for (let i = 12; i >= 1; i--) {
    const step = Math.max(1, Math.round(base * spreadFactor * i));
    asks.push({
      type: "ask",
      price: Math.max(1, base + step),
      qty: randInt(900, 4200)
    });
  }
  for (let i = 1; i <= 12; i++) {
    const step = Math.max(1, Math.round(base * spreadFactor * i));
    bids.push({
      type: "bid",
      price: Math.max(1, base - step),
      qty: randInt(900, 4200)
    });
  }
  stock.orderbook = [...asks, ...bids];
}

function addAlert(text, tone = "normal") {
  state.alerts.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text,
    tone,
    time: nowTime()
  });
  if (state.alerts.length > 180) state.alerts.length = 180;
}

function pushNews(type, stock, text, impact = 0) {
  state.news.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: nowTime(),
    code: stock.code,
    name: stock.name,
    theme: stock.theme,
    type,
    text,
    impact
  });
  if (state.news.length > 120) state.news.length = 120;
  addAlert(`${stock.name} · ${typeLabel(type)} · ${text}`, type === "bad" ? "down" : "up");
}

function recordOrder(entry) {
  state.orderHistory.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: nowTime(),
    ...entry
  });
  if (state.orderHistory.length > 200) state.orderHistory.length = 200;
}

function typeLabel(type) {
  return ({ good: "호재", bad: "주의", event: "이벤트", breaking: "속보" })[type] || "알림";
}

function toast(text, tone = "normal") {
  addAlert(text, tone);
  renderHistory();
}

function rollVirtualTime() {
  const minutePerLoopMap = {
    1: 1,
    2: 2,
    5: 5,
    10: 10,
    20: 20,
    50: 45,
    100: 90,
    200: 180,
    300: 360
  };
  const addMinutes = minutePerLoopMap[state.speed] || 1;
  state.virtualTime += addMinutes * 60 * 1000;
  const newKey = dateKeyFromTime(state.virtualTime);
  if (newKey !== state.virtualDateKey) {
    state.virtualDateKey = newKey;
    onVirtualDayChanged();
  }
}

function onVirtualDayChanged() {
  state.stocks.forEach(stock => {
    stock.prevClose = stock.currentPrice;
    stock.openPrice = stock.currentPrice;
    stock.dayHigh = stock.currentPrice;
    stock.dayLow = stock.currentPrice;
    stock.volume = Math.max(1000, Math.round(stock.volume * 0.15));
    stock.haltedDirection = null;
    stock.eventBias = 0;
    stock.eventTicks = 0;
    stock.historyLong.push(stock.currentPrice);
    if (stock.historyLong.length > 3000) stock.historyLong.shift();
  });
  addAlert(`가상 날짜 변경 · ${formatVirtualDateTime()}`, "event");
}

function maybeCreateNews(stock) {
  const chance = 0.004 * state.settings.newsFrequency;
  if (Math.random() > chance) return;

  if (stock.priceClass === "cheap" && stock.currentPrice <= 120 && Math.random() < 0.28) {
    const jump = stock.currentPrice <= 25 ? rand(1.5, 5.5) : rand(0.35, 1.8);
    stock.eventBias = jump;
    stock.eventTicks = randInt(3, 8);
    pushNews("good", stock, "저가주 회복 수급이 붙으며 급반등 기대가 커지고 있어요", jump);
    return;
  }

  if (stock.currentPrice >= 120 && stock.currentPrice <= 4000 && Math.random() < 0.14) {
    const targetLift = randInt(300, 3000);
    const impact = clamp(targetLift / Math.max(1, stock.currentPrice), 0.12, 1.8);
    stock.eventBias = impact;
    stock.eventTicks = randInt(2, 6);
    pushNews("breaking", stock, `테마성 수급이 몰리며 ${targetLift.toLocaleString("ko-KR")}원 급등 기대가 붙고 있어요`, impact);
    return;
  }

  const type = pick(["good", "bad", "event", "breaking"]);
  let impact = 0;
  if (type === "good") impact = rand(0.01, 0.035);
  if (type === "bad") impact = rand(-0.035, -0.01);
  if (type === "event") impact = rand(-0.015, 0.02);
  if (type === "breaking") impact = rand(-0.05, 0.05);

  stock.eventBias = impact;
  stock.eventTicks = randInt(8, 24);
  pushNews(type, stock, pick(GENERIC_NEWS[type]), impact);
}

function updateOneStock(stock) {
  if (!stock) return;
  if (stock.isFixed) {
    stock.flash = 0;
    buildOrderbook(stock);
    return;
  }

  maybeCreateNews(stock);

  const oldPrice = stock.currentPrice;
  const styleBoost =
    stock.style === "stable" ? 0.65 :
    stock.style === "momentum" ? 1.25 :
    stock.style === "news" ? 1.1 :
    stock.style === "theme" ? 1.18 :
    stock.style === "cyclical" ? 1.0 : 1;

  const bias = state.settings.marketBias * 0.002;
  const event = stock.eventTicks > 0 ? stock.eventBias : 0;
  const momentum = stock.momentum * 0.0009;
  const noise = rand(-stock.volatility, stock.volatility) * state.settings.globalVolatility * styleBoost;
  let move = noise + bias + event + momentum;

  if (Math.random() < 0.002 * state.settings.globalVolatility) move += rand(-0.14, 0.14);

  let next = Math.max(1, Math.round(stock.currentPrice * (1 + move)));

  if (state.settings.dailyLimitEnabled) {
    const upper = getUpperLimitPrice(stock);
    const lower = getLowerLimitPrice(stock);
    if (next >= upper) {
      next = upper;
      stock.haltedDirection = "up";
      stock.eventBias = rand(-0.01, 0.018);
      stock.eventTicks = randInt(1, 3);
      pushNews("breaking", stock, "상한가에 도달하며 과열 경고가 붙었어요", 0.15);
    } else if (next <= lower) {
      next = lower;
      stock.haltedDirection = "down";
      stock.eventBias = rand(0.01, 0.05);
      stock.eventTicks = randInt(3, 10);
      pushNews("bad", stock, `하한가 도달`, -0.15);
    } else {
      stock.haltedDirection = null;
    }
  } else {
    stock.haltedDirection = null;
  }

  stock.currentPrice = next;
  stock.dayHigh = Math.max(stock.dayHigh, next);
  stock.dayLow = Math.min(stock.dayLow, next);
  stock.volume += Math.max(1, Math.round(rand(200, 10000) * (1 + Math.abs(move) * 35) * (stock.priceClass === "cheap" ? 3.4 : stock.priceClass === "premium" ? 0.45 : 1)));
  stock.history.push(next);
  if (stock.history.length > 240) stock.history.shift();

  if (Math.random() < 0.12) {
    stock.historyLong.push(next);
    if (stock.historyLong.length > 3000) stock.historyLong.shift();
  }

  stock.momentum = clamp(stock.momentum * 0.92 + (next > oldPrice ? 0.28 : next < oldPrice ? -0.28 : 0), -3, 3);
  if (stock.eventTicks > 0) stock.eventTicks -= 1;
  if (stock.eventTicks <= 0) stock.eventBias *= 0.6;

  buildOrderbook(stock);
  stock.flash = next > oldPrice ? 1 : next < oldPrice ? -1 : 0;
}
function processAutoOrders() {
  const stocksByCode = new Map(state.stocks.map(s => [s.code, s]));

  if (Array.isArray(state.autoBuyOrders) && state.autoBuyOrders.length) {
    const remain = [];
    for (const order of state.autoBuyOrders) {
      const stock = stocksByCode.get(order.code);
      if (!stock) continue;

      if (stock.haltedDirection === "down") {
        remain.push(order);
        continue;
      }

      const targetPrice = Math.max(1, toInt(order.targetPrice, 0));
      const wantedQty = Math.max(1, toInt(order.qty, 0));
      const budget = Math.max(0, toInt(order.budget, 0));
      const useMax = !!order.useMax;

      if (stock.currentPrice <= targetPrice) {
        let qty = wantedQty;

        if (useMax) {
          qty = calculateMaxBuyQty(stock.currentPrice);
        } else if (budget > 0) {
          const maxByBudget = Math.floor(budget / (stock.currentPrice * (1 + state.settings.feeRate)));
          qty = Math.min(qty, Math.max(0, maxByBudget));
        }

        if (qty > 0) {
          const done = executeBuy(stock, qty, stock.currentPrice, true, "예약구매");
          if (!done) remain.push(order);
        }
      } else {
        remain.push(order);
      }
    }
    state.autoBuyOrders = remain;
  }

  if (Array.isArray(state.autoSellOrders) && state.autoSellOrders.length) {
    const remain = [];
    for (const order of state.autoSellOrders) {
      const stock = stocksByCode.get(order.code);
      if (!stock) continue;

      if (stock.haltedDirection === "down") {
        remain.push(order);
        continue;
      }

      const holding = holdingOf(order.code);
      if (holding.qty <= 0) continue;

      const targetPrice = Math.max(0, toInt(order.targetPrice, 0));
      const stopPrice = Math.max(0, toInt(order.stopPrice, 0));
      const useAll = !!order.useAll;
      const wantedQty = Math.max(1, toInt(order.qty, 0));

      const hitTarget = targetPrice > 0 && stock.currentPrice >= targetPrice;
      const hitStop = stopPrice > 0 && stock.currentPrice <= stopPrice;

      if (hitTarget || hitStop) {
        const qty = useAll ? holding.qty : Math.min(holding.qty, wantedQty);
        if (qty > 0) {
          const reason = hitTarget ? "예약판매" : "손절판매";
          const done = executeSell(stock, qty, stock.currentPrice, true, reason);
          if (!done && holding.qty > 0) remain.push(order);
        }
      } else {
        remain.push(order);
      }
    }
    state.autoSellOrders = remain;
  }
}

function calculateMaxBuyQty(price) {
  const p = Math.max(1, toNum(price, 0));
  if (p <= 0) return 0;
  const unitCost = p * (1 + state.settings.feeRate);
  if (unitCost <= 0) return 0;
  return Math.max(0, Math.floor(state.portfolio.cash / unitCost));
}

function resetBaseline() {
  state.baseline = {
    totalAsset: totalAsset(),
    startedAt: state.virtualTime || Date.now()
  };
  queueSave();
  renderAll();
  toast("수익률 기준선이 현재 자산 기준으로 초기화됐어요", "event");
}

function resetAllData() {
  defaultState();
  queueSave();
  renderAll();
  toast("전체 데이터가 초기화됐어요", "event");
}

function maybeSupportFund() {
  const limit = Math.max(0, toInt(state.settings.supportFundCashLimit, 0));
  const amount = Math.max(0, toInt(state.settings.supportFundAmount, 0));
  if (state.portfolio.cash > limit) {
    toast("긴급지원금은 현금이 기준 이하일 때만 받을 수 있어요", "down");
    return;
  }
  state.portfolio.cash += amount;
  queueSave();
  renderAll();
  toast(`긴급지원금 ${formatKRW(amount)}이 지급됐어요`, "up");
}

function clearHistories() {
  if (state.historyTab === "orders") state.orderHistory = [];
  else state.alerts = [];
  queueSave();
  renderHistory();
}

function executeBuy(stock, qty, price, isAuto = false, reason = "매수") {
  if (!stock || qty <= 0 || price <= 0) return false;
  if (stock.haltedDirection === "down") {
    toast(`${stock.name}은 현재 VI 상태라 거래할 수 없어요`, "down");
    return false;
  }

  const gross = qty * price;
  const fee = feeOf(gross);
  const total = gross + fee;

  if (state.portfolio.cash < total) {
    if (!isAuto) toast("주문 가능 현금이 부족해요", "down");
    return false;
  }

  state.portfolio.cash -= total;

  const holding = holdingOf(stock.code);
  const oldQty = holding.qty || 0;
  const oldAvg = holding.avgPrice || 0;
  const newQty = oldQty + qty;
  const newAvg = newQty > 0 ? ((oldQty * oldAvg) + (qty * price)) / newQty : 0;

  state.portfolio.holdings[stock.code] = {
    qty: newQty,
    avgPrice: newAvg
  };

  recordOrder({
    side: "buy",
    type: reason,
    code: stock.code,
    name: stock.name,
    qty,
    price,
    fee,
    total
  });

  addAlert(`${stock.name} ${formatQty(qty)} ${reason} 완료`, "up");
  queueSave();
  renderAll();
  return true;
}

function executeSell(stock, qty, price, isAuto = false, reason = "매도") {
  if (!stock || qty <= 0 || price <= 0) return false;
  if (stock.haltedDirection === "down") {
    toast(`${stock.name}은 현재 VI 상태라 거래할 수 없어요`, "down");
    return false;
  }

  const holding = holdingOf(stock.code);
  if (holding.qty < qty) {
    if (!isAuto) toast("보유 수량이 부족해요", "down");
    return false;
  }

  const gross = qty * price;
  const fee = feeOf(gross);
  const net = gross - fee;
  const realized = (price - holding.avgPrice) * qty - fee;

  state.realizedProfit += realized;
  state.portfolio.cash += net;

  const newQty = holding.qty - qty;
  if (newQty <= 0) {
    delete state.portfolio.holdings[stock.code];
  } else {
    state.portfolio.holdings[stock.code] = {
      qty: newQty,
      avgPrice: holding.avgPrice
    };
  }

  recordOrder({
    side: "sell",
    type: reason,
    code: stock.code,
    name: stock.name,
    qty,
    price,
    fee,
    total: net,
    realized
  });

  addAlert(`${stock.name} ${formatQty(qty)} ${reason} 완료`, realized >= 0 ? "up" : "down");

  if (!hasAnyHolding()) {
    state.baseline = {
      totalAsset: totalAsset(),
      startedAt: state.virtualTime || Date.now()
    };
  }

  queueSave();
  renderAll();
  return true;
}

function submitManualOrder() {
  const stock = selectedStock();
  if (!stock) return;

  const qty = Math.max(1, toInt(els.orderQty?.value, 1));
  const price = stock.currentPrice;

  if (state.orderMode === "buy") {
    executeBuy(stock, qty, price, false, "매수");
  } else {
    executeSell(stock, qty, price, false, "매도");
  }
}

function submitAutoBuy() {
  const stock = selectedStock();
  if (!stock) return;

  const targetPrice = Math.max(1, toInt(els.autoBuyTargetPrice?.value, 0));
  const qty = Math.max(1, toInt(els.autoBuyQty?.value, 1));
  const budget = Math.max(0, toInt(els.autoBuyBudget?.value, 0));
  const useMax = !!els.autoBuyMax?.checked;

  if (!targetPrice) {
    toast("목표 매수가를 입력해 주세요", "down");
    return;
  }

  state.autoBuyOrders.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    code: stock.code,
    name: stock.name,
    targetPrice,
    qty,
    budget,
    useMax,
    createdAt: nowTime()
  });

  if (els.autoBuyTargetPrice) els.autoBuyTargetPrice.value = "";
  if (els.autoBuyQty) els.autoBuyQty.value = "1";
  if (els.autoBuyBudget) els.autoBuyBudget.value = "";
  if (els.autoBuyMax) els.autoBuyMax.checked = false;

  queueSave();
  renderAutoLists();
  toast(`${stock.name} 예약구매가 등록됐어요`, "event");
}

function submitAutoSell() {
  const stock = selectedStock();
  if (!stock) return;

  const targetPrice = Math.max(0, toInt(els.autoSellTargetPrice?.value, 0));
  const stopPrice = Math.max(0, toInt(els.autoSellStopPrice?.value, 0));
  const qty = Math.max(1, toInt(els.autoSellQty?.value, 1));
  const useAll = !!els.autoSellAll?.checked;

  if (!targetPrice && !stopPrice) {
    toast("목표가 또는 손절가 중 하나는 입력해 주세요", "down");
    return;
  }

  state.autoSellOrders.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    code: stock.code,
    name: stock.name,
    targetPrice,
    stopPrice,
    qty,
    useAll,
    createdAt: nowTime()
  });

  if (els.autoSellTargetPrice) els.autoSellTargetPrice.value = "";
  if (els.autoSellStopPrice) els.autoSellStopPrice.value = "";
  if (els.autoSellQty) els.autoSellQty.value = "1";
  if (els.autoSellAll) els.autoSellAll.checked = false;

  queueSave();
  renderAutoLists();
  toast(`${stock.name} 예약판매가 등록됐어요`, "event");
}

function removeAutoBuy(id) {
  state.autoBuyOrders = state.autoBuyOrders.filter(x => x.id !== id);
  queueSave();
  renderAutoLists();
}

function removeAutoSell(id) {
  state.autoSellOrders = state.autoSellOrders.filter(x => x.id !== id);
  queueSave();
  renderAutoLists();
}

function cancelAllAutoOrders() {
  if (state.orderMode === "buy") state.autoBuyOrders = [];
  else state.autoSellOrders = [];
  queueSave();
  renderAutoLists();
  toast("현재 모드의 자동주문을 모두 비웠어요", "event");
}

function toggleFavorite(code) {
  const idx = state.favorites.indexOf(code);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.unshift(code);
  state.favorites = state.favorites.slice(0, 30);
  queueSave();
  renderWatchlists();
  renderHero();
}

function currentSearch() {
  return (els.searchInput?.value || "").trim().toLowerCase();
}

function filteredStocks() {
  const keyword = currentSearch();
  let list = state.stocks.slice();

  if (keyword) {
    list = list.filter(stock =>
      stock.name.toLowerCase().includes(keyword) ||
      stock.code.toLowerCase().includes(keyword) ||
      stock.theme.toLowerCase().includes(keyword)
    );
  }

  if (state.sortBy === "volume") {
    list.sort((a, b) => b.volume - a.volume);
  } else {
    list.sort((a, b) => stockRate(b) - stockRate(a));
  }
  return list;
}

function renderHero() {
  const stock = selectedStock();
  if (!stock) return;

  setText(els.symbolLogo, stock.logo);
  setText(els.selectedName, stock.name);
  setText(els.selectedCode, `${stock.code} · ${stock.theme}`);
  setText(els.selectedPrice, formatKRW(stock.currentPrice));

  const diff = stockDiff(stock);
  const rate = stockRate(stock);
  if (els.selectedChange) {
    els.selectedChange.textContent = `${formatSignedKRW(diff)} (${formatSignedPct(rate)})`;
    els.selectedChange.classList.remove("positive", "negative");
    els.selectedChange.classList.add(diff >= 0 ? "positive" : "negative");
  }

  setText(els.dayOpen, formatKRW(stock.openPrice));
  setText(els.dayHigh, formatKRW(stock.dayHigh));
  setText(els.dayLow, formatKRW(stock.dayLow));
  setText(els.dayVolume, formatVolume(stock.volume));

  if (els.heroStockSelect && els.heroStockSelect.value !== stock.code) {
    els.heroStockSelect.value = stock.code;
  }

  if (els.favoriteToggleBtn) {
    els.favoriteToggleBtn.textContent = state.favorites.includes(stock.code) ? "★" : "☆";
  }

  const moodScore = clamp(
    ((stockRate(stock) / 20) * 50) + 50 + (stock.eventBias * 40),
    0,
    100
  );
  if (els.moodFill) els.moodFill.style.width = `${moodScore}%`;

  let moodText = "지금은 중립적인 분위기예요";
  if (moodScore >= 75) moodText = "매수 심리가 강하고 속도가 붙는 분위기예요";
  else if (moodScore >= 60) moodText = "우상향 기대감이 조금 더 강해 보여요";
  else if (moodScore <= 25) moodText = "매도 압력이 강해서 흔들림이 큰 구간이에요";
  else if (moodScore <= 40) moodText = "조심스럽게 눌리는 흐름이 이어지고 있어요";
  setText(els.moodText, moodText);

  renderOrderPanel();
  renderSelectedNews();
  renderOrderbook();
}

function renderSpeedButtons() {
  if (!els.speedButtons) return;
  const speeds = [1, 2, 5, 10, 20, 50];
  const adminSpeeds = state.isAdmin && state.settings.adminHighSpeedEnabled ? [100, 200, 300] : [];
  const all = [...speeds, ...adminSpeeds];

  els.speedButtons.innerHTML = "";
  all.forEach(spd => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = `${spd}x`;
    if (state.speed === spd) btn.classList.add("active");
    btn.addEventListener("click", () => {
      state.speed = spd;
      queueSave();
      renderSpeedButtons();
      toast(`속도가 ${spd}x로 변경됐어요`, "event");
    });
    els.speedButtons.appendChild(btn);
  });
}

function renderChartTabs() {
  if (!els.chartTabs) return;
  els.chartTabs.innerHTML = "";
  CHART_RANGES.forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab-btn${state.chartRange === item.key ? " active" : ""}`;
    btn.textContent = item.label;
    btn.addEventListener("click", () => {
      state.chartRange = item.key;
      queueSave();
      renderChartTabs();
      renderChart();
    });
    els.chartTabs.appendChild(btn);
  });
}

function getChartSeries(stock) {
  if (!stock) return [];
  const long = stock.historyLong.slice();
  const short = stock.history.slice();

  if (state.chartRange === "1m") return short.slice(-60);
  if (state.chartRange === "5m") return short.slice(-180);
  if (state.chartRange === "1d") return [...long.slice(-160), ...short.slice(-80)].slice(-220);
  if (state.chartRange === "1w") return long.slice(-350);
  if (state.chartRange === "1y") return long.slice(-900);
  if (state.chartRange === "10y") return long.slice(-2000);
  return long.slice(-3000);
}

function movingAverage(series, period) {
  const result = [];
  let sum = 0;
  for (let i = 0; i < series.length; i++) {
    sum += series[i];
    if (i >= period) sum -= series[i - period];
    result.push(i >= period - 1 ? sum / period : null);
  }
  return result;
}

function sampleSeriesForHighSpeed(series, width) {
  if (!Array.isArray(series) || !series.length) return [];
  const maxPoints = Math.max(60, Math.floor(width / 3));
  if (series.length <= maxPoints) return series.slice();

  const sampled = [];
  const bucket = series.length / maxPoints;
  for (let i = 0; i < maxPoints; i++) {
    const start = Math.floor(i * bucket);
    const end = Math.min(series.length, Math.floor((i + 1) * bucket));
    const chunk = series.slice(start, Math.max(start + 1, end));
    const avg = chunk.reduce((a, b) => a + b, 0) / chunk.length;
    sampled.push(avg);
  }
  return sampled;
}

function renderChart() {
  const canvas = els.priceChart;
  if (!canvas) return;
  const stock = selectedStock();
  if (!stock) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(300, Math.floor(rect.width || canvas.clientWidth || 1100));
  const cssHeight = Math.max(300, Math.floor(rect.height || canvas.clientHeight || 620));

  if (canvas.width !== Math.floor(cssWidth * dpr) || canvas.height !== Math.floor(cssHeight * dpr)) {
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const rawSeries = getChartSeries(stock);
  const series = sampleSeriesForHighSpeed(rawSeries, cssWidth);
  if (series.length < 2) {
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    return;
  }

  const ma5 = movingAverage(series, 5);
  const ma20 = movingAverage(series, 20);
  const ma60 = movingAverage(series, 60);

  const pad = { top: 26, right: 24, bottom: 34, left: 66 };
  const w = cssWidth - pad.left - pad.right;
  const h = cssHeight - pad.top - pad.bottom;

  const minPrice = Math.min(...series);
  const maxPrice = Math.max(...series);
  const spread = Math.max(1, maxPrice - minPrice);
  const chartMin = minPrice - spread * 0.12;
  const chartMax = maxPrice + spread * 0.12;

  const xAt = i => pad.left + (i / Math.max(1, series.length - 1)) * w;
  const yAt = v => pad.top + (1 - (v - chartMin) / Math.max(1, chartMax - chartMin)) * h;

  ctx.clearRect(0, 0, cssWidth, cssHeight);

  const bg = ctx.createLinearGradient(0, 0, 0, cssHeight);
  bg.addColorStop(0, "rgba(20,37,76,.35)");
  bg.addColorStop(1, "rgba(7,15,30,.05)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (h / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(cssWidth - pad.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(181,199,235,.78)";
  ctx.font = '12px "Segoe UI","Noto Sans KR",sans-serif';
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i <= 5; i++) {
    const v = chartMax - ((chartMax - chartMin) / 5) * i;
    const y = pad.top + (h / 5) * i;
    ctx.fillText(formatKRW(v), pad.left - 10, y);
  }

  const isUp = series[series.length - 1] >= series[0];
  const lineColor = isUp ? "#ff6d92" : "#6ac7ff";
  const fillColor = isUp ? "rgba(255,109,146,.16)" : "rgba(106,199,255,.16)";

  ctx.beginPath();
  series.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.lineWidth = 3;
  ctx.strokeStyle = lineColor;
  ctx.shadowColor = isUp ? "rgba(255,109,146,.28)" : "rgba(106,199,255,.26)";
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.lineTo(xAt(series.length - 1), pad.top + h);
  ctx.lineTo(xAt(0), pad.top + h);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  drawMaLine(ctx, ma5, xAt, yAt, "#ff8caf");
  drawMaLine(ctx, ma20, xAt, yAt, "#f2c86a");
  drawMaLine(ctx, ma60, xAt, yAt, "#9f82ff");

  const lastX = xAt(series.length - 1);
  const lastY = yAt(series[series.length - 1]);
  ctx.beginPath();
  ctx.arc(lastX, lastY, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = lineColor;
  ctx.fill();

  canvas._chartMeta = {
    series,
    xAt,
    yAt,
    pad,
    cssWidth,
    cssHeight
  };
}

function drawMaLine(ctx, series, xAt, yAt, color) {
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < series.length; i++) {
    const v = series[i];
    if (v == null) continue;
    const x = xAt(i);
    const y = yAt(v);
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.stroke();
}
function bindChartHover() {
  if (!els.priceChart) return;

  const showTip = e => {
    const meta = els.priceChart._chartMeta;
    if (!meta || !els.chartTooltip) return;

    const rect = els.priceChart.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round(((x - meta.pad.left) / Math.max(1, meta.cssWidth - meta.pad.left - meta.pad.right)) * (meta.series.length - 1));
    const safeIdx = clamp(idx, 0, meta.series.length - 1);
    const price = meta.series[safeIdx];
    const rate = meta.series[0] > 0 ? ((price - meta.series[0]) / meta.series[0]) * 100 : 0;

    els.chartTooltip.classList.remove("hidden");
    els.chartTooltip.style.left = `${clamp(x + 14, 8, rect.width - 210)}px`;
    els.chartTooltip.style.top = `${clamp((e.clientY - rect.top) - 12, 8, rect.height - 100)}px`;
    els.chartTooltip.innerHTML = `
      <div style="font-weight:900;font-size:13px;margin-bottom:4px;">${selectedStock()?.name || ""}</div>
      <div>가격 <b>${formatKRW(price)}</b></div>
      <div>변동률 <b class="${rate >= 0 ? "positive" : "negative"}">${formatSignedPct(rate)}</b></div>
      <div style="margin-top:4px;color:#9fb2d8;">구간 ${safeIdx + 1} / ${meta.series.length}</div>
    `;
  };

  els.priceChart.addEventListener("mousemove", showTip);
  els.priceChart.addEventListener("mouseleave", () => {
    if (els.chartTooltip) els.chartTooltip.classList.add("hidden");
  });
}

function renderSelectedNews() {
  const stock = selectedStock();
  const list = (state.news || []).filter(n => n.code === stock?.code).slice(0, 18);

  setText(els.selectedNewsTitleName, stock?.name || "");
  setText(els.selectedNewsCount, `${list.length}건`);

  if (!els.selectedNewsFeed) return;
  els.selectedNewsFeed.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state-box";
    empty.textContent = "아직 이 종목 관련 뉴스가 없어요";
    els.selectedNewsFeed.appendChild(empty);
    return;
  }

  list.forEach(item => {
    els.selectedNewsFeed.appendChild(makeNewsCard(item));
  });
}

function makeNewsCard(item) {
  const card = document.createElement("div");
  card.className = "news-card";

  const top = document.createElement("div");
  top.className = "news-card-top";

  const badge = document.createElement("span");
  badge.className = `news-type ${item.type}`;
  badge.textContent = typeLabel(item.type);

  const time = document.createElement("span");
  time.className = "news-time";
  time.textContent = item.time || "";

  top.appendChild(badge);
  top.appendChild(time);

  const title = document.createElement("div");
  title.className = "news-title";
  title.textContent = `${item.name} · ${item.theme}`;

  const sub = document.createElement("div");
  sub.className = "news-sub";
  sub.textContent = item.text || "";

  card.appendChild(top);
  card.appendChild(title);
  card.appendChild(sub);
  return card;
}

function renderNewsFeed() {
  if (!els.newsFeed) return;
  const list = state.news.slice(0, 36);

  setText(els.newsCountChip, `${list.length}건`);
  els.newsFeed.innerHTML = "";

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state-box";
    empty.textContent = "아직 뉴스가 없어요";
    els.newsFeed.appendChild(empty);
    return;
  }

  list.forEach(item => {
    els.newsFeed.appendChild(makeNewsCard(item));
  });
}

function renderHistoryTabs() {
  qa(".history-tab").forEach(btn => {
    const tab = btn.dataset.historyTab;
    btn.classList.toggle("active", tab === state.historyTab);
  });

  if (els.orderHistoryList) els.orderHistoryList.classList.toggle("hidden", state.historyTab !== "orders");
  if (els.alertHistoryList) els.alertHistoryList.classList.toggle("hidden", state.historyTab !== "alerts");
}

function makeOrderHistoryCard(item) {
  const card = document.createElement("div");
  card.className = "history-card";

  const top = document.createElement("div");
  top.className = "history-card-top";

  const badge = document.createElement("span");
  badge.className = `history-type ${item.side === "buy" ? "buy" : "sell"}`;
  badge.textContent = `${item.type || (item.side === "buy" ? "매수" : "매도")}`;

  const time = document.createElement("span");
  time.className = "history-time";
  time.textContent = item.time || "";

  top.appendChild(badge);
  top.appendChild(time);

  const main = document.createElement("div");
  main.className = "history-main";
  main.textContent = `${item.name} · ${formatQty(item.qty)} · ${formatKRW(item.price)}`;

  const sub = document.createElement("div");
  sub.className = "history-sub";

  if (item.side === "buy") {
    sub.innerHTML = `총액 <b>${formatKRW(item.total)}</b> · 수수료 <b>${formatKRW(item.fee)}</b>`;
  } else {
    const realized = toNum(item.realized, 0);
    sub.innerHTML = `수령액 <b>${formatKRW(item.total)}</b> · 실현손익 <b class="${realized >= 0 ? "positive" : "negative"}">${formatSignedKRW(realized)}</b>`;
  }

  card.appendChild(top);
  card.appendChild(main);
  card.appendChild(sub);
  return card;
}

function makeAlertCard(item) {
  const card = document.createElement("div");
  card.className = "history-card";

  const top = document.createElement("div");
  top.className = "history-card-top";

  const badge = document.createElement("span");
  badge.className = "history-type alert";
  badge.textContent = "알림";

  const time = document.createElement("span");
  time.className = "history-time";
  time.textContent = item.time || "";

  top.appendChild(badge);
  top.appendChild(time);

  const main = document.createElement("div");
  main.className = "history-main";
  main.textContent = item.text || "";

  card.appendChild(top);
  card.appendChild(main);
  return card;
}

function renderHistory() {
  renderHistoryTabs();

  if (els.orderHistoryList) {
    els.orderHistoryList.innerHTML = "";
    const orders = state.orderHistory.slice(0, 60);
    if (!orders.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state-box";
      empty.textContent = "주문 기록이 아직 없어요";
      els.orderHistoryList.appendChild(empty);
    } else {
      orders.forEach(item => els.orderHistoryList.appendChild(makeOrderHistoryCard(item)));
    }
  }

  if (els.alertHistoryList) {
    els.alertHistoryList.innerHTML = "";
    const alerts = state.alerts.slice(0, 80);
    if (!alerts.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state-box";
      empty.textContent = "알림 기록이 아직 없어요";
      els.alertHistoryList.appendChild(empty);
    } else {
      alerts.forEach(item => els.alertHistoryList.appendChild(makeAlertCard(item)));
    }
  }

  if (els.alertBadge) setText(els.alertBadge, `${state.alerts.length}`);
  if (els.marketAlertBadge) setText(els.marketAlertBadge, `${state.news.filter(n => n.type === "breaking").length}`);
}

function renderOrderbook() {
  const stock = selectedStock();
  if (!stock || !els.orderbookRows) return;

  const asks = [];
  const bids = [];
  (stock.orderbook || []).forEach(row => {
    if (row.type === "ask") asks.push(row);
    else bids.push(row);
  });

  const maxRows = Math.max(asks.length, bids.length, 12);
  els.orderbookRows.innerHTML = "";

  for (let i = 0; i < maxRows; i++) {
    const ask = asks[i] || { qty: 0, price: stock.currentPrice + (i + 1) };
    const bid = bids[i] || { qty: 0, price: Math.max(1, stock.currentPrice - (i + 1)) };

    const row = document.createElement("div");
    row.className = "orderbook-row";

    const askQty = document.createElement("div");
    askQty.className = "ask-qty";
    askQty.textContent = ask.qty > 0 ? ask.qty.toLocaleString("ko-KR") : "-";

    const mid = document.createElement("div");
    mid.className = `mid-price ${ask.price >= stock.prevClose ? "mid-up" : "mid-down"}`;
    mid.textContent = formatKRW(ask.price);

    const bidQty = document.createElement("div");
    bidQty.className = "bid-qty";
    bidQty.textContent = bid.qty > 0 ? bid.qty.toLocaleString("ko-KR") : "-";

    row.appendChild(askQty);
    row.appendChild(mid);
    row.appendChild(bidQty);
    els.orderbookRows.appendChild(row);
  }
}

function renderOrderPanel() {
  const stock = selectedStock();
  if (!stock) return;

  const holding = holdingOf(stock.code);
  const maxQty = calculateMaxBuyQty(stock.currentPrice);

  setText(els.availableCash, formatKRW(state.portfolio.cash));
  setText(els.maxBuyQty, formatQty(maxQty));
  setText(els.currentHoldingQty, formatQty(holding.qty));
  setText(els.currentAvgPrice, formatKRW(holding.avgPrice));
  setText(els.holdingQtyInline, formatQty(holding.qty));
  setText(els.avgPriceInline, formatKRW(holding.avgPrice));
  setText(els.currentTradePriceLabel, formatKRW(stock.currentPrice));

  if (els.orderPrice) els.orderPrice.value = String(stock.currentPrice);

  const qty = Math.max(1, toInt(els.orderQty?.value, 1));
  const gross = qty * stock.currentPrice;
  const fee = feeOf(gross);

  setText(els.estimatedCost, formatKRW(gross));
  setText(els.estimatedFee, formatKRW(fee));

  if (els.buyModeBtn) {
    els.buyModeBtn.classList.toggle("active", state.orderMode === "buy");
    els.buyModeBtn.classList.toggle("buy", state.orderMode === "buy");
  }
  if (els.sellModeBtn) {
    els.sellModeBtn.classList.toggle("active", state.orderMode === "sell");
    els.sellModeBtn.classList.toggle("sell", state.orderMode === "sell");
  }

  if (els.submitOrderBtn) {
    els.submitOrderBtn.classList.toggle("buy", state.orderMode === "buy");
    els.submitOrderBtn.classList.toggle("sell", state.orderMode === "sell");
    els.submitOrderBtn.textContent = state.orderMode === "buy" ? "매수 실행" : "매도 실행";
  }

  if (els.autoModeTitle) setText(els.autoModeTitle, state.orderMode === "buy" ? "예약구매 · 조건매수" : "예약판매 · 조건매도");
  if (els.autoModeDesc) setText(els.autoModeDesc, state.orderMode === "buy"
    ? "원하는 가격까지 내려오면 자동으로 매수할 수 있어요"
    : "목표가 도달 또는 손절 조건에서 자동으로 판매해요"
  );

  if (els.autoBuyModeBox) els.autoBuyModeBox.classList.toggle("hidden", state.orderMode !== "buy");
  if (els.autoSellModeBox) els.autoSellModeBox.classList.toggle("hidden", state.orderMode !== "sell");

  renderAutoLists();
  renderQuickButtons(stock);
}

function renderQuickButtons(stock) {
  if (!els.quickRow) return;
  els.quickRow.innerHTML = "";

  const buttons = state.orderMode === "buy"
    ? [
        { label: "10%", action: () => setBuyQtyByRatio(stock, 0.1) },
        { label: "25%", action: () => setBuyQtyByRatio(stock, 0.25) },
        { label: "50%", action: () => setBuyQtyByRatio(stock, 0.5) },
        { label: "최대", action: () => setBuyQtyByRatio(stock, 1) }
      ]
    : [
        { label: "25%", action: () => setSellQtyByRatio(stock, 0.25) },
        { label: "50%", action: () => setSellQtyByRatio(stock, 0.5) },
        { label: "100%", action: () => setSellQtyByRatio(stock, 1) },
        { label: "전량매도", action: () => setSellQtyByRatio(stock, 1, true) }
      ];

  buttons.forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = item.label;
    btn.addEventListener("click", item.action);
    els.quickRow.appendChild(btn);
  });
}

function setBuyQtyByRatio(stock, ratio) {
  const max = calculateMaxBuyQty(stock.currentPrice);
  const qty = Math.max(1, Math.floor(max * ratio));
  if (els.orderQty) els.orderQty.value = String(qty);
  renderOrderPanel();
}

function setSellQtyByRatio(stock, ratio, all = false) {
  const holding = holdingOf(stock.code);
  const qty = all ? holding.qty : Math.max(1, Math.floor(holding.qty * ratio));
  if (els.orderQty) els.orderQty.value = String(Math.max(1, qty || 1));
  renderOrderPanel();
}

function renderAutoLists() {
  if (els.autoBuyList) {
    els.autoBuyList.innerHTML = "";
    const items = state.autoBuyOrders.filter(x => x.code === state.selectedCode).slice(0, 30);
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state-box";
      empty.textContent = "등록된 예약구매가 없어요";
      els.autoBuyList.appendChild(empty);
    } else {
      items.forEach(item => {
        const row = document.createElement("div");
        row.className = "auto-item";

        const main = document.createElement("div");
        main.className = "auto-item-main";

        const title = document.createElement("div");
        title.className = "auto-item-title";
        title.textContent = `${item.name} · ${formatKRW(item.targetPrice)} 이하 매수`;

        const sub = document.createElement("div");
        sub.className = "auto-item-sub";
        sub.textContent = `${formatQty(item.qty)} · ${item.useMax ? "최대수량" : (item.budget > 0 ? `예산 ${formatKRW(item.budget)}` : "예산 제한 없음")} · ${item.createdAt}`;

        const del = document.createElement("button");
        del.type = "button";
        del.textContent = "취소";
        del.addEventListener("click", () => removeAutoBuy(item.id));

        main.appendChild(title);
        main.appendChild(sub);
        row.appendChild(main);
        row.appendChild(del);
        els.autoBuyList.appendChild(row);
      });
    }
  }

  if (els.autoSellList) {
    els.autoSellList.innerHTML = "";
    const items = state.autoSellOrders.filter(x => x.code === state.selectedCode).slice(0, 30);
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state-box";
      empty.textContent = "등록된 예약판매가 없어요";
      els.autoSellList.appendChild(empty);
    } else {
      items.forEach(item => {
        const row = document.createElement("div");
        row.className = "auto-item";

        const main = document.createElement("div");
        main.className = "auto-item-main";

        const title = document.createElement("div");
        title.className = "auto-item-title";
        title.textContent = `${item.name} · ${item.targetPrice ? `목표 ${formatKRW(item.targetPrice)}` : "목표 없음"} / ${item.stopPrice ? `손절 ${formatKRW(item.stopPrice)}` : "손절 없음"}`;

        const sub = document.createElement("div");
        sub.className = "auto-item-sub";
        sub.textContent = `${item.useAll ? "전량" : formatQty(item.qty)} · ${item.createdAt}`;

        const del = document.createElement("button");
        del.type = "button";
        del.textContent = "취소";
        del.addEventListener("click", () => removeAutoSell(item.id));

        main.appendChild(title);
        main.appendChild(sub);
        row.appendChild(main);
        row.appendChild(del);
        els.autoSellList.appendChild(row);
      });
    }
  }
}

function renderPortfolio() {
  const total = totalAsset();
  const profit = baselineProfit();
  const baselineRate = baselineProfitRate();
  const absoluteRate = absoluteProfitRate();
  const invested = investedAmount();
  const stockVal = stockValue();
  const unrl = unrealizedProfit();

  setText(els.totalAssetTop, formatKRW(total));
  if (els.profitLossTop) {
    els.profitLossTop.innerHTML = `${formatSignedKRW(profit)}<span class="subline ${profit >= 0 ? "positive" : "negative"}">${formatSignedPct(baselineRate)}</span>`;
  }
  setText(els.cashTop, formatKRW(state.portfolio.cash));

  setText(els.portfolioTotal, formatKRW(total));
  if (els.portfolioPL) {
    els.portfolioPL.textContent = `${formatSignedKRW(profit)} (${formatSignedPct(baselineRate)})`;
    els.portfolioPL.classList.remove("positive", "negative");
    els.portfolioPL.classList.add(profit >= 0 ? "positive" : "negative");
  }

  setText(els.portfolioCash, formatKRW(state.portfolio.cash));
  setText(els.portfolioStockValue, formatKRW(stockVal));
  setText(els.portfolioInvested, formatKRW(invested));
  setText(els.portfolioRate, formatSignedPct(invested > 0 ? (unrl / invested) * 100 : 0));
  setText(els.portfolioAbsoluteRate, formatSignedPct(absoluteRate));
  setText(els.portfolioRealized, formatSignedKRW(state.realizedProfit));
  setText(els.portfolioBaselineRate, formatSignedPct(baselineRate));
  setText(els.portfolioUnrealized, formatSignedKRW(unrl));
}

function renderWatchlists() {
  const list = filteredStocks();

  if (els.watchlist) {
    els.watchlist.innerHTML = "";
    list.forEach(stock => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `watch-item${stock.code === state.selectedCode ? " active" : ""}`;
      btn.addEventListener("click", () => {
        state.selectedCode = stock.code;
        queueSave();
        renderAll();
      });

      const left = document.createElement("div");
      left.className = "watch-left";

      const logo = document.createElement("div");
      logo.className = "watch-logo";
      logo.textContent = stock.logo;

      const meta = document.createElement("div");
      const name = document.createElement("div");
      name.className = "watch-name";
      name.textContent = stock.name;

      const theme = document.createElement("div");
      theme.className = "watch-theme";
      theme.textContent = `${stock.code} · ${stock.theme}`;

      meta.appendChild(name);
      meta.appendChild(theme);
      left.appendChild(logo);
      left.appendChild(meta);

      const right = document.createElement("div");
      right.className = "watch-right";

      const price = document.createElement("div");
      price.className = "watch-price";
      price.textContent = formatKRW(stock.currentPrice);

      const rate = document.createElement("div");
      rate.className = `watch-rate ${stockRate(stock) >= 0 ? "positive" : "negative"}`;
      rate.textContent = `${formatSignedPct(stockRate(stock))}`;

      const mini = document.createElement("div");
      mini.className = "watch-mini";
      mini.textContent = `거래량 ${formatVolume(stock.volume)}`;

      right.appendChild(price);
      right.appendChild(rate);
      right.appendChild(mini);

      btn.appendChild(left);
      btn.appendChild(right);
      els.watchlist.appendChild(btn);
    });
  }

  if (els.favoritesList) {
    const favs = state.favorites
      .map(code => state.stocks.find(s => s.code === code))
      .filter(Boolean);

    els.favoritesList.innerHTML = "";
    if (!favs.length) {
      els.favoritesList.textContent = "즐겨찾기한 종목이 아직 없어요";
      els.favoritesList.className = "watchlist-block empty-state-box";
    } else {
      els.favoritesList.className = "watchlist-block";
      favs.forEach(stock => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "favorite-stock-chip";
        btn.textContent = `${stock.name} ${formatSignedPct(stockRate(stock))}`;
        btn.addEventListener("click", () => {
          state.selectedCode = stock.code;
          queueSave();
          renderAll();
        });
        els.favoritesList.appendChild(btn);
      });
    }
  }
}

function renderHeroSelects() {
  if (els.heroStockSelect) {
    const current = state.selectedCode;
    els.heroStockSelect.innerHTML = "";
    state.stocks.forEach(stock => {
      const opt = document.createElement("option");
      opt.value = stock.code;
      opt.textContent = `${stock.name} (${stock.code})`;
      els.heroStockSelect.appendChild(opt);
    });
    els.heroStockSelect.value = current;
  }

  if (els.adminStockSelect) {
    const current = state.selectedCode;
    els.adminStockSelect.innerHTML = "";
    state.stocks.forEach(stock => {
      const opt = document.createElement("option");
      opt.value = stock.code;
      opt.textContent = `${stock.name} (${stock.code})`;
      els.adminStockSelect.appendChild(opt);
    });
    els.adminStockSelect.value = current;
  }
}
function renderAdminPanel() {
  if (!els.adminOverlay) return;
  els.adminOverlay.classList.toggle("hidden", !state.isAdmin && !els.adminOverlay.dataset.open);

  if (els.adminInitialCash) els.adminInitialCash.value = String(toInt(state.settings.initialCash, DEFAULT_SETTINGS.initialCash));
  if (els.adminSupportAmount) els.adminSupportAmount.value = String(toInt(state.settings.supportFundAmount, DEFAULT_SETTINGS.supportFundAmount));
  if (els.adminSupportLimit) els.adminSupportLimit.value = String(toInt(state.settings.supportFundCashLimit, DEFAULT_SETTINGS.supportFundCashLimit));
  if (els.adminFeeRate) els.adminFeeRate.value = String(toNum(state.settings.feeRate, DEFAULT_SETTINGS.feeRate));
  if (els.adminVolatility) els.adminVolatility.value = String(toNum(state.settings.globalVolatility, 1));
  if (els.adminNewsFreq) els.adminNewsFreq.value = String(toNum(state.settings.newsFrequency, 1));
  if (els.adminUpperLimitRate) els.adminUpperLimitRate.value = String(toNum(state.settings.upperLimitRate, 0.3));
  if (els.adminLowerLimitRate) els.adminLowerLimitRate.value = String(toNum(state.settings.lowerLimitRate, 0.3));
  if (els.adminDailyLimitEnabled) els.adminDailyLimitEnabled.checked = !!state.settings.dailyLimitEnabled;
  if (els.adminHighSpeedEnabled) els.adminHighSpeedEnabled.checked = !!state.settings.adminHighSpeedEnabled;

  const stock = selectedStock();
  if (els.adminStockSelect) els.adminStockSelect.value = stock?.code || "";
  if (els.adminStockPrice) els.adminStockPrice.value = String(toInt(stock?.currentPrice, 0));
  if (els.adminStockFixed) els.adminStockFixed.checked = !!stock?.isFixed;

  if (els.adminPanelBox) els.adminPanelBox.classList.toggle("hidden", !state.isAdmin);
  if (els.adminLoginBox) els.adminLoginBox.classList.toggle("hidden", !!state.isAdmin);
}

function openAdminModal() {
  if (!els.adminOverlay) return;
  els.adminOverlay.dataset.open = "1";
  els.adminOverlay.classList.remove("hidden");
  renderAdminPanel();
}

function closeAdminModal() {
  if (!els.adminOverlay) return;
  delete els.adminOverlay.dataset.open;
  if (!state.isAdmin) els.adminOverlay.classList.add("hidden");
  renderAdminPanel();
}

function adminLogin() {
  const code = (els.adminCodeInput?.value || "").trim();
  if (code !== ADMIN_CODE) {
    toast("관리자 코드가 올바르지 않아요", "down");
    return;
  }
  state.isAdmin = true;
  if (els.adminCodeInput) els.adminCodeInput.value = "";
  renderSpeedButtons();
  renderAdminPanel();
  queueSave();
  toast("관리자 모드가 활성화됐어요", "event");
}

function saveAdminSettings() {
  state.settings.initialCash = Math.max(10000, toInt(els.adminInitialCash?.value, state.settings.initialCash));
  state.settings.supportFundAmount = Math.max(0, toInt(els.adminSupportAmount?.value, state.settings.supportFundAmount));
  state.settings.supportFundCashLimit = Math.max(0, toInt(els.adminSupportLimit?.value, state.settings.supportFundCashLimit));
  state.settings.feeRate = clamp(toNum(els.adminFeeRate?.value, state.settings.feeRate), 0, 0.1);
  state.settings.globalVolatility = clamp(toNum(els.adminVolatility?.value, state.settings.globalVolatility), 0.2, 10);
  state.settings.newsFrequency = clamp(toNum(els.adminNewsFreq?.value, state.settings.newsFrequency), 0.2, 10);
  state.settings.upperLimitRate = clamp(toNum(els.adminUpperLimitRate?.value, state.settings.upperLimitRate), 0.05, 1);
  state.settings.lowerLimitRate = clamp(toNum(els.adminLowerLimitRate?.value, state.settings.lowerLimitRate), 0.05, 0.95);
  state.settings.dailyLimitEnabled = !!els.adminDailyLimitEnabled?.checked;
  state.settings.adminHighSpeedEnabled = !!els.adminHighSpeedEnabled?.checked;

  if (!state.settings.adminHighSpeedEnabled && state.speed > 50) state.speed = 50;

  queueSave();
  renderAll();
  toast("관리자 설정이 저장됐어요", "event");
}

function applyAdminStockControls() {
  const code = els.adminStockSelect?.value || state.selectedCode;
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return;

  const newPrice = Math.max(1, toInt(els.adminStockPrice?.value, stock.currentPrice));
  stock.currentPrice = newPrice;
  stock.dayHigh = Math.max(stock.dayHigh, newPrice);
  stock.dayLow = Math.min(stock.dayLow, newPrice);
  stock.isFixed = !!els.adminStockFixed?.checked;
  stock.history.push(newPrice);
  if (stock.history.length > 240) stock.history.shift();
  stock.historyLong.push(newPrice);
  if (stock.historyLong.length > 3000) stock.historyLong.shift();
  buildOrderbook(stock);

  if (state.selectedCode !== code) state.selectedCode = code;

  queueSave();
  renderAll();
  toast(`${stock.name} 가격이 반영됐어요`, "event");
}

function bindEvents() {
  addEvent(els.supportFundBtn, "click", maybeSupportFund);
  addEvent(els.pauseBtn, "click", () => {
    state.isPaused = true;
    toast("일시정지됐어요", "event");
  });
  addEvent(els.resumeBtn, "click", () => {
    state.isPaused = false;
    state.isStopped = false;
    toast("재개됐어요", "event");
  });
  addEvent(els.stopBtn, "click", () => {
    state.isStopped = true;
    toast("정지됐어요", "down");
  });
  addEvent(els.resetBtn, "click", resetAllData);
  addEvent(els.saveSlotBtn, "click", () => {
    saveState();
    toast("저장됐어요", "event");
  });
  addEvent(els.loadSlotBtn, "click", () => {
    loadState();
    renderAll();
    toast("불러왔어요", "event");
  });
  addEvent(els.favoriteToggleBtn, "click", () => toggleFavorite(state.selectedCode));
  addEvent(els.heroStockSelect, "change", e => {
    state.selectedCode = e.target.value;
    queueSave();
    renderAll();
  });
  addEvent(els.searchInput, "input", renderWatchlists);

  addEvent(els.buyModeBtn, "click", () => {
    state.orderMode = "buy";
    queueSave();
    renderOrderPanel();
  });
  addEvent(els.sellModeBtn, "click", () => {
    state.orderMode = "sell";
    queueSave();
    renderOrderPanel();
  });

  addEvent(els.orderQty, "input", () => renderOrderPanel());
  addEvent(els.submitOrderBtn, "click", submitManualOrder);
  addEvent(els.addAutoBuyBtn, "click", submitAutoBuy);
  addEvent(els.addAutoSellBtn, "click", submitAutoSell);
  addEvent(els.resetBaselineBtn, "click", resetBaseline);
  addEvent(els.toggleActiveOrdersBtn, "click", cancelAllAutoOrders);
  addEvent(els.clearHistoryBtn, "click", clearHistories);

  qa(".history-tab").forEach(btn => {
    addEvent(btn, "click", () => {
      state.historyTab = btn.dataset.historyTab === "alerts" ? "alerts" : "orders";
      queueSave();
      renderHistory();
    });
  });

  qa(".sort-btn").forEach(btn => {
    addEvent(btn, "click", () => {
      state.sortBy = btn.dataset.sort === "volume" ? "volume" : "change";
      qa(".sort-btn").forEach(x => x.classList.toggle("active", x === btn));
      queueSave();
      renderWatchlists();
    });
  });

  addEvent(els.adminEntryBtn, "click", openAdminModal);
  addEvent(els.closeAdminModalBtn, "click", closeAdminModal);
  addEvent(els.adminLoginBtn, "click", adminLogin);
  addEvent(els.applyAdminStockPriceBtn, "click", applyAdminStockControls);
  addEvent(els.saveAdminSettingsBtn, "click", saveAdminSettings);
  addEvent(els.forceBaselineResetBtn, "click", resetBaseline);
  addEvent(els.adminCancelAllAutoSellBtn, "click", () => {
    state.autoSellOrders = [];
    queueSave();
    renderAutoLists();
    toast("예약판매를 모두 취소했어요", "event");
  });
  addEvent(els.adminCancelAllAutoBuyBtn, "click", () => {
    state.autoBuyOrders = [];
    queueSave();
    renderAutoLists();
    toast("예약구매를 모두 취소했어요", "event");
  });
  addEvent(els.adminResetAllBtn, "click", resetAllData);

  addEvent(els.adminStockSelect, "change", e => {
    state.selectedCode = e.target.value;
    renderAll();
  });

  addEvent(window, "resize", () => renderChart());
  bindChartHover();
}

function renderAll() {
  renderHeroSelects();
  renderSpeedButtons();
  renderChartTabs();
  renderHero();
  renderChart();
  renderPortfolio();
  renderWatchlists();
  renderNewsFeed();
  renderHistory();
  renderAdminPanel();
}

function tickLoop() {
  if (state.isPaused || state.isStopped) return;

  rollVirtualTime();

  for (const stock of state.stocks) {
    updateOneStock(stock);
  }

  processAutoOrders();

  state.chartRenderCounter += 1;
  renderHero();
  renderPortfolio();
  renderWatchlists();
  renderNewsFeed();
  renderHistory();

  if (state.chartRenderCounter % (state.speed >= 100 ? 3 : state.speed >= 20 ? 2 : 1) === 0) {
    renderChart();
  }

  queueSave();
}

function collectElements() {
  [
    "totalAssetTop","profitLossTop","cashTop",
    "supportFundBtn","pauseBtn","resumeBtn","stopBtn","resetBtn","saveSlotBtn","loadSlotBtn","adminEntryBtn","alertBellBtn","alertBadge",
    "symbolLogo","selectedName","selectedCode","favoriteToggleBtn","heroStockSelect",
    "selectedPrice","selectedChange","dayHigh","dayLow","dayOpen","dayVolume",
    "speedButtons","moodFill","moodText","chartTabs","priceChart","chartTooltip",
    "selectedNewsTitleName","selectedNewsCount","selectedNewsFeed",
    "holdingQtyInline","avgPriceInline","availableCash","maxBuyQty","currentHoldingQty","currentAvgPrice",
    "buyModeBtn","sellModeBtn","currentTradePriceLabel","orderPrice","orderQty","quickRow","estimatedCost","estimatedFee","submitOrderBtn",
    "autoModeTitle","autoModeDesc","autoBuyModeBox","autoSellModeBox",
    "autoBuyTargetPrice","autoBuyQty","autoBuyBudget","autoBuyMax","addAutoBuyBtn","autoBuyList",
    "autoSellTargetPrice","autoSellStopPrice","autoSellQty","autoSellAll","addAutoSellBtn","autoSellList",
    "orderbookRows","newsCountChip","newsFeed","clearHistoryBtn","orderHistoryList","alertHistoryList",
    "portfolioTotal","portfolioPL","portfolioCash","portfolioStockValue","portfolioInvested","portfolioRate",
    "portfolioAbsoluteRate","portfolioRealized","portfolioBaselineRate","portfolioUnrealized","resetBaselineBtn","toggleActiveOrdersBtn",
    "searchInput","favoritesList","marketAlertBadge","watchlist",
    "adminOverlay","closeAdminModalBtn","adminCodeInput","adminLoginBtn","adminLoginBox","adminPanelBox",
    "adminInitialCash","adminSupportAmount","adminSupportLimit","adminFeeRate","adminVolatility","adminNewsFreq",
    "adminUpperLimitRate","adminLowerLimitRate","adminDailyLimitEnabled","adminHighSpeedEnabled",
    "adminStockSelect","adminStockPrice","adminStockFixed",
    "applyAdminStockPriceBtn","saveAdminSettingsBtn","forceBaselineResetBtn","adminCancelAllAutoSellBtn","adminCancelAllAutoBuyBtn","adminResetAllBtn"
  ].forEach(id => {
    els[id] = byId(id);
  });
}

function startLoop() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    try {
      tickLoop();
    } catch (e) {
      console.error("tickLoop", e);
    }
  }, 500);
}

function init() {
  collectElements();
  loadState();

  if (!state.stocks.length) defaultState();

  bindEvents();
  renderAll();
  startLoop();
}

document.addEventListener("DOMContentLoaded", init);
