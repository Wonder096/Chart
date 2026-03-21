const STORAGE_KEY = "k_mock_trading_pro_v8_secure_order";
const INITIAL_CASH = 1000000;
const SUPPORT_FUND = 500000;
const SUPPORT_FUND_LIMIT = 500000;
const NEWS_LIMIT = 100;
const ORDER_LIMIT = 200;
const ALERT_LIMIT = 200;
const CANVAS_W = 1280;
const CANVAS_H = 700;

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
  searchTerm: "",
  chartRange: "1m",
  hoverIndex: -1,
  alertCount: 0,
  marketAlertCount: 0,
  isPaused: false,
  isStopped: false,
  supportFundClaimed: false,
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
      time: `T-${140 - i}`,
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

function getSelectedStock() {
  return state.stocks.find(s => s.code === state.selectedCode) || state.stocks[0];
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
  return ((getTotalAsset() - INITIAL_CASH) / INITIAL_CASH) * 100;
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
  state.speed = 1;
  state.orderMode = "buy";
  state.sortBy = "change";
  state.chartRange = "1m";
  state.selectedCode = "KQ001";
  state.searchTerm = "";
  state.hoverIndex = -1;
  state.supportFundClaimed = false;

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
  saveState();
}

function sanitizeLoadedState(raw) {
  if (!raw || typeof raw !== "object") return false;
  if (!Array.isArray(raw.stocks) || !raw.stocks.length) return false;

  state.speed = Number(raw.speed) || 1;
  state.selectedCode = raw.selectedCode || "KQ001";
  state.orderMode = raw.orderMode === "sell" ? "sell" : "buy";
  state.sortBy = raw.sortBy === "volume" ? "volume" : "change";
  state.chartRange = ["1m", "5m", "1d", "1w"].includes(raw.chartRange) ? raw.chartRange : "1m";
  state.favorites = Array.isArray(raw.favorites) ? raw.favorites : [];
  state.news = Array.isArray(raw.news) ? raw.news : [];
  state.alerts = Array.isArray(raw.alerts) ? raw.alerts : [];
  state.orderHistory = Array.isArray(raw.orderHistory) ? raw.orderHistory : [];
  state.autoSellOrders = Array.isArray(raw.autoSellOrders) ? raw.autoSellOrders : [];
  state.watchlistOrder = Array.isArray(raw.watchlistOrder) ? raw.watchlistOrder : [];
  state.isPaused = !!raw.isPaused;
  state.isStopped = !!raw.isStopped;
  state.supportFundClaimed = !!raw.supportFundClaimed;
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
      prevClose: s.prevClose || s.candles[0].open,
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
    console.error(e);
    return false;
  }
}

