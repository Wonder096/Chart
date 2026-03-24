const STORAGE_KEY = "k_mock_trading_pro_v31";
const ADMIN_CODE = "010814";

const DEFAULT_SETTINGS = {
  initialCash: 1000000,
  supportFundAmount: 500000,
  supportFundCashLimit: 500000,
  feeRate: 0.0015,
  adminHighSpeedEnabled: false,
  marketBias: 0,
  globalVolatility: 1,
  newsFrequency: 1
};

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
    "신규 계약 기대감이 돌면서 매수 대기가 늘고 있어요",
    "외국인 수급 기대가 붙으면서 시선이 모이는 구간이에요"
  ],
  bad: [
    "차익 실현 물량이 나오면서 잠깐 흔들리는 모습이에요",
    "위쪽 매물이 두꺼워져서 속도가 조금 둔해졌어요",
    "단기 급등 뒤라 변동성이 커질 수 있어 보여요",
    "시장 눌림과 함께 같이 약해지는 흐름이에요",
    "매수세가 약해지면 아래쪽 확인이 나올 수 있어요",
    "장 후반 갈수록 흔들림이 커질 가능성도 있어요"
  ],
  event: [
    "오늘 관심 종목으로 자주 언급되고 있어요",
    "검색량이 빠르게 늘면서 시선이 몰리고 있어요",
    "장중 알림 빈도가 늘어날 만큼 주목받고 있어요",
    "체결량이 늘면서 눈에 띄게 활발해졌어요",
    "단기 트레이더들이 많이 보는 자리예요",
    "수급이 몰리면 체감상 훨씬 빠르게 움직일 수 있어요"
  ],
  breaking: [
    "장중 수급이 몰리면서 움직임이 커지고 있어요",
    "거래량이 급격히 늘면서 변동성도 커졌어요",
    "한 번 방향이 나오면 강하게 이어질 수 있는 구간이에요",
    "시장 전체보다 훨씬 빠르게 반응 중이에요",
    "분봉 기준 강한 탄력이 살아나는 모습이에요",
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
  searchTerm: "",
  emergencyFundClaimed: false,
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
  autoBuyOrders: []
};

