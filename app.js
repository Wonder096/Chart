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
  state.settings.marketBias = clamp(toNum(state.settings.marketBias, 0), -1, 1);
  state.settings.adminHighSpeedEnabled = !!state.settings.adminHighSpeedEnabled;
  state.settings.dailyLimitEnabled = !!state.settings.dailyLimitEnabled;
  state.settings.upperLimitRate = clamp(toNum(state.settings.upperLimitRate, 0.30), 0.05, 10);
  state.settings.lowerLimitRate = clamp(toNum(state.settings.lowerLimitRate, 0.30), 0.05, 0.99);

  state.baseline = {
    totalAsset: Math.max(0, toNum(data.baseline?.totalAsset, state.settings.initialCash)),
    startedAt: toInt(data.baseline?.startedAt, Date.now())
  };
  state.realizedProfit = toNum(data.realizedProfit, 0);

  state.portfolio = {
    cash: Math.max(0, toInt(data.portfolio?.cash, state.settings.initialCash)),
    holdings: {}
  };

  if (data.portfolio?.holdings && typeof data.portfolio.holdings === "object") {
    Object.entries(data.portfolio.holdings).forEach(([code, h]) => {
      const qty = Math.max(0, toInt(h?.qty, 0));
      const avgPrice = Math.max(0, toNum(h?.avgPrice, 0));
      if (qty > 0) state.portfolio.holdings[code] = { qty, avgPrice };
    });
  }

  state.favorites = Array.isArray(data.favorites) ? data.favorites.filter(v => typeof v === "string").slice(0, 20) : [];
  state.news = Array.isArray(data.news) ? data.news.slice(0, 120) : [];
  state.alerts = Array.isArray(data.alerts) ? data.alerts.slice(0, 200) : [];
  state.orderHistory = Array.isArray(data.orderHistory) ? data.orderHistory.slice(0, 200) : [];
  state.autoSellOrders = Array.isArray(data.autoSellOrders) ? data.autoSellOrders.slice(0, 120) : [];
  state.autoBuyOrders = Array.isArray(data.autoBuyOrders) ? data.autoBuyOrders.slice(0, 120) : [];
  state.virtualTime = Math.max(0, toInt(data.virtualTime, Date.now()));
  state.virtualDateKey = typeof data.virtualDateKey === "string" ? data.virtualDateKey : dateKeyFromTime(state.virtualTime);

  if (Array.isArray(data.stocks) && data.stocks.length) {
    const oldMap = new Map(data.stocks.map(s => [s.code, s]));
    state.stocks = STOCK_BLUEPRINTS.map(bp => {
      const stock = makeStock(bp);
      const old = oldMap.get(bp[0]);
      if (!old) {
        buildOrderbook(stock);
        return stock;
      }
      stock.currentPrice = Math.max(1, toInt(old.currentPrice, stock.currentPrice));
      stock.prevClose = Math.max(1, toInt(old.prevClose, stock.prevClose));
      stock.openPrice = Math.max(1, toInt(old.openPrice, stock.openPrice));
      stock.dayHigh = Math.max(stock.currentPrice, toInt(old.dayHigh, stock.currentPrice));
      stock.dayLow = Math.max(1, Math.min(stock.currentPrice, toInt(old.dayLow, stock.currentPrice)));
      stock.volume = Math.max(0, toInt(old.volume, stock.volume));
      stock.momentum = clamp(toNum(old.momentum, stock.momentum), -3, 3);
      stock.eventBias = toNum(old.eventBias, 0);
      stock.eventTicks = Math.max(0, toInt(old.eventTicks, 0));
      stock.history = Array.isArray(old.history) ? old.history.map(v => Math.max(1, toInt(v, stock.currentPrice))).slice(-240) : stock.history;
      stock.historyLong = Array.isArray(old.historyLong) ? old.historyLong.map(v => Math.max(1, toInt(v, stock.currentPrice))).slice(-2000) : stock.history.slice(-180);
      stock.haltedDirection = old.haltedDirection || null;
      buildOrderbook(stock);
      return stock;
    });
  }

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
  const base = toNum(state.settings.initialCash, 1000000);
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
    base < 2000 ? 0.006 :
    base < 10000 ? 0.003 :
    base < 100000 ? 0.0016 :
    0.001;

  const asks = [];
  const bids = [];

  for (let i = 5; i >= 1; i--) {
    const step = Math.max(1, Math.round(base * spreadFactor * i));
    asks.push({
      type: "ask",
      price: Math.max(1, base + step),
      qty: randInt(800, 2800)
    });
  }

  for (let i = 1; i <= 5; i++) {
    const step = Math.max(1, Math.round(base * spreadFactor * i));
    bids.push({
      type: "bid",
      price: Math.max(1, base - step),
      qty: randInt(800, 2800)
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

function typeLabel(type) {
  return ({ good: "호재", bad: "주의", event: "이벤트", breaking: "속보" })[type] || "알림";
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
  addAlert(`${stock.name} · ${typeLabel(type)} · ${text}`, type === "bad" ? "down" : type === "good" ? "up" : "normal");
}

function recordOrder(entry) {
  state.orderHistory.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: nowTime(),
    ...entry
  });
  if (state.orderHistory.length > 200) state.orderHistory.length = 200;
}

function toast(text) {
  addAlert(text, "normal");
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
  if (stock.haltedDirection) {
    buildOrderbook(stock);
    stock.flash = 0;
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

  if (Math.random() < 0.002 * state.settings.globalVolatility) {
    move += rand(-0.14, 0.14);
  }

  let next = Math.max(1, Math.round(stock.currentPrice * (1 + move)));

  if (state.settings.dailyLimitEnabled) {
    const upper = getUpperLimitPrice(stock);
    const lower = getLowerLimitPrice(stock);
    if (next >= upper) {
      next = upper;
      stock.haltedDirection = "up";
      pushNews("breaking", stock, "상한가에 도달했어요", 0.15);
    }
    if (next <= lower) {
      next = lower;
      stock.haltedDirection = "down";
      pushNews("bad", stock, "하한가에 도달했어요", -0.15);
    }
  }

  stock.currentPrice = next;
  stock.dayHigh = Math.max(stock.dayHigh, next);
  stock.dayLow = Math.min(stock.dayLow, next);
  stock.volume += Math.max(
    1,
    Math.round(rand(200, 10000) * (1 + Math.abs(move) * 35) * (stock.priceClass === "cheap" ? 3.4 : stock.priceClass === "premium" ? 0.45 : 1))
  );
  stock.history.push(next);
  if (stock.history.length > 240) stock.history.shift();

  if (Math.random() < 0.12) {
    stock.historyLong.push(next);
    if (stock.historyLong.length > 3000) stock.historyLong.shift();
  }

  stock.momentum = clamp(stock.momentum * 0.92 + (next > oldPrice ? 0.28 : -0.28), -3, 3);
  if (stock.eventTicks > 0) stock.eventTicks -= 1;
  if (stock.eventTicks <= 0) stock.eventBias *= 0.6;

  buildOrderbook(stock);
  stock.flash = next > oldPrice ? 1 : next < oldPrice ? -1 : 0;
}

function executeBuy(code, qty, price, reason = "현재가 매수") {
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return false;
  qty = Math.max(0, toInt(qty, 0));
  if (qty <= 0) return false;

  const amount = price * qty;
  const fee = feeOf(amount);
  const total = amount + fee;
  if (state.portfolio.cash < total) {
    toast("현금이 부족해요.");
    return false;
  }

  const h = holdingOf(code);
  const newQty = h.qty + qty;
  const newAvg = newQty > 0 ? (((h.avgPrice * h.qty) + amount) / newQty) : 0;

  state.portfolio.cash -= total;
  state.portfolio.holdings[code] = { qty: newQty, avgPrice: newAvg };
  recordOrder({ type: "buy", stockName: stock.name, code, qty, price, fee, total, reason });
  return true;
}

function executeSell(code, qty, price, reason = "현재가 매도") {
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return false;
  qty = Math.max(0, toInt(qty, 0));
  if (qty <= 0) return false;

  const h = holdingOf(code);
  if (h.qty < qty) {
    toast("보유 수량이 부족해요.");
    return false;
  }

  const amount = price * qty;
  const fee = feeOf(amount);
  const total = amount - fee;

  state.portfolio.cash += total;
  state.realizedProfit += ((price - h.avgPrice) * qty) - fee;

  if (h.qty === qty) {
    delete state.portfolio.holdings[code];
  } else {
    state.portfolio.holdings[code] = { qty: h.qty - qty, avgPrice: h.avgPrice };
  }

  if (!hasAnyHolding()) {
    state.realizedProfit = 0;
    state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() };
  }

  recordOrder({ type: "sell", stockName: stock.name, code, qty, price, fee, total, reason });
  return true;
}

function processAutoOrders() {
  const removeSellIds = [];
  state.autoSellOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) { removeSellIds.push(order.id); return; }

    const holding = holdingOf(order.code);
    if (holding.qty <= 0) { removeSellIds.push(order.id); return; }

    const hitTarget = order.targetPrice > 0 && stock.currentPrice >= order.targetPrice;
    const hitStop = order.stopPrice > 0 && stock.currentPrice <= order.stopPrice;
    if (!hitTarget && !hitStop) return;

    const qty = order.all ? holding.qty : Math.min(holding.qty, order.qty);
    if (qty <= 0) { removeSellIds.push(order.id); return; }

    executeSell(order.code, qty, stock.currentPrice, hitTarget ? "예약판매(목표가)" : "예약판매(손절가)");
    removeSellIds.push(order.id);
  });

  if (removeSellIds.length) {
    state.autoSellOrders = state.autoSellOrders.filter(x => !removeSellIds.includes(x.id));
  }

  const removeBuyIds = [];
  state.autoBuyOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) { removeBuyIds.push(order.id); return; }
    if (stock.currentPrice > order.targetPrice) return;

    let qty = order.useMax
      ? Math.floor(state.portfolio.cash / (stock.currentPrice + feeOf(stock.currentPrice)))
      : Math.max(0, toInt(order.qty, 0));

    if (order.budgetLimit > 0) {
      qty = Math.min(qty, Math.floor(order.budgetLimit / Math.max(1, stock.currentPrice)));
    }

    if (qty <= 0) { removeBuyIds.push(order.id); return; }

    const total = (stock.currentPrice * qty) + feeOf(stock.currentPrice * qty);
    if (state.portfolio.cash < total) {
      removeBuyIds.push(order.id);
      return;
    }

    executeBuy(order.code, qty, stock.currentPrice, "자동구매(예약구매)");
    removeBuyIds.push(order.id);
  });

  if (removeBuyIds.length) {
    state.autoBuyOrders = state.autoBuyOrders.filter(x => !removeBuyIds.includes(x.id));
  }
}

