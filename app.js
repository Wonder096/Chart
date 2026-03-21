const STORAGE_KEY = "k-moseui-pro-state-v2";

const INITIAL_CASH = 1000000;
const EMERGENCY_AID_AMOUNT = 500000;
const EMERGENCY_AID_LIMIT = 500000;

const STOCK_SEEDS = [
  { code: "A001", name: "한빛전자", base: 128000, theme: "반도체" },
  { code: "A002", name: "네오바이오", base: 84200, theme: "바이오" },
  { code: "A003", name: "대한로직스", base: 56300, theme: "물류" },
  { code: "A004", name: "미래모빌", base: 192500, theme: "모빌리티" },
  { code: "A005", name: "스카이게임즈", base: 71600, theme: "게임" },
  { code: "A006", name: "그린에너지", base: 104500, theme: "에너지" },
  { code: "A007", name: "블루핀테크", base: 151300, theme: "핀테크" },
  { code: "A008", name: "코어AI", base: 238000, theme: "AI" }
];

const NEWS_TEMPLATES = {
  호재: [
    "대형 계약 체결 기대감 확산",
    "기관 순매수 유입으로 강세",
    "신제품 출시 기대감 부각",
    "실적 서프라이즈 전망 확산"
  ],
  주의: [
    "단기 급등에 따른 차익실현 우려",
    "거래량 급증 속 변동성 확대",
    "수급 불균형으로 주가 흔들림",
    "시장 불안 심리 확대"
  ],
  속보: [
    "장중 속보: 관련 섹터 동반 움직임",
    "급등 알림: 투자심리 과열 주의",
    "긴급 공시 해석에 따라 방향성 확대",
    "외국인 수급 변화 포착"
  ],
  이벤트: [
    "테마 이벤트 발생으로 단기 관심 집중",
    "배당 기대 이벤트 반영",
    "지수 편입 기대감 부각",
    "정책 수혜 기대 이벤트 발생"
  ]
};

const state = loadState() || createInitialState();

let selectedStockCode = state.selectedStockCode || STOCK_SEEDS[0].code;
let currentMode = state.currentMode || "buy";
let intervalId = null;
let simulationPaused = false;
let sortMode = state.sortMode || "default";
let frozenSortCodes = state.frozenSortCodes || null;
let hoverIndex = null;

const el = {
  stockList: document.getElementById("stockList"),
  stockSelect: document.getElementById("stockSelect"),
  selectedStockName: document.getElementById("selectedStockName"),
  selectedStockMeta: document.getElementById("selectedStockMeta"),
  selectedNewsList: document.getElementById("selectedNewsList"),
  chartCanvas: document.getElementById("chartCanvas"),
  chartTooltip: document.getElementById("chartTooltip"),
  tickerTrack: document.getElementById("tickerTrack"),

  cashValue: document.getElementById("cashValue"),
  stockValue: document.getElementById("stockValue"),
  totalAssetValue: document.getElementById("totalAssetValue"),
  profitValue: document.getElementById("profitValue"),
  marketStatus: document.getElementById("marketStatus"),

  buyTab: document.getElementById("buyTab"),
  sellTab: document.getElementById("sellTab"),
  orderStockName: document.getElementById("orderStockName"),
  orderPrice: document.getElementById("orderPrice"),
  ownedQtyBox: document.getElementById("ownedQtyBox"),
  orderQty: document.getElementById("orderQty"),
  orderEstimate: document.getElementById("orderEstimate"),
  availableQty: document.getElementById("availableQty"),
  submitOrderBtn: document.getElementById("submitOrderBtn"),
  autosellSection: document.getElementById("autosellSection"),
  autosellEnabled: document.getElementById("autosellEnabled"),
  targetPrice: document.getElementById("targetPrice"),
  stopPrice: document.getElementById("stopPrice"),
  autoSellQty: document.getElementById("autoSellQty"),
  sellAllToggle: document.getElementById("sellAllToggle"),
  saveAutoSellBtn: document.getElementById("saveAutoSellBtn"),
  clearAutoSellBtn: document.getElementById("clearAutoSellBtn"),

  portfolioList: document.getElementById("portfolioList"),
  orderLog: document.getElementById("orderLog"),
  alertLog: document.getElementById("alertLog"),

  speedRange: document.getElementById("speedRange"),
  speedLabel: document.getElementById("speedLabel"),

  pauseBtn: document.getElementById("pauseBtn"),
  resumeBtn: document.getElementById("resumeBtn"),
  stopBtn: document.getElementById("stopBtn"),
  resetBtn: document.getElementById("resetBtn"),
  aidBtn: document.getElementById("aidBtn"),
  aidHint: document.getElementById("aidHint"),

  sortDefaultBtn: document.getElementById("sortDefaultBtn"),
  sortChangeBtn: document.getElementById("sortChangeBtn"),
  sortVolumeBtn: document.getElementById("sortVolumeBtn")
};

