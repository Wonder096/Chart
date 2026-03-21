const STORAGE_KEY = "k_mock_trading_pro_v10_safe";
const INITIAL_CASH = 1000000;
const SUPPORT_FUND = 500000;
const SUPPORT_FUND_LIMIT = 500000;
const NEWS_LIMIT = 120;
const ORDER_LIMIT = 250;
const ALERT_LIMIT = 250;
const CANVAS_W = 1280;
const CANVAS_H = 700;
const FEE_RATE = 0.0015;

const STOCK_SEED = [
  { code: "KQ001", name: "한강테크", logo: "한", base: 48200, theme: "AI 반도체" },
  { code: "KQ002", name: "네오바이오", logo: "네", base: 32150, theme: "바이오 신약" },
  { code: "KQ003", name: "블루모빌리티", logo: "블", base: 187000, theme: "전기차 부품" },
  { code: "KQ004", name: "코어엔터", logo: "코", base: 12950, theme: "엔터/플랫폼" },
  { code: "KQ005", name: "스카이로직스", logo: "스", base: 85300, theme: "물류 자동화" },
  { code: "KQ006", name: "오로라게임즈", logo: "오", base: 56700, theme: "게임/콘텐츠" },
  { code: "KQ007", name: "에코플랜트", logo: "에", base: 104500, theme: "친환경 소재" },
  { code: "KQ008", name: "미래핀테크", logo: "미", base: 72200, theme: "핀테크" },
  { code: "KQ009", name: "제니스AI", logo: "제", base: 243500, theme: "초거대 AI" },
  { code: "KQ010", name: "라이트메드", logo: "라", base: 41550, theme: "헬스케어" },
  { code: "KQ011", name: "웨이브로보틱스", logo: "웨", base: 96400, theme: "로봇/공장자동화" },
  { code: "KQ012", name: "트리온클라우드", logo: "트", base: 138800, theme: "클라우드" }
];

const breakingTemplates = [
  "{name}, 장중 수급 집중되며 변동성 확대",
  "{name}, 외국인 매수세 유입 추정",
  "{name}, 개인 투자자 관심 급증",
  "{name}, 시세 급등 속 거래량 폭증",
  "{name}, 테마 확산 기대감 속 시장 주목"
];
const goodTemplates = [
  "{name}, 신규 계약 기대감으로 투자심리 개선",
  "{name}, 실적 기대감 반영되며 상승 탄력 강화",
  "{name}, 업황 개선 수혜 기대감 부각",
  "{name}, 차세대 사업 확장 기대",
  "{name}, 기관 수급 개선 기대감 반영"
];
const warnTemplates = [
  "{name}, 단기 급등에 따른 차익실현 매물 주의",
  "{name}, 변동성 확대 구간 진입",
  "{name}, 급등 이후 추격 매수 주의보",
  "{name}, 고점 부근 매물 압박 가능성",
  "{name}, 장중 흔들림 확대 가능성 유의"
];
const eventTemplates = [
  "{name}, 장 마감 브리핑 관심 종목 선정",
  "{name}, 투자자 토론방 언급량 급증",
  "{name}, 테마 이벤트 발생으로 관심 확대",
  "{name}, 당일 관심 검색어 상위권 진입",
  "{name}, 시장 리포트 상위 조회 종목 편입"
];

const state = {
  speed: 1,
  selectedCode: "KQ001",
  orderMode: "buy",
  sortBy: "change",
  chartRange: "1m",
  hoverIndex: -1,
  alertCount: 0,
  marketAlertCount: 0,
  isPaused: false,
  isStopped: false,
  emergencyFundClaimed: false,
  searchTerm: "",
  stocks: [],
  favorites: [],
  news: [],
  alerts: [],
  orderHistory: [],
  autoSellOrders: [],
  watchlistOrder: [],
  portfolio: {
    cash: INITIAL_CASH,
    holdings: {}
  }
};

const els = {};
let tickTimer = null;
let saveThrottleTimer = null;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
function formatKRW(v) {
  return `${Math.round(v).toLocaleString("ko-KR")}원`;
}
function formatSignedKRW(v) {
  const rounded = Math.round(v);
  return `${rounded >= 0 ? "+" : ""}${rounded.toLocaleString("ko-KR")}원`;
}
function formatSignedPct(v) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}
function formatVolume(v) {
  if (v >= 100000000) return `${(v / 100000000).toFixed(2)}억`;
  if (v >= 10000) return `${(v / 10000).toFixed(1)}만`;
  return Math.round(v).toLocaleString("ko-KR");
}
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
function typeLabel(type) {
  if (type === "breaking") return "속보";
  if (type === "good") return "호재";
  if (type === "warn") return "주의";
  return "이벤트";
}
function feeOf(amount) {
  return Math.round(amount * FEE_RATE);
}
function safeGet(id) {
  return document.getElementById(id);
}
function safeHTML(el, html) {
  if (el) el.innerHTML = html;
}
function safeText(el, text) {
  if (el) el.textContent = text;
}
function safeValue(el, value) {
  if (el) el.value = value;
}
function safeAddEvent(el, event, handler) {
  if (el) el.addEventListener(event, handler);
}
function queueSave() {
  if (saveThrottleTimer) return;
  saveThrottleTimer = setTimeout(() => {
    saveThrottleTimer = null;
    saveState();
  }, 250);
}
function getSelectedStock() {
  return state.stocks.find(s => s.code === state.selectedCode) || state.stocks[0] || null;
}
function getHolding(code) {
  return state.portfolio.holdings[code] || { qty: 0, avgPrice: 0 };
}
function getStockRate(stock) {
  return ((stock.currentPrice - stock.prevClose) / stock.prevClose) * 100;
}
function getStockValueOfHolding(code) {
  const stock = state.stocks.find(s => s.code === code);
  const holding = getHolding(code);
  return stock ? stock.currentPrice * holding.qty : 0;
}
function getInvestedAmount() {
  return Object.values(state.portfolio.holdings).reduce((sum, h) => sum + (h.avgPrice * h.qty), 0);
}
function getStockEvaluation() {
  return Object.keys(state.portfolio.holdings).reduce((sum, code) => sum + getStockValueOfHolding(code), 0);
}
function getTotalAsset() {
  return state.portfolio.cash + getStockEvaluation();
}
function getProfitLoss() {
  return getTotalAsset() - INITIAL_CASH;
}
function getProfitRate() {
  return INITIAL_CASH > 0 ? ((getTotalAsset() - INITIAL_CASH) / INITIAL_CASH) * 100 : 0;
}

