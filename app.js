const STORAGE_KEY = "k_mock_trading_pro_v3_design";
const INITIAL_CASH = 10000000;
const SUPPORT_FUND = 1000000;
const NEWS_LIMIT = 80;
const ORDER_LIMIT = 160;
const ALERT_LIMIT = 160;
const CANVAS_W = 1280;
const CANVAS_H = 700;

const STOCK_SEED = [
  { code: "KQ001", name: "한강테크", logo: "한", base: 48200, shares: 4200000, theme: "AI 반도체" },
  { code: "KQ002", name: "네오바이오", logo: "네", base: 32150, shares: 3200000, theme: "바이오 신약" },
  { code: "KQ003", name: "블루모빌리티", logo: "블", base: 187000, shares: 1700000, theme: "전기차 부품" },
  { code: "KQ004", name: "코어엔터", logo: "코", base: 12950, shares: 6700000, theme: "엔터/플랫폼" },
  { code: "KQ005", name: "스카이로직스", logo: "스", base: 85300, shares: 2800000, theme: "물류 자동화" },
  { code: "KQ006", name: "오로라게임즈", logo: "오", base: 56700, shares: 3500000, theme: "게임/콘텐츠" },
  { code: "KQ007", name: "에코플랜트", logo: "에", base: 104500, shares: 2900000, theme: "친환경 소재" },
  { code: "KQ008", name: "미래핀테크", logo: "미", base: 72200, shares: 3100000, theme: "핀테크" },
  { code: "KQ009", name: "제니스AI", logo: "제", base: 243500, shares: 1500000, theme: "초거대 AI" },
  { code: "KQ010", name: "라이트메드", logo: "라", base: 41550, shares: 4900000, theme: "헬스케어" },
  { code: "KQ011", name: "웨이브로보틱스", logo: "웨", base: 96400, shares: 2100000, theme: "로봇/공장자동화" },
  { code: "KQ012", name: "트리온클라우드", logo: "트", base: 138800, shares: 2600000, theme: "클라우드" }
];

const breakingTemplates = [
  "{name}, 장중 수급 집중되며 변동성 확대",
  "{name}, 외국인 매수세 유입 추정",
  "{name}, 개인 투자자 관심 급증",
  "{name}, 단기 과열 구간 진입 가능성 부각",
  "{name}, 시세 급등 속 거래량 폭증",
  "{name}, 장 초반 급등 이후 매물 소화 진행",
  "{name}, 기관 추정 매수세로 강세 흐름",
  "{name}, 테마 확산 기대감 속 주목"
];

const goodTemplates = [
  "{name}, 신규 계약 기대감으로 투자심리 개선",
  "{name}, 실적 기대감 반영되며 상승 탄력 강화",
  "{name}, 업황 개선 수혜 기대감 부각",
  "{name}, 차세대 사업 확장 기대에 강세",
  "{name}, AI/로봇/바이오 테마 순환매 수혜",
  "{name}, 기술적 돌파 시도에 매수세 확대",
  "{name}, 시장 내 대표 수혜주로 재부각",
  "{name}, 증권가 관심주 편입 기대감"
];

const warnTemplates = [
  "{name}, 단기 급등에 따른 차익실현 매물 주의",
  "{name}, 변동성 확대 구간 진입",
  "{name}, 장중 흔들림 확대 가능성 유의",
  "{name}, 거래량 감소 속 탄력 둔화 주의",
  "{name}, 급등 이후 추격 매수 주의보",
  "{name}, 고점 부근 매물 압박 가능성",
  "{name}, 호재성 이슈 소멸 시 변동성 확대 우려",
  "{name}, 당일 등락폭 커지며 리스크 확대"
];

