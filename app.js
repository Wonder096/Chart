const STORAGE_KEY = "k_mock_trading_pro_v11_design";
const INITIAL_CASH = 1000000;
const SUPPORT_FUND = 500000;
const SUPPORT_FUND_LIMIT = 500000;
const NEWS_LIMIT = 120;
const ORDER_LIMIT = 200;
const ALERT_LIMIT = 200;
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

const newsPools = {
  breaking: [
    "{name}, 장중 수급이 몰리면서 움직임이 커지고 있어요",
    "{name}, 거래량이 갑자기 늘면서 시장이 주목하고 있어요",
    "{name}, 관련 테마가 함께 오르며 관심이 커지고 있어요"
  ],
  good: [
    "{name}, 실적 기대감이 반영되면서 분위기가 좋아지고 있어요",
    "{name}, 신규 계약 기대감으로 매수세가 붙는 모습이에요",
    "{name}, 기관 관심이 커지며 흐름이 탄탄해지고 있어요"
  ],
  warn: [
    "{name}, 단기 급등 뒤라 변동성이 커질 수 있어요",
    "{name}, 고점 부근 매물 부담이 나올 수 있어 보여요",
    "{name}, 흔들림이 커질 수 있어 너무 급하게 따라가진 않는 편이 좋아요"
  ],
  event: [
    "{name}, 오늘 관심 종목으로 많이 언급되고 있어요",
    "{name}, 테마 이벤트가 붙으면서 수급이 몰리는 분위기예요",
    "{name}, 검색량이 늘어나며 단기 관심이 높아지고 있어요"
  ]
};

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
let saveTimer = null;

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
  const n = Math.round(v);
  return `${n >= 0 ? "+" : ""}${n.toLocaleString("ko-KR")}원`;
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
function getEl(id) {
  return document.getElementById(id);
}
function text(el, value) {
  if (el) el.textContent = value;
}
function addEvent(el, type, handler) {
  if (el) el.addEventListener(type, handler);
}
function queueSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveState();
  }, 250);
}

function getSelectedStock() {
  return state.stocks.find(stock => stock.code === state.selectedCode) || state.stocks[0] || null;
}
function getHolding(code) {
  return state.portfolio.holdings[code] || { qty: 0, avgPrice: 0 };
}
function getStockRate(stock) {
  return ((stock.currentPrice - stock.prevClose) / stock.prevClose) * 100;
}
function getInvestedAmount() {
  return Object.values(state.portfolio.holdings).reduce((sum, item) => sum + item.qty * item.avgPrice, 0);
}
function getStockEvaluation() {
  return Object.entries(state.portfolio.holdings).reduce((sum, [code, holding]) => {
    const stock = state.stocks.find(s => s.code === code);
    if (!stock) return sum;
    return sum + stock.currentPrice * holding.qty;
  }, 0);
}
function getTotalAsset() {
  return state.portfolio.cash + getStockEvaluation();
}
function getProfitLoss() {
  return getTotalAsset() - INITIAL_CASH;
}
function getProfitRate() {
  return INITIAL_CASH ? ((getTotalAsset() - INITIAL_CASH) / INITIAL_CASH) * 100 : 0;
}

