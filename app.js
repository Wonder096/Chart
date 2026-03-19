const START_CASH = 1_000_000;
const RESCUE_CASH = 1_000_000;

const NEWS_CHANCE_PER_TICK = 0.014;
const SHOCK_CHANCE_PER_TICK = 0.0045;
const SHOCK_MIN = 0.08;
const SHOCK_MAX = 0.20;

const LIMIT_UP_PCT = 0.30;
const LIMIT_DOWN_PCT = 0.30;
const HALT_TICKS = 25;

const HISTORY_LEN = 240;
const TAPE_LEN = 20;
const INVESTOR_HISTORY_LEN = 7;
const CANDLE_LIMIT = 140;
const TICKS_PER_CANDLE = 5;

const FEE_RATE = 0.001;
const SLIPPAGE_RATE = 0.0006;

const STORAGE_KEY = "k_mock_stock_pro_v3";

const REGIMES = {
  CALM: { label: "보합권", move: 0.010, eventMul: 0.95, bias: 0.0000, mood: "📍 보합 흐름", cls: "calm" },
  MANIA: { label: "강세장", move: 0.028, eventMul: 1.70, bias: 0.0018, mood: "🔥 매수세 우위", cls: "mania" },
  CRASH: { label: "약세장", move: 0.024, eventMul: 1.50, bias: -0.0022, mood: "❄️ 매도세 우위", cls: "crash" }
};

const SPARKS = "▁▂▃▄▅▆▇█";

const STOCK_CATALOG = [
  { symbol: "HBT", name: "한빛테크", color: "#ef4444", sector: "IT", theme: "AI · 반도체", desc: "AI 서버와 차세대 연산 칩을 개발하는 고성장 기술주" },
  { symbol: "MBB", name: "미래바이오", color: "#8b5cf6", sector: "바이오", theme: "신약 · 헬스케어", desc: "항암 신약 파이프라인과 정밀의료 플랫폼을 보유한 바이오주" },
  { symbol: "DHM", name: "대한모빌리티", color: "#f59e0b", sector: "자동차", theme: "전기차 · 자율주행", desc: "전기차 구동계와 자율주행 솔루션을 확대 중인 모빌리티 기업" },
  { symbol: "NEE", name: "네오엔터", color: "#ec4899", sector: "게임", theme: "게임 · 콘텐츠", desc: "라이브 서비스와 IP 확장을 동시에 노리는 엔터테인먼트 기업" },
  { symbol: "LNE", name: "루나에너지", color: "#10b981", sector: "에너지", theme: "2차전지 · ESS", desc: "배터리 소재와 에너지 저장장치 사업을 함께 키우는 친환경 기업" },
  { symbol: "CRL", name: "코어로직", color: "#06b6d4", sector: "소프트웨어", theme: "클라우드 · SaaS", desc: "클라우드 전환 솔루션과 기업용 AI 자동화를 제공하는 플랫폼 기업" },
  { symbol: "ATK", name: "아르테크", color: "#84cc16", sector: "기계", theme: "로봇 · 자동화", desc: "산업용 로봇과 물류 자동화 설비를 공급하는 로봇 테마주" },
  { symbol: "FCP", name: "핀캐피탈", color: "#6366f1", sector: "금융", theme: "핀테크 · 결제", desc: "간편결제와 디지털 자산 관리 서비스를 확장하는 금융 플랫폼" }
];

const RIVAL_NAMES = ["레드펀드", "블루캐피탈", "알파투자", "스카이자산", "넥스트홀딩스", "골든리버", "노바트레이드"];

const SPEED_MODES = [1000, 500, 250, 167, 125, 100];