function generateCandles(base) {
  const candles = [];
  let prev = base * rand(0.92, 1.08);
  const prevClose = prev;

  for (let i = 0; i < 140; i++) {
    const open = prev;
    const move = rand(-0.02, 0.022);
    const close = Math.max(500, open * (1 + move));
    const high = Math.max(open, close) * (1 + rand(0.001, 0.015));
    const low = Math.min(open, close) * (1 - rand(0.001, 0.015));
    const volume = randInt(12000, 220000) * (1 + Math.abs(move) * 20);

    candles.push({
      time: Date.now() - (140 - i) * 60000,
      open,
      high,
      low,
      close,
      volume
    });

    prev = close;
  }

  return { candles, prevClose };
}

function generateOrderbook(stock) {
  const rows = [];
  const base = stock.currentPrice;

  for (let i = 10; i >= 1; i--) {
    rows.push({
      side: "ask",
      price: Math.max(100, Math.round(base * (1 + i * 0.002))),
      qty: randInt(30, 1200),
      flash: 0
    });
  }
  for (let i = 1; i <= 10; i++) {
    rows.push({
      side: "bid",
      price: Math.max(100, Math.round(base * (1 - i * 0.002))),
      qty: randInt(30, 1200),
      flash: 0
    });
  }

  return rows;
}

function buildInitialState() {
  state.portfolio = { cash: INITIAL_CASH, holdings: {} };
  state.favorites = [];
  state.news = [];
  state.alerts = [];
  state.orderHistory = [];
  state.autoSellOrders = [];
  state.alertCount = 0;
  state.marketAlertCount = 0;
  state.isPaused = false;
  state.isStopped = false;
  state.emergencyFundClaimed = false;
  state.speed = 1;
  state.orderMode = "buy";
  state.sortBy = "change";
  state.chartRange = "1m";
  state.selectedCode = "KQ001";
  state.searchTerm = "";

  state.stocks = STOCK_SEED.map(seed => {
    const generated = generateCandles(seed.base);
    const candles = generated.candles;
    const stock = {
      code: seed.code,
      name: seed.name,
      logo: seed.logo,
      theme: seed.theme,
      prevClose: generated.prevClose,
      candles,
      currentPrice: candles[candles.length - 1].close,
      currentVolume: candles[candles.length - 1].volume,
      dayHigh: Math.max(...candles.map(c => c.high)),
      dayLow: Math.min(...candles.map(c => c.low)),
      mood: randInt(35, 65),
      volatility: rand(0.75, 1.45),
      orderbook: []
    };
    stock.orderbook = generateOrderbook(stock);
    return stock;
  });

  seedInitialNews();
  rebuildWatchlistOrder();
}

function sanitizeLoadedState(raw) {
  if (!raw || typeof raw !== "object") return false;
  if (!Array.isArray(raw.stocks) || !raw.stocks.length) return false;

  state.speed = [1, 2, 5, 10, 20, 50].includes(Number(raw.speed)) ? Number(raw.speed) : 1;
  state.selectedCode = raw.selectedCode || "KQ001";
  state.orderMode = raw.orderMode === "sell" ? "sell" : "buy";
  state.sortBy = raw.sortBy === "volume" ? "volume" : "change";
  state.chartRange = ["1m", "5m", "1d", "1w"].includes(raw.chartRange) ? raw.chartRange : "1m";
  state.favorites = Array.isArray(raw.favorites) ? raw.favorites : [];
  state.news = Array.isArray(raw.news) ? raw.news.slice(0, NEWS_LIMIT) : [];
  state.alerts = Array.isArray(raw.alerts) ? raw.alerts.slice(0, ALERT_LIMIT) : [];
  state.orderHistory = Array.isArray(raw.orderHistory) ? raw.orderHistory.slice(0, ORDER_LIMIT) : [];
  state.autoSellOrders = Array.isArray(raw.autoSellOrders) ? raw.autoSellOrders : [];
  state.watchlistOrder = Array.isArray(raw.watchlistOrder) ? raw.watchlistOrder : [];
  state.isPaused = !!raw.isPaused;
  state.isStopped = !!raw.isStopped;
  state.emergencyFundClaimed = !!raw.emergencyFundClaimed;
  state.searchTerm = typeof raw.searchTerm === "string" ? raw.searchTerm : "";
  state.portfolio = raw.portfolio && typeof raw.portfolio === "object" ? raw.portfolio : { cash: INITIAL_CASH, holdings: {} };

  if (!Number.isFinite(state.portfolio.cash) || state.portfolio.cash < 0) state.portfolio.cash = INITIAL_CASH;
  if (!state.portfolio.holdings || typeof state.portfolio.holdings !== "object") state.portfolio.holdings = {};

  state.stocks = raw.stocks.map(s => {
    if (!s || !Array.isArray(s.candles) || !s.candles.length) return null;
    return {
      code: s.code,
      name: s.name,
      logo: s.logo,
      theme: s.theme,
      prevClose: Number.isFinite(s.prevClose) ? s.prevClose : s.candles[0].open,
      candles: s.candles,
      currentPrice: s.candles[s.candles.length - 1].close,
      currentVolume: s.candles[s.candles.length - 1].volume,
      dayHigh: Math.max(...s.candles.map(c => c.high)),
      dayLow: Math.min(...s.candles.map(c => c.low)),
      mood: Number.isFinite(s.mood) ? s.mood : randInt(35, 65),
      volatility: Number.isFinite(s.volatility) ? s.volatility : rand(0.75, 1.45),
      orderbook: Array.isArray(s.orderbook) && s.orderbook.length ? s.orderbook : []
    };
  }).filter(Boolean);

  if (!state.stocks.length) return false;
  state.stocks.forEach(s => {
    if (!s.orderbook.length) s.orderbook = generateOrderbook(s);
  });

  if (!state.stocks.some(s => s.code === state.selectedCode)) {
    state.selectedCode = state.stocks[0].code;
  }

  if (!state.watchlistOrder.length) rebuildWatchlistOrder();
  return true;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    return sanitizeLoadedState(JSON.parse(raw));
  } catch (e) {
    console.error("loadState error", e);
    return false;
  }
}