const ctx = el.chartCanvas.getContext("2d");

init();

function init() {
  buildStockSelect();
  bindEvents();
  syncModeUI();
  refreshAll(true);
  startSimulation();
}

function createInitialState() {
  const stocks = STOCK_SEEDS.map(seed => {
    const candles = createInitialCandles(seed.base);
    const last = candles[candles.length - 1];
    return {
      code: seed.code,
      name: seed.name,
      theme: seed.theme,
      price: last.close,
      prevClose: candles[candles.length - 2]?.close || last.close,
      changeRate: 0,
      volume: last.volume,
      candles,
      favorite: false,
      recentNews: [
        createNewsItem(seed.name, "이벤트"),
        createNewsItem(seed.name, "호재")
      ]
    };
  });

  recalcStockRates(stocks);

  return {
    cash: INITIAL_CASH,
    initialCash: INITIAL_CASH,
    emergencyAidClaimed: false,
    currentMode: "buy",
    speed: 1,
    sortMode: "default",
    frozenSortCodes: null,
    selectedStockCode: stocks[0].code,
    orderLogs: [],
    alertLogs: [],
    portfolio: {},
    autoSellRules: {},
    stocks
  };
}

function buildStockSelect() {
  el.stockSelect.innerHTML = "";
  state.stocks.forEach(stock => {
    const opt = document.createElement("option");
    opt.value = stock.code;
    opt.textContent = `${stock.name} (${stock.code})`;
    el.stockSelect.appendChild(opt);
  });
  el.stockSelect.value = selectedStockCode;
}

function bindEvents() {
  el.stockSelect.addEventListener("change", e => {
    selectedStockCode = e.target.value;
    state.selectedStockCode = selectedStockCode;
    refreshAll();
  });

  el.buyTab.addEventListener("click", () => setMode("buy"));
  el.sellTab.addEventListener("click", () => setMode("sell"));

  el.orderQty.addEventListener("input", updateOrderEstimate);
  el.targetPrice.addEventListener("input", persistState);
  el.stopPrice.addEventListener("input", persistState);
  el.autoSellQty.addEventListener("input", persistState);
  el.sellAllToggle.addEventListener("change", handleSellAllToggle);
  el.autosellEnabled.addEventListener("change", persistState);

  document.querySelectorAll(".ratio-btn").forEach(btn => {
    btn.addEventListener("click", () => applyRatio(Number(btn.dataset.ratio)));
  });

  el.submitOrderBtn.addEventListener("click", submitOrder);
  el.saveAutoSellBtn.addEventListener("click", saveAutoSellRule);
  el.clearAutoSellBtn.addEventListener("click", clearAutoSellRule);

  el.speedRange.addEventListener("input", e => {
    state.speed = Number(e.target.value);
    el.speedLabel.textContent = `${state.speed}배`;
    persistState();
  });

  el.pauseBtn.addEventListener("click", pauseSimulation);
  el.resumeBtn.addEventListener("click", resumeSimulation);
  el.stopBtn.addEventListener("click", stopSimulation);
  el.resetBtn.addEventListener("click", resetAllData);
  el.aidBtn.addEventListener("click", claimEmergencyAid);

  el.sortDefaultBtn.addEventListener("click", () => setFrozenSort("default"));
  el.sortChangeBtn.addEventListener("click", () => setFrozenSort("change"));
  el.sortVolumeBtn.addEventListener("click", () => setFrozenSort("volume"));

  el.chartCanvas.addEventListener("mousemove", onChartMouseMove);
  el.chartCanvas.addEventListener("mouseleave", () => {
    hoverIndex = null;
    el.chartTooltip.classList.add("hidden");
    drawChart();
  });
}

function startSimulation() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(tickSimulation, 1000);
}

function pauseSimulation() {
  simulationPaused = true;
  el.marketStatus.textContent = "시장 일시정지";
}

function resumeSimulation() {
  simulationPaused = false;
  el.marketStatus.textContent = "시장 가동중";
}

function stopSimulation() {
  simulationPaused = true;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  el.marketStatus.textContent = "시장 정지";
}

function tickSimulation() {
  if (simulationPaused) return;

  const loops = Math.max(1, state.speed);
  for (let i = 0; i < loops; i++) {
    state.stocks.forEach(stock => updateStockPrice(stock));
    maybeCreateMarketNews();
    processAutoSellRules();
  }

  recalcStockRates(state.stocks);
  trimLogs();
  refreshAll();
}