const eventTemplates = [
  "{name}, 장 마감 브리핑 관심 종목 선정",
  "{name}, 투자자 토론방 언급량 급증",
  "{name}, 테마 이벤트 발생으로 관심 확대",
  "{name}, 시장 리포트 상위 조회 종목 진입",
  "{name}, 급등주/저평가주 후보로 부상",
  "{name}, 당일 관심 검색어 상위권 진입",
  "{name}, 기관/외인 수급 관측 이벤트 발생",
  "{name}, 변동성 상위 종목으로 편입"
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
  stocks: [],
  favorites: [],
  news: [],
  alerts: [],
  orderHistory: [],
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

function saveState() {
  const data = {
    speed: state.speed,
    selectedCode: state.selectedCode,
    orderMode: state.orderMode,
    sortBy: state.sortBy,
    favorites: state.favorites,
    news: state.news.slice(0, NEWS_LIMIT),
    alerts: state.alerts.slice(0, ALERT_LIMIT),
    orderHistory: state.orderHistory.slice(0, ORDER_LIMIT),
    portfolio: state.portfolio,
    isPaused: state.isPaused,
    isStopped: state.isStopped,
    stocks: state.stocks.map(s => ({
      code: s.code,
      name: s.name,
      logo: s.logo,
      theme: s.theme,
      shares: s.shares,
      candles: s.candles,
      orderbook: s.orderbook,
      prevClose: s.prevClose,
      volatility: s.volatility,
      turnoverBoost: s.turnoverBoost
    }))
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const saved = JSON.parse(raw);
    state.speed = saved.speed || 1;
    state.selectedCode = saved.selectedCode || "KQ001";
    state.orderMode = saved.orderMode || "buy";
    state.sortBy = saved.sortBy || "change";
    state.favorites = Array.isArray(saved.favorites) ? saved.favorites : [];
    state.news = Array.isArray(saved.news) ? saved.news : [];
    state.alerts = Array.isArray(saved.alerts) ? saved.alerts : [];
    state.orderHistory = Array.isArray(saved.orderHistory) ? saved.orderHistory : [];
    state.isPaused = !!saved.isPaused;
    state.isStopped = !!saved.isStopped;

    if (saved.portfolio && typeof saved.portfolio.cash === "number") {
      state.portfolio = saved.portfolio;
    } else {
      state.portfolio = { cash: INITIAL_CASH, holdings: {} };
    }

    if (!Number.isFinite(state.portfolio.cash) || state.portfolio.cash <= 0) {
      state.portfolio.cash = INITIAL_CASH;
    }

    if (!state.portfolio.holdings || typeof state.portfolio.holdings !== "object") {
      state.portfolio.holdings = {};
    }

    if (Array.isArray(saved.stocks) && saved.stocks.length) {
      state.stocks = saved.stocks.map(s => {
        const candles = Array.isArray(s.candles) && s.candles.length ? s.candles : [];
        if (!candles.length) return null;
        return {
          ...s,
          candles,
          currentPrice: candles[candles.length - 1].close,
          currentVolume: candles[candles.length - 1].volume,
          dayHigh: Math.max(...candles.map(c => c.high)),
          dayLow: Math.min(...candles.map(c => c.low)),
          mood: 50 + randInt(-10, 10),
          flashDirection: 0
        };
      }).filter(Boolean);

      if (state.stocks.length) {
        return true;
      }
    }
  } catch (e) {
    console.error(e);
  }

  return false;
}

function buildInitialStocks() {
  state.stocks = STOCK_SEED.map(seed => {
    const candles = [];
    let prev = seed.base * rand(0.92, 1.08);
    const prevClose = prev;

    for (let i = 0; i < 120; i++) {
      const open = prev;
      const move = rand(-0.022, 0.024) * (1 + i / 420);
      const close = Math.max(700, open * (1 + move));
      const high = Math.max(open, close) * (1 + rand(0.001, 0.018));
      const low = Math.min(open, close) * (1 - rand(0.001, 0.018));
      const volume = randInt(8000, 200000) * (1 + Math.abs(move) * 25);

      candles.push({
        time: `T-${120 - i}`,
        open,
        high,
        low,
        close,
        volume
      });

      prev = close;
    }

    const currentPrice = candles[candles.length - 1].close;

    return {
      code: seed.code,
      name: seed.name,
      logo: seed.logo,
      theme: seed.theme,
      shares: seed.shares,
      candles,
      currentPrice,
      currentVolume: candles[candles.length - 1].volume,
      prevClose,
      dayHigh: Math.max(...candles.map(c => c.high)),
      dayLow: Math.min(...candles.map(c => c.low)),
      volatility: rand(0.7, 1.6),
      turnoverBoost: rand(0.9, 1.4),
      mood: randInt(35, 65),
      flashDirection: 0,
      orderbook: []
    };
  });

  state.stocks.forEach(stock => {
    stock.orderbook = generateOrderbook(stock);
  });
}

function generateOrderbook(stock) {
  const rows = [];
  const base = stock.currentPrice;

  for (let i = 10; i >= 1; i--) {
    rows.push({
      side: "ask",
      price: Math.max(100, Math.round(base * (1 + i * 0.0022))),
      qty: randInt(40, 900),
      flash: 0
    });
  }

  for (let i = 1; i <= 10; i++) {
    rows.push({
      side: "bid",
      price: Math.max(100, Math.round(base * (1 - i * 0.0022))),
      qty: randInt(40, 900),
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
  if (!stock) return 0;
  return stock.currentPrice * holding.qty;
}

function getInvestedAmount() {
  return Object.entries(state.portfolio.holdings).reduce((sum, [code, holding]) => {
    return sum + (holding.avgPrice * holding.qty);
  }, 0);
}

function getStockEvaluation() {
  return Object.keys(state.portfolio.holdings).reduce((sum, code) => {
    return sum + getStockValueOfHolding(code);
  }, 0);
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

function addNews(type, stock, title, desc) {
  state.news.unshift({
    id: `${Date.now()}_${Math.random()}`,
    type,
    code: stock.code,
    name: stock.name,
    title,
    desc,
    time: nowTime()
  });
  state.news = state.news.slice(0, NEWS_LIMIT);
}

function addAlert(message, stock, level = "alert") {
  state.alerts.unshift({
    id: `${Date.now()}_${Math.random()}`,
    message,
    code: stock ? stock.code : "",
    name: stock ? stock.name : "",
    time: nowTime(),
    level
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

function typeLabel(type) {
  if (type === "breaking") return "속보";
  if (type === "good") return "호재";
  if (type === "warn") return "주의";
  return "이벤트";
}

function createRandomNews(stock) {
  const pool = [
    { type: "breaking", templates: breakingTemplates },
    { type: "good", templates: goodTemplates },
    { type: "warn", templates: warnTemplates },
    { type: "event", templates: eventTemplates }
  ];

  const picked = pool[randInt(0, pool.length - 1)];
  const raw = picked.templates[randInt(0, picked.templates.length - 1)];
  const title = raw.replace("{name}", stock.name);
  const desc = `${stock.name} · ${stock.theme} 관련 흐름 속에서 현재 ${formatSignedPct(getStockRate(stock))} 변동 중. 체결 강도와 거래량 변화를 주시할 필요가 있다.`;

  addNews(picked.type, stock, title, desc);
  addAlert(`${stock.name} 관련 ${typeLabel(picked.type)} 발생`, stock, "alert");
}

function maybeGenerateBurstNews(stock, tickFactor) {
  const baseChance = 0.015 * tickFactor;
  const extraChance = Math.abs(getStockRate(stock)) > 8 ? 0.025 * tickFactor : 0;
  const volumeChance = stock.currentVolume > 250000 ? 0.012 * tickFactor : 0;
  const chance = baseChance + extraChance + volumeChance;

  if (Math.random() < chance) {
    createRandomNews(stock);
  }
}

function maybeGenerateLimitEvents(stock) {
  const rate = getStockRate(stock);

  if (rate >= 29.7 && Math.random() < 0.04) {
    addNews("good", stock, `${stock.name}, 상한가 부근 진입`, `${stock.name}이 상한가 수준까지 접근했다. 강한 매수세가 이어지며 변동성이 매우 커진 상태다.`);
    addAlert(`${stock.name} 상한가 부근 진입`, stock, "alert");
  } else if (rate <= -29.7 && Math.random() < 0.04) {
    addNews("warn", stock, `${stock.name}, 하한가 부근 급락`, `${stock.name}이 하한가 수준까지 밀렸다. 단기 반등 시도보다 변동성 관리가 우선인 구간이다.`);
    addAlert(`${stock.name} 하한가 부근 급락`, stock, "alert");
  } else if (Math.abs(rate) > 12 && Math.random() < 0.02) {
    const positive = rate > 0;
    addNews(
      positive ? "breaking" : "warn",
      stock,
      `${stock.name}, ${positive ? "급등" : "급락"} 변동성 확대`,
      `${stock.name}의 장중 변동률이 ${formatSignedPct(rate)}를 기록 중이다. 거래량 확대와 함께 단기 변동성이 매우 커진 상태다.`
    );
    addAlert(`${stock.name} ${positive ? "급등" : "급락"} 감지`, stock, "alert");
  }
}

function updateOrderbook(stock) {
  stock.orderbook.forEach(row => {
    const oldQty = row.qty;
    const move = randInt(-100, 140);
    row.qty = clamp(oldQty + move, 20, 2000);
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

function simulateTick() {
  if (state.isPaused || state.isStopped) return;

  const loops = state.speed;

  for (let loop = 0; loop < loops; loop++) {
    state.stocks.forEach(stock => {
      const last = stock.candles[stock.candles.length - 1];
      const rate = getStockRate(stock);
      let drift = 0;

      if (rate > 22) drift -= rand(0.002, 0.007);
      if (rate < -18) drift += rand(0.002, 0.007);

      const sentimentBoost = (stock.mood - 50) / 10000;
      const move = (rand(-0.018, 0.018) * stock.volatility) + drift + sentimentBoost;
      const open = last.close;
      let close = open * (1 + move);

      close = Math.max(500, close);
      close = clamp(close, stock.prevClose * 0.70, stock.prevClose * 1.30);

      const high = Math.max(open, close) * (1 + rand(0.0005, 0.015));
      const low = Math.min(open, close) * (1 - rand(0.0005, 0.015));
      const volume = randInt(12000, 280000) * stock.turnoverBoost * (1 + Math.abs(move) * 30);

      stock.candles.push({
        time: `${Date.now()}`,
        open,
        high,
        low,
        close,
        volume
      });

      if (stock.candles.length > 180) {
        stock.candles.shift();
      }

      const beforePrice = stock.currentPrice;
      stock.currentPrice = close;
      stock.currentVolume = volume;
      stock.dayHigh = Math.max(stock.dayHigh, high);
      stock.dayLow = Math.min(stock.dayLow, low);
      stock.flashDirection = close > beforePrice ? 1 : close < beforePrice ? -1 : 0;
      stock.mood = clamp(stock.mood + randInt(-2, 2) + (close > open ? 1 : -1), 0, 100);

      updateOrderbook(stock);
      maybeGenerateLimitEvents(stock);
      maybeGenerateBurstNews(stock, state.speed >= 20 ? 2.3 : state.speed >= 10 ? 1.6 : 1);
    });
  }

  renderAll();
  saveState();
}

function compressCandles(candles, step) {
  const result = [];
  for (let i = 0; i < candles.length; i += step) {
    const chunk = candles.slice(i, i + step);
    if (!chunk.length) continue;
    result.push({
      time: chunk[chunk.length - 1].time,
      open: chunk[0].open,
      close: chunk[chunk.length - 1].close,
      high: Math.max(...chunk.map(c => c.high)),
      low: Math.min(...chunk.map(c => c.low)),
      volume: chunk.reduce((s, c) => s + c.volume, 0)
    });
  }
  return result;
}

function getDisplayCandles(stock) {
  const all = stock.candles;
  if (state.chartRange === "1m") return all.slice(-80);
  if (state.chartRange === "5m") return compressCandles(all, 5).slice(-80);
  if (state.chartRange === "1d") return compressCandles(all, 10).slice(-80);
  if (state.chartRange === "1w") return compressCandles(all, 20).slice(-80);
  return all.slice(-80);
}

function calcMA(candles, period) {
  const result = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += candles[j].close;
    }
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
  const ctx = canvas.getContext("2d");
  const stock = getSelectedStock();
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

  candles.forEach((candle, i) => {
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);
    const openY = priceToY(candle.open);
    const closeY = priceToY(candle.close);
    const highY = priceToY(candle.high);
    const lowY = priceToY(candle.low);
    const up = candle.close >= candle.open;

    ctx.strokeStyle = up ? "#ff6482" : "#5daeff";
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    ctx.fillStyle = up ? "#ff5f82" : "#4f95ff";
    const bodyY = Math.min(openY, closeY);
    const bodyH = Math.max(2, Math.abs(closeY - openY));
    ctx.fillRect(x - candleW / 2, bodyY, candleW, bodyH);

    const volumeY = volToY(candle.volume);
    ctx.fillStyle = up ? "rgba(255,95,130,.92)" : "rgba(79,149,255,.92)";
    ctx.fillRect(x - candleW / 2, volumeY, candleW, volTop + volHeight - volumeY);
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
    const volume = maxVolume - (maxVolume / 2) * i;
    ctx.fillText(formatVolume(volume), CANVAS_W - 12, y + 4);
  }

  ctx.fillStyle = "rgba(255,255,255,.92)";
  ctx.textAlign = "left";
  ctx.fillText("가격", 18, 28);
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.fillText("거래량", 18, volTop - 8);

  if (state.hoverIndex >= 0 && state.hoverIndex < candles.length) {
    const i = state.hoverIndex;
    const x = pad.left + (i + 0.5) * (chartWidth / candles.length);

    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(x, chartTop);
    ctx.lineTo(x, CANVAS_H - pad.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    const candle = candles[i];
    const tooltip = els.chartTooltip;
    tooltip.classList.remove("hidden");
    tooltip.innerHTML = `
      <div><b>${stock.name}</b></div>
      <div>시가: ${formatKRW(candle.open)}</div>
      <div>고가: ${formatKRW(candle.high)}</div>
      <div>저가: ${formatKRW(candle.low)}</div>
      <div>종가: ${formatKRW(candle.close)}</div>
      <div>거래량: ${formatVolume(candle.volume)}</div>
    `;

    const rect = canvas.getBoundingClientRect();
    const ratioX = rect.width / CANVAS_W;
    const ratioY = rect.height / CANVAS_H;
    const left = (x * ratioX) + 18;
    const top = (priceToY(candle.high) * ratioY) + 12;
    tooltip.style.left = `${Math.min(left, rect.width - 220)}px`;
    tooltip.style.top = `${Math.min(top, rect.height - 150)}px`;
  } else {
    els.chartTooltip.classList.add("hidden");
  }
}

function renderSelectedHeader() {
  const stock = getSelectedStock();
  const rate = getStockRate(stock);
  const diff = stock.currentPrice - stock.prevClose;

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

  const holding = getHolding(stock.code);
  els.holdingQtyInline.textContent = `${holding.qty.toLocaleString("ko-KR")}주`;
  els.avgPriceInline.textContent = holding.qty > 0 ? formatKRW(holding.avgPrice) : "0원";

  els.availableCash.textContent = formatKRW(state.portfolio.cash);
  els.maxBuyQty.textContent = `${Math.floor(state.portfolio.cash / Math.max(1, stock.currentPrice)).toLocaleString("ko-KR")}주`;
  els.currentHoldingQty.textContent = `${holding.qty.toLocaleString("ko-KR")}주`;
  els.currentAvgPrice.textContent = holding.qty > 0 ? formatKRW(holding.avgPrice) : "0원";

  els.favoriteToggleBtn.textContent = state.favorites.includes(stock.code) ? "★" : "☆";

  els.moodFill.style.width = `${stock.mood}%`;
  els.moodText.textContent = stock.mood >= 68 ? "매수 우위" : stock.mood <= 34 ? "매도 우위" : "중립";

  if (document.activeElement !== els.orderPrice) {
    els.orderPrice.value = Math.round(stock.currentPrice);
  }

  updateEstimate();
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
  els.favoritesList.innerHTML = favorites.map(stock => {
    const rate = getStockRate(stock);
    return `
      <div class="watch-item ${stock.code === state.selectedCode ? "active" : ""}" data-code="${stock.code}">
        <div class="watch-top">
          <div class="watch-left">
            <div class="watch-logo">${stock.logo}</div>
            <div class="watch-name-wrap">
              <div class="watch-name">${stock.name}</div>
              <div class="watch-code">${stock.code}</div>
            </div>
          </div>
          <div class="watch-right">
            <div class="watch-price">${formatKRW(stock.currentPrice)}</div>
            <div class="watch-change ${rate >= 0 ? "positive" : "negative"}">${formatSignedPct(rate)}</div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderWatchlist() {
  let list = [...state.stocks];
  const q = state.searchTerm.trim().toLowerCase();

  list = list.filter(stock =>
    stock.name.toLowerCase().includes(q) ||
    stock.code.toLowerCase().includes(q) ||
    stock.theme.toLowerCase().includes(q)
  );

  if (state.sortBy === "change") {
    list.sort((a, b) => getStockRate(b) - getStockRate(a));
  } else {
    list.sort((a, b) => b.currentVolume - a.currentVolume);
  }

  const maxVolume = Math.max(...list.map(s => s.currentVolume), 1);

  els.watchlist.innerHTML = list.map(stock => {
    const rate = getStockRate(stock);
    const diff = stock.currentPrice - stock.prevClose;
    const isActive = stock.code === state.selectedCode;
    const volumePct = (stock.currentVolume / maxVolume) * 100;

    return `
      <div class="watch-item ${isActive ? "active" : ""}" data-code="${stock.code}">
        <div class="watch-top">
          <div class="watch-left">
            <div class="watch-logo">${stock.logo}</div>
            <div class="watch-name-wrap">
              <div class="watch-name">${stock.name}</div>
              <div class="watch-code">${stock.code} · ${stock.theme}</div>
            </div>
          </div>
          <div class="watch-right">
            <div class="watch-price">${formatKRW(stock.currentPrice)}</div>
            <div class="watch-change ${rate >= 0 ? "positive" : "negative"}">
              ${formatSignedKRW(diff)} (${formatSignedPct(rate)})
            </div>
          </div>
        </div>
        <div class="watch-bottom">
          <div class="volume-bar"><div class="volume-fill" style="width:${volumePct}%"></div></div>
          <div class="watch-mini">거래량 ${formatVolume(stock.currentVolume)}</div>
        </div>
      </div>
    `;
  }).join("");

  renderFavorites();
  els.marketAlertBadge.textContent = String(state.marketAlertCount);
}

function renderOrderbook() {
  const stock = getSelectedStock();
  els.orderbookRows.innerHTML = stock.orderbook.map(row => `
    <div class="order-row ${row.side} ${row.flash > 0 ? "flash-up" : row.flash < 0 ? "flash-down" : ""}">
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

function renderHistory() {
  els.orderHistoryList.innerHTML = state.orderHistory.map(item => `
    <div class="history-card">
      <div class="history-card-top">
        <span class="history-type ${item.type}">${item.type === "buy" ? "매수 체결" : "매도 체결"}</span>
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
      <div class="history-sub">${item.name ? `${item.name} · ${item.code}` : "전체 시장"}</div>
    </div>
  `).join("");

  els.alertBadge.textContent = String(state.alertCount);
}

function updateEstimate() {
  const price = Math.max(1, parseInt(els.orderPrice.value || "0", 10));
  const qty = Math.max(0, parseInt(els.orderQty.value || "0", 10));
  const amount = price * qty;
  const fee = amount * 0.0015;

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
}

function renderControlButtons() {
  els.pauseBtn.textContent = state.isPaused ? "일시정지됨" : "일시정지";
  els.resumeBtn.textContent = state.isStopped ? "재개(정지 해제)" : "재개";
}

function renderAll() {
  renderSelectedHeader();
  renderPortfolio();
  renderWatchlist();
  renderOrderbook();
  renderNews();
  renderHistory();
  drawChart();
  updateSpeedButtons();
  updateOrderModeButtons();
  renderControlButtons();
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
  const price = Math.max(1, parseInt(els.orderPrice.value || "0", 10));
  const qty = Math.max(0, parseInt(els.orderQty.value || "0", 10));

  if (!qty) {
    alert("수량을 입력해줘.");
    return;
  }

  const amount = price * qty;
  const fee = Math.round(amount * 0.0015);
  const holding = getHolding(stock.code);

  if (state.orderMode === "buy") {
    const totalCost = amount + fee;
    if (state.portfolio.cash < totalCost) {
      alert("예수금이 부족하다.");
      return;
    }

    const newQty = holding.qty + qty;
    const newAvg = newQty > 0 ? ((holding.avgPrice * holding.qty) + amount) / newQty : 0;

    state.portfolio.cash -= totalCost;
    state.portfolio.holdings[stock.code] = {
      qty: newQty,
      avgPrice: newAvg
    };

    addOrderHistory("buy", stock, qty, price, totalCost, `수수료 ${formatKRW(fee)} 포함`);
    addAlert(`${stock.name} ${qty.toLocaleString("ko-KR")}주 매수 체결`, stock);
  } else {
    if (holding.qty < qty) {
      alert("보유 수량이 부족하다.");
      return;
    }

    const proceeds = amount - fee;
    const remainQty = holding.qty - qty;

    state.portfolio.cash += proceeds;
    if (remainQty <= 0) {
      delete state.portfolio.holdings[stock.code];
    } else {
      state.portfolio.holdings[stock.code] = {
        qty: remainQty,
        avgPrice: holding.avgPrice
      };
    }

    addOrderHistory("sell", stock, qty, price, proceeds, `수수료 ${formatKRW(fee)} 차감`);
    addAlert(`${stock.name} ${qty.toLocaleString("ko-KR")}주 매도 체결`, stock);
  }

  renderAll();
  saveState();
}

function setOrderRatio(ratio) {
  const stock = getSelectedStock();
  const holding = getHolding(stock.code);
  const price = Math.max(1, parseInt(els.orderPrice.value || stock.currentPrice, 10));

  if (state.orderMode === "buy") {
    const maxQty = Math.floor(state.portfolio.cash / (price * 1.0015));
    els.orderQty.value = Math.max(1, Math.floor(maxQty * ratio));
  } else {
    els.orderQty.value = Math.max(1, Math.floor(holding.qty * ratio));
  }

  updateEstimate();
}

function sellAll() {
  state.orderMode = "sell";
  updateOrderModeButtons();

  const holding = getHolding(state.selectedCode);
  if (holding.qty <= 0) {
    alert("전량 매도할 보유 수량이 없다.");
    return;
  }

  els.orderQty.value = holding.qty;
  els.orderPrice.value = Math.round(getSelectedStock().currentPrice);
  updateEstimate();
}

function supportFund() {
  state.portfolio.cash += SUPPORT_FUND;
  addAlert(`긴급지원금 ${formatKRW(SUPPORT_FUND)} 지급 완료`, null);
  state.orderHistory.unshift({
    id: `${Date.now()}_${Math.random()}`,
    type: "buy",
    code: "SYSTEM",
    name: "긴급지원금",
    qty: 1,
    price: SUPPORT_FUND,
    amount: SUPPORT_FUND,
    note: "운영 지원금 지급",
    time: nowTime()
  });
  state.orderHistory = state.orderHistory.slice(0, ORDER_LIMIT);
  renderAll();
  saveState();
}

function pauseSimulation() {
  state.isPaused = true;
  state.isStopped = false;
  addAlert("시장 시뮬레이션 일시정지", null);
  renderControlButtons();
  saveState();
}

function resumeSimulation() {
  state.isPaused = false;
  state.isStopped = false;
  addAlert("시장 시뮬레이션 재개", null);
  renderControlButtons();
  saveState();
}

function stopSimulation() {
  state.isStopped = true;
  state.isPaused = false;
  addAlert("시장 시뮬레이션 정지", null);
  renderControlButtons();
  saveState();
}

function handleChartHover(e) {
  const canvas = els.priceChart;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const stock = getSelectedStock();
  const candles = getDisplayCandles(stock);

  const padLeft = 70;
  const padRight = 76;
  const chartWidth = CANVAS_W - padLeft - padRight;
  const innerX = (x / rect.width) * CANVAS_W - padLeft;
  const idx = Math.floor((innerX / chartWidth) * candles.length);

  state.hoverIndex = clamp(idx, 0, candles.length - 1);
  drawChart();
}

function bindEvents() {
  els.favoriteToggleBtn.addEventListener("click", toggleFavorite);

  document.getElementById("speedButtons").addEventListener("click", e => {
    const btn = e.target.closest("button[data-speed]");
    if (!btn) return;
    state.speed = Number(btn.dataset.speed);
    updateSpeedButtons();
    saveState();
  });

  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sortBy = btn.dataset.sort;
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.toggle("active", b === btn));
      renderWatchlist();
      saveState();
    });
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.chartRange = btn.dataset.chartRange;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b === btn));
      drawChart();
    });
  });

  document.querySelectorAll(".history-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".history-tab").forEach(b => b.classList.toggle("active", b === btn));
      const tab = btn.dataset.historyTab;
      els.orderHistoryList.classList.toggle("hidden", tab !== "orders");
      els.alertHistoryList.classList.toggle("hidden", tab !== "alerts");
    });
  });

  els.searchInput.addEventListener("input", e => {
    state.searchTerm = e.target.value || "";
    renderWatchlist();
  });

  els.buyModeBtn.addEventListener("click", () => {
    state.orderMode = "buy";
    updateOrderModeButtons();
  });

  els.sellModeBtn.addEventListener("click", () => {
    state.orderMode = "sell";
    updateOrderModeButtons();
  });

  els.submitOrderBtn.addEventListener("click", executeOrder);

  document.querySelector(".quick-row").addEventListener("click", e => {
    const btn = e.target.closest("button[data-ratio]");
    if (btn) {
      setOrderRatio(Number(btn.dataset.ratio));
      return;
    }
    if (e.target.id === "sellAllBtn") {
      sellAll();
    }
  });

  els.orderPrice.addEventListener("input", updateEstimate);
  els.orderQty.addEventListener("input", updateEstimate);

  els.watchlist.addEventListener("click", e => {
    const item = e.target.closest(".watch-item[data-code]");
    if (!item) return;
    setSelectedStock(item.dataset.code);
  });

  els.favoritesList.addEventListener("click", e => {
    const item = e.target.closest(".watch-item[data-code]");
    if (!item) return;
    setSelectedStock(item.dataset.code);
  });

  els.clearHistoryBtn.addEventListener("click", () => {
    state.orderHistory = [];
    state.alerts = [];
    state.alertCount = 0;
    state.marketAlertCount = 0;
    renderHistory();
    renderWatchlist();
    saveState();
  });

  els.alertBellBtn.addEventListener("click", () => {
    state.alertCount = 0;
    renderHistory();
    saveState();
  });

  els.supportFundBtn.addEventListener("click", supportFund);
  els.pauseBtn.addEventListener("click", pauseSimulation);
  els.resumeBtn.addEventListener("click", resumeSimulation);
  els.stopBtn.addEventListener("click", stopSimulation);

  els.priceChart.addEventListener("mousemove", handleChartHover);
  els.priceChart.addEventListener("mouseleave", () => {
    state.hoverIndex = -1;
    drawChart();
  });
}

function cacheElements() {
  [
    "selectedName","selectedCode","selectedPrice","selectedChange","dayHigh","dayLow","dayOpen","dayVolume",
    "favoriteToggleBtn","symbolLogo","moodFill","moodText","watchlist","favoritesList","orderbookRows",
    "newsFeed","orderHistoryList","alertHistoryList","newsCountChip","orderPrice","orderQty","estimatedCost",
    "estimatedFee","buyModeBtn","sellModeBtn","submitOrderBtn","searchInput","priceChart","chartTooltip",
    "clearHistoryBtn","alertBadge","alertBellBtn","marketAlertBadge","holdingQtyInline","avgPriceInline",
    "availableCash","maxBuyQty","currentHoldingQty","currentAvgPrice","portfolioTotal","portfolioPL",
    "portfolioCash","portfolioStockValue","portfolioInvested","portfolioRate","totalAssetTop","profitLossTop",
    "cashTop","supportFundBtn","pauseBtn","resumeBtn","stopBtn"
  ].forEach(id => {
    els[id] = document.getElementById(id);
  });
}

function seedInitialNews() {
  const shuffled = [...state.stocks].sort(() => Math.random() - 0.5).slice(0, 12);
  shuffled.forEach(stock => createRandomNews(stock));
}

function init() {
  cacheElements();

  const loaded = loadState();
  if (!loaded) {
    buildInitialStocks();
    state.portfolio = { cash: INITIAL_CASH, holdings: {} };
    seedInitialNews();
  }

  if (!state.stocks.length) {
    buildInitialStocks();
  }

  if (!Number.isFinite(state.portfolio.cash) || state.portfolio.cash <= 0) {
    state.portfolio.cash = INITIAL_CASH;
  }

  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.sort === state.sortBy);
  });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.chartRange === state.chartRange);
  });

  bindEvents();
  renderAll();
  saveState();

  setInterval(simulateTick, 1000);
}

init();