function getSpeedProfile(speed) {
  const map = {
    1: { delay: 1000, loops: 1, chartEvery: 1 },
    2: { delay: 520, loops: 1, chartEvery: 1 },
    5: { delay: 240, loops: 1, chartEvery: 1 },
    10: { delay: 130, loops: 1, chartEvery: 2 },
    20: { delay: 70, loops: 2, chartEvery: 3 },
    50: { delay: 30, loops: 3, chartEvery: 5 },
    100: { delay: 16, loops: 4, chartEvery: 8 },
    200: { delay: 9, loops: 6, chartEvery: 12 },
    300: { delay: 6, loops: 8, chartEvery: 16 }
  };
  return map[speed] || map[1];
}

function tickOnce() {
  if (state.isPaused || state.isStopped) return;

  const profile = getSpeedProfile(state.speed);
  for (let i = 0; i < profile.loops; i++) {
    rollVirtualTime();
    state.stocks.forEach(updateOneStock);
    processAutoOrders();
  }

  state.chartRenderCounter += 1;
  render(state.chartRenderCounter % profile.chartEvery === 0);
  queueSave();
}

function restartTick() {
  clearTimeout(tickTimer);
  const loop = () => {
    tickOnce();
    tickTimer = setTimeout(loop, getSpeedProfile(state.speed).delay);
  };
  tickTimer = setTimeout(loop, getSpeedProfile(state.speed).delay);
}

function collectEls() {
  [
    "totalAssetTop","profitLossTop","cashTop","supportFundBtn","pauseBtn","resumeBtn","stopBtn","resetBtn","alertBadge",
    "symbolLogo","selectedName","selectedCode","heroStockSelect","favoriteToggleBtn","selectedPrice","selectedChange","dayHigh","dayLow","dayOpen","dayVolume",
    "speedButtons","moodFill","moodText","priceChart","chartTooltip","selectedNewsTitleName","selectedNewsCount","selectedNewsFeed",
    "holdingQtyInline","avgPriceInline","availableCash","maxBuyQty","currentHoldingQty","currentAvgPrice","buyModeBtn","sellModeBtn",
    "currentTradePriceLabel","orderPrice","orderQty","quickRow","estimatedCost","estimatedFee","submitOrderBtn",
    "autoSellTargetPrice","autoSellStopPrice","autoSellQty","autoSellAll","addAutoSellBtn","autoSellList","orderbookRows",
    "newsCountChip","newsFeed","clearHistoryBtn","orderHistoryList","alertHistoryList","portfolioTotal","portfolioPL","portfolioCash",
    "portfolioStockValue","portfolioInvested","portfolioRate","watchlist"
  ].forEach(id => els[id] = byId(id));

  els.autoBuyTargetPrice = byId("autoBuyTargetPrice");
  els.autoBuyQty = byId("autoBuyQty");
  els.autoBuyBudget = byId("autoBuyBudget");
  els.autoBuyMax = byId("autoBuyMax");
  els.addAutoBuyBtn = byId("addAutoBuyBtn");
  els.autoBuyList = byId("autoBuyList");

  els.resetBaselineBtn = byId("resetBaselineBtn");
  els.toggleActiveOrdersBtn = byId("toggleActiveOrdersBtn");
  els.adminEntryBtn = byId("adminEntryBtn");
  els.saveSlotBtn = byId("saveSlotBtn");
  els.loadSlotBtn = byId("loadSlotBtn");
  els.virtualClockChip = byId("virtualClockChip");

  els.adminOverlay = byId("adminOverlay");
  els.adminCodeInput = byId("adminCodeInput");
  els.adminLoginBtn = byId("adminLoginBtn");
  els.closeAdminModalBtn = byId("closeAdminModalBtn");
  els.adminLoginBox = byId("adminLoginBox");
  els.adminPanelBox = byId("adminPanelBox");
  els.adminInitialCash = byId("adminInitialCash");
  els.adminSupportAmount = byId("adminSupportAmount");
  els.adminSupportLimit = byId("adminSupportLimit");
  els.adminFeeRate = byId("adminFeeRate");
  els.adminVolatility = byId("adminVolatility");
  els.adminNewsFreq = byId("adminNewsFreq");
  els.adminHighSpeedEnabled = byId("adminHighSpeedEnabled");
  els.adminStockSelect = byId("adminStockSelect");
  els.adminStockPrice = byId("adminStockPrice");
  els.applyAdminStockPriceBtn = byId("applyAdminStockPriceBtn");
  els.saveAdminSettingsBtn = byId("saveAdminSettingsBtn");
  els.forceBaselineResetBtn = byId("forceBaselineResetBtn");
  els.adminCancelAllAutoSellBtn = byId("adminCancelAllAutoSellBtn");
  els.adminCancelAllAutoBuyBtn = byId("adminCancelAllAutoBuyBtn");
  els.adminResetAllBtn = byId("adminResetAllBtn");
  els.adminDailyLimitEnabled = byId("adminDailyLimitEnabled");
  els.adminUpperLimitRate = byId("adminUpperLimitRate");
  els.adminLowerLimitRate = byId("adminLowerLimitRate");
}

