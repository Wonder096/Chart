const STORAGE_KEY = "k_mock_pro_v35";

const DEFAULT_SETTINGS = {
  initialCash: 1000000,
  supportFundAmount: 500000,
  supportFundCashLimit: 500000,
  feeRate: 0.0015,
  upperLimitRate: 0.3,
  lowerLimitRate: 0.3,
  dailyLimitEnabled: true
};

const CHART_RANGES = ["1m", "5m", "1d", "1w", "1y", "10y", "100y"];

const STOCK_BLUEPRINTS = [
  ["KQ001", "한강테크", "한", "AI 반도체", 48200, "mid", "momentum"],
  ["KQ002", "네오바이오", "네", "바이오 신약", 32150, "mid", "news"],
  ["KQ003", "블루모빌리티", "블", "전기차 부품", 187000, "large", "cyclical"],
  ["KQ004", "코어엔터", "코", "엔터/플랫폼", 12950, "mid", "momentum"],
  ["KQ005", "스카이로직스", "스", "물류 자동화", 85300, "mid", "stable"],
  ["KQ006", "오로라게임즈", "오", "게임/콘텐츠", 56700, "mid", "theme"],
  ["KQ007", "에코플랜트", "에", "친환경 소재", 104500, "mid", "stable"],
  ["KQ008", "미래핀테크", "미", "핀", 72200, "mid", "news"],
  ["KQ009", "제니스AI", "제", "초거대 AI", 243500, "large", "momentum"],
  ["KQ010", "라이트메드", "라", "헬스케어", 41550, "mid", "news"],
  ["KQ011", "웨이브로보틱스", "웨", "로봇", 96400, "large", "theme"],
  ["KQ012", "트리온클라우드", "트", "클라우드", 138800, "large", "stable"],
  ["KQ013", "초록에너지", "초", "신재생", 16350, "mid", "theme"],
  ["KQ014", "다올반도체", "다", "메모리", 9100, "mid", "cyclical"],
  ["KQ015", "나래커머스", "나", "이커머스", 2780, "cheap", "momentum"],
  ["KQ016", "성운광학", "성", "광학장비", 506000, "expensive", "stable"],
  ["KQ017", "큐브로직", "큐", "보안", 66900, "mid", "stable"],
  ["KQ018", "바이오엣지", "바", "유전자", 1450, "cheap", "news"],
  ["KQ019", "마이크로링크", "마", "IoT", 860, "cheap", "momentum"],
  ["KQ020", "프라임홀딩스", "프", "금융", 1030000, "premium", "stable"],
  ["KQ021", "루멘미디어", "루", "미디어", 6350, "cheap", "theme"],
  ["KQ022", "하이젠소프트", "하", "기업용 소프트웨어", 199500, "large", "stable"],
  ["KQ023", "솔라트론", "솔", "태양광", 118000, "large", "cyclical"],
  ["KQ024", "피닉스소재", "피", "2차전지", 352000, "large", "theme"],
  ["KQ025", "유니온푸드", "유", "식품", 59000, "mid", "stable"],
  ["KQ026", "센텀칩스", "센", "팹리스", 715000, "expensive", "momentum"],
  ["KQ027", "원픽엔진", "원", "엔진", 500, "cheap", "momentum"],
  ["KQ028", "엘릭서메디", "엘", "제약 플랫폼", 982000, "premium", "news"],
  ["KQ029", "제로클라우드", "제로", "AI 인프라", 425000, "expensive", "theme"],
  ["KQ030", "아틀라스모터스", "아", "미래 모빌리티", 1105000, "premium", "cyclical"]
];