function generateCandles(base) {
  const candles = [];
  let prev = base * rand(0.92, 1.08);
  const prevClose = prev;

  for (let i = 0; i < 140; i++) {
    const open = prev;
    const move = rand(-0.02, 0.022);
    const close = Math.max(1000, open * (1 + move));
    const high = Math.max(open, close) * (1 + rand(0.001, 0.015));
    const low = Math.min(open, close) * (1 - rand(0.001, 0.015));
    const volume = randInt(15000, 220000) * (1 + Math.abs(move) * 18);

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
  const base = Math.round(stock.currentPrice);

  for (let i = 10; i >= 1; i--) {
    rows.push({
      askQty: randInt(80, 2200),
      price: Math.max(100, Math.round(base * (1 + i * 0.0017))),
      bidQty: randInt(80, 2200)
    });
  }

  return rows;
}

function createInitialState() {
  state.speed = 1;
  state.selectedCode = "KQ001";
  state.orderMode = "buy";
  state.sortBy = "change";
  state.chartRange = "1m";
  state.hoverIndex = -1;
  state.alertCount = 0;
  state.marketAlertCount = 0;
  state.isPaused = false;
  state.isStopped = false;
  state.emergencyFundClaimed = false;
  state.searchTerm = "";
  state.favorites = [];
  state.news = [];
  state.alerts = [];
  state.orderHistory = [];
  state.autoSellOrders = [];
  state.watchlistOrder = [];
  state.portfolio = {
    cash: INITIAL_CASH,
    holdings: {}
  };

  state.stocks = STOCK_SEED.map(seed => {
    const gen = generateCandles(seed.base);
    const candles = gen.candles;
    const current = candles[candles.length - 1].close;
    return {
      code: seed.code,
      name: seed.name,
      logo: seed.logo,
      theme: seed.theme,
      prevClose: gen.prevClose,
      candles,
      currentPrice: current,
      currentVolume: candles[candles.length - 1].volume,
      dayHigh: Math.max(...candles.map(c => c.high)),
      dayLow: Math.min(...candles.map(c => c.low)),
      mood: randInt(35, 65),
      volatility: rand(0.8, 1.45),
      orderbook: []
    };
  });

  state.stocks.forEach(stock => {
    stock.orderbook = generateOrderbook(stock);
  });

  for (let i = 0; i < 10; i++) {
    const stock = state.stocks[randInt(0, state.stocks.length - 1)];
    createRandomNews(stock);
  }

  rebuildWatchlistOrder();
}

function sanitizeLoadedState(raw) {
  if (!raw || !Array.isArray(raw.stocks) || !raw.stocks.length) return false;

  state.speed = [1, 2, 5, 10, 20, 50].includes(Number(raw.speed)) ? Number(raw.speed) : 1;
  state.selectedCode = raw.selectedCode || "KQ001";
  state.orderMode = raw.orderMode === "sell" ? "sell" : "buy";
  state.sortBy = raw.sortBy === "volume" ? "volume" : "change";
  state.chartRange = ["1m", "5m", "1d", "1w"].includes(raw.chartRange) ? raw.chartRange : "1m";
  state.hoverIndex = -1;
  state.alertCount = Number(raw.alertCount) || 0;
  state.marketAlertCount = Number(raw.marketAlertCount) || 0;
  state.isPaused = !!raw.isPaused;
  state.isStopped = !!raw.isStopped;
  state.emergencyFundClaimed = !!raw.emergencyFundClaimed;
  state.searchTerm = typeof raw.searchTerm === "string" ? raw.searchTerm : "";
  state.favorites = Array.isArray(raw.favorites) ? raw.favorites : [];
  state.news = Array.isArray(raw.news) ? raw.news.slice(0, NEWS_LIMIT) : [];
  state.alerts = Array.isArray(raw.alerts) ? raw.alerts.slice(0, ALERT_LIMIT) : [];
  state.orderHistory = Array.isArray(raw.orderHistory) ? raw.orderHistory.slice(0, ORDER_LIMIT) : [];
  state.autoSellOrders = Array.isArray(raw.autoSellOrders) ? raw.autoSellOrders : [];
  state.watchlistOrder = Array.isArray(raw.watchlistOrder) ? raw.watchlistOrder : [];
  state.portfolio = raw.portfolio && typeof raw.portfolio === "object"
    ? raw.portfolio
    : { cash: INITIAL_CASH, holdings: {} };

  if (!Number.isFinite(state.portfolio.cash)) state.portfolio.cash = INITIAL_CASH;
  if (!state.portfolio.holdings || typeof state.portfolio.holdings !== "object") {
    state.portfolio.holdings = {};
  }

  state.stocks = raw.stocks.map(stock => {
    if (!stock || !Array.isArray(stock.candles) || !stock.candles.length) return null;
    const currentCandle = stock.candles[stock.candles.length - 1];
    return {
      code: stock.code,
      name: stock.name,
      logo: stock.logo,
      theme: stock.theme,
      prevClose: Number(stock.prevClose) || stock.candles[0].open,
      candles: stock.candles,
      currentPrice: currentCandle.close,
      currentVolume: currentCandle.volume,
      dayHigh: Math.max(...stock.candles.map(c => c.high)),
      dayLow: Math.min(...stock.candles.map(c => c.low)),
      mood: Number.isFinite(stock.mood) ? stock.mood : randInt(35, 65),
      volatility: Number.isFinite(stock.volatility) ? stock.volatility : rand(0.8, 1.45),
      orderbook: Array.isArray(stock.orderbook) && stock.orderbook.length ? stock.orderbook : []
    };
  }).filter(Boolean);

  if (!state.stocks.length) return false;
  state.stocks.forEach(stock => {
    if (!stock.orderbook.length) stock.orderbook = generateOrderbook(stock);
  });
  if (!state.stocks.some(stock => stock.code === state.selectedCode)) {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      speed: state.speed,
      selectedCode: state.selectedCode,
      orderMode: state.orderMode,
      sortBy: state.sortBy,
      chartRange: state.chartRange,
      alertCount: state.alertCount,
      marketAlertCount: state.marketAlertCount,
      isPaused: state.isPaused,
      isStopped: state.isStopped,
      emergencyFundClaimed: state.emergencyFundClaimed,
      searchTerm: state.searchTerm,
      favorites: state.favorites,
      news: state.news.slice(0, NEWS_LIMIT),
      alerts: state.alerts.slice(0, ALERT_LIMIT),
      orderHistory: state.orderHistory.slice(0, ORDER_LIMIT),
      autoSellOrders: state.autoSellOrders,
      watchlistOrder: state.watchlistOrder,
      portfolio: state.portfolio,
      stocks: state.stocks
    }));
  } catch (e) {
    console.error("saveState error", e);
  }
}