function updateStockPrice(stock) {
  const lastClose = stock.candles[stock.candles.length - 1].close;
  const eventBias = getNewsBias(stock);
  const volatility = Math.max(0.0045, 0.008 + Math.random() * 0.018);
  const direction = (Math.random() - 0.5 + eventBias) * volatility;
  const newClose = Math.max(1000, Math.round(lastClose * (1 + direction)));
  const high = Math.max(lastClose, newClose) + Math.round(Math.random() * lastClose * 0.01);
  const low = Math.min(lastClose, newClose) - Math.round(Math.random() * lastClose * 0.01);
  const volume = Math.round((Math.random() * 45000 + 9000) * (1 + Math.abs(direction) * 28));

  stock.candles.push({
    time: Date.now(),
    open: lastClose,
    high: Math.max(newClose, high),
    low: Math.max(1000, low),
    close: newClose,
    volume
  });

  if (stock.candles.length > 120) stock.candles.shift();

  stock.prevClose = lastClose;
  stock.price = newClose;
  stock.volume = volume;
}

function getNewsBias(stock) {
  const recent = stock.recentNews.slice(-3);
  let bias = 0;
  recent.forEach(item => {
    if (Date.now() - item.time > 90000) return;
    if (item.type === "호재") bias += 0.12;
    if (item.type === "주의") bias -= 0.10;
    if (item.type === "속보") bias += (Math.random() - 0.5) * 0.2;
    if (item.type === "이벤트") bias += 0.04;
  });
  return bias;
}

function maybeCreateMarketNews() {
  const chance = Math.random();
  if (chance > 0.18) return;

  const stock = state.stocks[Math.floor(Math.random() * state.stocks.length)];
  const types = ["호재", "주의", "속보", "이벤트"];
  const type = types[Math.floor(Math.random() * types.length)];
  const news = createNewsItem(stock.name, type);

  stock.recentNews.push(news);
  if (stock.recentNews.length > 8) stock.recentNews.shift();

  state.alertLogs.unshift({
    time: Date.now(),
    text: `[${type}] ${stock.name} - ${news.text}`
  });
}

function createNewsItem(stockName, type) {
  const list = NEWS_TEMPLATES[type];
  const text = list[Math.floor(Math.random() * list.length)];
  return {
    id: cryptoRandomId(),
    stockName,
    type,
    text,
    time: Date.now()
  };
}

function processAutoSellRules() {
  const rules = state.autoSellRules || {};
  Object.keys(rules).forEach(code => {
    const rule = rules[code];
    const stock = getStock(code);
    const holding = state.portfolio[code];

    if (!rule || !rule.enabled || !stock || !holding || holding.qty <= 0) return;

    const qty = rule.sellAll ? holding.qty : Math.min(rule.qty || 0, holding.qty);
    if (qty <= 0) return;

    let triggered = false;
    let reason = "";

    if (rule.targetPrice && stock.price >= rule.targetPrice) {
      triggered = true;
      reason = `목표가 도달 (${formatPrice(stock.price)})`;
    } else if (rule.stopPrice && stock.price <= rule.stopPrice) {
      triggered = true;
      reason = `손절가 도달 (${formatPrice(stock.price)})`;
    }

    if (!triggered) return;

    executeSell(stock.code, qty, stock.price, true);
    state.alertLogs.unshift({
      time: Date.now(),
      text: `[자동매도] ${stock.name} ${qty}주 체결 - ${reason}`
    });

    if (!state.portfolio[code] || state.portfolio[code].qty <= 0 || rule.sellAll) {
      delete state.autoSellRules[code];
    }
  });
}

function recalcStockRates(stocks) {
  stocks.forEach(stock => {
    const base = stock.prevClose || stock.price;
    stock.changeRate = base ? ((stock.price - base) / base) * 100 : 0;
  });
}

function refreshAll(initial = false) {
  renderSummary();
  renderStockList();
  renderSelectedStockInfo();
  renderNewsList();
  renderPortfolio();
  renderLogs();
  renderTicker();
  syncOrderPanel();
  drawChart();
  saveRuntimeState();

  if (!initial) persistState();
}

function renderSummary() {
  const stockValue = calcPortfolioStockValue();
  const total = state.cash + stockValue;
  const pnl = total - state.initialCash;

  el.cashValue.textContent = formatPrice(state.cash);
  el.stockValue.textContent = formatPrice(stockValue);
  el.totalAssetValue.textContent = formatPrice(total);
  el.profitValue.textContent = `${pnl >= 0 ? "+" : ""}${formatPrice(pnl)}`;
  el.profitValue.className = pnl >= 0 ? "positive" : "negative";

  const canAid = state.cash <= EMERGENCY_AID_LIMIT && !state.emergencyAidClaimed;
  el.aidBtn.disabled = !canAid;
  el.aidHint.textContent = state.emergencyAidClaimed
    ? "긴급 지원금은 이미 지급됨"
    : `현금 ${formatPrice(EMERGENCY_AID_LIMIT)} 이하일 때만 활성화`;
}