const els = {};
let tickTimer = null;
let saveTimer = null;

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function byId(id) { return document.getElementById(id); }
function q(sel, root = document) { return root.querySelector(sel); }
function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function setText(el, value) { if (el) el.textContent = value; }
function addEvent(el, type, fn) { if (el) el.addEventListener(type, fn); }
function toNum(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function toInt(v, d = 0) { const n = Math.floor(Number(v)); return Number.isFinite(n) ? n : d; }

function formatKRW(v) { return `${Math.round(toNum(v)).toLocaleString("ko-KR")}원`; }
function formatSignedKRW(v) {
  const n = Math.round(toNum(v));
  return `${n >= 0 ? "+" : ""}${n.toLocaleString("ko-KR")}원`;
}
function formatSignedPct(v) {
  const n = toNum(v);
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function formatQty(v) {
  return `${Math.max(0, toInt(v)).toLocaleString("ko-KR")}주`;
}
function formatVolume(v) {
  const n = toNum(v);
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return Math.round(n).toLocaleString("ko-KR");
}
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}
function feeOf(amount) {
  return Math.round(toNum(amount) * toNum(state.settings.feeRate));
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
  state.searchTerm = "";
  state.emergencyFundClaimed = false;
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
  state.stocks.forEach(buildOrderbook);
}

function makeStock([code, name, logo, theme, base, priceClass, style]) {
  const volatilityMap = { cheap: 0.045, mid: 0.022, large: 0.015, expensive: 0.011, premium: 0.009 };
  const history = [];
  let p = base;
  for (let i = 0; i < 120; i++) {
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
    orderbook: [],
    volatility: volatilityMap[priceClass] || 0.02,
    momentum: rand(-0.5, 0.5),
    eventBias: 0,
    eventTicks: 0,
    flash: 0
  };
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function loadState() {
  defaultState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = safeParse(raw, null);
  if (!parsed || typeof parsed !== "object") return;

  state.speed = [1,2,5,10,20,50,100,200,300].includes(toInt(parsed.speed, 1)) ? toInt(parsed.speed, 1) : 1;
  state.selectedCode = typeof parsed.selectedCode === "string" ? parsed.selectedCode : "KQ001";
  state.orderMode = parsed.orderMode === "sell" ? "sell" : "buy";
  state.sortBy = ["change", "volume"].includes(parsed.sortBy) ? parsed.sortBy : "change";
  state.chartRange = ["1m", "5m", "1d", "1w"].includes(parsed.chartRange) ? parsed.chartRange : "1m";
  state.historyTab = ["orders", "alerts"].includes(parsed.historyTab) ? parsed.historyTab : "orders";
  state.emergencyFundClaimed = !!parsed.emergencyFundClaimed;
  state.isAdmin = false;

  state.settings = {
    ...DEFAULT_SETTINGS,
    ...(parsed.settings || {})
  };
  state.settings.initialCash = Math.max(10000, toInt(state.settings.initialCash, 1000000));
  state.settings.supportFundAmount = Math.max(0, toInt(state.settings.supportFundAmount, 500000));
  state.settings.supportFundCashLimit = Math.max(0, toInt(state.settings.supportFundCashLimit, 500000));
  state.settings.feeRate = clamp(toNum(state.settings.feeRate, 0.0015), 0, 0.1);
  state.settings.marketBias = clamp(toNum(state.settings.marketBias, 0), -1, 1);
  state.settings.globalVolatility = clamp(toNum(state.settings.globalVolatility, 1), 0.2, 8);
  state.settings.newsFrequency = clamp(toNum(state.settings.newsFrequency, 1), 0.2, 8);
  state.settings.adminHighSpeedEnabled = !!state.settings.adminHighSpeedEnabled;

  state.baseline = {
    totalAsset: Math.max(0, toNum(parsed.baseline?.totalAsset, state.settings.initialCash)),
    startedAt: toInt(parsed.baseline?.startedAt, Date.now())
  };
  state.realizedProfit = toNum(parsed.realizedProfit, 0);

  state.portfolio = {
    cash: Math.max(0, toInt(parsed.portfolio?.cash, state.settings.initialCash)),
    holdings: {}
  };
  if (parsed.portfolio?.holdings && typeof parsed.portfolio.holdings === "object") {
    Object.entries(parsed.portfolio.holdings).forEach(([code, h]) => {
      const qty = Math.max(0, toInt(h?.qty, 0));
      const avgPrice = Math.max(0, toNum(h?.avgPrice, 0));
      if (qty > 0) state.portfolio.holdings[code] = { qty, avgPrice };
    });
  }

  state.favorites = Array.isArray(parsed.favorites) ? parsed.favorites.filter(x => typeof x === "string").slice(0, 20) : [];
  state.news = Array.isArray(parsed.news) ? parsed.news.slice(0, 120) : [];
  state.alerts = Array.isArray(parsed.alerts) ? parsed.alerts.slice(0, 120) : [];
  state.orderHistory = Array.isArray(parsed.orderHistory) ? parsed.orderHistory.slice(0, 200) : [];
  state.autoSellOrders = Array.isArray(parsed.autoSellOrders) ? parsed.autoSellOrders.slice(0, 120) : [];
  state.autoBuyOrders = Array.isArray(parsed.autoBuyOrders) ? parsed.autoBuyOrders.slice(0, 120) : [];

  if (Array.isArray(parsed.stocks) && parsed.stocks.length) {
    const savedMap = new Map(parsed.stocks.map(s => [s.code, s]));
    state.stocks = STOCK_BLUEPRINTS.map(bp => {
      const base = makeStock(bp);
      const saved = savedMap.get(bp[0]);
      if (!saved) {
        buildOrderbook(base);
        return base;
      }
      const currentPrice = Math.max(1, toInt(saved.currentPrice, base.currentPrice));
      const prevClose = Math.max(1, toInt(saved.prevClose, base.prevClose));
      const history = Array.isArray(saved.history) ? saved.history.map(v => Math.max(1, toInt(v, currentPrice))).slice(-240) : base.history.slice(-240);
      const stock = {
        ...base,
        ...saved,
        currentPrice,
        prevClose,
        openPrice: Math.max(1, toInt(saved.openPrice, prevClose)),
        dayHigh: Math.max(currentPrice, toInt(saved.dayHigh, currentPrice)),
        dayLow: Math.max(1, Math.min(currentPrice, toInt(saved.dayLow, currentPrice))),
        volume: Math.max(0, toInt(saved.volume, base.volume)),
        history: history.length ? history : [currentPrice],
        momentum: clamp(toNum(saved.momentum, base.momentum), -3, 3),
        eventBias: toNum(saved.eventBias, 0),
        eventTicks: Math.max(0, toInt(saved.eventTicks, 0)),
        flash: 0
      };
      buildOrderbook(stock);
      return stock;
    });
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    speed: state.speed,
    selectedCode: state.selectedCode,
    orderMode: state.orderMode,
    sortBy: state.sortBy,
    chartRange: state.chartRange,
    historyTab: state.historyTab,
    emergencyFundClaimed: state.emergencyFundClaimed,
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
    autoBuyOrders: state.autoBuyOrders
  }));
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 120);
}