function rebuildWatchlistOrder() {
  const arr = [...state.stocks];
  if (state.sortBy === "change") {
    arr.sort((a, b) => getStockRate(b) - getStockRate(a));
  } else {
    arr.sort((a, b) => b.currentVolume - a.currentVolume);
  }
  state.watchlistOrder = arr.map(stock => stock.code);
}

function addAlert(message, stock = null) {
  state.alerts.unshift({
    id: `${Date.now()}_${Math.random()}`,
    message,
    name: stock ? stock.name : "시스템",
    code: stock ? stock.code : "SYSTEM",
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
    name: stock.name,
    code: stock.code,
    qty,
    price,
    amount,
    note,
    time: nowTime()
  });
  state.orderHistory = state.orderHistory.slice(0, ORDER_LIMIT);
}

function addNews(type, stock, title, desc) {
  state.news.unshift({
    id: `${Date.now()}_${Math.random()}`,
    type,
    name: stock.name,
    code: stock.code,
    title,
    desc,
    time: nowTime()
  });
  state.news = state.news.slice(0, NEWS_LIMIT);
}

function createRandomNews(stock) {
  const types = ["breaking", "good", "warn", "event"];
  const type = types[randInt(0, types.length - 1)];
  const template = newsPools[type][randInt(0, newsPools[type].length - 1)];
  addNews(
    type,
    stock,
    template.replace("{name}", stock.name),
    `${stock.name} 흐름이 ${formatSignedPct(getStockRate(stock))} 정도로 움직이고 있어요.`
  );
}

function claimSupportFund() {
  if (state.emergencyFundClaimed) {
    addAlert("긴급지원금은 이미 한 번 받으셨어요.");
    renderHistory();
    return;
  }
  if (state.portfolio.cash > SUPPORT_FUND_LIMIT) {
    addAlert(`긴급지원금은 현금이 ${formatKRW(SUPPORT_FUND_LIMIT)} 이하일 때 받을 수 있어요.`);
    renderHistory();
    return;
  }

  state.portfolio.cash += SUPPORT_FUND;
  state.emergencyFundClaimed = true;
  addAlert(`긴급지원금 ${formatKRW(SUPPORT_FUND)}이 지급됐어요.`);
  renderAll();
  queueSave();
}

function resetAllData() {
  const ok = confirm("지금까지 기록을 모두 초기화할까요?");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  createInitialState();
  renderAll();
  queueSave();
}