function renderStockList() {
  const ordered = getSortedStocksForDisplay();

  el.stockList.innerHTML = "";
  ordered.forEach(stock => {
    const item = document.createElement("div");
    item.className = `stock-item ${stock.code === selectedStockCode ? "active" : ""}`;
    item.addEventListener("click", e => {
      if (e.target.closest(".star-btn")) return;
      selectedStockCode = stock.code;
      state.selectedStockCode = stock.code;
      el.stockSelect.value = stock.code;
      refreshAll();
    });

    item.innerHTML = `
      <div class="stock-top">
        <div class="stock-name-wrap">
          <button class="star-btn ${stock.favorite ? "active" : ""}" data-code="${stock.code}" title="즐겨찾기">★</button>
          <div>
            <div class="stock-name">${stock.name}</div>
            <div class="stock-volume">${stock.theme}</div>
          </div>
        </div>
        <div class="stock-price">${formatPrice(stock.price)}</div>
      </div>
      <div class="stock-bottom">
        <div class="stock-change ${stock.changeRate >= 0 ? "up" : "down"}">
          ${stock.changeRate >= 0 ? "+" : ""}${stock.changeRate.toFixed(2)}%
        </div>
        <div class="stock-volume">거래량 ${formatNumber(stock.volume)}</div>
      </div>
    `;

    el.stockList.appendChild(item);
  });

  el.stockList.querySelectorAll(".star-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const stock = getStock(btn.dataset.code);
      if (!stock) return;
      stock.favorite = !stock.favorite;
      persistState();
      renderStockList();
    });
  });
}

function renderSelectedStockInfo() {
  const stock = getSelectedStock();
  if (!stock) return;

  el.selectedStockName.textContent = `${stock.name} (${stock.code})`;
  el.selectedStockMeta.textContent =
    `현재가 ${formatPrice(stock.price)} · 등락률 ${stock.changeRate >= 0 ? "+" : ""}${stock.changeRate.toFixed(2)}% · 거래량 ${formatNumber(stock.volume)}`;
}