function saveState() {
  try {
    const payload = {
      speed: state.speed,
      selectedCode: state.selectedCode,
      orderMode: state.orderMode,
      sortBy: state.sortBy,
      chartRange: state.chartRange,
      favorites: state.favorites,
      news: state.news.slice(0, NEWS_LIMIT),
      alerts: state.alerts.slice(0, ALERT_LIMIT),
      orderHistory: state.orderHistory.slice(0, ORDER_LIMIT),
      autoSellOrders: state.autoSellOrders,
      watchlistOrder: state.watchlistOrder,
      isPaused: state.isPaused,
      isStopped: state.isStopped,
      emergencyFundClaimed: state.emergencyFundClaimed,
      searchTerm: state.searchTerm,
      portfolio: state.portfolio,
      stocks: state.stocks
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("saveState error", e);
  }
}

function rebuildWatchlistOrder() {
  const sorted = [...state.stocks];
  if (state.sortBy === "change") {
    sorted.sort((a, b) => getStockRate(b) - getStockRate(a));
  } else {
    sorted.sort((a, b) => b.currentVolume - a.currentVolume);
  }
  state.watchlistOrder = sorted.map(s => s.code);
}

function addNews(type, stock, title, desc) {
  state.news.unshift({
    id: `${Date.now()}_${Math.random()}`,
    type,
    code: stock ? stock.code : "SYSTEM",
    name: stock ? stock.name : "시스템",
    title,
    desc,
    time: nowTime()
  });
  state.news = state.news.slice(0, NEWS_LIMIT);
}

function addAlert(message, stock = null) {
  state.alerts.unshift({
    id: `${Date.now()}_${Math.random()}`,
    message,
    code: stock ? stock.code : "SYSTEM",
    name: stock ? stock.name : "시스템",
    time: nowTime()
  });
  state.alerts = state.alerts.slice(0, ALERT_LIMIT);
  state.alertCount += 1;
  state.marketAlertCount += 1;
}

function addOrderHistory(type, stock, qty, price, amount, note) {
  state.orderHistory.unshift({
    id: `${Date.now()}_${Math.random()}`,
    type,
    code: stock.code,
    name: stock.name,
    qty,
    price,
    amount,
    note,
    time: nowTime()
  });
  state.orderHistory = state.orderHistory.slice(0, ORDER_LIMIT);
}

function createRandomNews(stock) {
  const pool = [
    { type: "breaking", templates: breakingTemplates },
    { type: "good", templates: goodTemplates },
    { type: "warn", templates: warnTemplates },
    { type: "event", templates: eventTemplates }
  ];
  const picked = pool[randInt(0, pool.length - 1)];
  const title = picked.templates[randInt(0, picked.templates.length - 1)].replace("{name}", stock.name);
  const desc = `${stock.name} · ${stock.theme} 관련 흐름 속에서 현재 ${formatSignedPct(getStockRate(stock))} 변동 중이다.`;
  addNews(picked.type, stock, title, desc);
}

function seedInitialNews() {
  const shuffled = [...STOCK_SEED].sort(() => Math.random() - 0.5).slice(0, 10);
  shuffled.forEach(seed => {
    const stock = state.stocks.find(s => s.code === seed.code);
    if (stock) createRandomNews(stock);
  });
}

function updateOrderbook(stock) {
  stock.orderbook.forEach(row => {
    const oldQty = row.qty;
    row.qty = clamp(oldQty + randInt(-100, 130), 20, 2000);
    row.flash = row.qty > oldQty ? 1 : row.qty < oldQty ? -1 : 0;
  });

  const asks = stock.orderbook.filter(r => r.side === "ask");
  const bids = stock.orderbook.filter(r => r.side === "bid");
  const base = stock.currentPrice;

  asks.forEach((row, idx) => {
    row.price = Math.max(100, Math.round(base * (1 + (asks.length - idx) * 0.002)));
  });
  bids.forEach((row, idx) => {
    row.price = Math.max(100, Math.round(base * (1 - (idx + 1) * 0.002)));
  });
}

function maybeGenerateNews(stock) {
  const rate = Math.abs(getStockRate(stock));
  let chance = 0.01;
  if (rate > 7) chance += 0.02;
  if (stock.currentVolume > 180000) chance += 0.01;
  if (Math.random() < chance) {
    createRandomNews(stock);
    addAlert(`${stock.name} 관련 ${typeLabel(state.news[0].type)} 발생`, stock);
  }
}

function executeMarketSell(code, qty, reason) {
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return false;

  const holding = getHolding(code);
  if (holding.qty <= 0) return false;

  const realQty = Math.min(qty, holding.qty);
  if (realQty <= 0) return false;

  const price = Math.round(stock.currentPrice);
  const amount = price * realQty;
  const fee = feeOf(amount);
  const proceeds = amount - fee;
  const remainQty = holding.qty - realQty;

  state.portfolio.cash += proceeds;

  if (remainQty <= 0) {
    delete state.portfolio.holdings[code];
  } else {
    state.portfolio.holdings[code] = {
      qty: remainQty,
      avgPrice: holding.avgPrice
    };
  }

  addOrderHistory("sell", stock, realQty, price, proceeds, reason);
  addAlert(`${stock.name} 자동매도 실행 · ${realQty.toLocaleString("ko-KR")}주`, stock);
  addNews("event", stock, `${stock.name} 자동매도 체결`, `${reason} 조건이 충족되어 ${realQty.toLocaleString("ko-KR")}주가 자동으로 매도되었다.`);
  return true;
}

function checkAutoSellOrders() {
  if (!state.autoSellOrders.length) return;

  const remain = [];

  state.autoSellOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) return;

    const holding = getHolding(order.code);
    if (holding.qty <= 0) return;

    const current = stock.currentPrice;
    const targetHit = order.targetPrice && current >= order.targetPrice;
    const stopHit = order.stopPrice && current <= order.stopPrice;

    if (!targetHit && !stopHit) {
      remain.push(order);
      return;
    }

    const qty = order.sellAll ? holding.qty : Math.min(order.qty, holding.qty);
    if (qty <= 0) return;

    const reason = targetHit
      ? `목표가 ${formatKRW(order.targetPrice)} 도달`
      : `손절가 ${formatKRW(order.stopPrice)} 도달`;

    executeMarketSell(order.code, qty, reason);
  });

  state.autoSellOrders = remain;
}

function simulateTick() {
  if (state.isPaused || state.isStopped) return;

  for (let loop = 0; loop < state.speed; loop++) {
    state.stocks.forEach(stock => {
      const last = stock.candles[stock.candles.length - 1];
      const rate = getStockRate(stock);
      let drift = 0;

      if (rate > 20) drift -= rand(0.002, 0.006);
      if (rate < -16) drift += rand(0.002, 0.006);

      const move = rand(-0.016, 0.016) * stock.volatility + drift + ((stock.mood - 50) / 10000);
      const open = last.close;
      let close = open * (1 + move);
      close = clamp(close, stock.prevClose * 0.7, stock.prevClose * 1.3);

      const high = Math.max(open, close) * (1 + rand(0.0005, 0.012));
      const low = Math.min(open, close) * (1 - rand(0.0005, 0.012));
      const volume = randInt(10000, 240000) * (1 + Math.abs(move) * 22);

      stock.candles.push({
        time: Date.now(),
        open,
        high,
        low,
        close,
        volume
      });

      if (stock.candles.length > 180) stock.candles.shift();

      stock.currentPrice = close;
      stock.currentVolume = volume;
      stock.dayHigh = Math.max(stock.dayHigh, high);
      stock.dayLow = Math.min(stock.dayLow, low);
      stock.mood = clamp(stock.mood + randInt(-2, 2), 0, 100);

      updateOrderbook(stock);

      if (Math.abs(getStockRate(stock)) >= 29.5 && Math.random() < 0.04) {
        addAlert(`${stock.name} ${getStockRate(stock) > 0 ? "상한가 부근" : "하한가 부근"} 진입`, stock);
      }

      maybeGenerateNews(stock);
    });
  }

  checkAutoSellOrders();
  renderAll();
  queueSave();
}