function saveState() {
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
    supportFundClaimed: state.supportFundClaimed,
    portfolio: state.portfolio,
    stocks: state.stocks
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
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
  const fee = Math.round(amount * 0.0015);
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
      close = clamp(close, stock.prevClose * 0.70, stock.prevClose * 1.30);

      const high = Math.max(open, close) * (1 + rand(0.0005, 0.012));
      const low = Math.min(open, close) * (1 - rand(0.0005, 0.012));
      const volume = randInt(10000, 240000) * (1 + Math.abs(move) * 22);

      stock.candles.push({
        time: `${Date.now()}`,
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
  saveState();
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
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const ma5 = calcMA(candles, 5);
  const ma20 = calcMA(candles, 20);
  const ma60 = calcMA(candles, 60);

  const pad = { left: 70, right: 76, top: 26, bottom: 74 };
  const volumeH = 160;
  const chartBottom = CANVAS_H - pad.bottom - volumeH - 14;
  const chartTop = pad.top;
  const chartHeight = chartBottom - chartTop;
  const chartWidth = CANVAS_W - pad.left - pad.right;
  const volTop = chartBottom + 24;
  const volHeight = volumeH - 24;

  const maxPrice = Math.max(...candles.map(c => c.high)) * 1.02;
  const minPrice = Math.min(...candles.map(c => c.low)) * 0.98;
  const maxVolume = Math.max(...candles.map(c => c.volume), 1);

  ctx.fillStyle = "#0b1120";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = chartTop + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(CANVAS_W - pad.right, y);
    ctx.stroke();
  }
  for (let i = 0; i <= 6; i++) {
    const x = pad.left + (chartWidth / 6) * i;
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, CANVAS_H - pad.bottom);
    ctx.stroke();
  }

  const candleW = (chartWidth / candles.length) * 0.64;

  function priceToY(price) {
    return chartTop + ((maxPrice - price) / (maxPrice - minPrice)) * chartHeight;
  }

  function volToY(volume) {
    return volTop + volHeight - (volume / maxVolume) * volHeight;
  }

  candles.forEach((c, i) => {
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    const openY = priceToY(c.open);
    const closeY = priceToY(c.close);
    const highY = priceToY(c.high);
    const lowY = priceToY(c.low);
    const up = c.close >= c.open;

    ctx.strokeStyle = up ? "#ff6482" : "#5daeff";
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    ctx.fillStyle = up ? "#ff5f82" : "#4f95ff";
    ctx.fillRect(x - candleW / 2, Math.min(openY, closeY), candleW, Math.max(2, Math.abs(closeY - openY)));

    const vy = volToY(c.volume);
    ctx.fillStyle = up ? "rgba(255,95,130,.92)" : "rgba(79,149,255,.92)";
    ctx.fillRect(x - candleW / 2, vy, candleW, volTop + volHeight - vy);
  });

  drawMALine(ctx, ma5, candles, pad, chartWidth, priceToY, "#ff8da3");
  drawMALine(ctx, ma20, candles, pad, chartWidth, priceToY, "#ff9a4d");
  drawMALine(ctx, ma60, candles, pad, chartWidth, priceToY, "#b97cff");

  ctx.fillStyle = "#9fb3db";
  ctx.font = "12px Pretendard, sans-serif";
  ctx.textAlign = "right";

  for (let i = 0; i <= 5; i++) {
    const y = chartTop + (chartHeight / 5) * i;
    const price = maxPrice - ((maxPrice - minPrice) / 5) * i;
    ctx.fillText(formatKRW(price), CANVAS_W - 12, y + 4);
  }

  for (let i = 0; i <= 2; i++) {
    const y = volTop + (volHeight / 2) * i;
    const vol = maxVolume - (maxVolume / 2) * i;
    ctx.fillText(formatVolume(vol), CANVAS_W - 12, y + 4);
  }

  ctx.fillStyle = "rgba(255,255,255,.92)";
  ctx.textAlign = "left";
  ctx.fillText("가격", 18, 28);
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.fillText("거래량", 18, volTop - 8);

  if (state.hoverIndex >= 0 && state.hoverIndex < candles.length) {
    const i = state.hoverIndex;
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    const c = candles[i];

    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, CANVAS_H - pad.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    els.chartTooltip.classList.remove("hidden");
    els.chartTooltip.innerHTML = `
      <div><b>${stock.name}</b></div>
      <div>시가: ${formatKRW(c.open)}</div>
      <div>고가: ${formatKRW(c.high)}</div>
      <div>저가: ${formatKRW(c.low)}</div>
      <div>종가: ${formatKRW(c.close)}</div>
      <div>거래량: ${formatVolume(c.volume)}</div>
    `;

    const rect = canvas.getBoundingClientRect();
    const ratioX = rect.width / CANVAS_W;
    const ratioY = rect.height / CANVAS_H;
    els.chartTooltip.style.left = `${Math.min((x * ratioX) + 16, rect.width - 220)}px`;
    els.chartTooltip.style.top = `${Math.min((priceToY(c.high) * ratioY) + 12, rect.height - 150)}px`;
  } else {
    els.chartTooltip.classList.add("hidden");
  }
}

function renderHeroSelect() {
  els.heroStockSelect.innerHTML = state.stocks.map(stock => `
    <option value="${stock.code}" ${stock.code === state.selectedCode ? "selected" : ""}>
      ${stock.name} (${stock.code})
    </option>
  `).join("");
}

function renderQuickButtons() {
  if (state.orderMode === "buy") {
    els.quickRow.innerHTML = `
      <button type="button" data-ratio="0.1">10%</button>
      <button type="button" data-ratio="0.25">25%</button>
      <button type="button" data-ratio="0.5">50%</button>
      <button type="button" data-ratio="1">최대</button>
    `;
  } else {
    els.quickRow.innerHTML = `
      <button type="button" data-ratio="0.1">10%</button>
      <button type="button" data-ratio="0.25">25%</button>
      <button type="button" data-ratio="0.5">50%</button>
      <button type="button" data-ratio="1">최대</button>
      <button type="button" id="sellAllBtn">전량매도</button>
    `;
  }
}