function setSelectedStock(code) {
  if (!state.stocks.some(stock => stock.code === code)) return;
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
    addAlert("수량을 한 번 확인해 주세요.", stock);
    renderHistory();
    return;
  }

  const executionPrice = Math.round(stock.currentPrice);
  const amount = executionPrice * qty;
  const fee = feeOf(amount);

  if (state.orderMode === "buy") {
    const totalNeed = amount + fee;
    if (state.portfolio.cash < totalNeed) {
      addAlert(`잔액이 조금 부족해요. 필요 금액은 ${formatKRW(totalNeed)}예요.`, stock);
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
    addAlert(`${stock.name} ${qty.toLocaleString("ko-KR")}주가 매수됐어요.`, stock);
  } else {
    const holding = getHolding(stock.code);
    if (holding.qty < qty) {
      addAlert(`보유 수량보다 많아서 주문이 어려워요. 현재 ${holding.qty.toLocaleString("ko-KR")}주 보유 중이에요.`, stock);
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
    addAlert(`${stock.name} ${qty.toLocaleString("ko-KR")}주가 매도됐어요.`, stock);
  }

  els.orderQty.value = "1";
  renderAll();
  queueSave();
}

function addAutoSellOrder() {
  const stock = getSelectedStock();
  if (!stock) return;

  const holding = getHolding(stock.code);
  if (holding.qty <= 0) {
    addAlert("보유 수량이 있어야 자동매도를 등록할 수 있어요.", stock);
    renderHistory();
    return;
  }

  const targetPrice = Math.floor(Number(els.autoSellTargetPrice?.value || 0));
  const stopPrice = Math.floor(Number(els.autoSellStopPrice?.value || 0));
  const sellAll = !!els.autoSellAll?.checked;
  let qty = Math.floor(Number(els.autoSellQty?.value || 0));

  if (!targetPrice && !stopPrice) {
    addAlert("목표가나 손절가 중에서 하나는 입력해 주세요.", stock);
    renderHistory();
    return;
  }

  if (sellAll) qty = holding.qty;
  if (!qty || qty <= 0) {
    addAlert("자동매도 수량을 한 번 확인해 주세요.", stock);
    renderHistory();
    return;
  }

  qty = Math.min(qty, holding.qty);

  state.autoSellOrders.push({
    id: `${Date.now()}_${Math.random()}`,
    code: stock.code,
    targetPrice,
    stopPrice,
    qty,
    sellAll
  });

  els.autoSellTargetPrice.value = "";
  els.autoSellStopPrice.value = "";
  els.autoSellQty.value = "1";
  els.autoSellQty.disabled = false;
  els.autoSellAll.checked = false;

  addAlert(`${stock.name} 자동매도가 등록됐어요.`, stock);
  renderAutoSellList();
  renderHistory();
  queueSave();
}

function deleteAutoSellOrder(id) {
  state.autoSellOrders = state.autoSellOrders.filter(order => order.id !== id);
  renderAutoSellList();
  queueSave();
}

function executeAutoSell(order, reason) {
  const stock = state.stocks.find(s => s.code === order.code);
  if (!stock) return false;

  const holding = getHolding(order.code);
  if (holding.qty <= 0) return false;

  const qty = order.sellAll ? holding.qty : Math.min(order.qty, holding.qty);
  if (qty <= 0) return false;

  const price = Math.round(stock.currentPrice);
  const amount = price * qty;
  const fee = feeOf(amount);
  const proceeds = amount - fee;

  state.portfolio.cash += proceeds;

  const remainQty = holding.qty - qty;
  if (remainQty <= 0) {
    delete state.portfolio.holdings[order.code];
  } else {
    state.portfolio.holdings[order.code] = {
      qty: remainQty,
      avgPrice: holding.avgPrice
    };
  }

  addOrderHistory("sell", stock, qty, price, proceeds, reason);
  addAlert(`${stock.name} 자동매도가 실행됐어요.`, stock);
  addNews("event", stock, `${stock.name} 자동매도 체결`, `${reason} 조건이 맞아서 자동으로 체결됐어요.`);
  return true;
}

function checkAutoSellOrders() {
  if (!state.autoSellOrders.length) return;

  const remain = [];
  state.autoSellOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) return;

    const current = stock.currentPrice;
    const targetHit = order.targetPrice > 0 && current >= order.targetPrice;
    const stopHit = order.stopPrice > 0 && current <= order.stopPrice;

    if (!targetHit && !stopHit) {
      remain.push(order);
      return;
    }

    const reason = targetHit
      ? `목표가 ${formatKRW(order.targetPrice)}에 도달했어요`
      : `손절가 ${formatKRW(order.stopPrice)}까지 내려왔어요`;

    executeAutoSell(order, reason);
  });

  state.autoSellOrders = remain;
}

function updateOrderbook(stock) {
  stock.orderbook.forEach(row => {
    row.askQty = clamp(row.askQty + randInt(-180, 220), 20, 2800);
    row.bidQty = clamp(row.bidQty + randInt(-180, 220), 20, 2800);
  });

  const base = Math.round(stock.currentPrice);
  stock.orderbook.forEach((row, idx) => {
    const level = stock.orderbook.length - idx;
    row.price = Math.max(100, Math.round(base * (1 + (level - 5.5) * 0.0017)));
  });
}

function maybeGenerateNews(stock) {
  const move = Math.abs(getStockRate(stock));
  let chance = 0.012;
  if (move > 6) chance += 0.018;
  if (stock.currentVolume > 180000) chance += 0.01;

  if (Math.random() < chance) {
    createRandomNews(stock);
    addAlert(`${stock.name} 쪽에 새 소식이 들어왔어요.`, stock);
  }
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
      maybeGenerateNews(stock);

      if (Math.abs(getStockRate(stock)) >= 29.5 && Math.random() < 0.03) {
        addAlert(`${stock.name}가 상하단 부근까지 크게 움직이고 있어요.`, stock);
      }
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
    "totalAssetTop","profitLossTop","cashTop","supportFundBtn","pauseBtn","resumeBtn","stopBtn","resetBtn","alertBellBtn","alertBadge",
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
    "currentTradePriceLabel"
  ].forEach(id => {
    els[id] = getEl(id);
  });
}

function buildStockSelect() {
  if (!els.heroStockSelect) return;
  els.heroStockSelect.innerHTML = "";
  state.stocks.forEach(stock => {
    const option = document.createElement("option");
    option.value = stock.code;
    option.textContent = `${stock.name} (${stock.code})`;
    if (stock.code === state.selectedCode) option.selected = true;
    els.heroStockSelect.appendChild(option);
  });
}