function injectExtraUI() {
  document.title = "주식 모의증권";
  const brandTitle = q(".brand-title");
  if (brandTitle) brandTitle.textContent = "주식 모의증권";
  const brandSub = q(".brand-sub");
  if (brandSub) brandSub.textContent = "GitHub Pages Edition";

  const topSummaryRow = q(".top-summary-row");
  if (topSummaryRow && !byId("virtualClockChip")) {
    const div = document.createElement("div");
    div.id = "virtualClockChip";
    div.className = "summary-card";
    div.innerHTML = `<div class="summary-label">가상시간</div><div class="summary-value" style="font-size:15px">${formatVirtualDateTime()}</div>`;
    topSummaryRow.appendChild(div);
  }

  const headerActions = q(".header-actions");
  if (headerActions && !byId("saveSlotBtn")) {
    const saveBtn = document.createElement("button");
    saveBtn.id = "saveSlotBtn";
    saveBtn.className = "top-action-btn control-btn";
    saveBtn.type = "button";
    saveBtn.textContent = "저장";

    const loadBtn = document.createElement("button");
    loadBtn.id = "loadSlotBtn";
    loadBtn.className = "top-action-btn control-btn";
    loadBtn.type = "button";
    loadBtn.textContent = "불러오기";

    const adminBtn = document.createElement("button");
    adminBtn.id = "adminEntryBtn";
    adminBtn.className = "top-action-btn control-btn";
    adminBtn.type = "button";
    adminBtn.textContent = "관리자";

    headerActions.insertBefore(saveBtn, byId("pauseBtn"));
    headerActions.insertBefore(loadBtn, byId("pauseBtn"));
    headerActions.insertBefore(adminBtn, byId("pauseBtn"));
  }

  const portfolioPanel = q(".portfolio-panel");
  if (portfolioPanel && !byId("portfolioExtraBox")) {
    const extra = document.createElement("div");
    extra.id = "portfolioExtraBox";
    extra.className = "portfolio-grid";
    extra.innerHTML = `
      <div class="portfolio-card"><span>전체 수익률</span><b id="portfolioAbsoluteRate">0.00%</b></div>
      <div class="portfolio-card"><span>실현손익</span><b id="portfolioRealized">0원</b></div>
      <div class="portfolio-card"><span>기준선 이후</span><b id="portfolioBaselineRate">0.00%</b></div>
      <div class="portfolio-card"><span>평가손익</span><b id="portfolioUnrealized">0원</b></div>
    `;
    extra.style.marginTop = "12px";
    portfolioPanel.appendChild(extra);
  }

  if (!byId("resetBaselineBtn") && portfolioPanel) {
    const row = document.createElement("div");
    row.className = "header-actions";
    row.style.justifyContent = "stretch";
    row.style.marginTop = "12px";
    row.innerHTML = `
      <button class="top-action-btn control-btn" id="resetBaselineBtn" type="button" style="flex:1">수익률 기준 리셋</button>
      <button class="top-action-btn control-btn" id="toggleActiveOrdersBtn" type="button" style="flex:1">자동매매 비우기</button>
    `;
    portfolioPanel.appendChild(row);
  }

  const chartTabs = q(".chart-tabs");
  if (chartTabs) {
    chartTabs.innerHTML = CHART_RANGES.map(r => `<button type="button" class="tab-btn ${r.key === state.chartRange ? "active" : ""}" data-chart-range="${r.key}">${r.label}</button>`).join("");
  }

  const orderPanel = q(".order-panel");
  const autoSellBlock = q(".auto-sell-block");
  if (orderPanel && !autoSellBlock) {
    const block = document.createElement("div");
    block.className = "auto-sell-block";
    block.innerHTML = `
      <div class="auto-sell-head">
        <h3 id="autoModeTitle">예약판매 · 자동매도</h3>
        <p id="autoModeDesc">원하는 가격에 도달하면 자동으로 매도할 수 있어요</p>
      </div>

      <div id="autoSellModeBox">
        <div class="auto-sell-grid">
          <div class="form-group">
            <label for="autoSellTargetPrice">목표가</label>
            <input id="autoSellTargetPrice" type="number" min="0" step="1" />
          </div>
          <div class="form-group">
            <label for="autoSellStopPrice">손절가</label>
            <input id="autoSellStopPrice" type="number" min="0" step="1" />
          </div>
          <div class="form-group">
            <label for="autoSellQty">수량</label>
            <input id="autoSellQty" type="number" min="1" step="1" value="1" />
          </div>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input id="autoSellAll" type="checkbox" />
              <span>전량 사용</span>
            </label>
          </div>
        </div>
        <button class="auto-sell-add-btn" id="addAutoSellBtn" type="button">예약판매 등록</button>
        <div class="auto-sell-list-wrap">
          <div class="auto-sell-list-head">등록된 예약판매</div>
          <div class="auto-sell-list" id="autoSellList"></div>
        </div>
      </div>

      <div id="autoBuyModeBox" class="hidden">
        <div class="auto-sell-grid">
          <div class="form-group">
            <label for="autoBuyTargetPrice">목표 매수가</label>
            <input id="autoBuyTargetPrice" type="number" min="1" step="1" />
          </div>
          <div class="form-group">
            <label for="autoBuyQty">수량</label>
            <input id="autoBuyQty" type="number" min="1" step="1" value="1" />
          </div>
          <div class="form-group">
            <label for="autoBuyBudget">예산 제한</label>
            <input id="autoBuyBudget" type="number" min="0" step="1" placeholder="비워두면 제한 없음" />
          </div>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input id="autoBuyMax" type="checkbox" />
              <span>가능한 최대 수량</span>
            </label>
          </div>
        </div>
        <button class="auto-sell-add-btn" id="addAutoBuyBtn" type="button">자동구매 등록</button>
        <div class="auto-sell-list-wrap">
          <div class="auto-sell-list-head">등록된 자동구매</div>
          <div class="auto-sell-list" id="autoBuyList"></div>
        </div>
      </div>
    `;
    orderPanel.appendChild(block);
  }

  if (!byId("adminOverlay")) {
    const overlay = document.createElement("div");
    overlay.id = "adminOverlay";
    overlay.className = "hidden";
    overlay.innerHTML = `
      <div id="adminModal" style="width:min(980px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;border-radius:24px;padding:20px;background:linear-gradient(180deg,rgba(14,25,50,.98),rgba(8,17,34,.98));border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 60px rgba(0,0,0,.45);color:#f5f8ff">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px">
          <h3 style="margin:0">관리자 모드</h3>
          <button id="closeAdminModalBtn" type="button" class="ghost-btn">닫기</button>
        </div>

        <div id="adminLoginBox" class="admin-block">
          <div style="color:#93a4c9;margin-bottom:12px">관리자 코드 입력 후 세부 설정을 즉시 반영할 수 있어요</div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <input id="adminCodeInput" type="password" placeholder="관리자 코드 입력" style="flex:1;min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px">
            <button id="adminLoginBtn" type="button" class="top-action-btn control-btn">입장</button>
          </div>
        </div>

        <div id="adminPanelBox" class="admin-block hidden" style="margin-top:14px">
          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px">
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">초기 자산<input id="adminInitialCash" type="number" min="1000" step="1000" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">긴급지원금<input id="adminSupportAmount" type="number" min="0" step="1000" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">지원 가능 현금 기준<input id="adminSupportLimit" type="number" min="0" step="1000" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">수수료율<input id="adminFeeRate" type="number" min="0" step="0.0001" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">변동성<input id="adminVolatility" type="number" min="0.2" step="0.1" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">뉴스 빈도<input id="adminNewsFreq" type="number" min="0.2" step="0.1" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
          </div>

          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px">
            <label class="checkbox-label"><input id="adminHighSpeedEnabled" type="checkbox"><span>100x / 200x / 300x 활성화</span></label>
            <label class="checkbox-label"><input id="adminDailyLimitEnabled" type="checkbox"><span>상한/하한 활성화</span></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">상한율<input id="adminUpperLimitRate" type="number" min="0.05" step="0.01" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
          </div>

          <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:12px">
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">하한율<input id="adminLowerLimitRate" type="number" min="0.05" step="0.01" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <button id="saveAdminSettingsBtn" type="button" class="top-action-btn control-btn">설정 반영</button>
            <button id="forceBaselineResetBtn" type="button" class="top-action-btn control-btn">수익률 기준 리셋</button>
          </div>

          <div style="display:grid;grid-template-columns:1.3fr 1fr auto;gap:12px;align-items:end;margin-top:12px">
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">종목 선택<select id="adminStockSelect" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></select></label>
            <label style="display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px">현재가 수정<input id="adminStockPrice" type="number" min="1" step="1" style="min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:#081224;color:#fff;padding:12px 14px"></label>
            <button id="applyAdminStockPriceBtn" type="button" class="top-action-btn control-btn">가격 반영</button>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
            <button id="adminCancelAllAutoSellBtn" type="button" class="top-action-btn control-btn">예약판매 전체 취소</button>
            <button id="adminCancelAllAutoBuyBtn" type="button" class="top-action-btn control-btn">자동구매 전체 취소</button>
            <button id="adminResetAllBtn" type="button" class="top-action-btn control-btn danger-btn">전체 데이터 초기화</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const style = document.createElement("style");
    style.textContent = `
      #adminOverlay{position:fixed;inset:0;background:rgba(2,8,20,.72);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:9999}
      #adminOverlay.hidden{display:none}
      .price-flash-up{animation:priceUp .55s ease}
      .price-flash-down{animation:priceDown .55s ease}
      @keyframes priceUp{0%{text-shadow:0 0 0 rgba(0,0,0,0)}50%{text-shadow:0 0 18px rgba(78,225,143,.65)}100%{text-shadow:0 0 0 rgba(0,0,0,0)}}
      @keyframes priceDown{0%{text-shadow:0 0 0 rgba(0,0,0,0)}50%{text-shadow:0 0 18px rgba(255,95,130,.65)}100%{text-shadow:0 0 0 rgba(0,0,0,0)}}
      @media (max-width:860px){#adminPanelBox > div{grid-template-columns:1fr !important}}
    `;
    document.head.appendChild(style);
  }

  collectEls();
}

function renderTop() {
  setText(els.totalAssetTop, formatKRW(totalAsset()));
  setText(els.profitLossTop, `${formatSignedKRW(baselineProfit())} (${formatSignedPct(baselineProfitRate())})`);
  setText(els.cashTop, formatKRW(state.portfolio.cash));
  setText(els.virtualClockChip, formatVirtualDateTime());

  if (els.profitLossTop) {
    els.profitLossTop.classList.remove("up", "down");
    els.profitLossTop.classList.add(baselineProfit() >= 0 ? "up" : "down");
  }
  if (els.alertBadge) els.alertBadge.textContent = String(state.alerts.length);
  if (els.supportFundBtn) {
    els.supportFundBtn.disabled = state.portfolio.cash > state.settings.supportFundCashLimit;
    els.supportFundBtn.textContent = `긴급지원금 +${Math.round(state.settings.supportFundAmount / 10000)}만원`;
  }
}

function renderHero() {
  const stock = selectedStock();
  if (!stock) return;

  setText(els.symbolLogo, stock.logo);
  setText(els.selectedName, stock.name);
  setText(els.selectedCode, `${stock.code} · ${stock.theme}`);
  setText(els.selectedPrice, formatKRW(stock.currentPrice));
  setText(els.selectedChange, `${formatSignedKRW(stockDiff(stock))} (${formatSignedPct(stockRate(stock))})`);
  setText(els.dayHigh, formatKRW(stock.dayHigh));
  setText(els.dayLow, formatKRW(stock.dayLow));
  setText(els.dayOpen, formatKRW(stock.openPrice));
  setText(els.dayVolume, formatVolume(stock.volume));

  if (els.selectedPrice) {
    els.selectedPrice.classList.remove("up", "down", "price-flash-up", "price-flash-down");
    els.selectedPrice.classList.add(stockDiff(stock) >= 0 ? "up" : "down");
    if (stock.flash === 1) els.selectedPrice.classList.add("price-flash-up");
    if (stock.flash === -1) els.selectedPrice.classList.add("price-flash-down");
  }
  if (els.selectedChange) {
    els.selectedChange.classList.remove("up", "down");
    els.selectedChange.classList.add(stockDiff(stock) >= 0 ? "up" : "down");
  }

  const mood = state.stocks.reduce((sum, s) => sum + Math.sign(stockRate(s)), 0);
  const moodPct = clamp(((mood + state.stocks.length) / (state.stocks.length * 2)) * 100, 0, 100);
  if (els.moodFill) els.moodFill.style.width = `${moodPct}%`;
  setText(
    els.moodText,
    mood >= 10 ? "지금은 매수 심리가 꽤 강한 분위기예요" :
    mood >= 3 ? "전체적으로 살짝 강한 흐름이에요" :
    mood > -3 ? "지금은 중립적인 분위기예요" :
    mood > -10 ? "조금 조심스러운 흐름이에요" :
    "매도 압력이 제법 강한 장이에요"
  );

  if (els.favoriteToggleBtn) {
    els.favoriteToggleBtn.textContent = state.favorites.includes(stock.code) ? "★" : "☆";
  }
  if (els.heroStockSelect) {
    els.heroStockSelect.innerHTML = state.stocks.map(s => `<option value="${s.code}">${s.name} · ${s.theme}</option>`).join("");
    els.heroStockSelect.value = stock.code;
  }
}

function renderPortfolio() {
  const unrealized = unrealizedProfit();

  setText(els.portfolioTotal, `${formatKRW(totalAsset())} · ${formatSignedPct(baselineProfitRate())}`);
  setText(els.portfolioPL, `${formatSignedKRW(baselineProfit())} (${formatSignedPct(baselineProfitRate())})`);
  if (els.portfolioPL) {
    els.portfolioPL.classList.remove("up", "down");
    els.portfolioPL.classList.add(baselineProfit() >= 0 ? "up" : "down");
  }

  setText(els.portfolioCash, formatKRW(state.portfolio.cash));
  setText(els.portfolioStockValue, formatKRW(stockValue()));
  setText(els.portfolioInvested, formatKRW(investedAmount()));
  setText(els.portfolioRate, formatSignedPct(baselineProfitRate()));
  setText(byId("portfolioAbsoluteRate"), formatSignedPct(absoluteProfitRate()));
  setText(byId("portfolioRealized"), formatSignedKRW(state.realizedProfit));
  setText(byId("portfolioBaselineRate"), formatSignedPct(baselineProfitRate()));
  setText(byId("portfolioUnrealized"), formatSignedKRW(unrealized));
}

function renderOrderbook() {
  const stock = selectedStock();
  if (!stock || !els.orderbookRows) return;

  const asks = stock.orderbook.filter(x => x.type === "ask").sort((a, b) => b.price - a.price);
  const bids = stock.orderbook.filter(x => x.type === "bid").sort((a, b) => b.price - a.price);
  const maxQty = Math.max(1, ...stock.orderbook.map(x => x.qty));

  const rows = [];
  for (let i = 0; i < 5; i++) {
    const ask = asks[i];
    const bid = bids[i];
    const showPrice = i === 4 ? stock.currentPrice : ask.price;
    rows.push(`
      <div class="orderbook-row">
        <div class="ask-cell">
          <span class="bar red" style="width:${(ask.qty / maxQty) * 100}%"></span>
          <b>${ask.qty.toLocaleString("ko-KR")}</b>
        </div>
        <div class="price-cell ${showPrice >= stock.prevClose ? "sell-color" : "buy-color"}">${formatKRW(showPrice)}</div>
        <div class="bid-cell">
          <span class="bar blue" style="width:${(bid.qty / maxQty) * 100}%"></span>
          <b>${bid.qty.toLocaleString("ko-KR")}</b>
        </div>
      </div>
    `);
  }
  els.orderbookRows.innerHTML = rows.join("");
}

function renderSelectedNews() {
  const stock = selectedStock();
  if (!stock || !els.selectedNewsFeed) return;

  const list = state.news.filter(n => n.code === stock.code).slice(0, 12);
  setText(els.selectedNewsTitleName, stock.name);
  setText(els.selectedNewsCount, `${list.length}건`);

  if (!list.length) {
    els.selectedNewsFeed.innerHTML = `<div class="news-card"><div class="news-title">${stock.name}</div><div class="news-desc">아직 종목 뉴스가 없어요.</div></div>`;
    return;
  }

  els.selectedNewsFeed.innerHTML = list.map(n => `
    <div class="news-card">
      <div class="news-top">
        <span class="news-type ${n.type}">${typeLabel(n.type)}</span>
        <span class="news-time">${n.time}</span>
      </div>
      <div class="news-title">${n.name}</div>
      <div class="news-desc">${n.text}</div>
    </div>
  `).join("");
}

function renderNews() {
  if (!els.newsFeed) return;
  setText(els.newsCountChip, `${state.news.length}건`);
  if (!state.news.length) {
    els.newsFeed.innerHTML = `<div class="news-card"><div class="news-title">뉴스 없음</div><div class="news-desc">아직 뉴스가 없어요.</div></div>`;
    return;
  }
  els.newsFeed.innerHTML = state.news.map(n => `
    <div class="news-card">
      <div class="news-top">
        <span class="news-type ${n.type}">${typeLabel(n.type)}</span>
        <span class="news-time">${n.time}</span>
      </div>
      <div class="news-title">${n.name}</div>
      <div class="news-desc">${n.text}</div>
    </div>
  `).join("");
}

function renderHistory() {
  if (els.orderHistoryList) {
    els.orderHistoryList.innerHTML = state.orderHistory.length ? state.orderHistory.map(item => `
      <div class="history-card">
        <div class="history-card-top">
          <span class="history-type ${item.type === "buy" ? "good" : "warn"}">${item.type === "buy" ? "매수" : "매도"}</span>
          <span class="history-time">${item.time}</span>
        </div>
        <div class="history-main">${item.stockName} ${formatQty(item.qty)}</div>
        <div class="history-sub">${formatKRW(item.price)} / 수수료 ${formatKRW(item.fee)} / ${item.reason || ""}</div>
      </div>
    `).join("") : `<div class="history-card"><div class="history-main">아직 주문 기록이 없어요</div></div>`;
  }

  if (els.alertHistoryList) {
    els.alertHistoryList.innerHTML = state.alerts.length ? state.alerts.map(item => `
      <div class="history-card">
        <div class="history-card-top">
          <span class="history-type ${item.tone === "up" ? "good" : item.tone === "down" ? "warn" : "event"}">${item.tone === "up" ? "상승" : item.tone === "down" ? "하락" : "알림"}</span>
          <span class="history-time">${item.time}</span>
        </div>
        <div class="history-main">${item.text}</div>
      </div>
    `).join("") : `<div class="history-card"><div class="history-main">아직 알림이 없어요</div></div>`;
  }

  if (els.orderHistoryList) els.orderHistoryList.classList.toggle("hidden", state.historyTab !== "orders");
  if (els.alertHistoryList) els.alertHistoryList.classList.toggle("hidden", state.historyTab !== "alerts");
  qa(".history-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.historyTab === state.historyTab));
}

function filteredStocks() {
  const list = [...state.stocks];
  if (state.sortBy === "change") list.sort((a, b) => stockRate(b) - stockRate(a));
  if (state.sortBy === "volume") list.sort((a, b) => b.volume - a.volume);
  return list;
}

function renderWatchlist() {
  if (!els.watchlist) return;
  els.watchlist.innerHTML = filteredStocks().map(stock => `
    <button type="button" class="watch-item ${stock.code === state.selectedCode ? "active" : ""}" data-code="${stock.code}">
      <div class="watch-left">
        <div class="watch-name-row">
          <span class="watch-logo">${stock.logo}</span>
          <div>
            <div class="watch-name">${stock.name}</div>
            <div class="watch-theme">${stock.theme}</div>
          </div>
        </div>
      </div>
      <div class="watch-right">
        <div class="watch-price ${stockDiff(stock) >= 0 ? "positive" : "negative"}">${formatKRW(stock.currentPrice)}</div>
        <div class="watch-rate ${stockDiff(stock) >= 0 ? "positive" : "negative"}">${formatSignedPct(stockRate(stock))}</div>
        <div class="watch-mini">거래량 ${formatVolume(stock.volume)}</div>
      </div>
    </button>
  `).join("");

  qa(".watch-item", els.watchlist).forEach(btn => {
    addEvent(btn, "click", () => {
      state.selectedCode = btn.dataset.code;
      render(true);
      queueSave();
    });
  });
}

function renderSpeedButtons() {
  if (!els.speedButtons) return;
  const speeds = [1,2,5,10,20,50];
  if (state.isAdmin && state.settings.adminHighSpeedEnabled) speeds.push(100,200,300);

  els.speedButtons.innerHTML = speeds.map(speed =>
    `<button type="button" data-speed="${speed}" class="${state.speed === speed ? "active" : ""}">${speed}x</button>`
  ).join("");

  qa("button", els.speedButtons).forEach(btn => {
    addEvent(btn, "click", () => {
      state.speed = toInt(btn.dataset.speed, 1);
      renderSpeedButtons();
      restartTick();
      queueSave();
    });
  });
}

function setOrderMode(mode) {
  state.orderMode = mode === "sell" ? "sell" : "buy";
  if (els.buyModeBtn) els.buyModeBtn.classList.toggle("active", state.orderMode === "buy");
  if (els.sellModeBtn) els.sellModeBtn.classList.toggle("active", state.orderMode === "sell");
  if (els.submitOrderBtn) {
    els.submitOrderBtn.textContent = state.orderMode === "buy" ? "매수 실행" : "매도 실행";
    els.submitOrderBtn.classList.toggle("buy", state.orderMode === "buy");
    els.submitOrderBtn.classList.toggle("sell", state.orderMode === "sell");
  }

  const autoModeTitle = byId("autoModeTitle");
  const autoModeDesc = byId("autoModeDesc");
  const autoSellModeBox = byId("autoSellModeBox");
  const autoBuyModeBox = byId("autoBuyModeBox");

  if (state.orderMode === "buy") {
    if (autoModeTitle) autoModeTitle.textContent = "자동구매 · 예약구매";
    if (autoModeDesc) autoModeDesc.textContent = "원하는 가격까지 내려오면 자동으로 매수할 수 있어요";
    if (autoSellModeBox) autoSellModeBox.classList.add("hidden");
    if (autoBuyModeBox) autoBuyModeBox.classList.remove("hidden");
  } else {
    if (autoModeTitle) autoModeTitle.textContent = "예약판매 · 자동매도";
    if (autoModeDesc) autoModeDesc.textContent = "원하는 가격에 도달하면 자동으로 매도할 수 있어요";
    if (autoSellModeBox) autoSellModeBox.classList.remove("hidden");
    if (autoBuyModeBox) autoBuyModeBox.classList.add("hidden");
  }

  updateOrderInputs();
}

function updateQuickButtons(maxBuyQty, holdingQty) {
  if (!els.quickRow) return;

  const base = state.orderMode === "buy" ? maxBuyQty : holdingQty;
  const values = [
    Math.max(1, Math.floor(base * 0.10)),
    Math.max(1, Math.floor(base * 0.25)),
    Math.max(1, Math.floor(base * 0.50)),
    Math.max(1, Math.floor(base * 0.75)),
    Math.max(1, Math.floor(base * 1.00))
  ];
  const labels = ["10%", "25%", "50%", "75%", "100%"];

  els.quickRow.innerHTML = labels.map((label, idx) => `<button type="button" data-qty="${values[idx]}">${label}</button>`).join("");

  qa("button", els.quickRow).forEach(btn => {
    addEvent(btn, "click", () => {
      if (els.orderQty) els.orderQty.value = String(Math.max(1, toInt(btn.dataset.qty, 1)));
      updateOrderInputs();
    });
  });
}

function updateOrderInputs() {
  const stock = selectedStock();
  if (!stock) return;

  if (els.orderPrice) {
    els.orderPrice.value = String(stock.currentPrice);
    els.orderPrice.readOnly = true;
  }

  const holding = holdingOf(stock.code);
  const maxBuyQty = Math.max(0, Math.floor(state.portfolio.cash / (stock.currentPrice + feeOf(stock.currentPrice))));
  let qty = Math.max(1, toInt(els.orderQty?.value, 1));

  if (state.orderMode === "sell" && holding.qty > 0 && qty > holding.qty) {
    qty = holding.qty;
    if (els.orderQty) els.orderQty.value = String(qty);
  }

  const amount = stock.currentPrice * qty;
  const fee = feeOf(amount);

  setText(els.holdingQtyInline, formatQty(holding.qty));
  setText(els.avgPriceInline, formatKRW(holding.avgPrice));
  setText(els.availableCash, formatKRW(state.portfolio.cash));
  setText(els.maxBuyQty, formatQty(maxBuyQty));
  setText(els.currentHoldingQty, formatQty(holding.qty));
  setText(els.currentAvgPrice, formatKRW(holding.avgPrice));
  setText(els.currentTradePriceLabel, formatKRW(stock.currentPrice));
  setText(els.estimatedCost, formatKRW(amount));
  setText(els.estimatedFee, formatKRW(fee));

  updateQuickButtons(maxBuyQty, holding.qty);
}

function submitOrder() {
  const stock = selectedStock();
  if (!stock) return;
  const qty = Math.max(1, toInt(els.orderQty?.value, 1));

  if (state.orderMode === "buy") {
    if (executeBuy(stock.code, qty, stock.currentPrice, "현재가 매수")) {
      toast(`${stock.name} ${qty}주 매수 완료`);
    }
  } else {
    if (executeSell(stock.code, qty, stock.currentPrice, "현재가 매도")) {
      toast(`${stock.name} ${qty}주 매도 완료`);
    }
  }

  updateOrderInputs();
  render(true);
  queueSave();
}

function addAutoSellOrder() {
  const stock = selectedStock();
  if (!stock) return;

  const targetPrice = Math.max(0, toInt(els.autoSellTargetPrice?.value, 0));
  const stopPrice = Math.max(0, toInt(els.autoSellStopPrice?.value, 0));
  const qty = Math.max(1, toInt(els.autoSellQty?.value, 1));
  const all = !!els.autoSellAll?.checked;

  if (!targetPrice && !stopPrice) {
    toast("목표가나 손절가 중 하나는 입력해 주세요.");
    return;
  }

  state.autoSellOrders.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    code: stock.code,
    targetPrice,
    stopPrice,
    qty,
    all
  });
  state.autoSellOrders = state.autoSellOrders.slice(0, 120);
  renderAutoLists();
  queueSave();
}

function addAutoBuyOrder() {
  const stock = selectedStock();
  if (!stock) return;

  const targetPrice = Math.max(1, toInt(els.autoBuyTargetPrice?.value, 0));
  const qty = Math.max(1, toInt(els.autoBuyQty?.value, 1));
  const budgetLimit = Math.max(0, toInt(els.autoBuyBudget?.value, 0));
  const useMax = !!els.autoBuyMax?.checked;

  if (targetPrice <= 0) {
    toast("목표 매수가를 입력해 주세요.");
    return;
  }

  state.autoBuyOrders.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    code: stock.code,
    targetPrice,
    qty,
    budgetLimit,
    useMax
  });
  state.autoBuyOrders = state.autoBuyOrders.slice(0, 120);
  renderAutoLists();
  queueSave();
}

function renderAutoLists() {
  if (els.autoSellList) {
    if (!state.autoSellOrders.length) {
      els.autoSellList.innerHTML = `<div class="auto-sell-item"><div class="auto-sell-item-main">등록된 예약판매가 없어요</div></div>`;
    } else {
      els.autoSellList.innerHTML = state.autoSellOrders.map(item => {
        const stock = state.stocks.find(s => s.code === item.code);
        return `
          <div class="auto-sell-item">
            <div class="auto-sell-item-main">
              <div>${stock?.name || item.code}</div>
              <div>목표가 ${item.targetPrice ? formatKRW(item.targetPrice) : "-"}</div>
              <div>손절가 ${item.stopPrice ? formatKRW(item.stopPrice) : "-"}</div>
              <div>${item.all ? "전량" : formatQty(item.qty)}</div>
            </div>
            <button class="ghost-btn" type="button" data-auto-sell-del="${item.id}">삭제</button>
          </div>
        `;
      }).join("");
    }

    qa("[data-auto-sell-del]", els.autoSellList).forEach(btn => {
      addEvent(btn, "click", () => {
        state.autoSellOrders = state.autoSellOrders.filter(x => x.id !== btn.dataset.autoSellDel);
        renderAutoLists();
        queueSave();
      });
    });
  }

  if (els.autoBuyList) {
    if (!state.autoBuyOrders.length) {
      els.autoBuyList.innerHTML = `<div class="auto-sell-item"><div class="auto-sell-item-main">등록된 자동구매가 없어요</div></div>`;
    } else {
      els.autoBuyList.innerHTML = state.autoBuyOrders.map(item => {
        const stock = state.stocks.find(s => s.code === item.code);
        return `
          <div class="auto-sell-item">
            <div class="auto-sell-item-main">
              <div>${stock?.name || item.code}</div>
              <div>목표 매수가 ${formatKRW(item.targetPrice)}</div>
              <div>${item.useMax ? "가능한 최대 수량" : formatQty(item.qty)}</div>
              <div>${item.budgetLimit > 0 ? `예산 ${formatKRW(item.budgetLimit)}` : "예산 제한 없음"}</div>
            </div>
            <button class="ghost-btn" type="button" data-auto-buy-del="${item.id}">삭제</button>
          </div>
        `;
      }).join("");
    }

    qa("[data-auto-buy-del]", els.autoBuyList).forEach(btn => {
      addEvent(btn, "click", () => {
        state.autoBuyOrders = state.autoBuyOrders.filter(x => x.id !== btn.dataset.autoBuyDel);
        renderAutoLists();
        queueSave();
      });
    });
  }
}

function getChartSeries(stock) {
  if (!stock) return [];
  const short = stock.history || [];
  const long = stock.historyLong || short;

  if (state.chartRange === "1m") return short.slice(-60);
  if (state.chartRange === "5m") return short.slice(-100);
  if (state.chartRange === "1d") return short.slice(-180);
  if (state.chartRange === "1w") return long.slice(-300);
  if (state.chartRange === "1y") return long.filter((_, i) => i % 2 === 0).slice(-500);
  if (state.chartRange === "10y") return long.filter((_, i) => i % 5 === 0).slice(-600);
  if (state.chartRange === "100y") return long.filter((_, i) => i % 10 === 0).slice(-700);
  return short.slice(-100);
}

function movingAverage(series, period) {
  return series.map((_, idx) => {
    if (idx < period - 1) return null;
    const slice = series.slice(idx - period + 1, idx + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function drawLine(ctx, values, xOf, yOf, color, width = 1.5) {
  ctx.beginPath();
  let started = false;
  values.forEach((v, i) => {
    if (v == null) return;
    const x = xOf(i);
    const y = yOf(v);
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawChart() {
  const canvas = els.priceChart;
  if (!canvas || !canvas.getContext) return;
  const stock = selectedStock();
  if (!stock) return;

  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 900;
  const height = 600;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const series = getChartSeries(stock);
  if (!series.length) return;

  const ma5 = movingAverage(series, 5);
  const ma20 = movingAverage(series, 20);
  const ma60 = movingAverage(series, 60);

  ctx.clearRect(0, 0, width, height);

  const padding = { top: 42, right: 36, bottom: 52, left: 52 };
  const w = width - padding.left - padding.right;
  const h = height - padding.top - padding.bottom;
  const min = Math.min(...series) * 0.98;
  const max = Math.max(...series) * 1.02;
  const xOf = i => padding.left + (i / Math.max(1, series.length - 1)) * w;
  const yOf = v => padding.top + (1 - (v - min) / (max - min || 1)) * h;

  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = padding.top + (h / 3) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + w, y);
    ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const x = padding.left + (w / 3) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + h);
    ctx.stroke();
  }

  const up = stockRate(stock) >= 0;
  const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + h);
  grad.addColorStop(0, up ? "rgba(78,225,143,.20)" : "rgba(255,95,130,.18)");
  grad.addColorStop(1, "rgba(255,255,255,0)");

  ctx.beginPath();
  series.forEach((v, i) => {
    const x = xOf(i);
    const y = yOf(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xOf(series.length - 1), padding.top + h);
  ctx.lineTo(xOf(0), padding.top + h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  drawLine(ctx, series, xOf, yOf, up ? "#50f0a9" : "#ff6b89", 2);
  drawLine(ctx, ma5, xOf, yOf, "#ff84a1", 1);
  drawLine(ctx, ma20, xOf, yOf, "#ffc94d", 1);
  drawLine(ctx, ma60, xOf, yOf, "#8e7dff", 1);

  ctx.fillStyle = "rgba(255,255,255,.65)";
  ctx.font = "12px Segoe UI, Apple SD Gothic Neo, Malgun Gothic, sans-serif";
  ctx.fillText(stock.name, padding.left, 22);
  ctx.fillText(`${formatSignedPct(stockRate(stock))} · 시가 ${formatKRW(stock.openPrice)} · 가상 ${formatVirtualDateTime()}`, padding.left, height - 14);

  bindChartTooltip(series, xOf, yOf, stock, width, height);
}

function bindChartTooltip(series, xOf, yOf, stock, width, height) {
  const canvas = els.priceChart;
  const tooltip = els.chartTooltip;
  if (!canvas || !tooltip || !series.length) return;

  canvas.onmousemove = e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rel = clamp(x / rect.width, 0, 1);
    const idx = Math.round(rel * (series.length - 1));
    const price = series[idx];
    const base = series[0];
    const pct = base > 0 ? ((price - base) / base) * 100 : 0;
    const volHint = Math.round((stock.volume / series.length) * (0.6 + idx / series.length));

    tooltip.classList.remove("hidden");
    tooltip.innerHTML = `
      <div><b>${stock.name}</b></div>
      <div>시점 가격: ${formatKRW(price)}</div>
      <div class="${pct >= 0 ? "up" : "down"}">등락률: ${formatSignedPct(pct)}</div>
      <div>거래량 느낌: ${formatVolume(volHint)}</div>
      <div>인덱스: ${idx + 1} / ${series.length}</div>
      <div>가상시간: ${formatVirtualDateTime()}</div>
    `;

    const left = clamp(xOf(idx) + 14, 8, width - 220);
    const top = clamp(yOf(price) - 98, 8, height - 150);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  canvas.onmouseleave = () => {
    tooltip.classList.add("hidden");
  };
}

function renderHistoryTabs() {
  qa(".history-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.historyTab === state.historyTab));
}
function renderChartTabs() {
  qa(".tab-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.chartRange === state.chartRange));
}
function renderSortButtons() {
  qa(".sort-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.sort === state.sortBy));
}

function renderAdminPanelState() {
  if (!state.isAdmin) return;
  if (els.adminInitialCash) els.adminInitialCash.value = state.settings.initialCash;
  if (els.adminSupportAmount) els.adminSupportAmount.value = state.settings.supportFundAmount;
  if (els.adminSupportLimit) els.adminSupportLimit.value = state.settings.supportFundCashLimit;
  if (els.adminFeeRate) els.adminFeeRate.value = state.settings.feeRate;
  if (els.adminVolatility) els.adminVolatility.value = state.settings.globalVolatility;
  if (els.adminNewsFreq) els.adminNewsFreq.value = state.settings.newsFrequency;
  if (els.adminHighSpeedEnabled) els.adminHighSpeedEnabled.checked = !!state.settings.adminHighSpeedEnabled;
  if (els.adminDailyLimitEnabled) els.adminDailyLimitEnabled.checked = !!state.settings.dailyLimitEnabled;
  if (els.adminUpperLimitRate) els.adminUpperLimitRate.value = state.settings.upperLimitRate;
  if (els.adminLowerLimitRate) els.adminLowerLimitRate.value = state.settings.lowerLimitRate;

  if (els.adminStockSelect) {
    els.adminStockSelect.innerHTML = state.stocks.map(s => `<option value="${s.code}">${s.name}</option>`).join("");
    els.adminStockSelect.value = state.selectedCode;
  }
  if (els.adminStockPrice) {
    const s = selectedStock();
    els.adminStockPrice.value = s ? s.currentPrice : "";
  }
}

function render(shouldDrawChart = true) {
  renderTop();
  renderHero();
  renderPortfolio();
  renderOrderbook();
  renderSelectedNews();
  renderNews();
  renderHistory();
  renderWatchlist();
  renderAutoLists();
  renderSpeedButtons();
  renderSortButtons();
  renderChartTabs();
  renderHistoryTabs();
  updateOrderInputs();
  setOrderMode(state.orderMode);
  if (shouldDrawChart) drawChart();
  renderAdminPanelState();
}

function claimSupportFund() {
  if (state.portfolio.cash > state.settings.supportFundCashLimit) {
    toast(`현금이 ${formatKRW(state.settings.supportFundCashLimit)} 이하일 때만 가능해요.`);
    return;
  }
  state.portfolio.cash += state.settings.supportFundAmount;
  toast(`${formatKRW(state.settings.supportFundAmount)} 지급 완료`);
  render(true);
  queueSave();
}

function resetBaseline() {
  state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() };
  toast("현재 총자산 기준으로 수익률 기준이 리셋됐어요.");
  render(true);
  queueSave();
}

function resetAllData() {
  if (!confirm("전체 데이터를 초기화할까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  defaultState();
  injectExtraUI();
  collectEls();
  bindDynamicEvents();
  render(true);
  restartTick();
}

function toggleFavorite() {
  const code = state.selectedCode;
  const idx = state.favorites.indexOf(code);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.unshift(code);
  state.favorites = state.favorites.slice(0, 20);
  renderHero();
  queueSave();
}

function doExportSave() {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify(exportStatePayload()))));
  window.prompt("아래 저장 문자열을 복사해 두세요.", payload);
}

function doImportSave() {
  const raw = window.prompt("저장 문자열을 붙여넣어 주세요.");
  if (!raw) return;
  try {
    const json = decodeURIComponent(escape(atob(raw.trim())));
    const parsed = JSON.parse(json);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    loadState();
    render(true);
    restartTick();
    toast("불러오기가 완료됐어요.");
  } catch {
    toast("불러오기 문자열이 올바르지 않아요.");
  }
}

function bindDynamicEvents() {
  addEvent(els.heroStockSelect, "change", () => {
    state.selectedCode = els.heroStockSelect.value;
    render(true);
    queueSave();
  });

  addEvent(els.favoriteToggleBtn, "click", toggleFavorite);
  addEvent(els.buyModeBtn, "click", () => setOrderMode("buy"));
  addEvent(els.sellModeBtn, "click", () => setOrderMode("sell"));
  addEvent(els.orderQty, "input", updateOrderInputs);
  addEvent(els.submitOrderBtn, "click", submitOrder);
  addEvent(els.addAutoSellBtn, "click", addAutoSellOrder);
  addEvent(els.addAutoBuyBtn, "click", addAutoBuyOrder);

  addEvent(els.resetBaselineBtn, "click", resetBaseline);
  addEvent(els.toggleActiveOrdersBtn, "click", () => {
    state.autoSellOrders = [];
    state.autoBuyOrders = [];
    renderAutoLists();
    queueSave();
  });

  addEvent(els.saveSlotBtn, "click", doExportSave);
  addEvent(els.loadSlotBtn, "click", doImportSave);

  qa(".history-tab").forEach(btn => {
    addEvent(btn, "click", () => {
      state.historyTab = btn.dataset.historyTab;
      renderHistory();
      queueSave();
    });
  });

  qa(".sort-btn").forEach(btn => {
    addEvent(btn, "click", () => {
      state.sortBy = btn.dataset.sort;
      renderSortButtons();
      renderWatchlist();
      queueSave();
    });
  });

  qa(".tab-btn").forEach(btn => {
    addEvent(btn, "click", () => {
      state.chartRange = btn.dataset.chartRange;
      renderChartTabs();
      drawChart();
      queueSave();
    });
  });

  addEvent(els.clearHistoryBtn, "click", () => {
    if (state.historyTab === "orders") state.orderHistory = [];
    else state.alerts = [];
    renderHistory();
    queueSave();
  });

  addEvent(els.adminEntryBtn, "click", () => {
    if (!state.isAdmin) {
      els.adminOverlay?.classList.remove("hidden");
      els.adminLoginBox?.classList.remove("hidden");
      els.adminPanelBox?.classList.add("hidden");
      return;
    }
    els.adminOverlay?.classList.remove("hidden");
    els.adminPanelBox?.classList.remove("hidden");
    renderAdminPanelState();
  });

  addEvent(els.closeAdminModalBtn, "click", () => {
    els.adminOverlay?.classList.add("hidden");
  });

  addEvent(els.adminLoginBtn, "click", () => {
    if ((els.adminCodeInput?.value || "").trim() !== ADMIN_CODE) {
      toast("관리자 코드가 올바르지 않아요.");
      return;
    }
    state.isAdmin = true;
    els.adminEntryBtn?.classList.add("active-admin");
    if (els.adminEntryBtn) els.adminEntryBtn.textContent = "관리자 ON";
    els.adminLoginBox?.classList.add("hidden");
    els.adminPanelBox?.classList.remove("hidden");
    renderAdminPanelState();
    renderSpeedButtons();
    queueSave();
  });

  addEvent(els.adminStockSelect, "change", () => {
    const stock = state.stocks.find(s => s.code === els.adminStockSelect.value);
    if (stock && els.adminStockPrice) els.adminStockPrice.value = stock.currentPrice;
  });

  addEvent(els.saveAdminSettingsBtn, "click", () => {
    if (!state.isAdmin) return;
    state.settings.initialCash = Math.max(10000, toInt(els.adminInitialCash?.value, state.settings.initialCash));
    state.settings.supportFundAmount = Math.max(0, toInt(els.adminSupportAmount?.value, state.settings.supportFundAmount));
    state.settings.supportFundCashLimit = Math.max(0, toInt(els.adminSupportLimit?.value, state.settings.supportFundCashLimit));
    state.settings.feeRate = clamp(toNum(els.adminFeeRate?.value, state.settings.feeRate), 0, 0.1);
    state.settings.globalVolatility = clamp(toNum(els.adminVolatility?.value, state.settings.globalVolatility), 0.2, 10);
    state.settings.newsFrequency = clamp(toNum(els.adminNewsFreq?.value, state.settings.newsFrequency), 0.2, 10);
    state.settings.adminHighSpeedEnabled = !!els.adminHighSpeedEnabled?.checked;
    state.settings.dailyLimitEnabled = !!els.adminDailyLimitEnabled?.checked;
    state.settings.upperLimitRate = clamp(toNum(els.adminUpperLimitRate?.value, state.settings.upperLimitRate), 0.05, 10);
    state.settings.lowerLimitRate = clamp(toNum(els.adminLowerLimitRate?.value, state.settings.lowerLimitRate), 0.05, 0.99);

    if (state.speed > 50 && !state.settings.adminHighSpeedEnabled) state.speed = 50;

    renderSpeedButtons();
    restartTick();
    render(true);
    queueSave();
    toast("관리자 설정이 반영됐어요.");
  });

  addEvent(els.applyAdminStockPriceBtn, "click", () => {
    if (!state.isAdmin) return;
    const code = els.adminStockSelect?.value || state.selectedCode;
    const stock = state.stocks.find(s => s.code === code);
    const price = Math.max(1, toInt(els.adminStockPrice?.value, 0));
    if (!stock || price <= 0) return;

    stock.currentPrice = price;
    stock.dayHigh = Math.max(stock.dayHigh, price);
    stock.dayLow = Math.min(stock.dayLow, price);
    stock.history.push(price);
    if (stock.history.length > 240) stock.history.shift();
    stock.historyLong.push(price);
    if (stock.historyLong.length > 3000) stock.historyLong.shift();
    buildOrderbook(stock);

    if (state.selectedCode === code) render(true);
    else render(false);
    queueSave();
    toast(`${stock.name} 현재가를 ${formatKRW(price)}로 반영했어요.`);
  });

  addEvent(els.forceBaselineResetBtn, "click", resetBaseline);
  addEvent(els.adminCancelAllAutoSellBtn, "click", () => {
    state.autoSellOrders = [];
    renderAutoLists();
    queueSave();
  });
  addEvent(els.adminCancelAllAutoBuyBtn, "click", () => {
    state.autoBuyOrders = [];
    renderAutoLists();
    queueSave();
  });
  addEvent(els.adminResetAllBtn, "click", resetAllData);

  window.addEventListener("resize", drawChart);
}

function bindStaticTopEvents() {
  addEvent(els.supportFundBtn, "click", claimSupportFund);
  addEvent(els.pauseBtn, "click", () => {
    state.isPaused = true;
    state.isStopped = false;
  });
  addEvent(els.resumeBtn, "click", () => {
    state.isPaused = false;
    state.isStopped = false;
  });
  addEvent(els.stopBtn, "click", () => {
    state.isStopped = !state.isStopped;
    if (!state.isStopped) state.isPaused = false;
  });
  addEvent(els.resetBtn, "click", resetAllData);
}

function init() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
    return;
  }

  loadState();
  injectExtraUI();
  collectEls();
  bindStaticTopEvents();
  bindDynamicEvents();
  setOrderMode(state.orderMode);
  render(true);
  restartTick();
}

init();