function compressCandles(candles, step) {
  const out = [];
  for (let i = 0; i < candles.length; i += step) {
    const chunk = candles.slice(i, i + step);
    if (!chunk.length) continue;
    out.push({
      time: chunk[chunk.length - 1].time,
      open: chunk[0].open,
      close: chunk[chunk.length - 1].close,
      high: Math.max(...chunk.map(c => c.high)),
      low: Math.min(...chunk.map(c => c.low)),
      volume: chunk.reduce((sum, c) => sum + c.volume, 0)
    });
  }
  return out;
}

function getDisplayCandles(stock) {
  const all = stock.candles;
  if (state.chartRange === "1m") return all.slice(-80);
  if (state.chartRange === "5m") return compressCandles(all, 5).slice(-80);
  if (state.chartRange === "1d") return compressCandles(all, 10).slice(-80);
  return compressCandles(all, 20).slice(-80);
}

function calcMA(candles, period) {
  const result = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    result.push(sum / period);
  }
  return result;
}

function cacheElements() {
  [
    "totalAssetTop","profitLossTop","cashTop","supportFundBtn","pauseBtn","resumeBtn","stopBtn","alertBellBtn","alertBadge",
    "selectedName","selectedCode","symbolLogo","favoriteToggleBtn","heroStockSelect",
    "selectedPrice","selectedChange","dayHigh","dayLow","dayOpen","dayVolume",
    "moodFill","moodText","priceChart","chartTooltip",
    "holdingQtyInline","avgPriceInline","availableCash","maxBuyQty","currentHoldingQty","currentAvgPrice",
    "buyModeBtn","sellModeBtn","orderPrice","orderQty","quickRow","estimatedCost","estimatedFee","submitOrderBtn",
    "orderbookRows","newsFeed","newsCountChip","orderHistoryList","alertHistoryList","clearHistoryBtn",
    "portfolioTotal","portfolioPL","portfolioCash","portfolioStockValue","portfolioInvested","portfolioRate",
    "favoritesList","marketAlertBadge","watchlist","searchInput",
    "selectedNewsTitleName","selectedNewsCount","selectedNewsFeed",
    "autoSellTargetPrice","autoSellStopPrice","autoSellQty","autoSellAll","addAutoSellBtn","autoSellList",
    "resetBtn"
  ].forEach(id => {
    els[id] = safeGet(id);
  });
}

function buildStockSelect() {
  if (!els.heroStockSelect) {
    console.warn("heroStockSelect 요소를 찾지 못했다.");
    return;
  }

  els.heroStockSelect.innerHTML = "";
  state.stocks.forEach(stock => {
    const opt = document.createElement("option");
    opt.value = stock.code;
    opt.textContent = `${stock.name} (${stock.code})`;
    if (stock.code === state.selectedCode) opt.selected = true;
    els.heroStockSelect.appendChild(opt);
  });
}

function bindEvents() {
  safeAddEvent(els.favoriteToggleBtn, "click", toggleFavorite);
  safeAddEvent(els.heroStockSelect, "change", e => setSelectedStock(e.target.value));

  safeAddEvent(safeGet("speedButtons"), "click", e => {
    const btn = e.target.closest("button[data-speed]");
    if (!btn) return;
    state.speed = Number(btn.dataset.speed);
    updateSpeedButtons();
    queueSave();
  });

  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sortBy = btn.dataset.sort;
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.toggle("active", b === btn));
      rebuildWatchlistOrder();
      renderWatchlist();
      queueSave();
    });
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.chartRange = btn.dataset.chartRange;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      drawChart();
      queueSave();
    });
  });

  document.querySelectorAll(".history-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".history-tab").forEach(b => b.classList.toggle("active", b === btn));
      const tab = btn.dataset.historyTab;
      if (els.orderHistoryList) els.orderHistoryList.classList.toggle("hidden", tab !== "orders");
      if (els.alertHistoryList) els.alertHistoryList.classList.toggle("hidden", tab !== "alerts");
    });
  });

  safeAddEvent(els.buyModeBtn, "click", () => {
    state.orderMode = "buy";
    renderOrderPanel();
    queueSave();
  });

  safeAddEvent(els.sellModeBtn, "click", () => {
    state.orderMode = "sell";
    renderOrderPanel();
    queueSave();
  });

  safeAddEvent(els.quickRow, "click", e => {
    const btn = e.target.closest("button[data-ratio]");
    if (!btn) return;
    applyQuickRatio(Number(btn.dataset.ratio));
  });

  safeAddEvent(els.orderQty, "input", renderOrderEstimate);

  safeAddEvent(els.autoSellAll, "change", () => {
    if (!els.autoSellQty) return;
    if (els.autoSellAll.checked) {
      const holding = getHolding(state.selectedCode);
      els.autoSellQty.value = Math.max(holding.qty, 1);
      els.autoSellQty.disabled = true;
    } else {
      els.autoSellQty.disabled = false;
    }
  });

  safeAddEvent(els.submitOrderBtn, "click", submitOrder);
  safeAddEvent(els.addAutoSellBtn, "click", addAutoSellOrder);

  safeAddEvent(els.supportFundBtn, "click", claimSupportFund);
  safeAddEvent(els.pauseBtn, "click", () => {
    state.isPaused = true;
    state.isStopped = false;
    queueSave();
    renderStatusButtons();
  });
  safeAddEvent(els.resumeBtn, "click", () => {
    state.isPaused = false;
    state.isStopped = false;
    queueSave();
    renderStatusButtons();
  });
  safeAddEvent(els.stopBtn, "click", () => {
    state.isStopped = true;
    state.isPaused = false;
    queueSave();
    renderStatusButtons();
  });
  safeAddEvent(els.resetBtn, "click", resetAllData);

  safeAddEvent(els.alertBellBtn, "click", () => {
    state.alertCount = 0;
    renderAlertBadges();
    queueSave();
  });

  safeAddEvent(els.clearHistoryBtn, "click", () => {
    state.orderHistory = [];
    state.alerts = [];
    state.alertCount = 0;
    state.marketAlertCount = 0;
    renderHistory();
    renderAlertBadges();
    queueSave();
  });

  safeAddEvent(els.searchInput, "input", e => {
    state.searchTerm = String(e.target.value || "").trim();
    renderWatchlist();
  });

  safeAddEvent(els.priceChart, "mousemove", handleChartHover);
  safeAddEvent(els.priceChart, "mouseleave", () => {
    state.hoverIndex = -1;
    if (els.chartTooltip) els.chartTooltip.classList.add("hidden");
    drawChart();
  });
}