const $ = (sel) => document.querySelector(sel);

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function fmtWon(x) {
  return `${Math.round(x).toLocaleString("ko-KR")}원`;
}
function fmtNum(x) {
  return `${Math.round(x).toLocaleString("ko-KR")}`;
}
function fmtPct(x) {
  const sign = x >= 0 ? "+" : "";
  return `${sign}${x.toFixed(2)}%`;
}
function fmtSignedWon(x) {
  const sign = x >= 0 ? "+" : "";
  return `${sign}${fmtWon(x)}`;
}
function fmtSignedNum(x) {
  const sign = x >= 0 ? "+" : "";
  return `${sign}${Math.round(x).toLocaleString("ko-KR")}`;
}
function clampPrice(p) {
  return Math.max(1, p);
}
function fee(cost) {
  return cost * FEE_RATE;
}
function execPrice(marketPrice, side) {
  return side === "BUY"
    ? marketPrice * (1 + SLIPPAGE_RATE)
    : marketPrice * (1 - SLIPPAGE_RATE);
}
function sparkline(values) {
  if (!values || values.length === 0) return "—";
  const vmin = Math.min(...values);
  const vmax = Math.max(...values);
  if (vmin === vmax) return SPARKS[0].repeat(values.length);
  return values.map(v => {
    const t = (v - vmin) / (vmax - vmin);
    const idx = Math.floor(t * (SPARKS.length - 1));
    return SPARKS[idx];
  }).join("");
}
function moveClass(delta, halted, limitState) {
  if (halted) return "neutral";
  if (limitState === "UP") return "up";
  if (limitState === "DOWN") return "down";
  if (delta > 0) return "up";
  if (delta < 0) return "down";
  return "neutral";
}
function trendWord(delta, halted, limitState) {
  if (halted) return "거래정지";
  if (limitState === "UP") return "상한가";
  if (limitState === "DOWN") return "하한가";
  if (delta > 0) return "상승";
  if (delta < 0) return "하락";
  return "보합";
}
function ratioBar(rate) {
  const r = Math.max(-10, Math.min(10, rate));
  const total = 10;
  let red = 0;
  let blue = 0;
  if (r >= 0) red = Math.round((r / 10) * total);
  else blue = Math.round((Math.abs(r) / 10) * total);
  return "🟥".repeat(red) + "⬜".repeat(total - red - blue) + "🟦".repeat(blue);
}
function todayLabel(offset = 0) {
  const d = new Date(Date.now() - offset * 86400000);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
}
function average(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function calcMA(candles, period) {
  const out = [];
  for (let i = 0; i < candles.length; i++) {
    if (i + 1 < period) {
      out.push(null);
      continue;
    }
    const slice = candles.slice(i + 1 - period, i + 1);
    out.push(average(slice.map(c => c.close)));
  }
  return out;
}
function newsTagType(text) {
  if (text.includes("호재") || text.includes("급등") || text.includes("고래매수") || text.includes("실적 상향")) return "good";
  if (text.includes("악재") || text.includes("급락") || text.includes("하한가") || text.includes("거래정지") || text.includes("고래매도")) return "bad";
  return "event";
}

class Holding {
  constructor(qty = 0, avg = 0) {
    this.qty = qty;
    this.avg = avg;
  }
}

class Portfolio {
  constructor() {
    this.cash = START_CASH;
    this.holdings = {};
    this.realizedPnl = 0;
    this.rescueCount = 0;
  }

  getHolding(sym) {
    if (!this.holdings[sym]) this.holdings[sym] = new Holding();
    return this.holdings[sym];
  }

  totalValue(prices) {
    let v = this.cash;
    for (const [sym, h] of Object.entries(this.holdings)) {
      v += h.qty * (prices[sym] || 0);
    }
    return v;
  }

  unrealizedPnl(prices) {
    let u = 0;
    for (const [sym, h] of Object.entries(this.holdings)) {
      if (h.qty <= 0) continue;
      u += ((prices[sym] || 0) - h.avg) * h.qty;
    }
    return u;
  }

  totalInvested() {
    return START_CASH + this.rescueCount * RESCUE_CASH;
  }

  totalReturnPct(prices) {
    const invested = this.totalInvested();
    if (!invested) return 0;
    return ((this.totalValue(prices) - invested) / invested) * 100;
  }

  allocation(prices) {
    const total = this.totalValue(prices);
    if (total <= 0) return [];
    const rows = [];
    for (const [sym, h] of Object.entries(this.holdings)) {
      if (h.qty <= 0) continue;
      const value = h.qty * (prices[sym] || 0);
      const pct = (value / total) * 100;
      rows.push({ sym, value, pct });
    }
    rows.sort((a, b) => b.value - a.value);
    return rows;
  }

  toJSON() {
    return {
      cash: this.cash,
      holdings: this.holdings,
      realizedPnl: this.realizedPnl,
      rescueCount: this.rescueCount
    };
  }

  static from(data) {
    const pf = new Portfolio();
    pf.cash = data.cash ?? START_CASH;
    pf.realizedPnl = data.realizedPnl ?? 0;
    pf.rescueCount = data.rescueCount ?? 0;
    pf.holdings = {};
    for (const [sym, v] of Object.entries(data.holdings || {})) {
      pf.holdings[sym] = new Holding(v.qty || 0, v.avg || 0);
    }
    return pf;
  }
}

class SymbolMarket {
  constructor(meta) {
    this.symbol = meta.symbol;
    this.name = meta.name;
    this.color = meta.color;
    this.sector = meta.sector;
    this.theme = meta.theme;
    this.desc = meta.desc;

    const base = randInt(10000, 300000);
    this.price = base * rand(0.94, 1.06);
    this.lastDeltaPct = 0;
    this.news = null;

    this.basePrice = this.price;
    this.dayOpen = this.price;
    this.dayHigh = this.price;
    this.dayLow = this.price;
    this.prevClose = this.price;
    this.dayVolume = randInt(1000, 5000);

    this.haltedUntilTick = 0;
    this.limitState = "NORMAL";

    this.history = [this.price];
    this.tradeTape = [];
    this.candles = [];
    this.currentCandle = null;

    this.investorToday = { personal: 0, foreign: 0, institute: 0 };
    this.investorHistory = [];
    this.seedInvestorHistory();
    this.seedCandles();
  }

  seedInvestorHistory() {
    this.investorHistory = [];
    for (let i = 6; i >= 1; i--) {
      const p = randInt(-18000000, 18000000);
      const f = randInt(-16000000, 16000000);
      const ins = -(p + f) + randInt(-1500000, 1500000);
      this.investorHistory.unshift({
        date: todayLabel(i),
        personal: p,
        foreign: f,
        institute: ins
      });
    }
  }

  seedCandles() {
    let p = this.price;
    for (let i = 0; i < 40; i++) {
      const o = p;
      const c = clampPrice(o * (1 + rand(-0.03, 0.03)));
      const h = Math.max(o, c) * (1 + rand(0.001, 0.02));
      const l = Math.min(o, c) * (1 - rand(0.001, 0.02));
      this.candles.push({
        time: i,
        open: o,
        high: h,
        low: l,
        close: c,
        volume: randInt(2000, 15000)
      });
      p = c;
    }
  }

  resetDayBase() {
    this.investorHistory.unshift({
      date: todayLabel(0),
      personal: this.investorToday.personal,
      foreign: this.investorToday.foreign,
      institute: this.investorToday.institute
    });
    this.investorHistory = this.investorHistory.slice(0, INVESTOR_HISTORY_LEN);

    this.prevClose = this.price;
    this.basePrice = this.price;
    this.dayOpen = this.price;
    this.dayHigh = this.price;
    this.dayLow = this.price;
    this.dayVolume = 0;
    this.limitState = "NORMAL";
    this.haltedUntilTick = 0;
    this.tradeTape = [];
    this.investorToday = { personal: 0, foreign: 0, institute: 0 };
  }

  limitUpPrice() {
    return this.basePrice * (1 + LIMIT_UP_PCT);
  }

  limitDownPrice() {
    return this.basePrice * (1 - LIMIT_DOWN_PCT);
  }

  isHalted(tick) {
    return tick < this.haltedUntilTick;
  }

  activeNewsBias(tick) {
    if (this.news && tick < this.news.untilTick) return this.news.bias;
    return 0;
  }

  activeNewsText(tick) {
    if (this.news && tick < this.news.untilTick) {
      return `${this.news.title}: ${this.news.text} (남은 ${this.news.untilTick - tick}s)`;
    }
    return "없음";
  }

  maybeClearNews(tick) {
    if (this.news && tick >= this.news.untilTick) this.news = null;
  }

  volatilityPct() {
    const vals = this.history.slice(-20);
    if (vals.length < 2) return 0;
    const low = Math.min(...vals);
    const high = Math.max(...vals);
    return ((high - low) / Math.max(1, this.price)) * 100;
  }

  rollNews(tick) {
    const good = Math.random() < 0.5;
    const pool = good ? [
      ["호재", "대형 계약 체결 소식 확산", 0.008, 0.020, 6, 14],
      ["호재", "실적 상향 기대감 반영", 0.006, 0.018, 6, 12],
      ["고래매수", "기관급 대량 매수 포착", 0.012, 0.035, 4, 9],
      ["기술호재", "신규 서비스 기대감 상승", 0.006, 0.018, 6, 13],
      ["실적", "분기 실적 서프라이즈", 0.010, 0.028, 6, 14],
      ["확장", "해외 진출 소식 부각", 0.008, 0.020, 6, 12]
    ] : [
      ["악재", "규제 이슈 가능성 보도", -0.020, -0.008, 6, 14],
      ["스캔들", "대표 관련 논란 발생", -0.028, -0.012, 5, 12],
      ["고래매도", "대량 시장가 매도 출회", -0.040, -0.012, 4, 9],
      ["장애", "서비스 장애로 신뢰 하락", -0.020, -0.008, 5, 10],
      ["공매도", "매도 압력 급증", -0.024, -0.010, 6, 12],
      ["실적", "실적 하향 우려 확산", -0.018, -0.007, 6, 12]
    ];
    const item = pool[randInt(0, pool.length - 1)];
    this.news = {
      title: item[0],
      text: item[1],
      bias: rand(item[2], item[3]),
      untilTick: tick + randInt(item[4], item[5])
    };
  }

  recordTradeTape(price, deltaPct) {
    const qty = randInt(1, 999);
    const side = deltaPct >= 0 ? "BUY" : "SELL";
    this.tradeTape.unshift({ side, price, qty, rate: deltaPct * 100 });
    this.tradeTape = this.tradeTape.slice(0, TAPE_LEN);
  }

  updateInvestors(deltaPct) {
    const strength = Math.abs(deltaPct) * 10000000;
    const personal = Math.round(randInt(-400000, 400000) + strength * (deltaPct >= 0 ? 1 : -0.5));
    const foreign = Math.round(randInt(-350000, 350000) + strength * (deltaPct >= 0 ? -0.6 : 1.0));
    const institute = Math.round(-(personal + foreign) + randInt(-120000, 120000));

    this.investorToday.personal += personal;
    this.investorToday.foreign += foreign;
    this.investorToday.institute += institute;
  }

  updateCandle(tick) {
    const candleTime = Math.floor(tick / TICKS_PER_CANDLE);
    if (!this.currentCandle || this.currentCandle.time !== candleTime) {
      if (this.currentCandle) this.candles.push(this.currentCandle);
      this.currentCandle = {
        time: candleTime,
        open: this.price,
        high: this.price,
        low: this.price,
        close: this.price,
        volume: 0
      };
    }
    this.currentCandle.high = Math.max(this.currentCandle.high, this.price);
    this.currentCandle.low = Math.min(this.currentCandle.low, this.price);
    this.currentCandle.close = this.price;
    this.currentCandle.volume += randInt(80, 800);

    this.candles = this.candles.slice(-CANDLE_LIMIT);
  }

  getCandleSeries() {
    const out = [...this.candles];
    if (this.currentCandle) out.push(this.currentCandle);
    return out.slice(-CANDLE_LIMIT);
  }

  toJSON() {
    return {
      symbol: this.symbol,
      name: this.name,
      color: this.color,
      sector: this.sector,
      theme: this.theme,
      desc: this.desc,
      price: this.price,
      lastDeltaPct: this.lastDeltaPct,
      news: this.news,
      basePrice: this.basePrice,
      dayOpen: this.dayOpen,
      dayHigh: this.dayHigh,
      dayLow: this.dayLow,
      prevClose: this.prevClose,
      dayVolume: this.dayVolume,
      haltedUntilTick: this.haltedUntilTick,
      limitState: this.limitState,
      history: this.history,
      tradeTape: this.tradeTape,
      investorToday: this.investorToday,
      investorHistory: this.investorHistory,
      candles: this.candles,
      currentCandle: this.currentCandle
    };
  }

  static from(data) {
    const sm = new SymbolMarket(data);
    Object.assign(sm, data);
    return sm;
  }
}

class Market {
  constructor() {
    this.tick = 0;
    this.regime = "CALM";
    this.regimeUntil = 0;
    this.lastDayReset = Date.now();

    this.symbols = {};
    for (const item of STOCK_CATALOG) this.symbols[item.symbol] = new SymbolMarket(item);

    this.newsFeed = [];
    this.eventFeed = [];
  }

  maybeSwitchRegime() {
    if (this.tick < this.regimeUntil) return;
    const r = Math.random();
    if (this.regime === "CALM") {
      this.regime = r < 0.12 ? "MANIA" : (r < 0.22 ? "CRASH" : "CALM");
    } else if (this.regime === "MANIA") {
      this.regime = r < 0.62 ? "CALM" : (r < 0.74 ? "CRASH" : "MANIA");
    } else {
      this.regime = r < 0.58 ? "CALM" : (r < 0.70 ? "MANIA" : "CRASH");
    }
    this.regimeUntil = this.tick + (this.regime === "CALM" ? randInt(18, 45) : randInt(12, 28));
  }

  maybeResetDay() {
    if (Date.now() - this.lastDayReset >= 24 * 60 * 60 * 1000) {
      this.lastDayReset = Date.now();
      Object.values(this.symbols).forEach(sm => sm.resetDayBase());
    }
  }

  rowsSorted() {
    const rows = Object.values(this.symbols).map(sm => ({
      sym: sm.symbol,
      name: sm.name,
      price: sm.price,
      delta: sm.lastDeltaPct * 100,
      halted: sm.isHalted(this.tick),
      limitState: sm.limitState,
      history: sm.history.slice(-18),
      volume: sm.dayVolume,
      volatility: sm.volatilityPct(),
      sector: sm.sector,
      theme: sm.theme,
      desc: sm.desc,
      prevClose: sm.prevClose,
      limitUp: sm.limitUpPrice(),
      limitDown: sm.limitDownPrice(),
      color: sm.color
    }));
    rows.sort((a, b) => b.delta - a.delta);
    return rows;
  }

  step() {
    this.tick += 1;
    this.maybeResetDay();
    this.maybeSwitchRegime();

    const cfg = REGIMES[this.regime];
    const moveAmp = cfg.move;
    const regimeBias = cfg.bias;
    const eventMul = cfg.eventMul;

    for (const sm of Object.values(this.symbols)) {
      sm.maybeClearNews(this.tick);

      if (!sm.news && Math.random() < NEWS_CHANCE_PER_TICK * eventMul) {
        sm.rollNews(this.tick);
        this.newsFeed.unshift(`📰 ${sm.name} — ${sm.news.title}: ${sm.news.text}`);
        this.newsFeed = this.newsFeed.slice(0, 6);
      }

      if (sm.isHalted(this.tick)) {
        sm.lastDeltaPct = 0;
        sm.history.push(sm.price);
        sm.history = sm.history.slice(-HISTORY_LEN);
        sm.dayVolume += randInt(0, 5);
        sm.updateCandle(this.tick);
        continue;
      }

      let didShock = false;
      let move;
      if (Math.random() < SHOCK_CHANCE_PER_TICK * eventMul) {
        const sign = Math.random() < 0.5 ? 1 : -1;
        const shock = rand(SHOCK_MIN, SHOCK_MAX) * sign;
        move = shock + regimeBias + sm.activeNewsBias(this.tick);
        didShock = true;
      } else {
        move = rand(-moveAmp, moveAmp) + regimeBias + sm.activeNewsBias(this.tick);
      }

      sm.lastDeltaPct = move;
      let newPrice = clampPrice(sm.price * (1 + move));

      const up = sm.limitUpPrice();
      const dn = sm.limitDownPrice();

      if (newPrice >= up) {
        sm.price = up;
        sm.limitState = "UP";
        sm.haltedUntilTick = this.tick + HALT_TICKS;
        this.eventFeed.unshift(`🟥 ${sm.name} 상한가 진입`);
      } else if (newPrice <= dn) {
        sm.price = dn;
        sm.limitState = "DOWN";
        sm.haltedUntilTick = this.tick + HALT_TICKS;
        this.eventFeed.unshift(`🟦 ${sm.name} 하한가 진입`);
      } else {
        sm.price = newPrice;
        sm.limitState = "NORMAL";
      }

      this.eventFeed = this.eventFeed.slice(0, 6);

      sm.dayHigh = Math.max(sm.dayHigh, sm.price);
      sm.dayLow = Math.min(sm.dayLow, sm.price);
      sm.dayVolume += randInt(40, 650);
      sm.history.push(sm.price);
      sm.history = sm.history.slice(-HISTORY_LEN);

      sm.recordTradeTape(sm.price, move);
      sm.updateInvestors(move);
      sm.updateCandle(this.tick);

      if (didShock && Math.abs(move * 100) >= 8) {
        this.eventFeed.unshift(`${move >= 0 ? "🔴 급등" : "🔵 급락"} ${sm.name} ${fmtPct(move * 100)}`);
        this.eventFeed = this.eventFeed.slice(0, 6);
      }
    }
  }

  toJSON() {
    const symbols = {};
    for (const [k, v] of Object.entries(this.symbols)) symbols[k] = v.toJSON();
    return {
      tick: this.tick,
      regime: this.regime,
      regimeUntil: this.regimeUntil,
      lastDayReset: this.lastDayReset,
      symbols,
      newsFeed: this.newsFeed,
      eventFeed: this.eventFeed
    };
  }

  static from(data) {
    const m = new Market();
    m.tick = data.tick ?? 0;
    m.regime = data.regime ?? "CALM";
    m.regimeUntil = data.regimeUntil ?? 0;
    m.lastDayReset = data.lastDayReset ?? Date.now();
    m.newsFeed = data.newsFeed || [];
    m.eventFeed = data.eventFeed || [];
    m.symbols = {};
    for (const [k, v] of Object.entries(data.symbols || {})) {
      m.symbols[k] = SymbolMarket.from(v);
    }
    return m;
  }
}

class Rival {
  constructor(name) {
    this.name = name;
    this.portfolio = new Portfolio();
    this.portfolio.cash = randInt(800000, 1400000);
    this.style = randInt(1, 3);
  }

  step(market) {
    const prices = currentPrices(market);
    const symbols = Object.keys(market.symbols);
    const pick = symbols[randInt(0, symbols.length - 1)];
    const sm = market.symbols[pick];
    const h = this.portfolio.getHolding(pick);

    if (sm.isHalted(market.tick)) return;

    const aggressiveness = this.style === 1 ? 0.42 : this.style === 2 ? 0.55 : 0.68;
    const willBuy = Math.random() < aggressiveness;

    if (willBuy) {
      const xprice = execPrice(sm.price, "BUY");
      const maxQty = Math.floor(this.portfolio.cash / (xprice * (1 + FEE_RATE)));
      if (maxQty > 0) {
        const qty = randInt(1, Math.max(1, Math.min(maxQty, this.style * 5)));
        const cost = xprice * qty;
        const f = fee(cost);
        const total = cost + f;
        if (total <= this.portfolio.cash) {
          const newQty = h.qty + qty;
          h.avg = ((h.avg * h.qty) + xprice * qty) / newQty;
          h.qty = newQty;
          this.portfolio.cash -= total;
        }
      }
    } else {
      if (h.qty > 0) {
        const qty = randInt(1, Math.max(1, Math.min(h.qty, this.style * 4)));
        const xprice = execPrice(sm.price, "SELL");
        const proceeds = xprice * qty;
        const f = fee(proceeds);
        const realized = (xprice - h.avg) * qty - f;
        this.portfolio.realizedPnl += realized;
        this.portfolio.cash += proceeds - f;
        h.qty -= qty;
        if (h.qty === 0) h.avg = 0;
      }
    }

    if (Math.random() < 0.02) {
      this.portfolio.cash += randInt(20000, 100000);
    }

    prices;
  }

  toJSON() {
    return {
      name: this.name,
      portfolio: this.portfolio.toJSON(),
      style: this.style
    };
  }

  static from(data) {
    const r = new Rival(data.name);
    r.portfolio = Portfolio.from(data.portfolio || {});
    r.style = data.style || 1;
    return r;
  }
}

const app = {
  market: null,
  myPortfolio: null,
  rivals: [],
  selectedSymbol: STOCK_CATALOG[0].symbol,
  running: true,
  timerId: null,
  tradeMode: "BUY",
  tickMs: 1000,
  speedIndex: 0,
  chartHoverIndex: null
};

function currentPrices(market) {
  const out = {};
  for (const [k, v] of Object.entries(market.symbols)) out[k] = v.price;
  return out;
}

function saveState() {
  const data = {
    market: app.market.toJSON(),
    myPortfolio: app.myPortfolio.toJSON(),
    rivals: app.rivals.map(r => r.toJSON()),
    selectedSymbol: app.selectedSymbol,
    tickMs: app.tickMs,
    speedIndex: app.speedIndex
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    app.market = Market.from(data.market || {});
    app.myPortfolio = Portfolio.from(data.myPortfolio || {});
    app.rivals = (data.rivals || []).map(x => Rival.from(x));
    app.selectedSymbol = data.selectedSymbol || STOCK_CATALOG[0].symbol;
    app.tickMs = data.tickMs || 1000;
    app.speedIndex = data.speedIndex || 0;
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

function createFreshState() {
  app.market = new Market();
  app.myPortfolio = new Portfolio();
  app.rivals = RIVAL_NAMES.map(name => new Rival(name));
  app.selectedSymbol = STOCK_CATALOG[0].symbol;
  app.tickMs = SPEED_MODES[0];
  app.speedIndex = 0;
}

function showToast(message, type = "info") {
  const wrap = $("#toastWrap");
  const div = document.createElement("div");
  div.className = `toast ${type}`;
  div.textContent = message;
  wrap.appendChild(div);
  setTimeout(() => div.remove(), 2600);
}

function openModal(mode) {
  app.tradeMode = mode;
  const sym = app.selectedSymbol;
  const sm = app.market.symbols[sym];
  const h = app.myPortfolio.getHolding(sym);
  const xprice = execPrice(sm.price, mode);
  const maxQty = mode === "BUY"
    ? Math.max(0, Math.floor(app.myPortfolio.cash / (xprice * (1 + FEE_RATE))))
    : h.qty;

  $("#modalTitle").textContent = `${mode === "BUY" ? "매수" : "매도"} · ${sm.name}`;
  $("#modalDesc").textContent =
    `${mode === "BUY" ? "예상 매수 체결가" : "예상 매도 체결가"} ${fmtWon(xprice)} · ` +
    `${mode === "BUY" ? `최대 ${maxQty}주 매수 가능` : `보유 ${h.qty}주`}`;

  $("#tradeQtyInput").value = "";
  $("#tradeQtyInput").setAttribute("max", maxQty);
  $("#tradeModal").classList.remove("hidden");
}
function closeModal() {
  $("#tradeModal").classList.add("hidden");
}

function openDetailModal(sym) {
  const sm = app.market.symbols[sym];
  const d = sm.lastDeltaPct * 100;
  const halted = sm.isHalted(app.market.tick);
  const cls = moveClass(d, halted, sm.limitState);
  const candles = sm.getCandleSeries().slice(-6);
  const ma5 = calcMA(sm.getCandleSeries(), 5).at(-1);
  const ma20 = calcMA(sm.getCandleSeries(), 20).at(-1);
  const ma60 = calcMA(sm.getCandleSeries(), 60).at(-1);

  $("#detailTitle").textContent = `${sm.name} (${sm.symbol})`;
  $("#detailPrice").textContent = fmtWon(sm.price);
  $("#detailChange").textContent = `${fmtPct(d)} · ${trendWord(d, halted, sm.limitState)}`;
  $("#detailChange").className = `detail-change ${cls}`;

  const state = $("#detailState");
  state.textContent = trendWord(d, halted, sm.limitState);
  state.className = `selected-state ${cls}`;

  $("#detailInfo").innerHTML =
    `업종 <strong>${sm.sector}</strong><br>` +
    `테마 <strong>${sm.theme}</strong><br>` +
    `${sm.desc}`;

  $("#detailPriceInfo").innerHTML =
    `전일 종가 <strong>${fmtWon(sm.prevClose)}</strong><br>` +
    `시가 ${fmtWon(sm.dayOpen)}<br>` +
    `고가 ${fmtWon(sm.dayHigh)}<br>` +
    `저가 ${fmtWon(sm.dayLow)}<br>` +
    `상한가 ${fmtWon(sm.limitUpPrice())}<br>` +
    `하한가 ${fmtWon(sm.limitDownPrice())}<br>` +
    `거래량 ${fmtNum(sm.dayVolume)}주`;

  $("#detailNews").innerHTML =
    sm.activeNewsText(app.market.tick) === "없음"
      ? `현재 활성 뉴스 없음<br><br>최근 시장 이벤트를 참고하면 됨`
      : sm.activeNewsText(app.market.tick).replace(/\n/g, "<br>");

  $("#detailTech").innerHTML =
    `변동성 <strong>${sm.volatilityPct().toFixed(2)}%</strong><br>` +
    `MA5 ${ma5 ? fmtWon(ma5) : "-"}<br>` +
    `MA20 ${ma20 ? fmtWon(ma20) : "-"}<br>` +
    `MA60 ${ma60 ? fmtWon(ma60) : "-"}<br>` +
    `스파크라인 ${sparkline(sm.history.slice(-24))}`;

  const candleBox = $("#detailCandles");
  candleBox.innerHTML = "";
  candles.forEach((c, idx) => {
    const div = document.createElement("div");
    div.className = "candle-mini";
    div.innerHTML =
      `<strong>${idx + 1}번째 최근봉</strong><br>` +
      `시가 ${fmtWon(c.open)}<br>` +
      `고가 ${fmtWon(c.high)}<br>` +
      `저가 ${fmtWon(c.low)}<br>` +
      `종가 ${fmtWon(c.close)}<br>` +
      `거래량 ${fmtNum(c.volume)}`;
    candleBox.appendChild(div);
  });

  $("#detailModal").classList.remove("hidden");
}

function closeDetailModal() {
  $("#detailModal").classList.add("hidden");
}

function executeTrade(side, qty) {
  const market = app.market;
  const sym = app.selectedSymbol;
  const sm = market.symbols[sym];
  const pf = app.myPortfolio;
  const h = pf.getHolding(sym);

  if (!Number.isInteger(qty) || qty <= 0) {
    showToast("수량은 1 이상 정수여야 함", "error");
    return false;
  }
  if (sm.isHalted(market.tick)) {
    showToast("거래정지 상태라 거래할 수 없음", "error");
    return false;
  }

  if (side === "BUY") {
    const xprice = execPrice(sm.price, "BUY");
    const maxQty = Math.floor(pf.cash / (xprice * (1 + FEE_RATE)));
    if (qty > maxQty) {
      showToast(`최대 ${maxQty}주까지 매수 가능`, "error");
      return false;
    }
    const cost = xprice * qty;
    const f = fee(cost);
    const total = cost + f;
    const newQty = h.qty + qty;
    h.avg = ((h.avg * h.qty) + (xprice * qty)) / newQty;
    h.qty = newQty;
    pf.cash -= total;
    showToast(`매수 완료 · ${sm.name} ${qty}주`, "success");
  } else {
    if (qty > h.qty) {
      showToast(`보유 수량 부족 · 현재 ${h.qty}주`, "error");
      return false;
    }
    const xprice = execPrice(sm.price, "SELL");
    const proceeds = xprice * qty;
    const f = fee(proceeds);
    const realized = (xprice - h.avg) * qty - f;
    pf.realizedPnl += realized;
    pf.cash += proceeds - f;
    h.qty -= qty;
    if (h.qty === 0) h.avg = 0;
    showToast(`매도 완료 · ${sm.name} ${qty}주`, "success");
  }

  saveState();
  renderAll();
  return true;
}

function renderHeadlines() {
  const rows = [
    ...app.market.newsFeed.slice(0, 3),
    ...app.market.eventFeed.slice(0, 3)
  ];

  $("#headlineTicker").textContent = rows[0] || "📰 현재 표시할 속보가 없음";

  const cards = $("#headlineCards");
  cards.innerHTML = "";
  (rows.length ? rows : ["📰 현재 표시할 속보가 없음"]).slice(0, 4).forEach(text => {
    const div = document.createElement("div");
    div.className = "headline-card";
    div.innerHTML = `
      <div class="tag ${newsTagType(text)}">${newsTagType(text) === "good" ? "호재" : newsTagType(text) === "bad" ? "주의" : "이벤트"}</div>
      <div class="title">${text}</div>
    `;
    cards.appendChild(div);
  });

  $("#tickValue").textContent = app.market.tick;
  $("#marketStatusText").textContent = app.running ? "실행 중" : "정지됨";

  const mood = REGIMES[app.market.regime];
  const badge = $("#marketMoodBadge");
  badge.textContent = `${mood.label} · ${mood.mood}`;
  badge.className = `mood-badge ${mood.cls}`;
}

function buildRankingRows() {
  const prices = currentPrices(app.market);
  const rows = [{
    name: "나",
    total: app.myPortfolio.totalValue(prices),
    summary: myHoldingSummary(),
    isMe: true
  }];

  app.rivals.forEach(r => {
    rows.push({
      name: r.name,
      total: r.portfolio.totalValue(prices),
      summary: rivalHoldingSummary(r, prices),
      isMe: false
    });
  });

  rows.sort((a, b) => b.total - a.total);
  return rows;
}

function myHoldingSummary() {
  const prices = currentPrices(app.market);
  const items = [];
  for (const [sym, h] of Object.entries(app.myPortfolio.holdings)) {
    if (h.qty > 0) items.push({ sym, qty: h.qty, value: h.qty * (prices[sym] || 0) });
  }
  items.sort((a, b) => b.value - a.value);
  if (!items.length) return "보유 주식 없음";
  const top = app.market.symbols[items[0].sym];
  return items.length === 1
    ? `${top.name} ${items[0].qty}주`
    : `${top.name} ${items[0].qty}주 외 ${items.length - 1}종목`;
}

function rivalHoldingSummary(rival, prices) {
  const items = [];
  for (const [sym, h] of Object.entries(rival.portfolio.holdings)) {
    if (h.qty > 0) items.push({ sym, qty: h.qty, value: h.qty * (prices[sym] || 0) });
  }
  items.sort((a, b) => b.value - a.value);
  if (!items.length) return "보유 주식 없음";
  const top = app.market.symbols[items[0].sym];
  return items.length === 1
    ? `${top.name} ${items[0].qty}주`
    : `${top.name} ${items[0].qty}주 외 ${items.length - 1}종목`;
}

function renderRanking() {
  const wrap = $("#rankingList");
  wrap.innerHTML = "";

  const rows = buildRankingRows();
  rows.forEach((row, idx) => {
    const badge = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}위`;
    const card = document.createElement("div");
    card.className = "rank-card";
    card.innerHTML = `
      <div class="rank-left">
        <div class="rank-badge">${badge}</div>
        <div>
          <div class="rank-name">${row.name}${row.isMe ? " 👈" : ""}</div>
          <div class="rank-sub">${row.summary}</div>
        </div>
      </div>
      <div class="rank-right">
        <div class="rank-asset">${fmtWon(row.total)}</div>
        <div class="rank-tag">${row.isMe ? "내 총자산" : "라이벌 총자산"}</div>
      </div>
    `;
    wrap.appendChild(card);
  });
}

function renderStocks() {
  const grid = $("#stockGrid");
  grid.innerHTML = "";

  const rows = app.market.rowsSorted();
  rows.forEach(row => {
    const cls = moveClass(row.delta, row.halted, row.limitState);
    const card = document.createElement("div");
    card.className = "stock-card";
    card.style.setProperty("--accent", row.color);
    card.innerHTML = `
      <div class="stock-card-top">
        <div>
          <div class="stock-name">${row.name}</div>
          <div class="stock-symbol">${row.sym} · ${row.sector} · ${row.theme}</div>
        </div>
        <div class="${cls}" style="font-weight:800;">${trendWord(row.delta, row.halted, row.limitState)}</div>
      </div>
      <div class="stock-price">${fmtWon(row.price)}</div>
      <div class="stock-delta ${cls}">${fmtPct(row.delta)}</div>
      <div class="stock-meta">
        거래량 ${fmtNum(row.volume)}주 · 변동성 ${row.volatility.toFixed(2)}%<br>
        전일 ${fmtWon(row.prevClose)} · 상한 ${fmtWon(row.limitUp)} · 하한 ${fmtWon(row.limitDown)}<br>
        ${row.desc}
      </div>
      <div class="stock-spark">${sparkline(row.history)}</div>
      <div class="stock-actions">
        <button class="tiny-btn detail-open-btn" data-sym="${row.sym}">상세보기</button>
        <button class="tiny-btn pick-btn" data-sym="${row.sym}">선택</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll(".detail-open-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      openDetailModal(e.currentTarget.dataset.sym);
    });
  });

  grid.querySelectorAll(".pick-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const sym = e.currentTarget.dataset.sym;
      app.selectedSymbol = sym;
      $("#symbolSelect").value = sym;
      saveState();
      renderSelectedPanel();
      showToast(`${app.market.symbols[sym].name} 선택됨`, "info");
    });
  });
}