const state = {
  speed: 1,
  selectedCode: "KQ001",
  orderMode: "buy",
  sortBy: "change",
  chartRange: "1m",
  historyTab: "orders",
  isPaused: false,
  isStopped: false,
  settings: { ...DEFAULT_SETTINGS },
  baseline: { totalAsset: DEFAULT_SETTINGS.initialCash, startedAt: Date.now() },
  realizedProfit: 0,
  portfolio: { cash: DEFAULT_SETTINGS.initialCash, holdings: {} },
  favorites: ["KQ001", "KQ006", "KQ009"],
  stocks: [],
  news: [],
  alerts: [],
  orderHistory: [],
  conditionalSellOrders: [],
  conditionalBuyOrders: [],
  virtualTime: Date.now(),
  virtualDateKey: "",
  searchQuery: "",
  lastChartDrawAt: 0,
  chartTick: 0
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
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function safeParse(raw, fallback) { try { return JSON.parse(raw); } catch { return fallback; } }

function formatKRW(v) { return `${Math.round(toNum(v)).toLocaleString("ko-KR")}원`; }
function formatSignedKRW(v) { const n = Math.round(toNum(v)); return `${n >= 0 ? "+" : ""}${n.toLocaleString("ko-KR")}원`; }
function formatSignedPct(v) { const n = toNum(v); return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`; }
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
function dateKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatVirtualDateTime() {
  const d = new Date(state.virtualTime || Date.now());
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function feeOf(amount) { return Math.round(toNum(amount) * toNum(state.settings.feeRate, DEFAULT_SETTINGS.feeRate)); }
function totalWithFee(price, qty) { const amount = Math.max(0, toNum(price)) * Math.max(0, toInt(qty)); return amount + feeOf(amount); }
function maxAffordableQty(cash, price) {
  const c = Math.max(0, toNum(cash));
  const p = Math.max(1, toNum(price));
  let qty = Math.floor(c / (p * (1 + state.settings.feeRate)));
  qty = Math.max(0, qty);
  while (qty > 0 && totalWithFee(p, qty) > c) qty -= 1;
  while (totalWithFee(p, qty + 1) <= c) qty += 1;
  return qty;
}

function makeStock([code, name, logo, theme, base, priceClass, style]) {
  const volMap = { cheap: 0.028, mid: 0.016, large: 0.010, expensive: 0.007, premium: 0.0055 };
  let p = base;
  const history = [];
  for (let i = 0; i < 180; i++) {
    p = Math.max(1, Math.round(p * (1 + rand(-0.009, 0.009))));
    history.push(p);
  }
  return {
    code, name, logo, theme, priceClass, style,
    prevClose: base,
    openPrice: base,
    currentPrice: history[history.length - 1] || base,
    dayHigh: Math.max(base, ...history),
    dayLow: Math.min(base, ...history),
    volume: randInt(20000, 260000),
    history,
    historyLong: history.slice(-180),
    volatility: volMap[priceClass] || 0.015,
    momentum: rand(-0.4, 0.4),
    eventBias: 0,
    eventTicks: 0,
    orderbook: [],
    flash: 0,
    viActive: false,
    viResumePrice: 0,
    fixedPrice: false
  };
}

function buildOrderbook(stock) {
  const p = Math.max(1, stock.currentPrice);
  const step = p < 1000 ? 1 : p < 5000 ? 2 : p < 20000 ? 5 : p < 100000 ? 10 : p < 500000 ? 50 : 100;
  const rows = [];
  for (let i = 4; i >= 0; i--) {
    rows.push({
      askQty: randInt(500, 2800),
      price: Math.max(1, p + step * i),
      bidQty: randInt(500, 2800)
    });
  }
  stock.orderbook = rows;
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
  state.settings = { ...DEFAULT_SETTINGS };
  state.baseline = { totalAsset: DEFAULT_SETTINGS.initialCash, startedAt: Date.now() };
  state.realizedProfit = 0;
  state.portfolio = { cash: DEFAULT_SETTINGS.initialCash, holdings: {} };
  state.favorites = ["KQ001", "KQ006", "KQ009"];
  state.stocks = STOCK_BLUEPRINTS.map(makeStock);
  state.news = [];
  state.alerts = [];
  state.orderHistory = [];
  state.conditionalSellOrders = [];
  state.conditionalBuyOrders = [];
  state.virtualTime = Date.now();
  state.virtualDateKey = dateKey(state.virtualTime);
  state.searchQuery = "";
  state.lastChartDrawAt = 0;
  state.chartTick = 0;
  state.stocks.forEach(buildOrderbook);
}

function exportState() {
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
    conditionalSellOrders: state.conditionalSellOrders,
    conditionalBuyOrders: state.conditionalBuyOrders,
    virtualTime: state.virtualTime,
    virtualDateKey: state.virtualDateKey,
    searchQuery: state.searchQuery
  };
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exportState())); } catch {}
  }, 120);
}

function loadState() {
  defaultState();
  let raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { raw = null; }
  if (!raw) return;
  const data = safeParse(raw, null);
  if (!data || typeof data !== "object") return;

  state.speed = [1,2,5,10,20,50,100,200,300].includes(toInt(data.speed, 1)) ? toInt(data.speed, 1) : 1;
  state.selectedCode = typeof data.selectedCode === "string" ? data.selectedCode : state.selectedCode;
  state.orderMode = data.orderMode === "sell" ? "sell" : "buy";
  state.sortBy = data.sortBy === "volume" ? "volume" : "change";
  state.chartRange = CHART_RANGES.includes(data.chartRange) ? data.chartRange : "1m";
  state.historyTab = data.historyTab === "alerts" ? "alerts" : "orders";
  state.settings = { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
  state.baseline = {
    totalAsset: Math.max(0, toNum(data?.baseline?.totalAsset, DEFAULT_SETTINGS.initialCash)),
    startedAt: toNum(data?.baseline?.startedAt, Date.now())
  };
  state.realizedProfit = toNum(data.realizedProfit, 0);
  state.portfolio.cash = Math.max(0, toNum(data?.portfolio?.cash, DEFAULT_SETTINGS.initialCash));
  state.portfolio.holdings = {};
  if (data?.portfolio?.holdings && typeof data.portfolio.holdings === "object") {
    Object.entries(data.portfolio.holdings).forEach(([code, h]) => {
      const qty = Math.max(0, toInt(h?.qty, 0));
      if (qty > 0) state.portfolio.holdings[code] = { qty, avgPrice: Math.max(0, toNum(h?.avgPrice, 0)) };
    });
  }
  state.favorites = Array.isArray(data.favorites) ? data.favorites.filter(v => typeof v === "string") : state.favorites;
  state.news = Array.isArray(data.news) ? data.news.slice(0, 120) : [];
  state.alerts = Array.isArray(data.alerts) ? data.alerts.slice(0, 180) : [];
  state.orderHistory = Array.isArray(data.orderHistory) ? data.orderHistory.slice(0, 200) : [];
  state.conditionalSellOrders = Array.isArray(data.conditionalSellOrders) ? data.conditionalSellOrders : [];
  state.conditionalBuyOrders = Array.isArray(data.conditionalBuyOrders) ? data.conditionalBuyOrders : [];
  state.virtualTime = Math.max(0, toNum(data.virtualTime, Date.now()));
  state.virtualDateKey = typeof data.virtualDateKey === "string" ? data.virtualDateKey : dateKey(state.virtualTime);
  state.searchQuery = typeof data.searchQuery === "string" ? data.searchQuery : "";

  const oldMap = new Map((Array.isArray(data.stocks) ? data.stocks : []).map(s => [s.code, s]));
  state.stocks = STOCK_BLUEPRINTS.map(bp => {
    const stock = makeStock(bp);
    const old = oldMap.get(stock.code);
    if (old && typeof old === "object") {
      stock.prevClose = Math.max(1, toInt(old.prevClose, stock.prevClose));
      stock.openPrice = Math.max(1, toInt(old.openPrice, stock.openPrice));
      stock.currentPrice = Math.max(1, toInt(old.currentPrice, stock.currentPrice));
      stock.dayHigh = Math.max(stock.currentPrice, toInt(old.dayHigh, stock.currentPrice));
      stock.dayLow = Math.max(1, Math.min(stock.currentPrice, toInt(old.dayLow, stock.currentPrice)));
      stock.volume = Math.max(0, toInt(old.volume, stock.volume));
      stock.history = Array.isArray(old.history) ? old.history.map(v => Math.max(1, toInt(v, stock.currentPrice))).slice(-240) : stock.history;
      stock.historyLong = Array.isArray(old.historyLong) ? old.historyLong.map(v => Math.max(1, toInt(v, stock.currentPrice))).slice(-3000) : stock.historyLong;
      stock.momentum = clamp(toNum(old.momentum, stock.momentum), -3, 3);
      stock.eventBias = clamp(toNum(old.eventBias, 0), -3, 3);
      stock.eventTicks = Math.max(0, toInt(old.eventTicks, 0));
      stock.viActive = !!old.viActive;
      stock.viResumePrice = Math.max(0, toInt(old.viResumePrice, 0));
      stock.fixedPrice = !!old.fixedPrice;
    }
    buildOrderbook(stock);
    return stock;
  });
}

function selectedStock() { return state.stocks.find(s => s.code === state.selectedCode) || state.stocks[0]; }
function holdingOf(code) { return state.portfolio.holdings[code] || { qty: 0, avgPrice: 0 }; }
function stockRate(stock) { return stock.prevClose > 0 ? ((stock.currentPrice - stock.prevClose) / stock.prevClose) * 100 : 0; }
function stockDiff(stock) { return stock.currentPrice - stock.prevClose; }
function stockValue() { return Object.entries(state.portfolio.holdings).reduce((sum, [code, h]) => sum + ((state.stocks.find(s => s.code === code)?.currentPrice || 0) * h.qty), 0); }
function investedAmount() { return Object.values(state.portfolio.holdings).reduce((sum, h) => sum + (h.avgPrice * h.qty), 0); }
function totalAsset() { return state.portfolio.cash + stockValue(); }
function unrealizedProfit() { return stockValue() - investedAmount(); }
function baselineProfit() { return totalAsset() - toNum(state.baseline.totalAsset, state.settings.initialCash); }
function baselineProfitRate() { const base = Math.max(1, toNum(state.baseline.totalAsset, state.settings.initialCash)); return ((totalAsset() - base) / base) * 100; }
function absoluteProfitRate() { const base = Math.max(1, toNum(state.settings.initialCash, DEFAULT_SETTINGS.initialCash)); return ((totalAsset() - base) / base) * 100; }
function hasHolding() { return Object.values(state.portfolio.holdings).some(h => (h?.qty || 0) > 0); }
function upperLimit(stock) { return Math.max(1, Math.round(stock.prevClose * (1 + state.settings.upperLimitRate))); }
function lowerLimit(stock) { return Math.max(1, Math.round(stock.prevClose * (1 - state.settings.lowerLimitRate))); }
function tradeBlocked(stock) { return !!stock?.viActive; }

function addAlert(text, tone = "normal") {
  state.alerts.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, text, tone, time: nowTime() });
  if (state.alerts.length > 180) state.alerts.length = 180;
}

function pushNews(type, stock, text) {
  state.news.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, type, code: stock.code, name: stock.name, theme: stock.theme, text, time: nowTime() });
  if (state.news.length > 120) state.news.length = 120;
  addAlert(`${stock.name} · ${text}`, type === "bad" ? "down" : type === "good" ? "up" : "normal");
}

function recordOrder(entry) {
  state.orderHistory.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, time: nowTime(), ...entry });
  if (state.orderHistory.length > 200) state.orderHistory.length = 200;
}

function dailyReset() {
  state.stocks.forEach(stock => {
    stock.prevClose = stock.currentPrice;
    stock.openPrice = stock.currentPrice;
    stock.dayHigh = stock.currentPrice;
    stock.dayLow = stock.currentPrice;
    stock.volume = Math.max(3000, Math.round(stock.volume * 0.12));
    stock.viActive = false;
    stock.viResumePrice = 0;
    stock.historyLong.push(stock.currentPrice);
    if (stock.historyLong.length > 3000) stock.historyLong.shift();
  });
  addAlert(`가상 날짜 변경 · ${formatVirtualDateTime()}`, "event");
}

function maybeNews(stock) {
  if (Math.random() > 0.005) return;
  if (stock.currentPrice >= 10 && stock.currentPrice <= 120 && Math.random() < 0.35) {
    stock.eventBias = rand(0.08, 0.36);
    stock.eventTicks = randInt(2, 7);
    pushNews("good", stock, "저가주 회복 수급이 붙으며 급반등 기대가 커지고 있어요");
    return;
  }
  if (stock.currentPrice >= 300 && stock.currentPrice <= 6000 && Math.random() < 0.25) {
    stock.eventBias = rand(0.05, 0.24);
    stock.eventTicks = randInt(2, 5);
    pushNews("good", stock, `${randInt(300, 3000).toLocaleString("ko-KR")}원 급등 기대감이 붙고 있어요`);
    return;
  }
  const bundle = pick([
    ["good", "기관 수급이 붙으며 매수세가 강해지고 있어요", rand(0.008, 0.03)],
    ["bad", "차익 실현 물량이 나오며 흔들리는 구간이에요", rand(-0.03, -0.008)],
    ["event", "단기 트레이더 관심이 몰리며 변동성이 커졌어요", rand(-0.015, 0.015)]
  ]);
  stock.eventBias = bundle[2];
  stock.eventTicks = randInt(4, 12);
  pushNews(bundle[0], stock, bundle[1]);
}

function updateOneStock(stock) {
  if (stock.fixedPrice) {
    buildOrderbook(stock);
    return;
  }

  maybeNews(stock);

  const old = stock.currentPrice;
  if (stock.viActive) {
    const rec = rand(-0.01, 0.06) + Math.max(0, stock.eventBias) * 0.4;
    stock.currentPrice = Math.max(1, Math.round(stock.currentPrice * (1 + rec)));
    if (stock.currentPrice >= Math.max(stock.viResumePrice, Math.round(stock.prevClose * 0.5))) {
      stock.viActive = false;
      stock.viResumePrice = 0;
      pushNews("event", stock, "VI가 해제되며 거래가 다시 가능해졌어요");
    }
  } else {
    const styleMul = stock.style === "momentum" ? 1.25 : stock.style === "theme" ? 1.18 : stock.style === "stable" ? 0.75 : 1;
    const noise = rand(-stock.volatility, stock.volatility) * styleMul;
    const event = stock.eventTicks > 0 ? stock.eventBias : 0;
    const drift = stock.momentum * 0.0008;
    let move = noise + event + drift;
    if (Math.random() < 0.0015) move += rand(-0.1, 0.1);
    stock.currentPrice = Math.max(1, Math.round(stock.currentPrice * (1 + move)));

    if (state.settings.dailyLimitEnabled) {
      const up = upperLimit(stock);
      const low = lowerLimit(stock);
      if (stock.currentPrice >= up) stock.currentPrice = up;
      if (stock.currentPrice <= low) {
        stock.currentPrice = low;
        stock.viActive = true;
        stock.viResumePrice = Math.max(Math.round(stock.prevClose * 0.5), Math.round(stock.currentPrice * 1.08));
        pushNews("bad", stock, `하한가 도달로 VI 발동 · ${formatKRW(stock.viResumePrice)} 이상 회복 시 거래 재개`);
      }
    }
  }

  stock.dayHigh = Math.max(stock.dayHigh, stock.currentPrice);
  stock.dayLow = Math.min(stock.dayLow, stock.currentPrice);
  stock.volume += Math.max(1, Math.round(rand(80, 8000) * (1 + Math.abs((stock.currentPrice - old) / Math.max(1, old)) * 50)));
  stock.history.push(stock.currentPrice);
  if (stock.history.length > 240) stock.history.shift();
  if (Math.random() < 0.2) {
    stock.historyLong.push(stock.currentPrice);
    if (stock.historyLong.length > 3000) stock.historyLong.shift();
  }
  stock.momentum = clamp(stock.momentum * 0.92 + (stock.currentPrice > old ? 0.18 : stock.currentPrice < old ? -0.18 : 0), -3, 3);
  if (stock.eventTicks > 0) stock.eventTicks -= 1;
  stock.flash = stock.currentPrice > old ? 1 : stock.currentPrice < old ? -1 : 0;
  buildOrderbook(stock);
}

function executeBuy(code, qty, price, reason = "현재가 매수") {
  const stock = state.stocks.find(s => s.code === code);
  if (!stock || tradeBlocked(stock)) return false;
  qty = Math.max(0, toInt(qty));
  if (qty <= 0) return false;
  const amount = price * qty;
  const fee = feeOf(amount);
  const total = amount + fee;
  if (state.portfolio.cash < total) return false;
  const h = holdingOf(code);
  const newQty = h.qty + qty;
  const newAvg = ((h.avgPrice * h.qty) + amount) / Math.max(1, newQty);
  state.portfolio.cash -= total;
  state.portfolio.holdings[code] = { qty: newQty, avgPrice: newAvg };
  recordOrder({ type: "buy", stockName: stock.name, code, qty, price, fee, total, reason });
  addAlert(`${stock.name} ${formatQty(qty)} 매수 완료`, "up");
  return true;
}

function executeSell(code, qty, price, reason = "현재가 매도") {
  const stock = state.stocks.find(s => s.code === code);
  if (!stock || tradeBlocked(stock)) return false;
  qty = Math.max(0, toInt(qty));
  if (qty <= 0) return false;
  const h = holdingOf(code);
  if (h.qty < qty) return false;
  const amount = price * qty;
  const fee = feeOf(amount);
  const total = amount - fee;
  state.portfolio.cash += total;
  state.realizedProfit += ((price - h.avgPrice) * qty) - fee;
  if (qty >= h.qty) delete state.portfolio.holdings[code];
  else state.portfolio.holdings[code] = { qty: h.qty - qty, avgPrice: h.avgPrice };
  if (!hasHolding()) {
    state.realizedProfit = 0;
    state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() };
  }
  recordOrder({ type: "sell", stockName: stock.name, code, qty, price, fee, total, reason });
  addAlert(`${stock.name} ${formatQty(qty)} 매도 완료`, "down");
  return true;
}

function processConditionalOrders() {
  const buyDone = [];
  state.conditionalBuyOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock || tradeBlocked(stock)) return;
    if (stock.currentPrice > order.targetPrice) return;
    let qty = order.useMax ? maxAffordableQty(state.portfolio.cash, stock.currentPrice) : Math.max(1, toInt(order.qty, 1));
    if (order.budget > 0) qty = Math.min(qty, maxAffordableQty(order.budget, stock.currentPrice));
    if (qty <= 0) { buyDone.push(order.id); return; }
    if (executeBuy(order.code, qty, stock.currentPrice, "예약구매 체결")) buyDone.push(order.id);
  });
  if (buyDone.length) state.conditionalBuyOrders = state.conditionalBuyOrders.filter(o => !buyDone.includes(o.id));

  const sellDone = [];
  state.conditionalSellOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock || tradeBlocked(stock)) return;
    const h = holdingOf(order.code);
    if (h.qty <= 0) { sellDone.push(order.id); return; }
    const hitTarget = order.targetPrice > 0 && stock.currentPrice >= order.targetPrice;
    const hitStop = order.stopPrice > 0 && stock.currentPrice <= order.stopPrice;
    if (!hitTarget && !hitStop) return;
    const qty = order.all ? h.qty : Math.min(h.qty, Math.max(1, toInt(order.qty, 1)));
    if (executeSell(order.code, qty, stock.currentPrice, hitTarget ? "예약판매 목표가 체결" : "예약판매 손절가 체결")) sellDone.push(order.id);
  });
  if (sellDone.length) state.conditionalSellOrders = state.conditionalSellOrders.filter(o => !sellDone.includes(o.id));
}

function getSpeedProfile(speed) {
  const map = {
    1: { delay: 1000, loops: 1, chartMs: 0 },
    2: { delay: 520, loops: 2, chartMs: 60 },
    5: { delay: 220, loops: 3, chartMs: 90 },
    10: { delay: 120, loops: 4, chartMs: 120 },
    20: { delay: 70, loops: 6, chartMs: 180 },
    50: { delay: 30, loops: 10, chartMs: 260 },
    100: { delay: 18, loops: 16, chartMs: 340 },
    200: { delay: 10, loops: 24, chartMs: 420 },
    300: { delay: 7, loops: 32, chartMs: 520 }
  };
  return map[speed] || map[1];
}

function rollTime() {
  const mins = { 1:1, 2:2, 5:5, 10:10, 20:20, 50:45, 100:90, 200:180, 300:360 }[state.speed] || 1;
  state.virtualTime += mins * 60000;
  const key = dateKey(state.virtualTime);
  if (key !== state.virtualDateKey) {
    state.virtualDateKey = key;
    dailyReset();
  }
}

function tick() {
  if (state.isPaused || state.isStopped) return;
  const profile = getSpeedProfile(state.speed);
  for (let i = 0; i < profile.loops; i++) {
    rollTime();
    state.stocks.forEach(updateOneStock);
    processConditionalOrders();
  }
  const shouldDraw = Date.now() - state.lastChartDrawAt >= profile.chartMs;
  render(shouldDraw);
  if (shouldDraw) state.lastChartDrawAt = Date.now();
  queueSave();
}

function restartTick() {
  clearTimeout(tickTimer);
  const loop = () => {
    tick();
    tickTimer = setTimeout(loop, getSpeedProfile(state.speed).delay);
  };
  tickTimer = setTimeout(loop, getSpeedProfile(state.speed).delay);
}

function injectExtraChartTabs() {
  const wrap = q(".chart-tabs");
  if (!wrap) return;
  wrap.innerHTML = "";
  CHART_RANGES.forEach(key => {
    const label = key === "1m" ? "1분" : key === "5m" ? "5분" : key === "1d" ? "일" : key === "1w" ? "주" : key === "1y" ? "1년" : key === "10y" ? "10년" : "100년";
    const btn = document.createElement("button");
    btn.className = `tab-btn ${state.chartRange === key ? "active" : ""}`;
    btn.dataset.chartRange = key;
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => { state.chartRange = key; render(true); queueSave(); });
    wrap.appendChild(btn);
  });
}

function collectEls() {
  [
    "supportFundBtn","pauseBtn","resumeBtn","stopBtn","resetBtn","alertBellBtn","alertBadge","totalAssetTop","profitLossTop","cashTop",
    "symbolLogo","favoriteToggleBtn","selectedName","selectedCode","heroStockSelect","selectedPrice","selectedChange","dayHigh","dayLow","dayOpen","dayVolume",
    "speedButtons","moodFill","moodText","priceChart","chartTooltip","selectedNewsTitleName","selectedNewsCount","selectedNewsFeed",
    "holdingQtyInline","avgPriceInline","availableCash","maxBuyQty","currentHoldingQty","currentAvgPrice","buyModeBtn","sellModeBtn","currentTradePriceLabel","orderPrice","orderQty","quickRow","estimatedCost","estimatedFee","submitOrderBtn",
    "autoSellTargetPrice","autoSellStopPrice","autoSellQty","autoSellAll","addAutoSellBtn","autoSellList","orderbookRows","newsCountChip","newsFeed","clearHistoryBtn","orderHistoryList","alertHistoryList",
    "portfolioTotal","portfolioPL","portfolioCash","portfolioStockValue","portfolioInvested","portfolioRate","searchInput","favoritesList","marketAlertBadge","watchlist"
  ].forEach(id => { els[id] = byId(id); });
  els.autoHeadTitle = q(".auto-sell-head h3");
  els.autoHeadDesc = q(".auto-sell-head p");
  els.autoListHead = q(".auto-sell-list-head");
  els.autoTargetLabel = q('label[for="autoSellTargetPrice"]');
  els.autoStopLabel = q('label[for="autoSellStopPrice"]');
  els.autoQtyLabel = q('label[for="autoSellQty"]');
  els.autoAllLabel = q(".checkbox-label span");
}

function ensureSelectedCode() {
  if (!state.stocks.some(s => s.code === state.selectedCode)) state.selectedCode = state.stocks[0]?.code || "KQ001";
}

function renderTopSummary() {
  const total = totalAsset();
  const pl = baselineProfit();
  setText(els.totalAssetTop, formatKRW(total));
  setText(els.profitLossTop, formatSignedKRW(pl));
  setText(els.cashTop, formatKRW(state.portfolio.cash));
  setText(els.alertBadge, String(state.alerts.length));
  setText(els.marketAlertBadge, String(state.alerts.length));

  const mood = baselineProfitRate();
  if (els.moodFill) els.moodFill.style.width = `${clamp((mood + 15) / 30 * 100, 0, 100)}%`;
  if (els.moodText) {
    els.moodText.textContent =
      mood > 3 ? "매수세가 꽤 강한 장이에요" :
      mood > 0.5 ? "상승 쪽 힘이 조금 우세해요" :
      mood < -3 ? "매도 압력이 제법 강한 장이에요" :
      mood < -0.5 ? "약세 흐름이 이어지는 중이에요" :
      `+0.00% · 총자산 ${formatKRW(total)}`;
  }
}

function renderHero() {
  const stock = selectedStock();
  if (!stock) return;
  setText(els.symbolLogo, stock.logo);
  setText(els.selectedName, stock.name);
  setText(els.selectedCode, `${stock.code} · ${stock.theme}${stock.viActive ? " · VI" : stock.fixedPrice ? " · 고정" : ""}`);
  setText(els.selectedPrice, formatKRW(stock.currentPrice));
  setText(els.selectedChange, `${formatSignedKRW(stockDiff(stock))} (${formatSignedPct(stockRate(stock))})`);
  setText(els.dayHigh, formatKRW(stock.dayHigh));
  setText(els.dayLow, formatKRW(stock.dayLow));
  setText(els.dayOpen, formatKRW(stock.openPrice));
  setText(els.dayVolume, formatVolume(stock.volume));

  if (els.selectedPrice) els.selectedPrice.style.color = stockRate(stock) >= 0 ? "#ff92ad" : "#67c2ff";
  if (els.selectedChange) els.selectedChange.style.color = stockRate(stock) >= 0 ? "#ff92ad" : "#67c2ff";

  if (els.heroStockSelect) {
    els.heroStockSelect.innerHTML = state.stocks.map(s => `<option value="${s.code}">${s.name}${s.theme ? " · " + s.theme : ""}</option>`).join("");
    els.heroStockSelect.value = state.selectedCode;
  }
  setText(els.favoriteToggleBtn, state.favorites.includes(stock.code) ? "★" : "☆");
}

function renderPortfolio() {
  const total = totalAsset();
  const baseProfit = baselineProfit();
  const baseRate = baselineProfitRate();
  const absRate = absoluteProfitRate();
  const unrl = unrealizedProfit();

  setText(els.portfolioTotal, formatKRW(total));
  setText(els.portfolioPL, `${formatSignedKRW(baseProfit)} (${formatSignedPct(baseRate)})`);
  setText(els.portfolioCash, formatKRW(state.portfolio.cash));
  setText(els.portfolioStockValue, formatKRW(stockValue()));
  setText(els.portfolioInvested, formatKRW(investedAmount()));
  setText(els.portfolioRate, formatSignedPct(baseRate));
  if (els.portfolioPL) els.portfolioPL.style.color = baseProfit >= 0 ? "#ff92ad" : "#67c2ff";

  let extra = byId("portfolioExtraBox");
  if (!extra && els.portfolioRate) {
    extra = document.createElement("div");
    extra.id = "portfolioExtraBox";
    extra.className = "portfolio-grid";
    extra.innerHTML = `
      <div class="portfolio-card"><span>전체 수익률</span><b id="portfolioAbsoluteRate">0.00%</b></div>
      <div class="portfolio-card"><span>실현손익</span><b id="portfolioRealized">0원</b></div>
      <div class="portfolio-card"><span>기준선 이후</span><b id="portfolioBaselineRate">0.00%</b></div>
      <div class="portfolio-card"><span>평가손익</span><b id="portfolioUnrealized">0원</b></div>
      <button class="ghost-btn" id="resetBaselineBtn" type="button">수익률 기준 리셋</button>
      <button class="ghost-btn" id="clearConditionalBtn" type="button">자동매매 비우기</button>
    `;
    els.portfolioRate.closest(".portfolio-grid")?.after(extra);
    addEvent(byId("resetBaselineBtn"), "click", () => { state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() }; render(false); queueSave(); });
    addEvent(byId("clearConditionalBtn"), "click", () => { state.conditionalBuyOrders = []; state.conditionalSellOrders = []; render(false); queueSave(); });
  }
  setText(byId("portfolioAbsoluteRate"), formatSignedPct(absRate));
  setText(byId("portfolioRealized"), formatSignedKRW(state.realizedProfit));
  setText(byId("portfolioBaselineRate"), formatSignedPct(baseRate));
  setText(byId("portfolioUnrealized"), formatSignedKRW(unrl));
}

function updateOrderModeUI() {
  const buy = state.orderMode === "buy";
  els.buyModeBtn?.classList.toggle("active", buy);
  els.sellModeBtn?.classList.toggle("active", !buy);
  if (els.submitOrderBtn) {
    els.submitOrderBtn.textContent = buy ? "매수 실행" : "매도 실행";
    els.submitOrderBtn.classList.toggle("buy", buy);
    els.submitOrderBtn.classList.toggle("sell", !buy);
  }
  if (els.autoHeadTitle) els.autoHeadTitle.textContent = buy ? "예약구매 · 조건매수" : "예약판매 · 자동매도";
  if (els.autoHeadDesc) els.autoHeadDesc.textContent = buy ? "원하는 가격까지 내려오면 자동으로 살 수 있어요" : "원하는 가격이 오거나 내려오면 자동으로 팔 수 있어요";
  if (els.autoListHead) els.autoListHead.textContent = buy ? "등록된 예약구매" : "등록된 자동매도";
  if (els.autoTargetLabel) els.autoTargetLabel.textContent = buy ? "목표 매수가" : "목표가";
  if (els.autoStopLabel) els.autoStopLabel.textContent = buy ? "예산 제한" : "손절가";
  if (els.autoQtyLabel) els.autoQtyLabel.textContent = "수량";
  if (els.autoAllLabel) els.autoAllLabel.textContent = buy ? "최대 수량으로 사기" : "전량으로 팔기";
  if (els.addAutoSellBtn) els.addAutoSellBtn.textContent = buy ? "예약구매 등록" : "자동매도 등록";
  if (els.autoSellStopPrice) els.autoSellStopPrice.placeholder = buy ? "비워두면 제한 없음" : "예: 45000";
  if (els.autoSellTargetPrice) els.autoSellTargetPrice.placeholder = buy ? "예: 43000" : "예: 52000";
}

function updateOrderInputs() {
  const stock = selectedStock();
  if (!stock) return;
  const holding = holdingOf(stock.code);
  const maxBuy = maxAffordableQty(state.portfolio.cash, stock.currentPrice);
  let qty = Math.max(1, toInt(els.orderQty?.value, 1));
  if (state.orderMode === "sell" && holding.qty > 0) qty = Math.min(qty, holding.qty);
  if (els.orderQty) els.orderQty.value = String(qty);
  if (els.orderPrice) {
    els.orderPrice.value = String(stock.currentPrice);
    els.orderPrice.readOnly = true;
  }
  setText(els.holdingQtyInline, formatQty(holding.qty));
  setText(els.avgPriceInline, formatKRW(holding.avgPrice));
  setText(els.availableCash, formatKRW(state.portfolio.cash));
  setText(els.maxBuyQty, formatQty(maxBuy));
  setText(els.currentHoldingQty, formatQty(holding.qty));
  setText(els.currentAvgPrice, formatKRW(holding.avgPrice));
  setText(els.currentTradePriceLabel, formatKRW(stock.currentPrice));
  setText(els.estimatedCost, formatKRW(stock.currentPrice * qty));
  setText(els.estimatedFee, formatKRW(feeOf(stock.currentPrice * qty)));
  renderQuickButtons(maxBuy, holding.qty);
}

function renderQuickButtons(maxBuy, holdingQty) {
  if (!els.quickRow) return;
  const basis = state.orderMode === "buy" ? maxBuy : holdingQty;
  const values = [0.1, 0.25, 0.5, 0.75, 1].map(p => {
    if (basis <= 0) return 0;
    if (p === 1) return Math.max(0, basis);
    return Math.max(1, Math.floor(basis * p));
  });
  els.quickRow.innerHTML = ["10%","25%","50%","75%","100%"].map((label, i) => `<button type="button" ${values[i] <= 0 ? "disabled" : ""} data-qty="${values[i]}">${label}</button>`).join("");
  qa("button", els.quickRow).forEach(btn => btn.addEventListener("click", () => { if (els.orderQty) els.orderQty.value = btn.dataset.qty; updateOrderInputs(); }));
}

function submitOrder() {
  const stock = selectedStock();
  if (!stock) return;
  if (tradeBlocked(stock)) { addAlert("VI 상태에서는 거래할 수 없어요", "down"); render(false); return; }
  const qty = Math.max(1, toInt(els.orderQty?.value, 1));
  const ok = state.orderMode === "buy" ? executeBuy(stock.code, qty, stock.currentPrice, "현재가 매수") : executeSell(stock.code, qty, stock.currentPrice, "현재가 매도");
  if (!ok) addAlert(state.orderMode === "buy" ? "매수에 실패했어요" : "매도에 실패했어요", "down");
  render(false);
  queueSave();
}

function addConditionalOrder() {
  const stock = selectedStock();
  if (!stock) return;
  const targetPrice = Math.max(1, toInt(els.autoSellTargetPrice?.value, 0));
  const subValue = Math.max(0, toInt(els.autoSellStopPrice?.value, 0));
  const qty = Math.max(1, toInt(els.autoSellQty?.value, 1));
  const flag = !!els.autoSellAll?.checked;

  if (state.orderMode === "buy") {
    if (targetPrice <= 0) { addAlert("예약구매 가격을 입력해 주세요", "down"); render(false); return; }
    state.conditionalBuyOrders.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, code: stock.code, targetPrice, qty, budget: subValue, useMax: flag });
    addAlert(`${stock.name} 예약구매가 등록됐어요`, "up");
  } else {
    if (targetPrice <= 0 && subValue <= 0) { addAlert("목표가나 손절가를 입력해 주세요", "down"); render(false); return; }
    state.conditionalSellOrders.unshift({ id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`, code: stock.code, targetPrice, stopPrice: subValue, qty, all: flag });
    addAlert(`${stock.name} 자동매도가 등록됐어요`, "normal");
  }
  render(false);
  queueSave();
}