function renderNewsList() {
  const stock = getSelectedStock();
  if (!stock) return;

  el.selectedNewsList.innerHTML = "";
  const items = stock.recentNews.slice().reverse();
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="news-tag ${item.type}">${item.type}</span>
      ${item.text}
    `;
    el.selectedNewsList.appendChild(li);
  });
}

function renderPortfolio() {
  el.portfolioList.innerHTML = "";
  const entries = Object.entries(state.portfolio);

  if (!entries.length) {
    el.portfolioList.innerHTML = `<div class="portfolio-item">보유 종목이 없습니다.</div>`;
    return;
  }

  entries.forEach(([code, holding]) => {
    const stock = getStock(code);
    if (!stock) return;

    const evalValue = stock.price * holding.qty;
    const avg = holding.avgPrice || 0;
    const pnl = (stock.price - avg) * holding.qty;

    const item = document.createElement("div");
    item.className = "portfolio-item";
    item.innerHTML = `
      <div class="portfolio-top">
        <span class="portfolio-name">${stock.name}</span>
        <span>${holding.qty}주</span>
      </div>
      <div class="portfolio-meta">평단 ${formatPrice(avg)} · 평가 ${formatPrice(evalValue)}</div>
      <div class="${pnl >= 0 ? "positive" : "negative"}" style="margin-top:6px;font-weight:800;">
        ${pnl >= 0 ? "+" : ""}${formatPrice(pnl)}
      </div>
    `;
    el.portfolioList.appendChild(item);
  });
}

function renderLogs() {
  el.orderLog.innerHTML = "";
  el.alertLog.innerHTML = "";

  if (!state.orderLogs.length) {
    el.orderLog.innerHTML = `<li>주문 기록이 없습니다.</li>`;
  } else {
    state.orderLogs.slice(0, 20).forEach(log => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>${log.text}</div>
        <div class="log-time">${formatTime(log.time)}</div>
      `;
      el.orderLog.appendChild(li);
    });
  }

  if (!state.alertLogs.length) {
    el.alertLog.innerHTML = `<li>알림 기록이 없습니다.</li>`;
  } else {
    state.alertLogs.slice(0, 20).forEach(log => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>${log.text}</div>
        <div class="log-time">${formatTime(log.time)}</div>
      `;
      el.alertLog.appendChild(li);
    });
  }
}

function renderTicker() {
  const recent = [];
  state.stocks.forEach(stock => {
    const last = stock.recentNews[stock.recentNews.length - 1];
    if (last) recent.push(last);
  });

  recent.sort((a, b) => b.time - a.time);
  const top = recent.slice(0, 10);
  el.tickerTrack.innerHTML = top.map(item => {
    return `<span>[${item.type}] ${item.stockName} - ${item.text}</span>`;
  }).join("");
}

function syncOrderPanel() {
  const stock = getSelectedStock();
  if (!stock) return;

  const holdingQty = state.portfolio[stock.code]?.qty || 0;
  const currentPrice = stock.price;
  const availableQty = currentMode === "buy"
    ? Math.floor(state.cash / currentPrice)
    : holdingQty;

  el.orderStockName.textContent = `${stock.name} (${stock.code})`;
  el.orderPrice.value = formatPrice(currentPrice);
  el.ownedQtyBox.textContent = `${holdingQty}주`;
  el.availableQty.textContent = `${availableQty}주`;

  if (currentMode === "buy") {
    el.submitOrderBtn.textContent = "매수 실행";
    el.submitOrderBtn.classList.remove("sell-mode");
    el.autosellSection.classList.add("hidden");
  } else {
    el.submitOrderBtn.textContent = "매도 실행";
    el.submitOrderBtn.classList.add("sell-mode");
    el.autosellSection.classList.remove("hidden");
    loadAutoSellRuleToForm(stock.code);
  }

  updateOrderEstimate();
}

function updateOrderEstimate() {
  const stock = getSelectedStock();
  if (!stock) return;

  const qty = Math.max(0, Number(el.orderQty.value) || 0);
  const estimate = qty * stock.price;
  el.orderEstimate.textContent = formatPrice(estimate);

  const holdingQty = state.portfolio[stock.code]?.qty || 0;
  const availableQty = currentMode === "buy"
    ? Math.floor(state.cash / stock.price)
    : holdingQty;

  el.availableQty.textContent = `${availableQty}주`;
}

function setMode(mode) {
  currentMode = mode;
  state.currentMode = mode;

  el.buyTab.classList.toggle("active", mode === "buy");
  el.sellTab.classList.toggle("active", mode === "sell");

  syncModeUI();
  refreshAll();
}

function syncModeUI() {
  const isSell = currentMode === "sell";
  el.autosellSection.classList.toggle("hidden", !isSell);
}

function applyRatio(ratio) {
  const stock = getSelectedStock();
  if (!stock) return;

  let qty = 0;
  if (currentMode === "buy") {
    const maxQty = Math.floor(state.cash / stock.price);
    qty = Math.floor(maxQty * (ratio / 100));
  } else {
    const holdingQty = state.portfolio[stock.code]?.qty || 0;
    qty = Math.floor(holdingQty * (ratio / 100));
  }

  if (ratio === 100) {
    qty = currentMode === "buy"
      ? Math.floor(state.cash / stock.price)
      : (state.portfolio[stock.code]?.qty || 0);
  }

  el.orderQty.value = qty > 0 ? qty : "";
  updateOrderEstimate();
}

function submitOrder() {
  const stock = getSelectedStock();
  if (!stock) return;

  const qty = Math.floor(Number(el.orderQty.value));
  if (!qty || qty <= 0) {
    pushAlert("수량을 올바르게 입력해 주세요.");
    return;
  }

  const executionPrice = stock.price;

  if (currentMode === "buy") {
    const maxQty = Math.floor(state.cash / executionPrice);
    if (qty > maxQty) {
      pushAlert(`주문 가능 수량을 초과했다. 최대 ${maxQty}주 가능하다.`);
      return;
    }
    executeBuy(stock.code, qty, executionPrice);
  } else {
    const holdingQty = state.portfolio[stock.code]?.qty || 0;
    if (qty > holdingQty) {
      pushAlert(`보유 수량을 초과했다. 최대 ${holdingQty}주 가능하다.`);
      return;
    }
    executeSell(stock.code, qty, executionPrice, false);
  }

  el.orderQty.value = "";
  updateOrderEstimate();
  refreshAll();
}

function executeBuy(code, qty, price) {
  const totalCost = qty * price;
  state.cash -= totalCost;

  const holding = state.portfolio[code] || { qty: 0, avgPrice: 0 };
  const newQty = holding.qty + qty;
  const newAvg = Math.round(((holding.qty * holding.avgPrice) + totalCost) / newQty);

  state.portfolio[code] = {
    qty: newQty,
    avgPrice: newAvg
  };

  const stock = getStock(code);
  state.orderLogs.unshift({
    time: Date.now(),
    text: `[매수] ${stock.name} ${qty}주 · ${formatPrice(price)}`
  });
}

function executeSell(code, qty, price, isAuto) {
  const holding = state.portfolio[code];
  if (!holding || holding.qty < qty) return;

  const totalValue = qty * price;
  state.cash += totalValue;

  holding.qty -= qty;
  if (holding.qty <= 0) {
    delete state.portfolio[code];
  }

  const stock = getStock(code);
  state.orderLogs.unshift({
    time: Date.now(),
    text: `[${isAuto ? "자동매도" : "매도"}] ${stock.name} ${qty}주 · ${formatPrice(price)}`
  });
}

function saveAutoSellRule() {
  if (currentMode !== "sell") return;

  const stock = getSelectedStock();
  const holdingQty = state.portfolio[stock.code]?.qty || 0;

  if (holdingQty <= 0) {
    pushAlert("보유 수량이 있어야 자동매도를 설정할 수 있다.");
    return;
  }

  const enabled = el.autosellEnabled.checked;
  const targetPrice = Number(el.targetPrice.value) || 0;
  const stopPrice = Number(el.stopPrice.value) || 0;
  const sellAll = el.sellAllToggle.checked;
  const qty = sellAll ? holdingQty : Math.floor(Number(el.autoSellQty.value));

  if (!enabled) {
    pushAlert("자동매도 사용 토글을 켜야 저장된다.");
    return;
  }

  if (!targetPrice && !stopPrice) {
    pushAlert("목표가 또는 손절가 중 하나는 입력해야 한다.");
    return;
  }

  if (!sellAll && (!qty || qty <= 0)) {
    pushAlert("자동매도 수량을 입력해 주세요.");
    return;
  }

  if (!sellAll && qty > holdingQty) {
    pushAlert(`보유 수량보다 많은 자동매도 수량은 설정할 수 없다. 최대 ${holdingQty}주`);
    return;
  }

  state.autoSellRules[stock.code] = {
    enabled: true,
    targetPrice,
    stopPrice,
    qty: sellAll ? holdingQty : qty,
    sellAll
  };

  pushAlert(`${stock.name} 자동매도 설정이 저장됐다.`);
  refreshAll();
}

function clearAutoSellRule() {
  const stock = getSelectedStock();
  delete state.autoSellRules[stock.code];

  el.autosellEnabled.checked = false;
  el.targetPrice.value = "";
  el.stopPrice.value = "";
  el.autoSellQty.value = "";
  el.sellAllToggle.checked = false;
  el.autoSellQty.disabled = false;

  pushAlert(`${stock.name} 자동매도 설정이 해제됐다.`);
  refreshAll();
}

function loadAutoSellRuleToForm(code) {
  const rule = state.autoSellRules[code];
  if (!rule) {
    el.autosellEnabled.checked = false;
    el.targetPrice.value = "";
    el.stopPrice.value = "";
    el.autoSellQty.value = "";
    el.sellAllToggle.checked = false;
    el.autoSellQty.disabled = false;
    return;
  }

  el.autosellEnabled.checked = !!rule.enabled;
  el.targetPrice.value = rule.targetPrice || "";
  el.stopPrice.value = rule.stopPrice || "";
  el.autoSellQty.value = rule.sellAll ? "" : (rule.qty || "");
  el.sellAllToggle.checked = !!rule.sellAll;
  el.autoSellQty.disabled = !!rule.sellAll;
}

function handleSellAllToggle() {
  const stock = getSelectedStock();
  const holdingQty = state.portfolio[stock.code]?.qty || 0;
  const checked = el.sellAllToggle.checked;

  el.autoSellQty.disabled = checked;
  if (checked) {
    el.autoSellQty.value = holdingQty || "";
  } else {
    el.autoSellQty.value = "";
  }
}

function claimEmergencyAid() {
  if (state.cash > EMERGENCY_AID_LIMIT) {
    pushAlert(`긴급 지원금은 현금 ${formatPrice(EMERGENCY_AID_LIMIT)} 이하일 때만 지급된다.`);
    return;
  }
  if (state.emergencyAidClaimed) {
    pushAlert("긴급 지원금은 이미 지급됐다.");
    return;
  }

  state.cash += EMERGENCY_AID_AMOUNT;
  state.emergencyAidClaimed = true;
  state.alertLogs.unshift({
    time: Date.now(),
    text: `[긴급지원금] ${formatPrice(EMERGENCY_AID_AMOUNT)} 지급 완료`
  });
  refreshAll();
}

function setFrozenSort(mode) {
  sortMode = mode;
  state.sortMode = mode;

  if (mode === "default") {
    frozenSortCodes = null;
    state.frozenSortCodes = null;
  } else {
    const sortedCodes = state.stocks
      .slice()
      .sort((a, b) => {
        if (mode === "change") return b.changeRate - a.changeRate;
        if (mode === "volume") return b.volume - a.volume;
        return 0;
      })
      .map(s => s.code);

    frozenSortCodes = sortedCodes;
    state.frozenSortCodes = sortedCodes;
  }

  persistState();
  renderStockList();
}

function getSortedStocksForDisplay() {
  let base = state.stocks.slice();

  if (sortMode === "default" || !frozenSortCodes) {
    return base.sort((a, b) => {
      if (b.favorite !== a.favorite) return Number(b.favorite) - Number(a.favorite);
      return STOCK_SEEDS.findIndex(x => x.code === a.code) - STOCK_SEEDS.findIndex(x => x.code === b.code);
    });
  }

  const map = new Map(base.map(stock => [stock.code, stock]));
  const ordered = frozenSortCodes.map(code => map.get(code)).filter(Boolean);

  const leftovers = base.filter(stock => !frozenSortCodes.includes(stock.code));
  return ordered.concat(leftovers);
}

function drawChart() {
  const stock = getSelectedStock();
  if (!stock) return;

  const width = el.chartCanvas.width;
  const height = el.chartCanvas.height;
  ctx.clearRect(0, 0, width, height);

  const candles = stock.candles.slice(-80);
  const priceAreaHeight = 300;
  const volumeAreaTop = 320;
  const volumeAreaHeight = 80;
  const leftPad = 56;
  const rightPad = 20;
  const topPad = 20;
  const bottomPad = 22;
  const chartWidth = width - leftPad - rightPad;

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const volumes = candles.map(c => c.volume);
  const maxPrice = Math.max(...highs) * 1.01;
  const minPrice = Math.min(...lows) * 0.99;
  const maxVolume = Math.max(...volumes, 1);

  const xStep = chartWidth / Math.max(candles.length, 1);
  const candleWidth = Math.max(4, xStep * 0.62);

  drawGrid(width, priceAreaHeight, leftPad, rightPad, topPad);

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const x = leftPad + i * xStep + xStep / 2;

    const openY = mapPriceToY(c.open, minPrice, maxPrice, topPad, priceAreaHeight);
    const closeY = mapPriceToY(c.close, minPrice, maxPrice, topPad, priceAreaHeight);
    const highY = mapPriceToY(c.high, minPrice, maxPrice, topPad, priceAreaHeight);
    const lowY = mapPriceToY(c.low, minPrice, maxPrice, topPad, priceAreaHeight);

    const isUp = c.close >= c.open;
    ctx.strokeStyle = isUp ? "#ff6985" : "#33d8a6";
    ctx.fillStyle = isUp ? "#ff6985" : "#33d8a6";

    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(2, Math.abs(closeY - openY));
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

    const volHeight = (c.volume / maxVolume) * volumeAreaHeight;
    ctx.fillStyle = "rgba(122,168,255,0.45)";
    ctx.fillRect(x - candleWidth / 2, volumeAreaTop + (volumeAreaHeight - volHeight), candleWidth, volHeight);
  }

  drawMA(candles, 5, "#7ed7ff", leftPad, xStep, minPrice, maxPrice, topPad, priceAreaHeight);
  drawMA(candles, 20, "#ffd66e", leftPad, xStep, minPrice, maxPrice, topPad, priceAreaHeight);
  drawMA(candles, 60, "#bb8cff", leftPad, xStep, minPrice, maxPrice, topPad, priceAreaHeight);

  drawAxisLabels(minPrice, maxPrice, leftPad, width, priceAreaHeight, topPad, bottomPad);

  if (hoverIndex !== null && candles[hoverIndex]) {
    const x = leftPad + hoverIndex * xStep + xStep / 2;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(x, topPad);
    ctx.lineTo(x, volumeAreaTop + volumeAreaHeight);
    ctx.stroke();
  }
}

function drawGrid(width, priceAreaHeight, leftPad, rightPad, topPad) {
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = topPad + (priceAreaHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(leftPad, y);
    ctx.lineTo(width - rightPad, y);
    ctx.stroke();
  }
}

function drawMA(candles, period, color, leftPad, xStep, minPrice, maxPrice, topPad, priceAreaHeight) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  let started = false;
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) continue;
    const slice = candles.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, c) => sum + c.close, 0) / period;
    const x = leftPad + i * xStep + xStep / 2;
    const y = mapPriceToY(avg, minPrice, maxPrice, topPad, priceAreaHeight);

    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawAxisLabels(minPrice, maxPrice, leftPad, width, priceAreaHeight, topPad, bottomPad) {
  ctx.fillStyle = "rgba(190,205,233,0.85)";
  ctx.font = "12px Pretendard";

  for (let i = 0; i <= 5; i++) {
    const ratio = i / 5;
    const price = Math.round(maxPrice - (maxPrice - minPrice) * ratio);
    const y = topPad + (priceAreaHeight / 5) * i + 4;
    ctx.fillText(formatNumber(price), 6, y);
  }

  ctx.fillStyle = "rgba(160,177,208,0.7)";
  ctx.fillText("거래량", 8, 338);
  ctx.fillText("최근 캔들 기준 자동 생성", width - 170, topPad + priceAreaHeight + bottomPad);
}

function onChartMouseMove(e) {
  const stock = getSelectedStock();
  if (!stock) return;

  const rect = el.chartCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const candles = stock.candles.slice(-80);
  const leftPad = 56;
  const rightPad = 20;
  const chartWidth = el.chartCanvas.width - leftPad - rightPad;
  const xStep = chartWidth / Math.max(candles.length, 1);

  const canvasX = (x / rect.width) * el.chartCanvas.width;
  const idx = Math.floor((canvasX - leftPad) / xStep);

  if (idx >= 0 && idx < candles.length) {
    hoverIndex = idx;
    const c = candles[idx];
    el.chartTooltip.classList.remove("hidden");
    el.chartTooltip.style.left = `${Math.min(rect.width - 180, x + 14)}px`;
    el.chartTooltip.style.top = `${Math.max(12, e.clientY - rect.top - 110)}px`;
    el.chartTooltip.innerHTML = `
      <div><strong>${formatTime(c.time, true)}</strong></div>
      <div>시가 ${formatPrice(c.open)}</div>
      <div>고가 ${formatPrice(c.high)}</div>
      <div>저가 ${formatPrice(c.low)}</div>
      <div>종가 ${formatPrice(c.close)}</div>
      <div>거래량 ${formatNumber(c.volume)}</div>
    `;
    drawChart();
  } else {
    hoverIndex = null;
    el.chartTooltip.classList.add("hidden");
  }
}

function calcPortfolioStockValue() {
  return Object.entries(state.portfolio).reduce((sum, [code, holding]) => {
    const stock = getStock(code);
    if (!stock) return sum;
    return sum + stock.price * holding.qty;
  }, 0);
}

function getSelectedStock() {
  return state.stocks.find(stock => stock.code === selectedStockCode);
}

function getStock(code) {
  return state.stocks.find(stock => stock.code === code);
}

function pushAlert(text) {
  state.alertLogs.unshift({
    time: Date.now(),
    text
  });
  trimLogs();
  renderLogs();
  persistState();
}

function trimLogs() {
  state.orderLogs = state.orderLogs.slice(0, 100);
  state.alertLogs = state.alertLogs.slice(0, 100);
}

function resetAllData() {
  const ok = confirm("정말 전체 데이터를 초기화할까? 현금, 보유종목, 주문기록, 자동매도 설정이 전부 초기화된다.");
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  const fresh = createInitialState();
  Object.keys(state).forEach(key => delete state[key]);
  Object.assign(state, fresh);

  selectedStockCode = state.selectedStockCode;
  currentMode = state.currentMode;
  sortMode = state.sortMode;
  frozenSortCodes = state.frozenSortCodes;
  simulationPaused = false;

  buildStockSelect();
  el.speedRange.value = state.speed;
  el.speedLabel.textContent = `${state.speed}배`;
  el.marketStatus.textContent = "시장 가동중";

  refreshAll(true);
  persistState();
}

function saveRuntimeState() {
  state.selectedStockCode = selectedStockCode;
  state.currentMode = currentMode;
  state.speed = Number(el.speedRange.value);
  state.sortMode = sortMode;
  state.frozenSortCodes = frozenSortCodes;
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("저장 실패", err);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("불러오기 실패", err);
    return null;
  }
}

function createInitialCandles(basePrice) {
  const candles = [];
  let price = basePrice;

  for (let i = 0; i < 90; i++) {
    const open = price;
    const drift = (Math.random() - 0.5) * 0.03;
    const close = Math.max(1000, Math.round(open * (1 + drift)));
    const high = Math.max(open, close) + Math.round(open * Math.random() * 0.012);
    const low = Math.max(1000, Math.min(open, close) - Math.round(open * Math.random() * 0.012));
    const volume = Math.round(Math.random() * 40000 + 8000);

    candles.push({
      time: Date.now() - (90 - i) * 60000,
      open,
      high,
      low,
      close,
      volume
    });

    price = close;
  }

  return candles;
}

function mapPriceToY(price, minPrice, maxPrice, topPad, height) {
  return topPad + ((maxPrice - price) / (maxPrice - minPrice || 1)) * height;
}

function formatPrice(value) {
  return `₩${Number(value).toLocaleString("ko-KR")}`;
}

function formatNumber(value) {
  return Number(value).toLocaleString("ko-KR");
}

function formatTime(ts, withDate = false) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  if (!withDate) return `${hh}:${mm}:${ss}`;

  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${month}/${date} ${hh}:${mm}:${ss}`;
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}