function bindEvents() {
  addEvent(els.favoriteToggleBtn, "click", toggleFavorite);
  addEvent(els.heroStockSelect, "change", e => setSelectedStock(e.target.value));

  addEvent(getEl("speedButtons"), "click", e => {
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
      const type = btn.dataset.historyTab;
      els.orderHistoryList.classList.toggle("hidden", type !== "orders");
      els.alertHistoryList.classList.toggle("hidden", type !== "alerts");
    });
  });

  addEvent(els.buyModeBtn, "click", () => {
    state.orderMode = "buy";
    renderOrderPanel();
    queueSave();
  });

  addEvent(els.sellModeBtn, "click", () => {
    state.orderMode = "sell";
    renderOrderPanel();
    queueSave();
  });

  addEvent(els.quickRow, "click", e => {
    const btn = e.target.closest("button[data-ratio]");
    if (!btn) return;
    applyQuickRatio(Number(btn.dataset.ratio));
  });

  addEvent(els.orderQty, "input", renderOrderEstimate);
  addEvent(els.submitOrderBtn, "click", submitOrder);

  addEvent(els.autoSellAll, "change", () => {
    if (!els.autoSellQty) return;
    if (els.autoSellAll.checked) {
      const holding = getHolding(state.selectedCode);
      els.autoSellQty.value = Math.max(holding.qty, 1);
      els.autoSellQty.disabled = true;
    } else {
      els.autoSellQty.disabled = false;
    }
  });

  addEvent(els.addAutoSellBtn, "click", addAutoSellOrder);

  addEvent(els.supportFundBtn, "click", claimSupportFund);
  addEvent(els.pauseBtn, "click", () => {
    state.isPaused = true;
    state.isStopped = false;
    renderStatusButtons();
    queueSave();
  });
  addEvent(els.resumeBtn, "click", () => {
    state.isPaused = false;
    state.isStopped = false;
    renderStatusButtons();
    queueSave();
  });
  addEvent(els.stopBtn, "click", () => {
    state.isStopped = true;
    state.isPaused = false;
    renderStatusButtons();
    queueSave();
  });
  addEvent(els.resetBtn, "click", resetAllData);

  addEvent(els.alertBellBtn, "click", () => {
    state.alertCount = 0;
    renderAlertBadge();
    queueSave();
  });

  addEvent(els.clearHistoryBtn, "click", () => {
    state.orderHistory = [];
    state.alerts = [];
    state.alertCount = 0;
    state.marketAlertCount = 0;
    renderHistory();
    renderAlertBadge();
    renderWatchlistMeta();
    queueSave();
  });

  addEvent(els.searchInput, "input", e => {
    state.searchTerm = String(e.target.value || "").trim().toLowerCase();
    renderWatchlist();
  });

  addEvent(els.priceChart, "mousemove", handleChartHover);
  addEvent(els.priceChart, "mouseleave", () => {
    state.hoverIndex = -1;
    els.chartTooltip.classList.add("hidden");
    drawChart();
  });
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

function renderTopSummary() {
  text(els.totalAssetTop, formatKRW(getTotalAsset()));
  const pl = getProfitLoss();
  if (els.profitLossTop) {
    els.profitLossTop.textContent = formatSignedKRW(pl);
    els.profitLossTop.classList.toggle("positive", pl >= 0);
    els.profitLossTop.classList.toggle("negative", pl < 0);
  }
  text(els.cashTop, formatKRW(state.portfolio.cash));

  if (els.supportFundBtn) {
    const enabled = !state.emergencyFundClaimed && state.portfolio.cash <= SUPPORT_FUND_LIMIT;
    els.supportFundBtn.disabled = !enabled;
    els.supportFundBtn.style.opacity = enabled ? "1" : ".55";
    els.supportFundBtn.style.cursor = enabled ? "pointer" : "not-allowed";
  }
}

function renderHero() {
  const stock = getSelectedStock();
  if (!stock) return;

  text(els.symbolLogo, stock.logo);
  text(els.selectedName, stock.name);
  text(els.selectedCode, `${stock.code} · ${stock.theme}`);
  text(els.selectedPrice, formatKRW(stock.currentPrice));

  const diff = stock.currentPrice - stock.prevClose;
  const rate = getStockRate(stock);

  if (els.selectedChange) {
    els.selectedChange.textContent = `${formatSignedKRW(diff)} (${formatSignedPct(rate)})`;
    els.selectedChange.classList.toggle("up", diff >= 0);
    els.selectedChange.classList.toggle("down", diff < 0);
  }

  text(els.dayHigh, formatKRW(stock.dayHigh));
  text(els.dayLow, formatKRW(stock.dayLow));
  text(els.dayOpen, formatKRW(stock.prevClose));
  text(els.dayVolume, formatVolume(stock.currentVolume));

  if (els.favoriteToggleBtn) {
    els.favoriteToggleBtn.textContent = state.favorites.includes(stock.code) ? "★" : "☆";
  }

  text(els.selectedNewsTitleName, stock.name);

  const mood = clamp(stock.mood, 0, 100);
  if (els.moodFill) els.moodFill.style.width = `${mood}%`;
  if (els.moodText) {
    els.moodText.textContent =
      mood >= 67 ? "지금은 강한 편이에요" :
      mood <= 33 ? "조금 조심스러운 흐름이에요" :
      "지금은 중립적인 분위기예요";
  }
}