function claimSupportFund() {
  if (state.emergencyFundClaimed) {
    addAlert("긴급지원금은 이미 지급되었다.");
    renderHistory();
    return;
  }
  if (state.portfolio.cash > SUPPORT_FUND_LIMIT) {
    addAlert(`긴급지원금은 현금 ${formatKRW(SUPPORT_FUND_LIMIT)} 이하일 때만 가능하다.`);
    renderHistory();
    return;
  }

  state.portfolio.cash += SUPPORT_FUND;
  state.emergencyFundClaimed = true;
  addAlert(`긴급지원금 ${formatKRW(SUPPORT_FUND)} 지급 완료`);
  renderAll();
  queueSave();
}

function resetAllData() {
  const ok = window.confirm("정말 초기화할까? 보유 종목, 주문 기록, 자동매도, 알림이 모두 초기화된다.");
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  buildInitialState();
  renderAll();
  queueSave();
}

function setSelectedStock(code) {
  if (!state.stocks.some(s => s.code === code)) return;
  state.selectedCode = code;
  renderAll();
  queueSave();
}

function toggleFavorite() {
  const stock = getSelectedStock();
  if (!stock) return;

  if (state.favorites.includes(stock.code)) {
    state.favorites = state.favorites.filter(code => code !== stock.code);
  } else {
    state.favorites.push(stock.code);
  }

  renderHero();
  renderWatchlist();
  queueSave();
}

function applyQuickRatio(ratio) {
  const stock = getSelectedStock();
  if (!stock || !els.orderQty) return;

  let qty = 1;
  if (state.orderMode === "buy") {
    const maxQty = Math.floor(state.portfolio.cash / stock.currentPrice);
    qty = ratio === 100 ? maxQty : Math.floor(maxQty * (ratio / 100));
  } else {
    const holding = getHolding(stock.code);
    qty = ratio === 100 ? holding.qty : Math.floor(holding.qty * (ratio / 100));
  }

  els.orderQty.value = Math.max(qty, 1);
  renderOrderEstimate();
}

function submitOrder() {
  const stock = getSelectedStock();
  if (!stock) return;

  const qty = Math.floor(Number(els.orderQty?.value || 0));
  if (!qty || qty <= 0) {
    addAlert("수량을 올바르게 입력해 주세요.", stock);
    renderHistory();
    return;
  }

  const executionPrice = Math.round(stock.currentPrice);
  const amount = executionPrice * qty;
  const fee = feeOf(amount);

  if (state.orderMode === "buy") {
    const totalNeed = amount + fee;
    if (state.portfolio.cash < totalNeed) {
      addAlert(`잔액 부족 · 필요금액 ${formatKRW(totalNeed)}`, stock);
      renderHistory();
      return;
    }

    const holding = getHolding(stock.code);
    const nextQty = holding.qty + qty;
    const nextAvg = Math.round(((holding.avgPrice * holding.qty) + amount) / nextQty);

    state.portfolio.cash -= totalNeed;
    state.portfolio.holdings[stock.code] = {
      qty: nextQty,
      avgPrice: nextAvg
    };

    addOrderHistory("buy", stock, qty, executionPrice, totalNeed, "현재가 기준 체결");
    addAlert(`${stock.name} 매수 체결 · ${qty.toLocaleString("ko-KR")}주`, stock);
  } else {
    const holding = getHolding(stock.code);
    if (holding.qty < qty) {
      addAlert(`보유 수량 부족 · 최대 ${holding.qty.toLocaleString("ko-KR")}주`, stock);
      renderHistory();
      return;
    }

    const proceeds = amount - fee;
    state.portfolio.cash += proceeds;

    const remainQty = holding.qty - qty;
    if (remainQty <= 0) {
      delete state.portfolio.holdings[stock.code];
    } else {
      state.portfolio.holdings[stock.code] = {
        qty: remainQty,
        avgPrice: holding.avgPrice
      };
    }

    addOrderHistory("sell", stock, qty, executionPrice, proceeds, "현재가 기준 체결");
    addAlert(`${stock.name} 매도 체결 · ${qty.toLocaleString("ko-KR")}주`, stock);
  }

  if (els.orderQty) els.orderQty.value = "1";
  renderAll();
  queueSave();
}

function addAutoSellOrder() {
  const stock = getSelectedStock();
  if (!stock) return;

  const holding = getHolding(stock.code);
  if (holding.qty <= 0) {
    addAlert("보유 수량이 있어야 자동매도를 등록할 수 있다.", stock);
    renderHistory();
    return;
  }

  const targetPrice = Math.floor(Number(els.autoSellTargetPrice?.value || 0));
  const stopPrice = Math.floor(Number(els.autoSellStopPrice?.value || 0));
  const sellAll = !!els.autoSellAll?.checked;
  let qty = Math.floor(Number(els.autoSellQty?.value || 0));

  if (!targetPrice && !stopPrice) {
    addAlert("목표가 또는 손절가를 하나 이상 입력해야 한다.", stock);
    renderHistory();
    return;
  }

  if (sellAll) qty = holding.qty;
  if (!qty || qty <= 0) {
    addAlert("자동매도 수량을 올바르게 입력해 주세요.", stock);
    renderHistory();
    return;
  }

  qty = Math.min(qty, holding.qty);

  state.autoSellOrders.push({
    id: `${Date.now()}_${Math.random()}`,
    code: stock.code,
    targetPrice: targetPrice || 0,
    stopPrice: stopPrice || 0,
    qty,
    sellAll
  });

  if (els.autoSellTargetPrice) els.autoSellTargetPrice.value = "";
  if (els.autoSellStopPrice) els.autoSellStopPrice.value = "";
  if (els.autoSellQty) {
    els.autoSellQty.value = "1";
    els.autoSellQty.disabled = false;
  }
  if (els.autoSellAll) els.autoSellAll.checked = false;

  addAlert(`${stock.name} 자동매도 등록`, stock);
  renderAutoSellList();
  renderHistory();
  queueSave();
}