function renderConditionalList() {
  if (!els.autoSellList) return;
  const list = state.orderMode === "buy" ? state.conditionalBuyOrders : state.conditionalSellOrders;
  if (!list.length) {
    els.autoSellList.innerHTML = `<div class="auto-sell-item"><div class="auto-sell-item-main">등록된 ${state.orderMode === "buy" ? "예약구매" : "자동매도"}가 없어요</div></div>`;
    return;
  }
  els.autoSellList.innerHTML = list.map(item => {
    const s = state.stocks.find(x => x.code === item.code);
    if (state.orderMode === "buy") {
      return `<div class="auto-sell-item"><div class="auto-sell-item-main"><div>${s?.name || item.code}</div><div>목표 매수가 ${formatKRW(item.targetPrice)}</div><div>${item.useMax ? "가능한 최대 수량" : formatQty(item.qty)}</div><div>${item.budget > 0 ? `예산 ${formatKRW(item.budget)}` : "예산 제한 없음"}</div></div><button class="ghost-btn" type="button" data-cond-del="${item.id}">삭제</button></div>`;
    }
    return `<div class="auto-sell-item"><div class="auto-sell-item-main"><div>${s?.name || item.code}</div><div>목표가 ${item.targetPrice > 0 ? formatKRW(item.targetPrice) : "-"}</div><div>손절가 ${item.stopPrice > 0 ? formatKRW(item.stopPrice) : "-"}</div><div>${item.all ? "전량" : formatQty(item.qty)}</div></div><button class="ghost-btn" type="button" data-cond-del="${item.id}">삭제</button></div>`;
  }).join("");
  qa("[data-cond-del]", els.autoSellList).forEach(btn => btn.addEventListener("click", () => {
    if (state.orderMode === "buy") state.conditionalBuyOrders = state.conditionalBuyOrders.filter(x => x.id !== btn.dataset.condDel);
    else state.conditionalSellOrders = state.conditionalSellOrders.filter(x => x.id !== btn.dataset.condDel);
    render(false);
    queueSave();
  }));
}