function renderOrderPanel() {
  const stock = getSelectedStock();
  if (!stock) return;

  const holding = getHolding(stock.code);
  const currentPrice = Math.round(stock.currentPrice);
  const maxBuyQty = Math.max(0, Math.floor(state.portfolio.cash / currentPrice));

  text(els.holdingQtyInline, `${holding.qty.toLocaleString("ko-KR")}주`);
  text(els.avgPriceInline, formatKRW(holding.avgPrice || 0));
  text(els.availableCash, formatKRW(state.portfolio.cash));
  text(els.maxBuyQty, `${maxBuyQty.toLocaleString("ko-KR")}주`);
  text(els.currentHoldingQty, `${holding.qty.toLocaleString("ko-KR")}주`);
  text(els.currentAvgPrice, formatKRW(holding.avgPrice || 0));
  text(els.currentTradePriceLabel, formatKRW(currentPrice));

  if (els.orderPrice) {
    els.orderPrice.value = String(currentPrice);
    els.orderPrice.readOnly = true;
    els.orderPrice.setAttribute("readonly", "readonly");
    els.orderPrice.title = "현재가 기준으로만 체결돼요";
  }

  if (els.buyModeBtn) els.buyModeBtn.classList.toggle("active", state.orderMode === "buy");
  if (els.sellModeBtn) els.sellModeBtn.classList.toggle("active", state.orderMode === "sell");

  if (els.submitOrderBtn) {
    els.submitOrderBtn.textContent = state.orderMode === "buy" ? "매수 실행" : "매도 실행";
    els.submitOrderBtn.classList.toggle("buy", state.orderMode === "buy");
    els.submitOrderBtn.classList.toggle("sell", state.orderMode === "sell");
  }

  if (els.quickRow) {
    els.quickRow.innerHTML = state.orderMode === "buy"
      ? `
        <button type="button" data-ratio="25">25%</button>
        <button type="button" data-ratio="50">50%</button>
        <button type="button" data-ratio="75">75%</button>
        <button type="button" data-ratio="100">100%</button>
      `
      : `
        <button type="button" data-ratio="25">25%</button>
        <button type="button" data-ratio="50">50%</button>
        <button type="button" data-ratio="75">75%</button>
        <button type="button" data-ratio="100">전량</button>
      `;
  }

  const autoSellBlock = document.querySelector(".auto-sell-block");
  if (autoSellBlock) {
    autoSellBlock.style.display = state.orderMode === "sell" ? "" : "none";
  }

  renderOrderEstimate();
}

function renderOrderEstimate() {
  const stock = getSelectedStock();
  if (!stock) return;

  const qty = Math.max(1, Math.floor(Number(els.orderQty?.value || 1)));
  const executionPrice = Math.round(stock.currentPrice);
  const amount = executionPrice * qty;
  const fee = feeOf(amount);

  if (els.estimatedCost) {
    const total = state.orderMode === "buy" ? amount + fee : amount - fee;
    els.estimatedCost.textContent = formatKRW(total);
  }
  if (els.estimatedFee) {
    els.estimatedFee.textContent = formatKRW(fee);
  }
}

function renderOrderbook() {
  if (!els.orderbookRows) return;
  const stock = getSelectedStock();
  if (!stock) return;

  const rows = stock.orderbook;
  const maxQty = Math.max(...rows.map(r => Math.max(r.askQty, r.bidQty)), 1);

  els.orderbookRows.innerHTML = rows.map((row, idx) => {
    const sideClass = idx < 5 ? "ask" : "bid";
    return `
      <div class="order-row ${sideClass}">
        <div class="order-qty left">${row.askQty.toLocaleString("ko-KR")}</div>
        <div class="order-price ${idx < 5 ? "sell-color" : "buy-color"}">${formatKRW(row.price)}</div>
        <div class="order-qty right">${row.bidQty.toLocaleString("ko-KR")}</div>
      </div>
    `;
  }).join("");
}