function deleteAutoSellOrder(id) {
  state.autoSellOrders = state.autoSellOrders.filter(order => order.id !== id);
  renderAutoSellList();
  queueSave();
}

function getVisibleStocks() {
  const byOrder = state.watchlistOrder
    .map(code => state.stocks.find(s => s.code === code))
    .filter(Boolean);

  const term = String(state.searchTerm || "").toLowerCase();
  let arr = byOrder;

  if (term) {
    arr = arr.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      s.theme.toLowerCase().includes(term)
    );
  }

  const favorites = arr.filter(s => state.favorites.includes(s.code));
  const rest = arr.filter(s => !state.favorites.includes(s.code));
  return favorites.concat(rest);
}

function renderTopSummary() {
  safeText(els.totalAssetTop, formatKRW(getTotalAsset()));

  if (els.profitLossTop) {
    const pl = getProfitLoss();
    els.profitLossTop.textContent = formatSignedKRW(pl);
    els.profitLossTop.classList.toggle("up", pl >= 0);
    els.profitLossTop.classList.toggle("down", pl < 0);
  }

  safeText(els.cashTop, formatKRW(state.portfolio.cash));

  if (els.supportFundBtn) {
    els.supportFundBtn.textContent = "긴급지원금 +50만원";
    const enabled = !state.emergencyFundClaimed && state.portfolio.cash <= SUPPORT_FUND_LIMIT;
    els.supportFundBtn.disabled = !enabled;
    els.supportFundBtn.style.opacity = enabled ? "1" : "0.5";
    els.supportFundBtn.style.cursor = enabled ? "pointer" : "not-allowed";
  }
}

function renderHero() {
  const stock = getSelectedStock();
  if (!stock) return;

  safeText(els.symbolLogo, stock.logo);
  safeText(els.selectedName, stock.name);
  safeText(els.selectedCode, `${stock.code} · ${stock.theme}`);
  safeText(els.selectedPrice, formatKRW(stock.currentPrice));

  const diff = stock.currentPrice - stock.prevClose;
  const rate = getStockRate(stock);
  if (els.selectedChange) {
    els.selectedChange.textContent = `${formatSignedKRW(diff)} (${formatSignedPct(rate)})`;
    els.selectedChange.classList.toggle("up", diff >= 0);
    els.selectedChange.classList.toggle("down", diff < 0);
  }

  safeText(els.dayHigh, formatKRW(stock.dayHigh));
  safeText(els.dayLow, formatKRW(stock.dayLow));
  safeText(els.dayOpen, formatKRW(stock.prevClose));
  safeText(els.dayVolume, formatVolume(stock.currentVolume));

  if (els.favoriteToggleBtn) {
    els.favoriteToggleBtn.textContent = state.favorites.includes(stock.code) ? "★" : "☆";
  }

  safeText(els.selectedNewsTitleName, stock.name);

  const mood = clamp(stock.mood, 0, 100);
  if (els.moodFill) els.moodFill.style.width = `${mood}%`;
  if (els.moodText) {
    els.moodText.textContent =
      mood >= 67 ? "강세" :
      mood <= 33 ? "약세" :
      "중립";
  }
}

function updateSpeedButtons() {
  document.querySelectorAll("#speedButtons button[data-speed]").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.speed) === state.speed);
  });
}

function renderStatusButtons() {
  if (els.pauseBtn) els.pauseBtn.disabled = state.isPaused;
  if (els.resumeBtn) els.resumeBtn.disabled = !state.isPaused && !state.isStopped;
  if (els.stopBtn) els.stopBtn.disabled = state.isStopped;
}

function renderOrderPanel() {
  const stock = getSelectedStock();
  if (!stock) return;

  const holding = getHolding(stock.code);
  const currentPrice = Math.round(stock.currentPrice);
  const maxBuyQty = Math.max(0, Math.floor(state.portfolio.cash / (currentPrice + feeOf(currentPrice))));

  safeText(els.holdingQtyInline, `${holding.qty.toLocaleString("ko-KR")}주`);
  safeText(els.avgPriceInline, formatKRW(holding.avgPrice || 0));
  safeText(els.availableCash, formatKRW(state.portfolio.cash));
  safeText(els.maxBuyQty, `${maxBuyQty.toLocaleString("ko-KR")}주`);
  safeText(els.currentHoldingQty, `${holding.qty.toLocaleString("ko-KR")}주`);
  safeText(els.currentAvgPrice, formatKRW(holding.avgPrice || 0));

  if (els.orderPrice) {
    els.orderPrice.value = String(currentPrice);
    els.orderPrice.readOnly = true;
    els.orderPrice.setAttribute("readonly", "readonly");
    els.orderPrice.style.opacity = "0.85";
    els.orderPrice.title = "현재가 기준으로만 체결된다";
  }

  if (els.buyModeBtn) els.buyModeBtn.classList.toggle("active", state.orderMode === "buy");
  if (els.sellModeBtn) els.sellModeBtn.classList.toggle("active", state.orderMode === "sell");

  if (els.submitOrderBtn) {
    els.submitOrderBtn.textContent = state.orderMode === "buy" ? "매수 실행" : "매도 실행";
    els.submitOrderBtn.classList.toggle("buy", state.orderMode === "buy");
    els.submitOrderBtn.classList.toggle("sell", state.orderMode === "sell");
  }

  if (els.quickRow) {
    const buyButtons = `
      <button type="button" data-ratio="25">25%</button>
      <button type="button" data-ratio="50">50%</button>
      <button type="button" data-ratio="75">75%</button>
      <button type="button" data-ratio="100">100%</button>
    `;
    const sellButtons = `
      <button type="button" data-ratio="25">25%</button>
      <button type="button" data-ratio="50">50%</button>
      <button type="button" data-ratio="75">75%</button>
      <button type="button" data-ratio="100">전량</button>
    `;
    els.quickRow.innerHTML = state.orderMode === "buy" ? buyButtons : sellButtons;
  }

  const autoSellBlock = document.querySelector(".auto-sell-block");
  if (autoSellBlock) {
    autoSellBlock.style.display = state.orderMode === "sell" ? "" : "none";
  }

  renderOrderEstimate();
  renderAutoSellList();
}

function renderOrderEstimate() {
  const stock = getSelectedStock();
  if (!stock) return;

  const qty = Math.max(1, Math.floor(Number(els.orderQty?.value || 1)));
  const executionPrice = Math.round(stock.currentPrice);
  const amount = executionPrice * qty;
  const fee = feeOf(amount);

  if (els.estimatedCost) {
    const viewAmount = state.orderMode === "buy" ? amount + fee : amount - fee;
    els.estimatedCost.textContent = formatKRW(viewAmount);
  }
  safeText(els.estimatedFee, formatKRW(fee));
}