function renderSelectedHeader() {
  const stock = getSelectedStock();
  const rate = getStockRate(stock);
  const diff = stock.currentPrice - stock.prevClose;
  const holding = getHolding(stock.code);

  els.selectedName.textContent = stock.name;
  els.selectedCode.textContent = `${stock.code} · ${stock.theme}`;
  els.symbolLogo.textContent = stock.logo;
  els.selectedPrice.textContent = formatKRW(stock.currentPrice);
  els.selectedChange.textContent = `${formatSignedKRW(diff)} (${formatSignedPct(rate)})`;
  els.selectedChange.className = `main-change ${rate >= 0 ? "positive" : "negative"}`;
  els.dayHigh.textContent = formatKRW(stock.dayHigh);
  els.dayLow.textContent = formatKRW(stock.dayLow);
  els.dayOpen.textContent = formatKRW(stock.candles[0].open);
  els.dayVolume.textContent = formatVolume(stock.candles.reduce((sum, c) => sum + c.volume, 0));
  els.favoriteToggleBtn.textContent = state.favorites.includes(stock.code) ? "★" : "☆";

  els.holdingQtyInline.textContent = `${holding.qty.toLocaleString("ko-KR")}주`;
  els.avgPriceInline.textContent = holding.qty > 0 ? formatKRW(holding.avgPrice) : "0원";
  els.availableCash.textContent = formatKRW(state.portfolio.cash);
  els.maxBuyQty.textContent = `${Math.floor(state.portfolio.cash / Math.max(1, stock.currentPrice)).toLocaleString("ko-KR")}주`;
  els.currentHoldingQty.textContent = `${holding.qty.toLocaleString("ko-KR")}주`;
  els.currentAvgPrice.textContent = holding.qty > 0 ? formatKRW(holding.avgPrice) : "0원";
  els.moodFill.style.width = `${stock.mood}%`;
  els.moodText.textContent = stock.mood >= 68 ? "매수 우위" : stock.mood <= 34 ? "매도 우위" : "중립";

  els.orderPrice.value = Math.round(stock.currentPrice);
  els.livePriceText.textContent = formatKRW(stock.currentPrice);

  updateEstimate();
  updateSupportFundButton();
}

function renderPortfolio() {
  const total = getTotalAsset();
  const stockValue = getStockEvaluation();
  const invested = getInvestedAmount();
  const pl = getProfitLoss();
  const rate = getProfitRate();

  els.totalAssetTop.textContent = formatKRW(total);
  els.profitLossTop.textContent = formatSignedKRW(pl);
  els.cashTop.textContent = formatKRW(state.portfolio.cash);

  els.portfolioTotal.textContent = formatKRW(total);
  els.portfolioPL.textContent = `${formatSignedKRW(pl)} (${formatSignedPct(rate)})`;
  els.portfolioPL.className = `portfolio-pl ${pl >= 0 ? "positive" : "negative"}`;

  els.portfolioCash.textContent = formatKRW(state.portfolio.cash);
  els.portfolioStockValue.textContent = formatKRW(stockValue);
  els.portfolioInvested.textContent = formatKRW(invested);
  els.portfolioRate.textContent = formatSignedPct(rate);
  els.portfolioRate.className = rate >= 0 ? "positive" : "negative";
}

function buildWatchItem(stock, compact = false) {
  const rate = getStockRate(stock);
  const diff = stock.currentPrice - stock.prevClose;
  const isActive = stock.code === state.selectedCode;
  const isFav = state.favorites.includes(stock.code);
  const maxVolume = Math.max(...state.stocks.map(s => s.currentVolume), 1);
  const volumePct = (stock.currentVolume / maxVolume) * 100;

  return `
    <div class="watch-item ${isActive ? "active" : ""}" data-code="${stock.code}">
      <div class="watch-top">
        <div class="watch-left">
          <div class="watch-logo">${stock.logo}</div>
          <div class="watch-name-wrap">
            <div class="watch-name-row">
              <div class="watch-name">${stock.name}</div>
              <span class="watch-fav-star">${isFav ? "★" : "☆"}</span>
            </div>
            <div class="watch-code">${compact ? stock.code : `${stock.code} · ${stock.theme}`}</div>
          </div>
        </div>
        <div class="watch-right">
          <div class="watch-price">${formatKRW(stock.currentPrice)}</div>
          <div class="watch-change ${rate >= 0 ? "positive" : "negative"}">
            ${compact ? formatSignedPct(rate) : `${formatSignedKRW(diff)} (${formatSignedPct(rate)})`}
          </div>
        </div>
      </div>
      ${compact ? "" : `
      <div class="watch-bottom">
        <div class="volume-bar"><div class="volume-fill" style="width:${volumePct}%"></div></div>
        <div class="watch-mini">거래량 ${formatVolume(stock.currentVolume)}</div>
      </div>`}
    </div>
  `;
}