function renderSelectedNews() {
  if (!els.selectedNewsFeed || !els.selectedNewsCount) return;
  const stock = getSelectedStock();
  if (!stock) return;

  const items = state.news.filter(item => item.code === stock.code).slice(0, 8);
  text(els.selectedNewsCount, `${items.length}건`);

  if (!items.length) {
    els.selectedNewsFeed.innerHTML = `<div class="news-empty">아직 들어온 뉴스가 없어요</div>`;
    return;
  }

  els.selectedNewsFeed.innerHTML = items.map(item => `
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

function renderNewsFeed() {
  if (!els.newsFeed) return;
  text(els.newsCountChip, `${state.news.length}건`);

  if (!state.news.length) {
    els.newsFeed.innerHTML = `<div class="news-empty">아직 들어온 뉴스가 없어요</div>`;
    return;
  }

  els.newsFeed.innerHTML = state.news.slice(0, 20).map(item => `
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
  if (els.orderHistoryList) {
    if (!state.orderHistory.length) {
      els.orderHistoryList.innerHTML = `<div class="history-empty">아직 주문 기록이 없어요</div>`;
    } else {
      els.orderHistoryList.innerHTML = state.orderHistory.slice(0, 20).map(item => `
        <div class="history-card">
          <div class="history-card-top">
            <span class="history-type ${item.type}">${item.type === "buy" ? "매수" : "매도"}</span>
            <span class="history-time">${item.time}</span>
          </div>
          <div class="history-main">${item.name} · ${item.qty.toLocaleString("ko-KR")}주</div>
          <div class="history-sub">${formatKRW(item.price)} · ${formatKRW(item.amount)} · ${item.note}</div>
        </div>
      `).join("");
    }
  }

  if (els.alertHistoryList) {
    if (!state.alerts.length) {
      els.alertHistoryList.innerHTML = `<div class="history-empty">아직 알림이 없어요</div>`;
    } else {
      els.alertHistoryList.innerHTML = state.alerts.slice(0, 20).map(item => `
        <div class="history-card">
          <div class="history-card-top">
            <span class="history-type alert">알림</span>
            <span class="history-time">${item.time}</span>
          </div>
          <div class="history-main">${item.name}</div>
          <div class="history-sub">${item.message}</div>
        </div>
      `).join("");
    }
  }
}

function renderPortfolio() {
  text(els.portfolioTotal, formatKRW(getTotalAsset()));

  const pl = getProfitLoss();
  if (els.portfolioPL) {
    els.portfolioPL.textContent = formatSignedKRW(pl);
    els.portfolioPL.classList.toggle("positive", pl >= 0);
    els.portfolioPL.classList.toggle("negative", pl < 0);
  }

  text(els.portfolioCash, formatKRW(state.portfolio.cash));
  text(els.portfolioStockValue, formatKRW(getStockEvaluation()));
  text(els.portfolioInvested, formatKRW(getInvestedAmount()));
  text(els.portfolioRate, `${getProfitRate().toFixed(2)}%`);
}

function getVisibleStocks() {
  const ordered = state.watchlistOrder
    .map(code => state.stocks.find(stock => stock.code === code))
    .filter(Boolean);

  const term = (state.searchTerm || "").toLowerCase();
  let arr = ordered;

  if (term) {
    arr = arr.filter(stock =>
      stock.name.toLowerCase().includes(term) ||
      stock.code.toLowerCase().includes(term) ||
      stock.theme.toLowerCase().includes(term)
    );
  }

  const favs = arr.filter(stock => state.favorites.includes(stock.code));
  const rest = arr.filter(stock => !state.favorites.includes(stock.code));
  return [...favs, ...rest];
}

function renderWatchlistMeta() {
  text(els.marketAlertBadge, String(state.marketAlertCount || 0));
}

function renderWatchlist() {
  renderWatchlistMeta();

  const visible = getVisibleStocks();

  if (els.favoritesList) {
    const favs = visible.filter(stock => state.favorites.includes(stock.code));
    if (!favs.length) {
      els.favoritesList.innerHTML = `<div class="empty-line">즐겨찾기한 종목이 아직 없어요</div>`;
    } else {
      els.favoritesList.innerHTML = favs.map(stock => `
        <button type="button" class="favorite-stock-chip" data-code="${stock.code}">${stock.name}</button>
      `).join("");
      els.favoritesList.querySelectorAll("[data-code]").forEach(btn => {
        btn.addEventListener("click", () => setSelectedStock(btn.dataset.code));
      });
    }
  }

  if (!els.watchlist) return;

  if (!visible.length) {
    els.watchlist.innerHTML = `<div class="watch-empty">조건에 맞는 종목이 없어요</div>`;
    return;
  }

  const maxVol = Math.max(...visible.map(stock => stock.currentVolume), 1);

  els.watchlist.innerHTML = visible.map(stock => {
    const rate = getStockRate(stock);
    const favoriteStar = state.favorites.includes(stock.code) ? `<span class="watch-fav-star">★</span>` : ``;
    const volumePct = (stock.currentVolume / maxVol) * 100;

    return `
      <button type="button" class="watch-item ${stock.code === state.selectedCode ? "active" : ""}" data-code="${stock.code}">
        <div class="watch-top">
          <div class="watch-left">
            <div class="watch-logo">${stock.logo}</div>
            <div class="watch-name-wrap">
              <div class="watch-name-row">
                <span class="watch-name">${stock.name}</span>
                ${favoriteStar}
              </div>
              <div class="watch-code">${stock.code} · ${stock.theme}</div>
            </div>
          </div>

          <div class="watch-right">
            <div class="watch-price">${formatKRW(stock.currentPrice)}</div>
            <div class="watch-change ${rate >= 0 ? "up" : "down"}">${formatSignedPct(rate)}</div>
          </div>
        </div>

        <div class="watch-bottom">
          <div class="volume-bar">
            <div class="volume-fill" style="width:${volumePct}%"></div>
          </div>
          <div class="watch-mini">${formatVolume(stock.currentVolume)}</div>
        </div>
      </button>
    `;
  }).join("");

  els.watchlist.querySelectorAll("[data-code]").forEach(btn => {
    btn.addEventListener("click", () => setSelectedStock(btn.dataset.code));
  });
}

function renderAutoSellList() {
  if (!els.autoSellList) return;
  const stock = getSelectedStock();
  if (!stock) return;

  const list = state.autoSellOrders.filter(order => order.code === stock.code);
  if (!list.length) {
    els.autoSellList.innerHTML = `<div class="empty-line">아직 등록된 자동매도가 없어요</div>`;
    return;
  }

  els.autoSellList.innerHTML = list.map(order => `
    <div class="auto-sell-item">
      <div class="auto-sell-item-main">
        <div>목표가: ${order.targetPrice ? formatKRW(order.targetPrice) : "-"}</div>
        <div>손절가: ${order.stopPrice ? formatKRW(order.stopPrice) : "-"}</div>
        <div>${order.sellAll ? "전량 매도로 설정돼 있어요" : `${order.qty.toLocaleString("ko-KR")}주 매도 예정이에요`}</div>
      </div>
      <button type="button" class="ghost-btn delete-auto-sell-btn" data-id="${order.id}">삭제</button>
    </div>
  `).join("");

  els.autoSellList.querySelectorAll(".delete-auto-sell-btn").forEach(btn => {
    btn.addEventListener("click", () => deleteAutoSellOrder(btn.dataset.id));
  });
}

function renderAlertBadge() {
  text(els.alertBadge, String(state.alertCount || 0));
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

  ctx.strokeStyle = "rgba(255,255,255,.06)";
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

    ctx.strokeStyle = isUp ? "#ff6d8a" : "#57b6ff";
    ctx.fillStyle = isUp ? "#ff6d8a" : "#57b6ff";

    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

    const volHeight = (candle.volume / maxVol) * volumeHeight;
    ctx.fillStyle = "rgba(89,151,255,.42)";
    ctx.fillRect(x - candleWidth / 2, volumeTop + (volumeHeight - volHeight), candleWidth, volHeight);
  });

  drawMALine(ctx, ma5, candles, pad, chartWidth, priceToY, "#ff6d8a");
  drawMALine(ctx, ma20, candles, pad, chartWidth, priceToY, "#ffb24d");
  drawMALine(ctx, ma60, candles, pad, chartWidth, priceToY, "#ae7dff");

  ctx.fillStyle = "rgba(214,224,255,.85)";
  ctx.font = "12px Pretendard, sans-serif";

  for (let i = 0; i <= 5; i++) {
    const ratio = i / 5;
    const price = maxPrice - (maxPrice - minPrice) * ratio;
    const y = pad.top + (chartHeight / 5) * i + 4;
    ctx.fillText(formatKRW(price), 8, y);
  }

  ctx.fillStyle = "rgba(180,195,230,.72)";
  const step = Math.max(1, Math.floor(candles.length / 6));
  for (let i = 0; i < candles.length; i += step) {
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    ctx.fillText(compressDateLabel(candles[i].time), x - 16, CANVAS_H - 20);
  }

  if (state.hoverIndex >= 0 && state.hoverIndex < candles.length) {
    const hover = candles[state.hoverIndex];
    const x = pad.left + (state.hoverIndex + 0.5) * (chartWidth / candles.length);

    ctx.strokeStyle = "rgba(255,255,255,.15)";
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
  const stock = getSelectedStock();
  if (!stock) return;

  const candles = getDisplayCandles(stock);
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;

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
  renderNewsFeed();
  renderHistory();
  renderPortfolio();
  renderWatchlist();
  renderAutoSellList();
  renderAlertBadge();
  drawChart();
}

function ensureState() {
  if (!loadState()) {
    createInitialState();
    saveState();
  }
  if (!state.stocks.length) {
    createInitialState();
    saveState();
  }
}

function startLoop() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(simulateTick, 1000);
}

function init() {
  cacheElements();
  ensureState();
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
    alert("초기 실행 중 문제가 생겼어요. 콘솔의 INIT ERROR를 한 번 확인해 주세요.");
  }
});