function renderOrderbook() {
  if (!els.orderbookRows) return;
  const stock = getSelectedStock();
  if (!stock) return;

  els.orderbookRows.innerHTML = "";

  const asks = stock.orderbook.filter(r => r.side === "ask");
  const bids = stock.orderbook.filter(r => r.side === "bid");
  const maxQty = Math.max(...stock.orderbook.map(r => r.qty), 1);

  for (let i = 0; i < 10; i++) {
    const ask = asks[i];
    const bid = bids[i];
    if (!ask || !bid) continue;

    const row = document.createElement("div");
    row.className = "orderbook-row";
    row.innerHTML = `
      <div class="orderbook-cell ask">
        <div class="depth ask-depth" style="width:${(ask.qty / maxQty) * 100}%"></div>
        <span>${ask.qty.toLocaleString("ko-KR")}</span>
      </div>
      <div class="orderbook-cell price ${ask.price >= stock.currentPrice ? "up" : "down"}">${formatKRW(ask.price)}</div>
      <div class="orderbook-cell bid">
        <div class="depth bid-depth" style="width:${(bid.qty / maxQty) * 100}%"></div>
        <span>${bid.qty.toLocaleString("ko-KR")}</span>
      </div>
    `;
    els.orderbookRows.appendChild(row);
  }
}

function renderSelectedNews() {
  if (!els.selectedNewsFeed || !els.selectedNewsCount) return;
  const stock = getSelectedStock();
  if (!stock) return;

  const items = state.news.filter(n => n.code === stock.code).slice(0, 8);
  els.selectedNewsCount.textContent = `${items.length}건`;

  if (!items.length) {
    els.selectedNewsFeed.innerHTML = `<div class="news-empty">아직 뉴스가 없다</div>`;
    return;
  }

  els.selectedNewsFeed.innerHTML = items.map(item => `
    <div class="news-item ${item.type}">
      <div class="news-item-top">
        <span class="chip ${item.type}">${typeLabel(item.type)}</span>
        <span class="news-time">${item.time}</span>
      </div>
      <div class="news-title">${item.title}</div>
      <div class="news-desc">${item.desc}</div>
    </div>
  `).join("");
}

function renderHistory() {
  if (els.orderHistoryList) {
    if (!state.orderHistory.length) {
      els.orderHistoryList.innerHTML = `<div class="history-empty">주문 기록이 없다</div>`;
    } else {
      els.orderHistoryList.innerHTML = state.orderHistory.slice(0, 20).map(item => `
        <div class="history-item">
          <div class="history-top">
            <b>${item.type === "buy" ? "매수" : "매도"} · ${item.name}</b>
            <span>${item.time}</span>
          </div>
          <div class="history-bottom">${item.qty.toLocaleString("ko-KR")}주 · ${formatKRW(item.price)} · ${formatKRW(item.amount)}</div>
        </div>
      `).join("");
    }
  }

  if (els.alertHistoryList) {
    if (!state.alerts.length) {
      els.alertHistoryList.innerHTML = `<div class="history-empty">알림이 없다</div>`;
    } else {
      els.alertHistoryList.innerHTML = state.alerts.slice(0, 20).map(item => `
        <div class="history-item">
          <div class="history-top">
            <b>${item.name}</b>
            <span>${item.time}</span>
          </div>
          <div class="history-bottom">${item.message}</div>
        </div>
      `).join("");
    }
  }
}

function renderPortfolio() {
  safeText(els.portfolioTotal, formatKRW(getTotalAsset()));
  safeText(els.portfolioPL, formatSignedKRW(getProfitLoss()));
  safeText(els.portfolioCash, formatKRW(state.portfolio.cash));
  safeText(els.portfolioStockValue, formatKRW(getStockEvaluation()));
  safeText(els.portfolioInvested, formatKRW(getInvestedAmount()));
  safeText(els.portfolioRate, `${getProfitRate().toFixed(2)}%`);
}

function renderWatchlist() {
  const watchlistEl = els.watchlist;
  const favoritesEl = els.favoritesList;
  const marketAlertBadge = els.marketAlertBadge;
  const visibleStocks = getVisibleStocks();

  safeText(marketAlertBadge, String(state.marketAlertCount || 0));

  if (favoritesEl) {
    const favs = visibleStocks.filter(s => state.favorites.includes(s.code));
    favoritesEl.innerHTML = favs.length
      ? favs.map(stock => `<button type="button" class="favorite-stock-chip" data-code="${stock.code}">${stock.name}</button>`).join("")
      : `<div class="empty-line">즐겨찾기한 종목이 없다</div>`;

    favoritesEl.querySelectorAll("[data-code]").forEach(btn => {
      btn.addEventListener("click", () => setSelectedStock(btn.dataset.code));
    });
  }

  if (!watchlistEl) return;

  if (!visibleStocks.length) {
    watchlistEl.innerHTML = `<div class="watch-empty">표시할 종목이 없다</div>`;
    return;
  }

  watchlistEl.innerHTML = visibleStocks.map(stock => {
    const rate = getStockRate(stock);
    const isFavorite = state.favorites.includes(stock.code);
    return `
      <button type="button" class="watch-item ${stock.code === state.selectedCode ? "active" : ""}" data-code="${stock.code}">
        <div class="watch-left">
          <div class="watch-logo">${stock.logo}</div>
          <div>
            <div class="watch-name-row">
              <span class="watch-name">${stock.name}</span>
              <span class="watch-fav">${isFavorite ? "★" : ""}</span>
            </div>
            <div class="watch-meta">${stock.code} · ${stock.theme}</div>
          </div>
        </div>
        <div class="watch-right">
          <div class="watch-price">${formatKRW(stock.currentPrice)}</div>
          <div class="watch-rate ${rate >= 0 ? "up" : "down"}">${formatSignedPct(rate)}</div>
          <div class="watch-vol">${formatVolume(stock.currentVolume)}</div>
        </div>
      </button>
    `;
  }).join("");

  watchlistEl.querySelectorAll("[data-code]").forEach(btn => {
    btn.addEventListener("click", () => setSelectedStock(btn.dataset.code));
  });
}