function collectEls() {
  els.totalAssetTop = byId("totalAssetTop");
  els.profitLossTop = byId("profitLossTop");
  els.cashTop = byId("cashTop");
  els.supportFundBtn = byId("supportFundBtn");
  els.pauseBtn = byId("pauseBtn");
  els.resumeBtn = byId("resumeBtn");
  els.stopBtn = byId("stopBtn");
  els.resetBtn = byId("resetBtn");
  els.alertBadge = byId("alertBadge");

  els.symbolLogo = byId("symbolLogo");
  els.selectedName = byId("selectedName");
  els.selectedCode = byId("selectedCode");
  els.heroStockSelect = byId("heroStockSelect");
  els.favoriteToggleBtn = byId("favoriteToggleBtn");
  els.selectedPrice = byId("selectedPrice");
  els.selectedChange = byId("selectedChange");
  els.dayHigh = byId("dayHigh");
  els.dayLow = byId("dayLow");
  els.dayOpen = byId("dayOpen");
  els.dayVolume = byId("dayVolume");
  els.speedButtons = byId("speedButtons");
  els.moodFill = byId("moodFill");
  els.moodText = byId("moodText");

  els.priceChart = byId("priceChart");
  els.chartTooltip = byId("chartTooltip");

  els.selectedNewsTitleName = byId("selectedNewsTitleName");
  els.selectedNewsCount = byId("selectedNewsCount");
  els.selectedNewsFeed = byId("selectedNewsFeed");

  els.holdingQtyInline = byId("holdingQtyInline");
  els.avgPriceInline = byId("avgPriceInline");
  els.availableCash = byId("availableCash");
  els.maxBuyQty = byId("maxBuyQty");
  els.currentHoldingQty = byId("currentHoldingQty");
  els.currentAvgPrice = byId("currentAvgPrice");
  els.buyModeBtn = byId("buyModeBtn");
  els.sellModeBtn = byId("sellModeBtn");
  els.currentTradePriceLabel = byId("currentTradePriceLabel");
  els.orderPrice = byId("orderPrice");
  els.orderQty = byId("orderQty");
  els.quickRow = byId("quickRow");
  els.estimatedCost = byId("estimatedCost");
  els.estimatedFee = byId("estimatedFee");
  els.submitOrderBtn = byId("submitOrderBtn");

  els.autoSellTargetPrice = byId("autoSellTargetPrice");
  els.autoSellStopPrice = byId("autoSellStopPrice");
  els.autoSellQty = byId("autoSellQty");
  els.autoSellAll = byId("autoSellAll");
  els.addAutoSellBtn = byId("addAutoSellBtn");
  els.autoSellList = byId("autoSellList");

  els.orderbookRows = byId("orderbookRows");

  els.newsCountChip = byId("newsCountChip");
  els.newsFeed = byId("newsFeed");

  els.clearHistoryBtn = byId("clearHistoryBtn");
  els.orderHistoryList = byId("orderHistoryList");
  els.alertHistoryList = byId("alertHistoryList");

  els.portfolioTotal = byId("portfolioTotal");
  els.portfolioPL = byId("portfolioPL");
  els.portfolioCash = byId("portfolioCash");
  els.portfolioStockValue = byId("portfolioStockValue");
  els.portfolioInvested = byId("portfolioInvested");
  els.portfolioRate = byId("portfolioRate");

  els.watchlist = byId("watchlist");
}