function renderOrderbook() {
  const stock = selectedStock();
  if (!stock || !els.orderbookRows) return;
  els.orderbookRows.innerHTML = stock.orderbook.map(row => `
    <div class="orderbook-row">
      <span class="ask-qty">${row.askQty.toLocaleString("ko-KR")}주</span>
      <span class="mid-price ${row.price >= stock.currentPrice ? "mid-up" : "mid-down"}">${formatKRW(row.price)}</span>
      <span class="bid-qty">${row.bidQty.toLocaleString("ko-KR")}주</span>
    </div>
  `).join("");
}

function renderNews() {
  setText(els.newsCountChip, `${state.news.length}건`);
  const allHtml = state.news.length ? state.news.map(item => `
    <div class="news-card">
      <div class="news-card-top"><span class="news-type ${item.type}">${item.type === "good" ? "호재" : item.type === "bad" ? "악재" : "이벤트"}</span><span class="news-time">${item.time}</span></div>
      <div class="news-title">${item.name}</div>
      <div class="news-sub">${item.text}</div>
    </div>
  `).join("") : `<div class="news-card"><div class="news-title">뉴스가 아직 없어요</div></div>`;
  if (els.newsFeed) els.newsFeed.innerHTML = allHtml;

  const stock = selectedStock();
  const related = state.news.filter(n => n.code === stock.code).slice(0, 6);
  setText(els.selectedNewsTitleName, stock.name);
  setText(els.selectedNewsCount, `${related.length}건`);
  if (els.selectedNewsFeed) els.selectedNewsFeed.innerHTML = related.length ? related.map(item => `
    <div class="news-card">
      <div class="news-card-top"><span class="news-type ${item.type}">${item.type === "good" ? "호재" : item.type === "bad" ? "악재" : "이벤트"}</span><span class="news-time">${item.time}</span></div>
      <div class="news-sub">${item.text}</div>
    </div>
  `).join("") : `<div class="news-card"><div class="news-sub">이 종목 관련 뉴스가 아직 없어요</div></div>`;
}