function renderAutoSellList() {
  if (!els.autoSellList) return;
  const stock = getSelectedStock();
  if (!stock) return;

  const list = state.autoSellOrders.filter(order => order.code === stock.code);
  if (!list.length) {
    els.autoSellList.innerHTML = `<div class="empty-line">등록된 자동매도가 없다</div>`;
    return;
  }

  els.autoSellList.innerHTML = list.map(order => `
    <div class="auto-sell-item">
      <div class="auto-sell-item-main">
        <div>목표가 ${order.targetPrice ? formatKRW(order.targetPrice) : "-"}</div>
        <div>손절가 ${order.stopPrice ? formatKRW(order.stopPrice) : "-"}</div>
        <div>${order.sellAll ? "전량매도" : `${order.qty.toLocaleString("ko-KR")}주`}</div>
      </div>
      <button type="button" class="ghost-btn delete-auto-sell-btn" data-id="${order.id}">삭제</button>
    </div>
  `).join("");

  els.autoSellList.querySelectorAll(".delete-auto-sell-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteAutoSellOrder(btn.dataset.id));
  });
}

function renderAlertBadges() {
  safeText(els.alertBadge, String(state.alertCount || 0));
}

function compressDateLabel(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function drawMALine(ctx, lineData, candles, pad, chartWidth, priceToY, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;

  lineData.forEach((value, i) => {
    if (value == null) return;
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    const y = priceToY(value);
    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

function drawChart() {
  const canvas = els.priceChart;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const stock = getSelectedStock();
  if (!stock) return;

  const candles = getDisplayCandles(stock);
  if (!candles.length) return;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const ma5 = calcMA(candles, 5);
  const ma20 = calcMA(candles, 20);
  const ma60 = calcMA(candles, 60);

  const pad = { left: 70, right: 76, top: 26, bottom: 120 };
  const chartWidth = CANVAS_W - pad.left - pad.right;
  const chartHeight = CANVAS_H - pad.top - pad.bottom;
  const volumeTop = CANVAS_H - 95;
  const volumeHeight = 60;

  const maxPrice = Math.max(...candles.map(c => c.high)) * 1.01;
  const minPrice = Math.min(...candles.map(c => c.low)) * 0.99;
  const maxVol = Math.max(...candles.map(c => c.volume), 1);

  const priceToY = value => pad.top + ((maxPrice - value) / (maxPrice - minPrice || 1)) * chartHeight;

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(CANVAS_W - pad.right, y);
    ctx.stroke();
  }

  const candleWidth = Math.max(5, (chartWidth / candles.length) * 0.58);

  candles.forEach((candle, i) => {
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    const openY = priceToY(candle.open);
    const closeY = priceToY(candle.close);
    const highY = priceToY(candle.high);
    const lowY = priceToY(candle.low);
    const isUp = candle.close >= candle.open;

    ctx.strokeStyle = isUp ? "#ff6d8a" : "#2fd2a3";
    ctx.fillStyle = isUp ? "#ff6d8a" : "#2fd2a3";

    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

    const volHeight = (candle.volume / maxVol) * volumeHeight;
    ctx.fillStyle = "rgba(89,151,255,0.4)";
    ctx.fillRect(x - candleWidth / 2, volumeTop + (volumeHeight - volHeight), candleWidth, volHeight);
  });

  drawMALine(ctx, ma5, candles, pad, chartWidth, priceToY, "#ff6d8a");
  drawMALine(ctx, ma20, candles, pad, chartWidth, priceToY, "#ffb24d");
  drawMALine(ctx, ma60, candles, pad, chartWidth, priceToY, "#ae7dff");

  ctx.fillStyle = "rgba(214,224,255,0.85)";
  ctx.font = "12px Pretendard, sans-serif";
  for (let i = 0; i <= 5; i++) {
    const ratio = i / 5;
    const price = maxPrice - (maxPrice - minPrice) * ratio;
    const y = pad.top + (chartHeight / 5) * i + 4;
    ctx.fillText(formatKRW(price), 8, y);
  }

  ctx.fillStyle = "rgba(180,195,230,0.72)";
  const step = Math.max(1, Math.floor(candles.length / 6));
  for (let i = 0; i < candles.length; i += step) {
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    ctx.fillText(compressDateLabel(candles[i].time), x - 16, CANVAS_H - 20);
  }

  if (state.hoverIndex >= 0 && state.hoverIndex < candles.length) {
    const hover = candles[state.hoverIndex];
    const x = pad.left + (state.hoverIndex + 0.5) * (chartWidth / candles.length);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, volumeTop + volumeHeight);
    ctx.stroke();

    if (els.chartTooltip) {
      els.chartTooltip.classList.remove("hidden");
      els.chartTooltip.innerHTML = `
        <div><b>${compressDateLabel(hover.time)}</b></div>
        <div>시가 ${formatKRW(hover.open)}</div>
        <div>고가 ${formatKRW(hover.high)}</div>
        <div>저가 ${formatKRW(hover.low)}</div>
        <div>종가 ${formatKRW(hover.close)}</div>
        <div>거래량 ${formatVolume(hover.volume)}</div>
      `;
    }
  }
}

function handleChartHover(e) {
  const canvas = els.priceChart;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const stock = getSelectedStock();
  if (!stock) return;

  const candles = getDisplayCandles(stock);
  const padLeft = 70;
  const padRight = 76;
  const chartWidth = CANVAS_W - padLeft - padRight;
  const innerX = (x / rect.width) * CANVAS_W - padLeft;
  const idx = Math.floor((innerX / chartWidth) * candles.length);

  state.hoverIndex = clamp(idx, 0, candles.length - 1);

  if (els.chartTooltip) {
    els.chartTooltip.style.left = `${Math.min(rect.width - 190, x + 14)}px`;
    els.chartTooltip.style.top = `${Math.max(18, e.clientY - rect.top - 120)}px`;
  }

  drawChart();
}

function renderAll() {
  buildStockSelect();
  renderTopSummary();
  renderHero();
  updateSpeedButtons();
  renderStatusButtons();
  renderOrderPanel();
  renderOrderbook();
  renderSelectedNews();
  renderHistory();
  renderPortfolio();
  renderWatchlist();
  renderAutoSellList();
  renderAlertBadges();
  drawChart();
}

function ensureSafeStartup() {
  if (!loadState()) {
    buildInitialState();
    saveState();
    return;
  }

  if (!state.stocks.length) {
    buildInitialState();
    saveState();
  }
}

function startLoop() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(simulateTick, 1000);
}

function init() {
  cacheElements();
  ensureSafeStartup();
  bindEvents();

  if (els.orderQty && (!els.orderQty.value || Number(els.orderQty.value) < 1)) {
    els.orderQty.value = "1";
  }

  renderAll();
  startLoop();
}

window.init = init;

document.addEventListener("DOMContentLoaded", () => {
  try {
    init();
  } catch (err) {
    console.error("INIT ERROR:", err);
    alert("초기 실행 중 오류가 발생했다. 콘솔의 INIT ERROR를 확인해줘.");
  }
});