function renderAccountSummary() {
  const prices = currentPrices(app.market);
  const total = app.myPortfolio.totalValue(prices);
  const unreal = app.myPortfolio.unrealizedPnl(prices);
  const realized = app.myPortfolio.realizedPnl;
  const pnl = unreal + realized;
  const ret = app.myPortfolio.totalReturnPct(prices);

  $("#myTotalAssets").textContent = fmtWon(total);

  const retEl = $("#myReturnPct");
  retEl.textContent = fmtPct(ret);
  retEl.className = ret > 0 ? "up" : ret < 0 ? "down" : "neutral";

  const pnlEl = $("#myTotalPnl");
  pnlEl.textContent = fmtSignedWon(pnl);
  pnlEl.className = pnl > 0 ? "up" : pnl < 0 ? "down" : "neutral";

  $("#myCash").textContent = fmtWon(app.myPortfolio.cash);
  $("#myRealized").textContent = fmtSignedWon(realized);
  $("#myUnrealized").textContent = fmtSignedWon(unreal);
  $("#myRescue").textContent = `${app.myPortfolio.rescueCount}회`;
}

function formatOrderbook(price) {
  const sell = [];
  const buy = [];
  for (let i = 5; i >= 1; i--) sell.push({ p: price * (1 + i * 0.0025), q: randInt(1000, 45000) });
  for (let i = 1; i <= 5; i++) buy.push({ p: price * (1 - i * 0.0025), q: randInt(1000, 45000) });

  let lines = [];
  lines.push("매도호가");
  sell.forEach(x => lines.push(`🔴 ${String(Math.round(x.p)).padStart(8)} | ${String(x.q).padStart(6)}`));
  lines.push("----------------------");
  lines.push(`⚪ ${String(Math.round(price)).padStart(8)} | 현재가`);
  lines.push("----------------------");
  buy.forEach(x => lines.push(`🔵 ${String(Math.round(x.p)).padStart(8)} | ${String(x.q).padStart(6)}`));
  lines.push("매수호가");
  return lines.join("\n");
}