function renderHistory() {
  qa(".history-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.historyTab === state.historyTab));
  if (els.orderHistoryList) {
    els.orderHistoryList.classList.toggle("hidden", state.historyTab !== "orders");
    els.orderHistoryList.innerHTML = state.orderHistory.length ? state.orderHistory.map(item => `
      <div class="history-card">
        <div class="history-card-top"><span class="history-type ${item.type === "buy" ? "buy" : "sell"}">${item.type === "buy" ? "매수" : "매도"}</span><span class="history-time">${item.time}</span></div>
        <div class="history-main">${item.stockName} ${formatQty(item.qty)} · ${formatKRW(item.price)}</div>
        <div class="history-sub">${item.reason} · 수수료 ${formatKRW(item.fee)}</div>
      </div>
    `).join("") : `<div class="history-card"><div class="history-main">아직 주문 내역이 없어요</div></div>`;
  }
  if (els.alertHistoryList) {
    els.alertHistoryList.classList.toggle("hidden", state.historyTab !== "alerts");
    els.alertHistoryList.innerHTML = state.alerts.length ? state.alerts.map(item => `
      <div class="history-card">
        <div class="history-card-top"><span class="history-type ${item.tone === "up" ? "buy" : item.tone === "down" ? "sell" : "alert"}">${item.tone === "up" ? "상승" : item.tone === "down" ? "하락" : "알림"}</span><span class="history-time">${item.time}</span></div>
        <div class="history-main">${item.text}</div>
      </div>
    `).join("") : `<div class="history-card"><div class="history-main">알림이 아직 없어요</div></div>`;
  }
}

function filteredStocks() {
  const query = state.searchQuery.trim().toLowerCase();
  let list = [...state.stocks];
  if (query) list = list.filter(s => `${s.name} ${s.code} ${s.theme}`.toLowerCase().includes(query));
  if (state.sortBy === "volume") list.sort((a, b) => b.volume - a.volume);
  else list.sort((a, b) => stockRate(b) - stockRate(a));
  return list;
}

function renderFavorites() {
  if (!els.favoritesList) return;
  const favs = state.stocks.filter(s => state.favorites.includes(s.code));
  if (!favs.length) {
    els.favoritesList.textContent = "즐겨찾기한 종목이 아직 없어요";
    els.favoritesList.classList.add("empty-state-box");
    return;
  }
  els.favoritesList.classList.remove("empty-state-box");
  els.favoritesList.innerHTML = favs.map(s => `<button type="button" class="favorite-stock-chip" data-fav-code="${s.code}">${s.name}</button>`).join("");
  qa("[data-fav-code]", els.favoritesList).forEach(btn => btn.addEventListener("click", () => { state.selectedCode = btn.dataset.favCode; render(true); queueSave(); }));
}

function renderWatchlist() {
  const list = filteredStocks();
  if (!els.watchlist) return;
  els.watchlist.innerHTML = list.map(stock => `
    <button type="button" class="watch-item ${stock.code === state.selectedCode ? "active" : ""}" data-code="${stock.code}">
      <div class="watch-left"><div class="watch-logo">${stock.logo}</div><div><div class="watch-name">${stock.name}</div><div class="watch-theme">${stock.theme}</div></div></div>
      <div class="watch-right"><div class="watch-price ${stockRate(stock) >= 0 ? "positive" : "negative"}">${formatKRW(stock.currentPrice)}</div><div class="watch-rate ${stockRate(stock) >= 0 ? "positive" : "negative"}">${formatSignedPct(stockRate(stock))}</div><div class="watch-mini">거래량 ${formatVolume(stock.volume)}</div></div>
    </button>
  `).join("");
  qa("[data-code]", els.watchlist).forEach(btn => btn.addEventListener("click", () => { state.selectedCode = btn.dataset.code; render(true); queueSave(); }));
}

function renderSpeedButtons() {
  if (!els.speedButtons) return;
  const speeds = [1,2,5,10,20,50,100,200,300];
  els.speedButtons.innerHTML = speeds.map(v => `<button type="button" data-speed="${v}" class="${state.speed === v ? "active" : ""}">${v}x</button>`).join("");
  qa("button", els.speedButtons).forEach(btn => btn.addEventListener("click", () => { state.speed = toInt(btn.dataset.speed, 1); render(false); restartTick(); queueSave(); }));
}

function renderChartTabs() {
  qa(".tab-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.chartRange === state.chartRange));
}

function renderSortButtons() {
  qa(".sort-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.sort === state.sortBy));
}

function getChartSeries(stock) {
  const short = stock.history || [];
  const long = stock.historyLong || short;
  if (state.chartRange === "1m") return short.slice(-60);
  if (state.chartRange === "5m") return short.slice(-100);
  if (state.chartRange === "1d") return short.slice(-180);
  if (state.chartRange === "1w") return long.slice(-300);
  if (state.chartRange === "1y") return long.filter((_, i) => i % 2 === 0).slice(-500);
  if (state.chartRange === "10y") return long.filter((_, i) => i % 5 === 0).slice(-600);
  return long.filter((_, i) => i % 10 === 0).slice(-700);
}

function movingAverage(series, n) {
  return series.map((_, i) => {
    if (i < n - 1) return null;
    let sum = 0;
    for (let j = i - n + 1; j <= i; j++) sum += series[j];
    return sum / n;
  });
}

function drawLine(ctx, values, xOf, yOf, color, width) {
  let started = false;
  ctx.beginPath();
  values.forEach((v, i) => {
    if (v == null) return;
    const x = xOf(i), y = yOf(v);
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawChart() {
  const canvas = els.priceChart;
  const stock = selectedStock();
  if (!canvas || !stock) return;
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 1000;
  const cssH = 620;
  canvas.width = Math.round(cssW * ratio);
  canvas.height = Math.round(cssH * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const series = getChartSeries(stock);
  if (!series.length) return;
  const ma5 = movingAverage(series, 5);
  const ma20 = movingAverage(series, 20);
  const ma60 = movingAverage(series, 60);
  const pad = { left: 52, right: 24, top: 26, bottom: 42 };
  const w = cssW - pad.left - pad.right;
  const h = cssH - pad.top - pad.bottom;
  const min = Math.min(...series) * 0.985;
  const max = Math.max(...series) * 1.015;
  const xOf = i => pad.left + (i / Math.max(1, series.length - 1)) * w;
  const yOf = v => pad.top + (1 - (v - min) / Math.max(1, max - min)) * h;

  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const y = pad.top + (h / 3) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + w, y); ctx.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const x = pad.left + (w / 3) * i;
    ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + h); ctx.stroke();
  }

  const upColor = "#ff6f95";
  const downColor = "#52d6ff";
  const lineColor = stockRate(stock) >= 0 ? upColor : downColor;
  const fill = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
  fill.addColorStop(0, stockRate(stock) >= 0 ? "rgba(255,111,149,.16)" : "rgba(82,214,255,.16)");
  fill.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath();
  series.forEach((v, i) => {
    const x = xOf(i), y = yOf(v);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.lineTo(xOf(series.length - 1), pad.top + h);
  ctx.lineTo(xOf(0), pad.top + h);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  drawLine(ctx, series, xOf, yOf, lineColor, 2);
  drawLine(ctx, ma5, xOf, yOf, "#ff6f95", 1.2);
  drawLine(ctx, ma20, xOf, yOf, "#ffc943", 1.2);
  drawLine(ctx, ma60, xOf, yOf, "#8a74ff", 1.2);

  canvas.onmousemove = e => {
    const rect = canvas.getBoundingClientRect();
    const idx = Math.round(clamp((e.clientX - rect.left) / rect.width, 0, 1) * (series.length - 1));
    const price = series[idx];
    if (!els.chartTooltip) return;
    els.chartTooltip.classList.remove("hidden");
    els.chartTooltip.style.left = `${clamp(xOf(idx) + 12, 8, cssW - 220)}px`;
    els.chartTooltip.style.top = `${clamp(yOf(price) - 88, 8, cssH - 120)}px`;
    els.chartTooltip.innerHTML = `<div><b>${stock.name}</b></div><div>가격 ${formatKRW(price)}</div><div>가상시간 ${formatVirtualDateTime()}</div>`;
  };
  canvas.onmouseleave = () => { els.chartTooltip?.classList.add("hidden"); };
}

function render(forceChart = true) {
  ensureSelectedCode();
  renderTopSummary();
  renderHero();
  renderPortfolio();
  updateOrderModeUI();
  updateOrderInputs();
  renderConditionalList();
  renderOrderbook();
  renderNews();
  renderHistory();
  renderFavorites();
  renderWatchlist();
  renderSpeedButtons();
  renderSortButtons();
  renderChartTabs();
  if (forceChart) drawChart();
}

function bindEvents() {
  addEvent(els.supportFundBtn, "click", () => {
    if (state.portfolio.cash > state.settings.supportFundCashLimit) { addAlert(`현금이 ${formatKRW(state.settings.supportFundCashLimit)} 이하일 때만 가능해요`, "down"); render(false); return; }
    state.portfolio.cash += state.settings.supportFundAmount;
    addAlert(`${formatKRW(state.settings.supportFundAmount)} 긴급지원금이 들어왔어요`, "up");
    render(false); queueSave();
  });
  addEvent(els.pauseBtn, "click", () => { state.isPaused = true; state.isStopped = false; });
  addEvent(els.resumeBtn, "click", () => { state.isPaused = false; state.isStopped = false; });
  addEvent(els.stopBtn, "click", () => { state.isStopped = !state.isStopped; if (!state.isStopped) state.isPaused = false; });
  addEvent(els.resetBtn, "click", () => { if (!confirm("전체 데이터를 초기화할까요?")) return; try { localStorage.removeItem(STORAGE_KEY); } catch {} defaultState(); render(true); restartTick(); });
  addEvent(els.alertBellBtn, "click", () => { state.historyTab = "alerts"; render(false); document.querySelector(".history-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }); });
  addEvent(els.favoriteToggleBtn, "click", () => {
    const code = state.selectedCode;
    const idx = state.favorites.indexOf(code);
    if (idx >= 0) state.favorites.splice(idx, 1); else state.favorites.unshift(code);
    state.favorites = [...new Set(state.favorites)].slice(0, 20);
    render(false); queueSave();
  });
  addEvent(els.heroStockSelect, "change", () => { state.selectedCode = els.heroStockSelect.value; render(true); queueSave(); });
  addEvent(els.buyModeBtn, "click", () => { state.orderMode = "buy"; render(false); queueSave(); });
  addEvent(els.sellModeBtn, "click", () => { state.orderMode = "sell"; render(false); queueSave(); });
  addEvent(els.orderQty, "input", updateOrderInputs);
  addEvent(els.submitOrderBtn, "click", submitOrder);
  addEvent(els.addAutoSellBtn, "click", addConditionalOrder);
  addEvent(els.searchInput, "input", () => { state.searchQuery = els.searchInput.value || ""; render(false); queueSave(); });
  qa(".history-tab").forEach(btn => addEvent(btn, "click", () => { state.historyTab = btn.dataset.historyTab; render(false); queueSave(); }));
  qa(".sort-btn").forEach(btn => addEvent(btn, "click", () => { state.sortBy = btn.dataset.sort; render(false); queueSave(); }));
  addEvent(els.clearHistoryBtn, "click", () => { if (state.historyTab === "orders") state.orderHistory = []; else state.alerts = []; render(false); queueSave(); });
  window.addEventListener("resize", () => drawChart());
}

function init() {
  loadState();
  injectExtraChartTabs();
  collectEls();
  if (els.searchInput) els.searchInput.value = state.searchQuery;
  bindEvents();
  render(true);
  restartTick();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();