function ensureInjectedUi() {
  if (!byId("chartTooltip")) {
    const wrap = q(".chart-wrap");
    if (wrap) {
      const div = document.createElement("div");
      div.id = "chartTooltip";
      div.className = "chart-tooltip hidden";
      wrap.appendChild(div);
    }
  }

  if (!byId("portfolioExtraBox")) {
    const grid = q(".portfolio-grid");
    if (grid) {
      const extra = document.createElement("div");
      extra.id = "portfolioExtraBox";
      extra.className = "portfolio-card";
      extra.innerHTML = `
        <span>실현손익 / 누적수익률 / 기준수익률 / 미실현손익</span>
        <strong id="portfolioRealized">0원</strong>
        <b id="portfolioAbsoluteRate">0.00%</b>
        <b id="portfolioBaselineRate">0.00%</b>
        <b id="portfolioUnrealized">0원</b>
      `;
      grid.parentNode.appendChild(extra);
    }
  }

  if (!byId("resetBaselineBtn")) {
    const actions = q(".header-actions");
    if (actions) {
      const btn = document.createElement("button");
      btn.id = "resetBaselineBtn";
      btn.className = "top-action-btn control-btn";
      btn.type = "button";
      btn.textContent = "수익률 리셋";
      actions.insertBefore(btn, els.pauseBtn || null);
    }
  }

  if (!byId("adminEntryBtn")) {
    const actions = q(".header-actions");
    if (actions) {
      const btn = document.createElement("button");
      btn.id = "adminEntryBtn";
      btn.className = "top-action-btn control-btn";
      btn.type = "button";
      btn.textContent = "관리자";
      actions.insertBefore(btn, els.pauseBtn || null);
    }
  }

  if (!byId("toggleActiveOrdersBtn")) {
    const head = q(".auto-sell-head");
    if (head) {
      const btn = document.createElement("button");
      btn.id = "toggleActiveOrdersBtn";
      btn.className = "ghost-btn";
      btn.type = "button";
      btn.textContent = "자동매매 비우기";
      head.appendChild(btn);
    }
  }

  if (!byId("watchlist")) {
    const panel = q(".watchlist-panel");
    if (panel) {
      const div = document.createElement("div");
      div.id = "watchlist";
      div.className = "watchlist";
      panel.appendChild(div);
    }
  }

  if (!byId("adminPanelWrap")) {
    const wrap = document.createElement("div");
    wrap.id = "adminPanelWrap";
    wrap.innerHTML = `
      <div id="adminPanel" class="hidden" style="position:fixed;right:16px;top:16px;z-index:1500;width:min(460px,calc(100vw - 32px));background:rgba(7,13,24,.98);border:1px solid rgba(255,255,255,.08);border-radius:22px;padding:18px;box-shadow:0 22px 48px rgba(0,0,0,.42);">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;">
          <div>
            <div style="font-size:12px;color:#8eb7ff;font-weight:800;">ADMIN MODE</div>
            <div style="font-size:22px;font-weight:900;">관리자 패널</div>
          </div>
          <button id="adminCloseBtn" type="button" class="ghost-btn">닫기</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">초기 자산</span>
            <input id="adminInitialCash" type="number" min="10000" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">긴급지원금</span>
            <input id="adminSupportAmount" type="number" min="0" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">긴급지원금 조건</span>
            <input id="adminSupportLimit" type="number" min="0" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">수수료율</span>
            <input id="adminFeeRate" type="number" step="0.0001" min="0" max="0.1" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">시장 편향(-1~1)</span>
            <input id="adminMarketBias" type="number" step="0.1" min="-1" max="1" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">전체 변동성</span>
            <input id="adminGlobalVolatility" type="number" step="0.1" min="0.2" max="8" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;flex-direction:column;gap:6px;">
            <span style="font-size:12px;color:#93a4c9;">뉴스 빈도</span>
            <input id="adminNewsFrequency" type="number" step="0.1" min="0.2" max="8" style="height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#0c1830;color:#fff;padding:0 12px;">
          </label>
          <label style="display:flex;align-items:center;gap:8px;margin-top:24px;">
            <input id="adminHighSpeedEnabled" type="checkbox">
            <span style="font-size:13px;color:#dce5ff;">100x / 200x / 300x 활성화</span>
          </label>
        </div>

        <div style="display:grid;gap:10px;margin-top:14px;">
          <button id="adminSaveBtn" type="button" class="top-action-btn control-btn" style="width:100%;">관리자 설정 저장</button>
          <button id="adminResetBaselineBtn" type="button" class="top-action-btn control-btn" style="width:100%;">수익률 기준 리셋 강제 실행</button>
          <button id="adminClearAutosBtn" type="button" class="top-action-btn control-btn" style="width:100%;">자동매매 전체 초기화</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  collectEls();
}

function buildOrderbook(stock) {
  const base = stock.currentPrice;
  const spreadFactor =
    base < 2000 ? 0.006 :
    base < 10000 ? 0.003 :
    base < 100000 ? 0.0016 : 0.001;

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

  for (let i = 0; i < 5; i++) {
    const step = Math.max(1, Math.round(base * spreadFactor * (i + 1)));
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

function renderTop() {
  setText(els.totalAssetTop, formatKRW(totalAsset()));
  setText(els.profitLossTop, `${formatSignedKRW(baselineProfit())} (${formatSignedPct(baselineProfitRate())})`);
  setText(els.cashTop, formatKRW(state.portfolio.cash));

  if (els.profitLossTop) {
    els.profitLossTop.classList.remove("up", "down");
    els.profitLossTop.classList.add(baselineProfit() >= 0 ? "up" : "down");
  }

  if (els.alertBadge) els.alertBadge.textContent = String(state.alerts.length);
  if (els.supportFundBtn) {
    els.supportFundBtn.disabled = state.emergencyFundClaimed || state.portfolio.cash > state.settings.supportFundCashLimit;
    els.supportFundBtn.textContent = state.emergencyFundClaimed
      ? "긴급지원금 사용완료"
      : `긴급지원금 +${Math.round(state.settings.supportFundAmount / 10000)}만원`;
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
    const liked = state.favorites.includes(stock.code);
    els.favoriteToggleBtn.textContent = liked ? "★" : "☆";
  }

  if (els.heroStockSelect) {
    els.heroStockSelect.innerHTML = state.stocks.map(s => {
      return `<option value="${s.code}">${s.name} · ${s.theme}</option>`;
    }).join("");
    els.heroStockSelect.value = stock.code;
  }
}

function renderPortfolio() {
  const unrealized = Object.entries(state.portfolio.holdings).reduce((sum, [code, h]) => {
    const stock = state.stocks.find(s => s.code === code);
    if (!stock) return sum;
    return sum + ((stock.currentPrice - h.avgPrice) * h.qty);
  }, 0);

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
      render();
      queueSave();
    });
  });
}

function renderSpeedButtons() {
  if (!els.speedButtons) return;
  const speeds = [1, 2, 5, 10, 20, 50].concat(state.settings.adminHighSpeedEnabled ? [100, 200, 300] : []);
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
  const autoSellBlock = q(".auto-sell-block");
  if (autoSellBlock) autoSellBlock.style.display = state.orderMode === "sell" ? "" : "none";
  updateOrderInputs();
}

function updateQuickButtons(maxBuyQty) {
  if (!els.quickRow) return;
  const buttons = [
    { label: "1주", value: 1 },
    { label: "5주", value: 5 },
    { label: "10주", value: 10 },
    { label: "4주", value: 4 },
    { label: "8주", value: 8 },
    { label: "최대", value: maxBuyQty }
  ];
  els.quickRow.innerHTML = buttons.map(b => `<button type="button" data-qty="${b.value}">${b.label}</button>`).join("");
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
  const qty = Math.max(1, toInt(els.orderQty?.value, 1));
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

  if (state.orderMode === "sell" && holding.qty > 0 && qty > holding.qty && els.orderQty) {
    els.orderQty.value = String(holding.qty);
  }

  updateQuickButtons(maxBuyQty);
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

  recordOrder({ type: "sell", stockName: stock.name, code, qty, price, fee, total, reason });
  return true;
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
  render();
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
  renderAutoSellList();
  queueSave();
}

function renderAutoSellList() {
  if (!els.autoSellList) return;
  if (!state.autoSellOrders.length) {
    els.autoSellList.innerHTML = `<div class="auto-sell-item"><div class="auto-sell-item-main">등록된 자동매도가 없어요</div></div>`;
    return;
  }
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

  qa("[data-auto-sell-del]", els.autoSellList).forEach(btn => {
    addEvent(btn, "click", () => {
      state.autoSellOrders = state.autoSellOrders.filter(x => x.id !== btn.dataset.autoSellDel);
      renderAutoSellList();
      queueSave();
    });
  });
}

function processAutoOrders() {
  const removeSellIds = [];
  state.autoSellOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) {
      removeSellIds.push(order.id);
      return;
    }
    const holding = holdingOf(order.code);
    if (holding.qty <= 0) {
      removeSellIds.push(order.id);
      return;
    }
    const hitTarget = order.targetPrice > 0 && stock.currentPrice >= order.targetPrice;
    const hitStop = order.stopPrice > 0 && stock.currentPrice <= order.stopPrice;
    if (!hitTarget && !hitStop) return;

    const qty = order.all ? holding.qty : Math.min(holding.qty, order.qty);
    if (qty <= 0) {
      removeSellIds.push(order.id);
      return;
    }
    executeSell(order.code, qty, stock.currentPrice, hitTarget ? "자동매도(목표가)" : "자동매도(손절가)");
    removeSellIds.push(order.id);
  });

  if (removeSellIds.length) {
    state.autoSellOrders = state.autoSellOrders.filter(x => !removeSellIds.includes(x.id));
    renderAutoSellList();
  }
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

  // 상한/하한 제거: 30% 제한 없음
  let next = Math.max(1, Math.round(stock.currentPrice * (1 + move)));

  stock.currentPrice = next;
  stock.dayHigh = Math.max(stock.dayHigh, next);
  stock.dayLow = Math.min(stock.dayLow, next);
  stock.volume += Math.max(1, Math.round(rand(200, 10000) * (1 + Math.abs(move) * 35) * (stock.priceClass === "cheap" ? 3.4 : stock.priceClass === "premium" ? 0.45 : 1)));
  stock.history.push(next);
  if (stock.history.length > 240) stock.history.shift();

  stock.momentum = clamp(stock.momentum * 0.92 + (next > oldPrice ? 0.28 : -0.28), -3, 3);
  if (stock.eventTicks > 0) stock.eventTicks -= 1;
  if (stock.eventTicks <= 0) stock.eventBias *= 0.6;

  buildOrderbook(stock);
  stock.flash = next > oldPrice ? 1 : next < oldPrice ? -1 : 0;
}

function getSpeedProfile(speed) {
  const map = {
    1: { delay: 1000, loops: 1 },
    2: { delay: 520, loops: 1 },
    5: { delay: 240, loops: 1 },
    10: { delay: 130, loops: 1 },
    20: { delay: 70, loops: 2 },
    50: { delay: 30, loops: 3 },
    100: { delay: 16, loops: 4 },
    200: { delay: 9, loops: 6 },
    300: { delay: 6, loops: 8 }
  };
  return map[speed] || map[1];
}

function tickOnce() {
  if (state.isPaused || state.isStopped) return;
  const profile = getSpeedProfile(state.speed);
  for (let i = 0; i < profile.loops; i++) {
    state.stocks.forEach(updateOneStock);
    processAutoOrders();
  }
  render();
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

function getChartSeries(stock) {
  const hist = stock.history || [];
  if (state.chartRange === "1m") return hist.slice(-60);
  if (state.chartRange === "5m") return hist.filter((_, i) => i % 2 === 0).slice(-80);
  if (state.chartRange === "1d") return hist.slice(-140);
  return hist.slice(-220);
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
  ctx.fillText(`${formatSignedPct(stockRate(stock))} · 시가 ${formatKRW(stock.openPrice)}`, padding.left, height - 14);

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
    `;

    const left = clamp(xOf(idx) + 14, 8, width - 220);
    const top = clamp(yOf(price) - 78, 8, height - 120);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  canvas.onmouseleave = () => {
    tooltip.classList.add("hidden");
  };
}

function renderSortButtons() {
  qa(".sort-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.sort === state.sortBy));
}

function renderChartTabs() {
  qa(".tab-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.chartRange === state.chartRange));
}

function render() {
  renderTop();
  renderHero();
  renderPortfolio();
  renderOrderbook();
  renderSelectedNews();
  renderNews();
  renderHistory();
  renderWatchlist();
  renderAutoSellList();
  renderSpeedButtons();
  renderSortButtons();
  renderChartTabs();
  updateOrderInputs();
  drawChart();
}

function claimSupportFund() {
  if (state.emergencyFundClaimed) {
    toast("긴급지원금은 이미 사용했어요.");
    return;
  }
  if (state.portfolio.cash > state.settings.supportFundCashLimit) {
    toast(`현금이 ${formatKRW(state.settings.supportFundCashLimit)} 이하일 때만 가능해요.`);
    return;
  }
  state.portfolio.cash += state.settings.supportFundAmount;
  state.emergencyFundClaimed = true;
  toast(`${formatKRW(state.settings.supportFundAmount)} 지급 완료`);
  render();
  queueSave();
}

function resetBaseline() {
  state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() };
  toast("현재 총자산 기준으로 수익률 기준이 리셋됐어요.");
  render();
  queueSave();
}

function resetAllData() {
  if (!confirm("전체 데이터를 초기화할까요?")) return;
  localStorage.removeItem(STORAGE_KEY);
  defaultState();
  render();
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

function bindEvents() {
  addEvent(els.supportFundBtn, "click", claimSupportFund);
  addEvent(byId("resetBaselineBtn"), "click", resetBaseline);
  addEvent(els.pauseBtn, "click", () => { state.isPaused = true; });
  addEvent(els.resumeBtn, "click", () => { state.isPaused = false; });
  addEvent(els.stopBtn, "click", () => { state.isStopped = !state.isStopped; });
  addEvent(els.resetBtn, "click", resetAllData);

  addEvent(els.favoriteToggleBtn, "click", toggleFavorite);
  addEvent(els.heroStockSelect, "change", () => {
    state.selectedCode = els.heroStockSelect.value;
    render();
    queueSave();
  });

  addEvent(els.buyModeBtn, "click", () => setOrderMode("buy"));
  addEvent(els.sellModeBtn, "click", () => setOrderMode("sell"));
  addEvent(els.orderQty, "input", updateOrderInputs);
  addEvent(els.submitOrderBtn, "click", submitOrder);

  addEvent(els.addAutoSellBtn, "click", addAutoSellOrder);
  addEvent(byId("toggleActiveOrdersBtn"), "click", () => {
    state.autoSellOrders = [];
    state.autoBuyOrders = [];
    renderAutoSellList();
    queueSave();
  });

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

  addEvent(byId("adminEntryBtn"), "click", () => {
    if (!state.isAdmin) {
      const code = prompt("관리자 코드를 입력하세요");
      if (code !== ADMIN_CODE) {
        toast("관리자 코드가 올바르지 않아요.");
        return;
      }
      state.isAdmin = true;
      byId("adminEntryBtn")?.classList.add("active-admin");
      byId("adminEntryBtn").textContent = "관리자 ON";
    }
    const panel = byId("adminPanel");
    if (panel) {
      panel.classList.remove("hidden");
      byId("adminInitialCash").value = state.settings.initialCash;
      byId("adminSupportAmount").value = state.settings.supportFundAmount;
      byId("adminSupportLimit").value = state.settings.supportFundCashLimit;
      byId("adminFeeRate").value = state.settings.feeRate;
      byId("adminMarketBias").value = state.settings.marketBias;
      byId("adminGlobalVolatility").value = state.settings.globalVolatility;
      byId("adminNewsFrequency").value = state.settings.newsFrequency;
      byId("adminHighSpeedEnabled").checked = !!state.settings.adminHighSpeedEnabled;
    }
  });

  addEvent(byId("adminCloseBtn"), "click", () => byId("adminPanel")?.classList.add("hidden"));

  addEvent(byId("adminSaveBtn"), "click", () => {
    if (!state.isAdmin) return;
    state.settings.initialCash = Math.max(10000, toInt(byId("adminInitialCash")?.value, state.settings.initialCash));
    state.settings.supportFundAmount = Math.max(0, toInt(byId("adminSupportAmount")?.value, state.settings.supportFundAmount));
    state.settings.supportFundCashLimit = Math.max(0, toInt(byId("adminSupportLimit")?.value, state.settings.supportFundCashLimit));
    state.settings.feeRate = clamp(toNum(byId("adminFeeRate")?.value, state.settings.feeRate), 0, 0.1);
    state.settings.marketBias = clamp(toNum(byId("adminMarketBias")?.value, state.settings.marketBias), -1, 1);
    state.settings.globalVolatility = clamp(toNum(byId("adminGlobalVolatility")?.value, state.settings.globalVolatility), 0.2, 8);
    state.settings.newsFrequency = clamp(toNum(byId("adminNewsFrequency")?.value, state.settings.newsFrequency), 0.2, 8);
    state.settings.adminHighSpeedEnabled = !!byId("adminHighSpeedEnabled")?.checked;

    if (![1,2,5,10,20,50,100,200,300].includes(state.speed)) state.speed = 1;
    if (state.speed > 50 && !state.settings.adminHighSpeedEnabled) state.speed = 50;

    render();
    restartTick();
    queueSave();
  });

  addEvent(byId("adminResetBaselineBtn"), "click", resetBaseline);
  addEvent(byId("adminClearAutosBtn"), "click", () => {
    state.autoSellOrders = [];
    state.autoBuyOrders = [];
    renderAutoSellList();
    queueSave();
  });

  window.addEventListener("resize", drawChart);
}

function init() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
    return;
  }
  loadState();
  collectEls();
  ensureInjectedUi();
  collectEls();
  bindEvents();
  setOrderMode(state.orderMode);
  render();
  restartTick();
}

init();