function formatTradeTape(tape) {
  if (!tape.length) return "체결 내역 없음";
  let lines = [];
  lines.push("체결가      수량   등락률");
  tape.slice(0, 8).forEach(t => {
    lines.push(`${String(Math.round(t.price)).padStart(8)}  ${String(t.qty).padStart(4)}  ${fmtPct(t.rate).padStart(8)}`);
  });
  return lines.join("\n");
}

function formatInvestorSummary(sm) {
  const bar = (v) => {
    const mag = Math.min(12, Math.max(0, Math.floor(Math.abs(v) / 300000)));
    return mag > 0 ? "█".repeat(mag) : "▏";
  };
  return [
    "투자자 동향",
    `개인   ${fmtSignedNum(sm.investorToday.personal).padStart(12)}  ${bar(sm.investorToday.personal)}`,
    `외국인 ${fmtSignedNum(sm.investorToday.foreign).padStart(12)}  ${bar(sm.investorToday.foreign)}`,
    `기관   ${fmtSignedNum(sm.investorToday.institute).padStart(12)}  ${bar(sm.investorToday.institute)}`,
    "",
    "날짜      개인        외국인      기관",
    ...sm.investorHistory.slice(0, 6).map(r =>
      `${r.date} ${fmtSignedNum(r.personal).padStart(10)} ${fmtSignedNum(r.foreign).padStart(10)} ${fmtSignedNum(r.institute).padStart(10)}`
    )
  ].join("\n");
}