function renderFavorites() {
  const favorites = state.favorites
    .map(code => state.stocks.find(s => s.code === code))
    .filter(Boolean);

  if (!favorites.length) {
    els.favoritesList.className = "watchlist-block empty-state-box";
    els.favoritesList.innerHTML = "즐겨찾기한 종목이 없다";
    return;
  }

  els.favoritesList.className = "watchlist-block";
  els.favoritesList.innerHTML = favorites.map(stock => buildWatchItem(stock, true)).join("");
}

function renderWatchlist() {
  const order = state.watchlistOrder.length ? state.watchlistOrder : state.stocks.map(s => s.code);
  const q = state.searchTerm.trim().toLowerCase();

  const list = order
    .map(code => state.stocks.find(s => s.code === code))
    .filter(Boolean)
    .filter(stock =>
      stock.name.toLowerCase().includes(q) ||
      stock.code.toLowerCase().includes(q) ||
      stock.theme.toLowerCase().includes(q)
    );

  els.watchlist.innerHTML = list.map(stock => buildWatchItem(stock, false)).join("");
  renderFavorites();
  els.marketAlertBadge.textContent = String(state.marketAlertCount);
}

function renderOrderbook() {
  const stock = getSelectedStock();
  els.orderbookRows.innerHTML = stock.orderbook.map(row => `
    <div class="order-row ${row.side}">
      <span class="order-qty ${row.side === "ask" ? "sell-color" : ""}">${row.side === "ask" ? row.qty.toLocaleString("ko-KR") : ""}</span>
      <span class="order-price ${row.side === "ask" ? "sell-color" : "buy-color"}">${formatKRW(row.price)}</span>
      <span class="order-qty ${row.side === "bid" ? "buy-color" : ""}">${row.side === "bid" ? row.qty.toLocaleString("ko-KR") : ""}</span>
    </div>
  `).join("");
}

function renderNews() {
  els.newsFeed.innerHTML = state.news.map(item => `
    <div class="news-card">
      <div class="news-top">
        <span class="news-type ${item.type}">${typeLabel(item.type)}</span>
        <span class="news-time">${item.time}</span>
      </div>
      <div class="news-title">${item.title}</div>
      <div class="news-desc">${item.desc}</div>
    </div>
  `).join("");
  els.newsCountChip.textContent = `${state.news.length}건`;
}

function renderSelectedStockNews() {
  const stock = getSelectedStock();
  const filtered = state.news.filter(n => n.code === stock.code).slice(0, 8);

  els.selectedNewsTitleName.textContent = stock.name;
  els.selectedNewsCount.textContent = `${filtered.length}건`;

  if (!filtered.length) {
    els.selectedNewsFeed.innerHTML = `<div class="empty-state-box">현재 선택 종목의 뉴스/이벤트가 아직 없다</div>`;
    return;
  }

  els.selectedNewsFeed.innerHTML = filtered.map(item => `
    <div class="news-card">
      <div class="news-top">
        <span class="news-type ${item.type}">${typeLabel(item.type)}</span>
        <span class="news-time">${item.time}</span>
      </div>
      <div class="news-title">${item.title}</div>
      <div class="news-desc">${item.desc}</div>
    </div>
  `).join("");
}

function renderHistory() {
  els.orderHistoryList.innerHTML = state.orderHistory.map(item => `
    <div class="history-card">
      <div class="history-card-top">
        <span class="history-type ${item.type === "sell" ? "sell" : "buy"}">${item.type === "sell" ? "매도 체결" : "매수 체결"}</span>
        <span class="history-time">${item.time}</span>
      </div>
      <div class="history-main">${item.name} · ${item.qty.toLocaleString("ko-KR")}주 · ${formatKRW(item.price)}</div>
      <div class="history-sub">총 ${formatKRW(item.amount)} · ${item.note}</div>
    </div>
  `).join("");

  els.alertHistoryList.innerHTML = state.alerts.map(item => `
    <div class="history-card">
      <div class="history-card-top">
        <span class="history-type alert">시장 알림</span>
        <span class="history-time">${item.time}</span>
      </div>
      <div class="history-main">${item.message}</div>
      <div class="history-sub">${item.name}</div>
    </div>
  `).join("");

  els.alertBadge.textContent = String(state.alertCount);
}