function renderAllocation() {
  const wrap = $("#allocationBox");
  wrap.innerHTML = "";
  const prices = currentPrices(app.market);
  const alloc = app.myPortfolio.allocation(prices);
  if (!alloc.length) {
    wrap.innerHTML = `<div class="desc-box">아직 보유한 종목이 없음</div>`;
    return;
  }

  alloc.slice(0, 5).forEach(row => {
    const sm = app.market.symbols[row.sym];
    const div = document.createElement("div");
    div.className = "alloc-row";
    div.innerHTML = `
      <div class="alloc-head">
        <span>${sm.name}</span>
        <span>${fmtWon(row.value)} · ${row.pct.toFixed(1)}%</span>
      </div>
      <div class="alloc-bar">
        <div class="alloc-fill" style="width:${Math.min(100, row.pct)}%"></div>
      </div>
    `;
    wrap.appendChild(div);
  });
}

function drawCandles(sm) {
  const canvas = $("#candleCanvas");
  const tooltip = $("#chartTooltip");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = 360;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const candles = sm.getCandleSeries().slice(-60);
  if (!candles.length) return;

  const ma5 = calcMA(candles, 5);
  const ma20 = calcMA(candles, 20);
  const ma60 = calcMA(candles, 60);

  const padL = 12;
  const padR = 56;
  const padT = 12;
  const volH = 68;
  const gap = 10;
  const padB = 20;
  const priceChartH = height - padT - padB - volH - gap;
  const volTop = padT + priceChartH + gap;
  const chartW = width - padL - padR;

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const maxP = Math.max(...highs);
  const minP = Math.min(...lows);
  const range = Math.max(1, maxP - minP);

  const maxVol = Math.max(...candles.map(c => c.volume), 1);

  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 5; i++) {
    const y = padT + (priceChartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.stroke();

    const priceLabel = maxP - (range / 4) * i;
    ctx.fillStyle = "rgba(203,213,225,.82)";
    ctx.font = "11px Inter";
    ctx.fillText(fmtNum(priceLabel), width - padR + 6, y + 4);
  }

  ctx.beginPath();
  ctx.moveTo(padL, volTop);
  ctx.lineTo(width - padR, volTop);
  ctx.stroke();

  const slotW = chartW / candles.length;
  const bodyW = Math.max(4, slotW * 0.56);

  function py(price) {
    return padT + ((maxP - price) / range) * priceChartH;
  }

  function drawLine(values, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    let started = false;
    values.forEach((v, i) => {
      if (v == null) return;
      const x = padL + slotW * i + slotW / 2;
      const y = py(v);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }

  drawLine(ma5, "#f59e0b");
  drawLine(ma20, "#10b981");
  drawLine(ma60, "#8b5cf6");

  candles.forEach((c, i) => {
    const x = padL + slotW * i + slotW / 2;
    const yHigh = py(c.high);
    const yLow = py(c.low);
    const yOpen = py(c.open);
    const yClose = py(c.close);

    const up = c.close >= c.open;
    const color = up ? "#ff5a7a" : "#56a2ff";

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();

    const bodyY = Math.min(yOpen, yClose);
    const bodyH = Math.max(2, Math.abs(yClose - yOpen));
    ctx.fillRect(x - bodyW / 2, bodyY, bodyW, bodyH);

    const volBarH = (c.volume / maxVol) * (volH - 10);
    ctx.globalAlpha = 0.7;
    ctx.fillRect(x - bodyW / 2, volTop + (volH - volBarH), bodyW, volBarH);
    ctx.globalAlpha = 1;
  });

  if (app.chartHoverIndex != null) {
    const i = Math.max(0, Math.min(candles.length - 1, app.chartHoverIndex));
    const c = candles[i];
    const x = padL + slotW * i + slotW / 2;

    ctx.strokeStyle = "rgba(255,255,255,.22)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, padT);
    ctx.lineTo(x, volTop + volH);
    ctx.stroke();

    tooltip.classList.remove("hidden");
    tooltip.innerHTML =
      `시가 ${fmtWon(c.open)}<br>` +
      `고가 ${fmtWon(c.high)}<br>` +
      `저가 ${fmtWon(c.low)}<br>` +
      `종가 ${fmtWon(c.close)}<br>` +
      `거래량 ${fmtNum(c.volume)}`;
    const canvasBox = canvas.getBoundingClientRect();
    let left = canvasBox.left + x + 12;
    let top = canvasBox.top + 20;
    tooltip.style.left = `${Math.min(window.innerWidth - 180, left)}px`;
    tooltip.style.top = `${top}px`;
  } else {
    tooltip.classList.add("hidden");
  }
}

function renderSelectedPanel() {
  const sym = app.selectedSymbol;
  const sm = app.market.symbols[sym];
  const h = app.myPortfolio.getHolding(sym);

  const d = sm.lastDeltaPct * 100;
  const halted = sm.isHalted(app.market.tick);
  const cls = moveClass(d, halted, sm.limitState);
  const priceGap = sm.prevClose > 0 ? ((sm.price - sm.prevClose) / sm.prevClose) * 100 : 0;

  $("#selectedName").textContent = `${sm.name} · ${sm.symbol}`;
  $("#selectedMeta").textContent = `${sm.sector} · ${sm.theme}`;
  $("#selectedState").textContent = trendWord(d, halted, sm.limitState);
  $("#selectedState").className = `selected-state ${cls}`;

  $("#selectedPrice").textContent = fmtWon(sm.price);
  const sub = $("#selectedPriceSub");
  sub.textContent = `전일대비 ${fmtPct(priceGap)} · 실시간 ${fmtPct(d)}`;
  sub.className = `selected-price-sub ${cls}`;
  $("#selectedSparkline").textContent = sparkline(sm.history.slice(-80));

  $("#holdQty").textContent = `${h.qty}주`;
  $("#holdAvg").textContent = h.qty > 0 ? fmtWon(h.avg) : "없음";

  const pnl = h.qty > 0 ? (sm.price - h.avg) * h.qty : 0;
  const rate = h.qty > 0 && h.avg > 0 ? ((sm.price - h.avg) / h.avg) * 100 : 0;
  const pnlEl = $("#holdPnl");
  pnlEl.textContent = fmtSignedWon(pnl);
  pnlEl.className = pnl > 0 ? "up" : pnl < 0 ? "down" : "neutral";
  const rateEl = $("#holdRate");
  rateEl.textContent = fmtPct(rate);
  rateEl.className = rate > 0 ? "up" : rate < 0 ? "down" : "neutral";

  $("#stockInfoBox").textContent =
    `업종 ${sm.sector}\n테마 ${sm.theme}\n${sm.desc}\n\n실시간 뉴스: ${sm.activeNewsText(app.market.tick)}`;

  $("#priceInfoBox").textContent =
    `전일 종가 ${fmtWon(sm.prevClose)}\n` +
    `시가 ${fmtWon(sm.dayOpen)} · 고가 ${fmtWon(sm.dayHigh)} · 저가 ${fmtWon(sm.dayLow)}\n` +
    `상한가 ${fmtWon(sm.limitUpPrice())} · 하한가 ${fmtWon(sm.limitDownPrice())}\n` +
    `거래량 ${fmtNum(sm.dayVolume)}주 · 변동성 ${sm.volatilityPct().toFixed(2)}%\n` +
    `수익률 바 ${ratioBar(app.myPortfolio.totalReturnPct(currentPrices(app.market)))}`;

  $("#orderbookBox").textContent = formatOrderbook(sm.price);
  $("#tradeTapeBox").textContent = formatTradeTape(sm.tradeTape);
  $("#investorBox").textContent = formatInvestorSummary(sm);

  renderAllocation();
  drawCandles(sm);
}

function renderSymbolOptions() {
  const select = $("#symbolSelect");
  select.innerHTML = "";
  Object.values(app.market.symbols).forEach(sm => {
    const op = document.createElement("option");
    op.value = sm.symbol;
    op.textContent = `${sm.name} (${sm.symbol})`;
    select.appendChild(op);
  });
  select.value = app.selectedSymbol;
}

function renderAll() {
  renderHeadlines();
  renderAccountSummary();
  renderRanking();
  renderStocks();
  renderSelectedPanel();
  $("#speedBtn").textContent = `속도 x${Math.round(1000 / app.tickMs)}`;
}

function tickLoop() {
  if (!app.running) return;
  app.market.step();
  app.rivals.forEach(r => r.step(app.market));
  saveState();
  renderAll();
}

function restartLoop() {
  if (app.timerId) clearInterval(app.timerId);
  app.timerId = setInterval(tickLoop, app.tickMs);
}

function bindEvents() {
  $("#symbolSelect").addEventListener("change", (e) => {
    app.selectedSymbol = e.target.value;
    app.chartHoverIndex = null;
    saveState();
    renderSelectedPanel();
  });

  $("#buyBtn").addEventListener("click", () => openModal("BUY"));
  $("#sellBtn").addEventListener("click", () => openModal("SELL"));

  $("#buyAllBtn").addEventListener("click", () => {
    const sm = app.market.symbols[app.selectedSymbol];
    const xprice = execPrice(sm.price, "BUY");
    const maxQty = Math.floor(app.myPortfolio.cash / (xprice * (1 + FEE_RATE)));
    if (maxQty <= 0) {
      showToast("전량매수 가능한 수량이 없음", "error");
      return;
    }
    executeTrade("BUY", maxQty);
  });

  $("#sellAllBtn").addEventListener("click", () => {
    const h = app.myPortfolio.getHolding(app.selectedSymbol);
    if (h.qty <= 0) {
      showToast("전량매도할 보유 수량이 없음", "error");
      return;
    }
    executeTrade("SELL", h.qty);
  });

  $("#modalSubmitBtn").addEventListener("click", () => {
    const qty = parseInt($("#tradeQtyInput").value, 10);
    const ok = executeTrade(app.tradeMode, qty);
    if (ok) closeModal();
  });

  $("#modalCloseBtn").addEventListener("click", closeModal);
  $("#tradeModal").addEventListener("click", (e) => {
    if (e.target.dataset.close === "true") closeModal();
  });

  $("#detailCloseBtn").addEventListener("click", closeDetailModal);
  $("#detailModal").addEventListener("click", (e) => {
    if (e.target.dataset.closeDetail === "true") closeDetailModal();
  });

  $("#pauseBtn").addEventListener("click", () => {
    app.running = !app.running;
    $("#pauseBtn").textContent = app.running ? "일시정지" : "재개";
    showToast(app.running ? "시뮬레이션 재개" : "시뮬레이션 일시정지", "info");
    renderHeadlines();
  });

  $("#speedBtn").addEventListener("click", () => {
    app.speedIndex = (app.speedIndex + 1) % SPEED_MODES.length;
    app.tickMs = SPEED_MODES[app.speedIndex];
    restartLoop();
    saveState();
    renderAll();
    showToast(`속도 변경 · x${Math.round(1000 / app.tickMs)}`, "info");
  });

  $("#resetBtn").addEventListener("click", () => {
    const ok = confirm("모든 데이터와 포트폴리오를 초기화할까?");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    createFreshState();
    renderSymbolOptions();
    renderAll();
    saveState();
    restartLoop();
    showToast("초기화 완료", "success");
  });

  $("#rescueBtn").addEventListener("click", () => {
    app.myPortfolio.cash += RESCUE_CASH;
    app.myPortfolio.rescueCount += 1;
    saveState();
    renderAll();
    showToast(`긴급 지원금 ${fmtWon(RESCUE_CASH)} 지급`, "success");
  });

  const canvas = $("#candleCanvas");
  canvas.addEventListener("mousemove", (e) => {
    const sm = app.market.symbols[app.selectedSymbol];
    const candles = sm.getCandleSeries().slice(-60);
    if (!candles.length) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const padL = 12;
    const padR = 56;
    const chartW = width - padL - padR;
    const slotW = chartW / candles.length;
    const x = e.clientX - rect.left;
    const idx = Math.floor((x - padL) / slotW);
    if (idx >= 0 && idx < candles.length) {
      app.chartHoverIndex = idx;
      drawCandles(sm);
    }
  });

  canvas.addEventListener("mouseleave", () => {
    app.chartHoverIndex = null;
    $("#chartTooltip").classList.add("hidden");
    drawCandles(app.market.symbols[app.selectedSymbol]);
  });

  window.addEventListener("resize", () => {
    renderSelectedPanel();
  });
}

function init() {
  const loaded = loadState();
  if (!loaded) createFreshState();
  renderSymbolOptions();
  bindEvents();
  renderAll();
  restartLoop();
}

init();