function renderAutoSellList() {
  const stock = getSelectedStock();
  const list = state.autoSellOrders.filter(o => o.code === stock.code);

  if (!list.length) {
    els.autoSellList.innerHTML = `<div class="empty-state-box">등록된 자동매도가 없다</div>`;
    return;
  }

  els.autoSellList.innerHTML = list.map(order => `
    <div class="auto-sell-item">
      <div class="auto-sell-item-top">
        <span class="auto-sell-type ${order.targetPrice ? "target" : "stop"}">${order.targetPrice ? "목표가" : "손절가"}</span>
        <button type="button" class="auto-sell-delete" data-id="${order.id}">삭제</button>
      </div>
      <div class="auto-sell-item-main">
        ${order.targetPrice ? formatKRW(order.targetPrice) : formatKRW(order.stopPrice)}
      </div>
      <div class="auto-sell-item-sub">
        ${order.sellAll ? "전량매도" : `${order.qty.toLocaleString("ko-KR")}주 매도`}
      </div>
    </div>
  `).join("");
}

function updateEstimate() {
  const stock = getSelectedStock();
  if (!stock) return;

  const price = Math.max(1, Math.round(stock.currentPrice));
  els.orderPrice.value = price;

  const qty = Math.max(0, parseInt(els.orderQty.value || "0", 10));
  const amount = price * qty;
  const fee = Math.round(amount * 0.0015);

  els.estimatedCost.textContent = formatKRW(amount);
  els.estimatedFee.textContent = formatKRW(fee);
}

function updateSpeedButtons() {
  document.querySelectorAll("#speedButtons button").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.speed) === state.speed);
  });
}
function updateOrderModeButtons() {
  els.buyModeBtn.classList.toggle("active", state.orderMode === "buy");
  els.sellModeBtn.classList.toggle("active", state.orderMode === "sell");
  els.submitOrderBtn.textContent = state.orderMode === "buy" ? "매수 실행" : "매도 실행";
  els.submitOrderBtn.className = `primary-order-btn ${state.orderMode}`;
  els.autoSellBlock.classList.toggle("hidden", state.orderMode !== "sell");
}

function updateSupportFundButton() {
  const canUse = state.portfolio.cash <= SUPPORT_FUND_LIMIT && !state.supportFundClaimed;
  els.supportFundBtn.disabled = !canUse;
  if (state.supportFundClaimed) {
    els.supportFundBtn.textContent = "긴급지원금 지급완료";
  } else if (state.portfolio.cash <= SUPPORT_FUND_LIMIT) {
    els.supportFundBtn.textContent = "긴급지원금 +50만원";
  } else {
    els.supportFundBtn.textContent = "현금 50만원 이하만 가능";
  }
}

function renderAll() {
  renderHeroSelect();
  renderQuickButtons();
  renderSelectedHeader();
  renderPortfolio();
  renderWatchlist();
  renderOrderbook();
  renderNews();
  renderSelectedStockNews();
  renderHistory();
  renderAutoSellList();
  drawChart();
  updateSpeedButtons();
  updateOrderModeButtons();
}

function setSelectedStock(code) {
  if (!state.stocks.some(s => s.code === code)) return;
  state.selectedCode = code;
  renderAll();
  saveState();
}

function toggleFavorite() {
  const stock = getSelectedStock();
  const idx = state.favorites.indexOf(stock.code);

  if (idx >= 0) {
    state.favorites.splice(idx, 1);
    addAlert(`${stock.name} 즐겨찾기 해제`, stock);
  } else {
    state.favorites.unshift(stock.code);
    state.favorites = [...new Set(state.favorites)].slice(0, 10);
    addAlert(`${stock.name} 즐겨찾기 추가`, stock);
  }
  renderAll();
  saveState();
}

function executeOrder() {
  const stock = getSelectedStock();
  const qty = Math.max(0, parseInt(els.orderQty.value || "0", 10));

  if (!qty) {
    alert("수량을 입력해줘.");
    return;
  }

  const price = Math.max(1, Math.round(stock.currentPrice));
  const amount = price * qty;
  const fee = Math.round(amount * 0.0015);
  const holding = getHolding(stock.code);

  if (state.orderMode === "buy") {
