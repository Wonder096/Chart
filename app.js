const STORAGE_KEY = 'k_mock_trading_pro_v20';
const ADMIN_CODE = '010814';
const CANVAS_W = 1280;
const CANVAS_H = 700;

const DEFAULT_SETTINGS = {
  initialCash: 1000000,
  supportFundAmount: 500000,
  supportFundCashLimit: 500000,
  feeRate: 0.0015,
  volatilityMultiplier: 1,
  newsFrequencyMultiplier: 1,
  adminHighSpeedEnabled: false,
  marketPreset: 'normal'
};

const PRESETS = {
  normal: { volatilityMultiplier: 1, newsFrequencyMultiplier: 1 },
  calm: { volatilityMultiplier: 0.65, newsFrequencyMultiplier: 0.7 },
  mania: { volatilityMultiplier: 1.8, newsFrequencyMultiplier: 1.5 },
  crash: { volatilityMultiplier: 2.1, newsFrequencyMultiplier: 1.35 }
};

const STOCK_BLUEPRINTS = [
  ['KQ001','한강테크','한','AI 반도체',48200,'large','momentum'],
  ['KQ002','네오바이오','네','바이오 신약',32150,'mid','news'],
  ['KQ003','블루모빌리티','블','전기차 부품',187000,'large','cyclical'],
  ['KQ004','코어엔터','코','엔터/플랫폼',12950,'mid','momentum'],
  ['KQ005','스카이로직스','스','물류 자동화',85300,'mid','stable'],
  ['KQ006','오로라게임즈','오','게임/콘텐츠',56700,'mid','theme'],
  ['KQ007','에코플랜트','에','친환경 소재',104500,'mid','stable'],
  ['KQ008','미래핀테크','미','핀테크',72200,'mid','news'],
  ['KQ009','제니스AI','제','초거대 AI',243500,'large','momentum'],
  ['KQ010','라이트메드','라','헬스케어',41550,'mid','news'],
  ['KQ011','웨이브로보틱스','웨','로봇/공장자동화',96400,'large','theme'],
  ['KQ012','트리온클라우드','트','클라우드',138800,'large','stable'],
  ['KQ013','초록에너지','초','신재생에너지',16350,'mid','theme'],
  ['KQ014','다올반도체','다','메모리 반도체',9100,'mid','cyclical'],
  ['KQ015','나래커머스','나','이커머스',2780,'cheap','momentum'],
  ['KQ016','성운광학','성','광학장비',506000,'expensive','stable'],
  ['KQ017','큐브로직','큐','보안 솔루션',66900,'mid','stable'],
  ['KQ018','바이오엣지','바','유전자 분석',1450,'cheap','news'],
  ['KQ019','마이크로링크','마','IoT 통신모듈',860,'cheap','momentum'],
  ['KQ020','프라임홀딩스','프','지주/금융',1023000,'premium','stable'],
  ['KQ021','루멘미디어','루','미디어/광고',6350,'cheap','theme'],
  ['KQ022','하이젠소프트','하','기업용 소프트웨어',199500,'large','stable'],
  ['KQ023','솔라트론','솔','태양광 장비',118000,'large','cyclical'],
  ['KQ024','피닉스소재','피','2차전지 소재',352000,'large','theme'],
  ['KQ025','유니온푸드','유','식품/소비재',59000,'mid','stable'],
  ['KQ026','센텀칩스','센','팹리스',715000,'expensive','momentum'],
  ['KQ027','원픽엔진','원','엔진/기계',500,'cheap','momentum'],
  ['KQ028','엘릭서메디','엘','제약 플랫폼',982000,'premium','news'],
  ['KQ029','제로클라우드','제로','AI 인프라',425000,'expensive','theme'],
  ['KQ030','아틀라스모터스','아','미래 모빌리티',1105000,'premium','cyclical']
];

const THEME_EVENT_TEXT = {
  'AI 반도체': ['AI 반도체 수요 기대감', 'GPU 관련 수급 집중', 'AI 서버 투자 확대 기대'],
  '바이오 신약': ['임상 기대감 부각', '기술수출 기대감', '바이오 업종 반등'],
  '전기차 부품': ['전기차 공급망 기대', '배터리 밸류체인 강세', '친환경 모빌리티 수급 유입'],
  '엔터/플랫폼': ['콘텐츠 기대감 확대', '플랫폼 MAU 증가 기대', '신작 이슈 부각'],
  '물류 자동화': ['스마트팩토리 관심 확대', '물류 자동화 수주 기대', '제조업 설비투자 기대'],
  '게임/콘텐츠': ['신작 기대감 반영', '글로벌 흥행 기대', '게임주 순환매 유입'],
  '친환경 소재': ['친환경 정책 기대', '소재 업종 관심 확대', 'ESG 테마 강세'],
  '핀테크': ['간편결제 모멘텀', '금융 플랫폼 성장 기대', '핀테크 규제 완화 기대'],
  '초거대 AI': ['AI 정책 수혜 기대', '대규모 투자 기대감', 'AI 인프라 확장 기대'],
  '헬스케어': ['헬스케어 수급 유입', '의료 데이터 기대감', '디지털 헬스케어 성장 기대'],
  '로봇/공장자동화': ['로봇 자동화 테마 강세', '공장 자동화 투자 확대', '스마트 제조 관심 증가'],
  '클라우드': ['클라우드 수요 증가', '기업용 SaaS 투자 확대', '데이터센터 기대감'],
  '신재생에너지': ['재생에너지 정책 기대', '태양광/풍력 동반 강세', '에너지 전환 모멘텀'],
  '메모리 반도체': ['업황 바닥 기대', '반도체 재고 개선 기대', '메모리 가격 반등 기대'],
  '이커머스': ['소비 회복 기대감', '플랫폼 이벤트 효과 기대', '배송 경쟁력 부각'],
  '광학장비': ['광학장비 수주 기대', '첨단장비 교체 수요 기대', '센서 투자 기대'],
  '보안 솔루션': ['보안 규제 강화 기대', '사이버 보안 수요 확대', '기업 보안 투자 증가'],
  '유전자 분석': ['정밀의료 관심 확대', '진단 수요 증가 기대', '헬스케어 테마 수급 유입'],
  'IoT 통신모듈': ['IoT 디바이스 확대 기대', '통신 모듈 수요 증가', '스마트홈 관심 증가'],
  '지주/금융': ['배당 기대감 부각', '자회사 가치 부각', '금융주 방어적 수급 유입'],
  '미디어/광고': ['광고 회복 기대감', '플랫폼 콘텐츠 확대', '미디어 수급 반등'],
  '기업용 소프트웨어': ['B2B 계약 기대감', '구독형 소프트웨어 성장', 'AI 업무툴 관심 확대'],
  '태양광 장비': ['태양광 수주 기대', '신재생 투자 확대', '에너지 장비주 강세'],
  '2차전지 소재': ['배터리 소재 기대감', '전기차 밸류체인 강세', '소재 공급 계약 기대'],
  '식품/소비재': ['방어주 수급 유입', '소비 회복 기대', '원가 안정 기대'],
  '팹리스': ['설계 수주 기대', 'AI 칩 관심 확대', '고성능 반도체 기대'],
  '엔진/기계': ['기계주 순환매', '설비 투자 회복 기대', '인프라 투자 기대'],
  '제약 플랫폼': ['신약 파이프라인 기대', '바이오 플랫폼 관심 확대', '기술이전 기대 부각'],
  'AI 인프라': ['데이터센터 투자 기대', 'AI 인프라 수혜 기대', '서버 증설 기대'],
  '미래 모빌리티': ['미래차 정책 기대', '모빌리티 수급 확대', '차세대 플랫폼 기대']
};

const GENERIC_NEWS = {
  good: [
    '실적 기대감이 반영되며 매수세가 붙고 있어요',
    '기관 수급이 유입되면서 흐름이 단단해지고 있어요',
    '관련 업종 전반이 강해서 같이 탄력을 받고 있어요',
    '장 초반보다 거래가 살아나면서 분위기가 좋아졌어요',
    '저점 매수세가 붙으면서 빠르게 되돌리는 모습이에요',
    '신규 계약 기대감이 돌면서 매수 대기가 늘고 있어요',
    '수급이 한쪽으로 쏠리면서 위쪽 호가가 얇아졌어요',
    '실적 발표 시즌 기대감이 선반영되는 분위기예요',
    '단기 조정 뒤 반등 시도가 깔끔하게 들어오고 있어요',
    '프로그램 매수 추정 물량이 붙으면서 움직임이 빨라졌어요',
    '외국인 수급 기대가 붙으면서 시선이 모이는 구간이에요',
    '시장 전체보다 강하게 버티는 모습이 인상적이에요',
    '테마 순환매가 들어오며 해당 섹터가 같이 강해지고 있어요',
    '호가 공백이 얇아져서 탄력이 붙기 쉬운 상태예요',
    '매물 부담을 소화하면서도 고점을 계속 높이고 있어요'
  ],
  bad: [
    '차익 실현 물량이 나오면서 잠깐 흔들리는 모습이에요',
    '위쪽 매물이 두꺼워져서 속도가 조금 둔해졌어요',
    '단기 급등 뒤라 변동성이 커질 수 있어 보여요',
    '추격 매수보다는 한 번 더 지켜보는 쪽이 좋아 보여요',
    '시장이 눌릴 때 같이 밀릴 수 있는 구간이에요',
    '테마 열기가 식으면 빠르게 되돌릴 수도 있어요',
    '거래량이 줄어들면 상승 탄력이 약해질 수 있어요',
    '뉴스 소멸 후 차익 매물이 나오는 흐름이 보여요',
    '단기 고점 인식이 생기면서 매도 대기가 늘고 있어요',
    '수급 공방이 심해져서 방향이 자주 바뀌고 있어요',
    '매수세가 약해지면 아래쪽 확인이 나올 수 있어요',
    '장 후반 갈수록 흔들림이 커질 가능성도 있어요',
    '강한 반등 뒤 숨 고르기 구간으로 보는 시선이 있어요',
    '시장 분위기 대비 상대적으로 힘이 덜 붙는 종목이에요',
    '짧은 시간에 많이 움직여서 피로감이 누적된 모습이에요'
  ],
  event: [
    '오늘 관심 종목으로 자주 언급되고 있어요',
    '검색량이 빠르게 늘면서 시선이 몰리고 있어요',
    '개인 투자자 관심도가 높아지는 분위기예요',
    '장중 알림 빈도가 늘어날 만큼 주목받고 있어요',
    '단기 트레이더들이 많이 보는 자리예요',
    '테마 키워드와 함께 자주 거론되는 중이에요',
    '단타 수급이 자주 들어오는 종목으로 보이고 있어요',
    '가격대가 뚜렷해서 눈에 잘 띄는 흐름이에요',
    '호가 반응 속도가 빨라서 체감 변동이 크게 느껴져요',
    '거래량이 붙을 때 움직임이 한 번에 커지는 타입이에요',
    '수급이 몰리면 체감상 훨씬 빠르게 움직일 수 있어요',
    '시장 주도 섹터와 연결되면서 함께 주목받고 있어요',
    '당일 테마 강도에 따라 반응이 확 달라질 수 있어요',
    '관심종목 상위권에 자주 올라오는 분위기예요',
    '시세 흐름이 살아 있을 때는 반응이 꽤 빠른 편이에요'
  ],
  breaking: [
    '장중 수급이 몰리면서 움직임이 커지고 있어요',
    '거래량이 급격히 늘면서 변동성도 커졌어요',
    '위아래 흔들림이 커져서 체감 속도가 빨라졌어요',
    '단기 세력전처럼 호가 반응이 빠르게 나타나고 있어요',
    '한 번 방향이 나오면 강하게 이어질 수 있는 구간이에요',
    '순간적으로 거래가 몰리면서 호가 간격이 달라졌어요',
    '시장 전체보다 훨씬 빠르게 반응 중이에요',
    '분봉 기준 강한 탄력이 살아나는 모습이에요',
    '뉴스 없이도 수급만으로 강하게 흔들리는 모습이에요',
    '장중 체결 강도가 확 살아나는 분위기예요',
    '매수와 매도가 강하게 부딪히며 속도가 올라갔어요',
    '체결량이 늘면서 눈에 띄게 활발해졌어요',
    '장중 고점/저점 갱신이 자주 나오는 종목이에요',
    '평소보다 체감 변동폭이 많이 커졌어요',
    '호가 공백이 빠르게 메워지며 전개가 빨라졌어요'
  ]
};

const state = {
  speed: 1,
  selectedCode: 'KQ001',
  orderMode: 'buy',
  sortBy: 'change',
  chartRange: '1m',
  historyTab: 'orders',
  isPaused: false,
  isStopped: false,
  isAdmin: false,
  searchTerm: '',
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
function setText(el, value) { if (el) el.textContent = value; }
function addEvent(el, type, fn) { if (el) el.addEventListener(type, fn); }
function toNum(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function toInt(v, d = 0) { const n = Math.floor(Number(v)); return Number.isFinite(n) ? n : d; }
function q(selector, root = document) { return root.querySelector(selector); }
function qa(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }
function formatKRW(v) { return `${Math.round(toNum(v)).toLocaleString('ko-KR')}원`; }
function formatSignedKRW(v) { const n = Math.round(toNum(v)); return `${n >= 0 ? '+' : ''}${n.toLocaleString('ko-KR')}원`; }
function formatSignedPct(v) { const n = toNum(v); return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`; }
function formatQty(v) { return `${Math.max(0, toInt(v)).toLocaleString('ko-KR')}주`; }
function formatVolume(v) {
  const n = toNum(v);
  if (n >= 100000000) return `${(n / 100000000).toFixed(2)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  return Math.round(n).toLocaleString('ko-KR');
}
function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}
function feeOf(amount) { return Math.round(toNum(amount) * toNum(state.settings.feeRate)); }
function stockValue() {
  return Object.entries(state.portfolio.holdings).reduce((sum, [code, h]) => {
    const s = state.stocks.find(x => x.code === code);
    return sum + ((s?.currentPrice || 0) * (h?.qty || 0));
  }, 0);
}
function totalAsset() { return state.portfolio.cash + stockValue(); }
function investedAmount() {
  return Object.values(state.portfolio.holdings).reduce((sum, h) => sum + ((h?.avgPrice || 0) * (h?.qty || 0)), 0);
}
function baselineProfit() { return totalAsset() - toNum(state.baseline.totalAsset, state.settings.initialCash); }
function baselineProfitRate() {
  const base = toNum(state.baseline.totalAsset, state.settings.initialCash);
  return base > 0 ? ((totalAsset() - base) / base) * 100 : 0;
}
function absoluteProfitRate() {
  const base = toNum(state.settings.initialCash);
  return base > 0 ? ((totalAsset() - base) / base) * 100 : 0;
}
function holdingOf(code) { return state.portfolio.holdings[code] || { qty: 0, avgPrice: 0 }; }
function stockRate(stock) { return ((stock.currentPrice - stock.prevClose) / stock.prevClose) * 100; }
function stockChangeValue(stock) { return stock.currentPrice - stock.prevClose; }

function makeStock([code, name, logo, theme, base, priceClass, style]) {
  const volatilityMap = { cheap: 0.038, mid: 0.018, large: 0.014, expensive: 0.011, premium: 0.0095 };
  const newsMap = { momentum: 1.1, news: 1.5, cyclical: 1.2, stable: 0.8, theme: 1.35 };
  const momentumMap = { momentum: 1.3, news: 1.0, cyclical: 1.15, stable: 0.7, theme: 1.25 };
  const volumeBaseMap = { cheap: randInt(120000, 600000), mid: randInt(20000, 120000), large: randInt(8000, 50000), expensive: randInt(2000, 12000), premium: randInt(1000, 8000) };
  const history = [];
  let p = base;
  for (let i = 0; i < 80; i++) {
    p = Math.max(1, Math.round(p * (1 + rand(-0.012, 0.012))));
    history.push(p);
  }
  return {
    code, name, logo, theme,
    basePrice: base,
    openPrice: base,
    prevClose: base,
    currentPrice: history[history.length - 1],
    dayHigh: Math.max(...history, base),
    dayLow: Math.min(...history, base),
    volume: volumeBaseMap[priceClass],
    history,
    orderbook: [],
    priceClass,
    style,
    volatility: volatilityMap[priceClass],
    newsSensitivity: newsMap[style],
    momentumFactor: momentumMap[style],
    marketCapHint: randInt(1500, 980000),
    intradayBias: rand(-0.001, 0.001),
    heat: rand(-0.6, 0.6),
    eventBias: 0,
    eventTicks: 0,
    haltedTicks: 0,
    flash: 0
  };
}

function defaultState() {
  state.speed = 1;
  state.selectedCode = 'KQ001';
  state.orderMode = 'buy';
  state.sortBy = 'change';
  state.chartRange = '1m';
  state.historyTab = 'orders';
  state.isPaused = false;
  state.isStopped = false;
  state.isAdmin = false;
  state.searchTerm = '';
  state.emergencyFundClaimed = false;
  state.settings = { ...DEFAULT_SETTINGS };
  state.baseline = { totalAsset: DEFAULT_SETTINGS.initialCash, startedAt: Date.now() };
  state.realizedProfit = 0;
  state.portfolio = { cash: DEFAULT_SETTINGS.initialCash, holdings: {} };
  state.favorites = ['KQ001','KQ006','KQ009'];
  state.stocks = STOCK_BLUEPRINTS.map(makeStock);
  state.news = [];
  state.alerts = [];
  state.orderHistory = [];
  state.autoSellOrders = [];
  state.autoBuyOrders = [];
  state.stocks.forEach(buildOrderbook);
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
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveState();
  }, 120);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      defaultState();
      return;
    }
    const data = JSON.parse(raw);
    defaultState();
    Object.assign(state.settings, data.settings || {});
    state.speed = data.speed || 1;
    state.selectedCode = data.selectedCode || 'KQ001';
    state.orderMode = data.orderMode || 'buy';
    state.sortBy = data.sortBy || 'change';
    state.chartRange = data.chartRange || '1m';
    state.historyTab = data.historyTab || 'orders';
    state.emergencyFundClaimed = !!data.emergencyFundClaimed;
    state.baseline = data.baseline || state.baseline;
    state.realizedProfit = toNum(data.realizedProfit, 0);
    state.portfolio = data.portfolio || state.portfolio;
    state.favorites = Array.isArray(data.favorites) ? data.favorites : state.favorites;
    if (Array.isArray(data.stocks) && data.stocks.length) {
      const fresh = STOCK_BLUEPRINTS.map(makeStock);
      state.stocks = fresh.map(base => {
        const old = data.stocks.find(x => x.code === base.code);
        if (!old) return base;
        return { ...base, ...old, history: Array.isArray(old.history) && old.history.length ? old.history.slice(-240) : base.history };
      });
    }
    state.news = Array.isArray(data.news) ? data.news.slice(0, 120) : [];
    state.alerts = Array.isArray(data.alerts) ? data.alerts.slice(0, 180) : [];
    state.orderHistory = Array.isArray(data.orderHistory) ? data.orderHistory.slice(0, 200) : [];
    state.autoSellOrders = Array.isArray(data.autoSellOrders) ? data.autoSellOrders : [];
    state.autoBuyOrders = Array.isArray(data.autoBuyOrders) ? data.autoBuyOrders : [];
    state.stocks.forEach(buildOrderbook);
  } catch (e) {
    console.error(e);
    defaultState();
  }
}

function collectEls() {
  const ids = [
    'totalAssetTop','profitLossTop','cashTop','supportFundBtn','pauseBtn','resumeBtn','stopBtn','resetBtn','alertBellBtn','alertBadge',
    'symbolLogo','selectedName','selectedCode','heroStockSelect','selectedPrice','selectedChange','dayHigh','dayLow','dayOpen','dayVolume',
    'speedButtons','moodFill','moodText','priceChart','chartTooltip','selectedNewsTitleName','selectedNewsCount','selectedNewsFeed',
    'holdingQtyInline','avgPriceInline','availableCash','maxBuyQty','currentHoldingQty','currentAvgPrice','buyModeBtn','sellModeBtn',
    'currentTradePriceLabel','orderPrice','orderQty','quickRow','estimatedCost','estimatedFee','submitOrderBtn',
    'autoSellTargetPrice','autoSellStopPrice','autoSellQty','autoSellAll','addAutoSellBtn','autoSellList','orderbookRows',
    'newsCountChip','newsFeed','clearHistoryBtn','orderHistoryList','alertHistoryList','portfolioTotal','portfolioPL','portfolioCash',
    'portfolioStockValue','portfolioInvested','portfolioRate','searchInput','favoritesList','marketAlertBadge','watchlist',
    'favoriteToggleBtn'
  ];
  ids.forEach(id => els[id] = byId(id));
}

function injectExtraUI() {
  const headerActions = q('.header-actions');
  if (headerActions && !byId('adminEntryBtn')) {
    const btn = document.createElement('button');
    btn.className = 'top-action-btn control-btn';
    btn.id = 'adminEntryBtn';
    btn.type = 'button';
    btn.textContent = '관리자';
    headerActions.insertBefore(btn, els.pauseBtn || null);
    els.adminEntryBtn = btn;
  }

  const portfolioPanel = q('.portfolio-panel');
  if (portfolioPanel && !byId('portfolioExtraBox')) {
    const extra = document.createElement('div');
    extra.id = 'portfolioExtraBox';
    extra.className = 'portfolio-grid';
    extra.style.marginTop = '12px';
    extra.innerHTML = `
      <div class="portfolio-card"><span>전체 수익률</span><b id="portfolioAbsoluteRate">0.00%</b></div>
      <div class="portfolio-card"><span>실현손익</span><b id="portfolioRealized">0원</b></div>
      <div class="portfolio-card"><span>기준선 이후</span><b id="portfolioBaselineRate">0.00%</b></div>
      <div class="portfolio-card"><span>평가손익</span><b id="portfolioUnrealized">0원</b></div>
    `;
    portfolioPanel.appendChild(extra);

    const actionRow = document.createElement('div');
    actionRow.className = 'header-actions';
    actionRow.style.justifyContent = 'stretch';
    actionRow.style.marginTop = '12px';
    actionRow.innerHTML = `
      <button class="top-action-btn control-btn" id="resetBaselineBtn" type="button" style="flex:1">수익률 기준 리셋</button>
      <button class="top-action-btn control-btn" id="toggleActiveOrdersBtn" type="button" style="flex:1">자동매매 보기</button>
    `;
    portfolioPanel.appendChild(actionRow);
  }

  const autoSellBlock = q('.auto-sell-block');
  if (autoSellBlock && !byId('autoBuyTargetPrice')) {
    const autoBuy = document.createElement('div');
    autoBuy.className = 'auto-sell-block';
    autoBuy.style.marginTop = '12px';
    autoBuy.innerHTML = `
      <div class="auto-sell-head">
        <h3>예약구매 · 자동매수</h3>
        <p>원하는 가격까지 내려오거나 조건이 맞으면 자동으로 살 수 있어요</p>
      </div>
      <div class="auto-sell-grid">
        <div class="form-group">
          <label for="autoBuyTargetPrice">목표 매수가</label>
          <input id="autoBuyTargetPrice" type="number" min="1" step="1" placeholder="예: 48000" />
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
            <span>가능한 최대 수량으로 사기</span>
          </label>
        </div>
      </div>
      <button class="auto-sell-add-btn" id="addAutoBuyBtn" type="button">자동매수 등록</button>
      <div class="auto-sell-list-wrap">
        <div class="auto-sell-list-head">등록된 자동매수</div>
        <div class="auto-sell-list" id="autoBuyList"></div>
      </div>
    `;
    autoSellBlock.insertAdjacentElement('afterend', autoBuy);
  }

  if (!byId('adminOverlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'adminOverlay';
    overlay.className = 'hidden';
    overlay.innerHTML = `
      <div id="adminModal">
        <div class="admin-head">
          <h3>관리자 모드</h3>
          <button id="closeAdminModalBtn" type="button">닫기</button>
        </div>
        <div id="adminLoginBox" class="admin-block">
          <div class="admin-note">관리자 코드를 입력하면 고속 배속과 세부 제어를 열 수 있어요</div>
          <div class="admin-row">
            <input id="adminCodeInput" type="password" placeholder="관리자 코드 입력" />
            <button id="adminLoginBtn" type="button">입장</button>
          </div>
        </div>
        <div id="adminPanelBox" class="admin-block hidden">
          <div class="admin-grid">
            <label>초기 자산<input id="adminInitialCash" type="number" min="1000" step="1000"></label>
            <label>긴급지원금<input id="adminSupportAmount" type="number" min="0" step="1000"></label>
            <label>지원 가능 현금 기준<input id="adminSupportLimit" type="number" min="0" step="1000"></label>
            <label>수수료(%)<input id="adminFeeRate" type="number" min="0" step="0.01"></label>
            <label>변동성 배수<input id="adminVolatility" type="number" min="0.2" step="0.1"></label>
            <label>뉴스 빈도 배수<input id="adminNewsFreq" type="number" min="0.2" step="0.1"></label>
          </div>
          <div class="admin-row wrap">
            <label class="checkbox-label"><input id="adminHighSpeedEnabled" type="checkbox"><span>100x/200x/300x 활성화</span></label>
            <select id="adminPresetSelect">
              <option value="normal">기본장</option>
              <option value="calm">안정장</option>
              <option value="mania">폭등장</option>
              <option value="crash">폭락장</option>
            </select>
            <button id="saveAdminSettingsBtn" type="button">설정 저장</button>
            <button id="forceBaselineResetBtn" type="button">수익률 기준 강제 리셋</button>
          </div>
          <div class="admin-grid slim">
            <label>종목 선택<select id="adminStockSelect"></select></label>
            <label>가격 조작<input id="adminStockPrice" type="number" min="1" step="1"></label>
            <button id="applyAdminStockPriceBtn" type="button">가격 적용</button>
          </div>
          <div class="admin-row wrap">
            <button id="adminCancelAllAutoSellBtn" type="button">자동매도 전체 취소</button>
            <button id="adminCancelAllAutoBuyBtn" type="button">자동매수 전체 취소</button>
            <button id="adminResetAllBtn" type="button" class="danger">전체 데이터 초기화</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  if (!byId('flashStyleAddon')) {
    const style = document.createElement('style');
    style.id = 'flashStyleAddon';
    style.textContent = `
      .price-flash-up{animation:priceUp .55s ease}
      .price-flash-down{animation:priceDown .55s ease}
      @keyframes priceUp{0%{text-shadow:0 0 0 rgba(0,0,0,0)}50%{text-shadow:0 0 18px rgba(78,225,143,.65)}100%{text-shadow:0 0 0 rgba(0,0,0,0)}}
      @keyframes priceDown{0%{text-shadow:0 0 0 rgba(0,0,0,0)}50%{text-shadow:0 0 18px rgba(255,95,130,.65)}100%{text-shadow:0 0 0 rgba(0,0,0,0)}}
      #adminOverlay{position:fixed;inset:0;background:rgba(2,8,20,.72);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:9999}
      #adminOverlay.hidden{display:none}
      #adminModal{width:min(980px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;border-radius:24px;padding:20px;background:linear-gradient(180deg,rgba(14,25,50,.98),rgba(8,17,34,.98));border:1px solid rgba(255,255,255,.1);box-shadow:0 24px 60px rgba(0,0,0,.45);color:#f5f8ff}
      .admin-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px}.admin-head h3{margin:0}
      .admin-head button,.admin-row button,.admin-grid button{border:none;border-radius:14px;padding:12px 14px;background:rgba(255,255,255,.08);color:#fff;font-weight:800;cursor:pointer}
      .admin-row button.danger,#adminResetAllBtn{background:rgba(255,95,130,.14);color:#ffc2d0}
      .admin-block{padding:14px;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.03)}
      .admin-block.hidden{display:none}.admin-note{color:#93a4c9;margin-bottom:12px}
      .admin-row{display:flex;gap:10px;align-items:center}.admin-row.wrap{flex-wrap:wrap;margin-top:12px}
      .admin-row input,.admin-grid input,.admin-grid select,.admin-row select{background:#081224;color:#fff;border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:12px 14px;min-height:46px}
      .admin-row input{flex:1}.admin-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.admin-grid.slim{grid-template-columns:1.4fr 1fr auto;align-items:end;margin-top:12px}
      .admin-grid label{display:flex;flex-direction:column;gap:8px;color:#93a4c9;font-size:13px}
      .header-actions .top-action-btn.active-admin{background:linear-gradient(135deg,#2f71ff,#67c2ff);border-color:transparent;box-shadow:0 12px 28px rgba(58,126,255,.22)}
      .watch-item-glow{box-shadow:0 0 0 1px rgba(255,255,255,.06),0 12px 24px rgba(0,0,0,.18)}
      .micro-tag{display:inline-flex;align-items:center;gap:4px;padding:5px 8px;border-radius:999px;font-size:11px;font-weight:800;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#cfe1ff}
      .micro-tag.up{color:#79f0ae;background:rgba(78,225,143,.08)} .micro-tag.down{color:#ffb0bf;background:rgba(255,95,130,.08)}
      .history-pnl{color:#93a4c9;font-size:12px;margin-top:4px}.hidden{display:none!important}
      @media (max-width: 860px){.admin-grid,.admin-grid.slim{grid-template-columns:1fr}.admin-row{flex-wrap:wrap}}
    `;
    document.head.appendChild(style);
  }

  collectEls();
}

function buildOrderbook(stock) {
  const levels = [];
  const base = stock.currentPrice;
  const spreadFactor = stock.currentPrice < 2000 ? 0.006 : stock.currentPrice < 10000 ? 0.003 : stock.currentPrice < 100000 ? 0.0016 : 0.001;
  for (let i = 5; i >= 1; i--) {
    const step = Math.max(1, Math.round(base * spreadFactor * i));
    levels.push({ type: 'ask', price: Math.max(1, base + step), qty: randInt(50, 5000) });
  }
  for (let i = 0; i < 5; i++) {
    const step = Math.max(1, Math.round(base * spreadFactor * (i + 1)));
    levels.push({ type: 'bid', price: Math.max(1, base - step), qty: randInt(50, 5000) });
  }
  stock.orderbook = levels;
}

function typeLabel(type) {
  return ({ good: '호재', bad: '주의', event: '이벤트', breaking: '속보' })[type] || '알림';
}

function addAlert(text, tone = 'normal') {
  state.alerts.unshift({ id: `${Date.now()}_${Math.random()}`, text, tone, time: nowTime() });
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
  addAlert(`${stock.name} · ${typeLabel(type)} · ${text}`, type === 'bad' ? 'down' : 'up');
}

function recordOrder(entry) {
  state.orderHistory.unshift({ id: `${Date.now()}_${Math.random()}`, time: nowTime(), ...entry });
  if (state.orderHistory.length > 200) state.orderHistory.length = 200;
}

function maybeCreateNews(stock) {
  const chanceBase = 0.011 * toNum(state.settings.newsFrequencyMultiplier) * toNum(stock.newsSensitivity);
  if (Math.random() > chanceBase) return;
  const roll = Math.random();
  let type = 'event';
  if (roll < 0.28) type = 'good';
  else if (roll < 0.46) type = 'bad';
  else if (roll < 0.66) type = 'breaking';
  const themeText = THEME_EVENT_TEXT[stock.theme] || ['시장 관심이 붙고 있어요'];
  const generic = pick(GENERIC_NEWS[type === 'bad' ? 'bad' : type]);
  const text = `${pick(themeText)} · ${generic}`;
  const impact = type === 'good' ? rand(0.004, 0.02) : type === 'bad' ? rand(-0.02, -0.004) : type === 'breaking' ? rand(-0.012, 0.018) : rand(-0.006, 0.01);
  stock.eventBias = impact;
  stock.eventTicks = randInt(8, 28);
  pushNews(type, stock, text, impact);
}

function maybeCreateThemeWave() {
  if (Math.random() > 0.008 * state.settings.newsFrequencyMultiplier) return;
  const stock = pick(state.stocks);
  const sameTheme = state.stocks.filter(s => s.theme === stock.theme);
  const impact = rand(0.004, 0.014) * (Math.random() > 0.25 ? 1 : -1);
  sameTheme.forEach(s => {
    s.eventBias += impact * rand(0.75, 1.1);
    s.eventTicks = Math.max(s.eventTicks, randInt(10, 24));
  });
  const waveText = `${stock.theme} 테마 전반에 ${impact >= 0 ? '매수세가 퍼지고 있어요' : '차익 매물이 퍼지고 있어요'}`;
  pushNews(impact >= 0 ? 'good' : 'bad', stock, waveText, impact);
}

function tickOnce() {
  if (state.isPaused || state.isStopped) return;
  const loops = state.speed >= 100 ? Math.min(10, Math.floor(state.speed / 30)) : state.speed >= 50 ? 4 : state.speed >= 20 ? 3 : state.speed >= 10 ? 2 : 1;

  for (let i = 0; i < loops; i++) {
    maybeCreateThemeWave();

    state.stocks.forEach(stock => {
      if (stock.haltedTicks > 0) {
        stock.haltedTicks -= 1;
        return;
      }

      maybeCreateNews(stock);
      if (stock.eventTicks > 0) stock.eventTicks -= 1;
      else stock.eventBias *= 0.82;

      const styleDrift =
        stock.style === 'momentum' ? rand(-0.0007, 0.0016) :
        stock.style === 'news' ? rand(-0.0012, 0.0012) :
        stock.style === 'stable' ? rand(-0.0005, 0.0007) :
        stock.style === 'cyclical' ? rand(-0.001, 0.001) :
        rand(-0.0011, 0.0014);

      const heatDrift = stock.heat * 0.0014 * stock.momentumFactor;
      const randomShock = (Math.random() - 0.5) * stock.volatility * state.settings.volatilityMultiplier;
      const move = styleDrift + heatDrift + randomShock + stock.eventBias + stock.intradayBias;

      const oldPrice = stock.currentPrice;
      let next = Math.max(1, Math.round(oldPrice * (1 + move)));

      const upper = Math.round(stock.prevClose * 1.3);
      const lower = Math.max(1, Math.round(stock.prevClose * 0.7));

      if (next >= upper) {
        next = upper;
        if (Math.random() < 0.08) stock.haltedTicks = randInt(2, 6);
      }
      if (next <= lower) {
        next = lower;
        if (Math.random() < 0.08) stock.haltedTicks = randInt(2, 6);
      }

      stock.currentPrice = next;
      stock.dayHigh = Math.max(stock.dayHigh, next);
      stock.dayLow = Math.min(stock.dayLow, next);
      stock.volume += Math.max(1, Math.round(rand(200, 10000) * (1 + Math.abs(move) * 35) * (stock.priceClass === 'cheap' ? 3.4 : stock.priceClass === 'premium' ? 0.45 : 1)));
      stock.history.push(next);
      if (stock.history.length > 240) stock.history.shift();
      stock.heat = clamp(stock.heat * 0.92 + (next > oldPrice ? 0.28 : -0.28), -3, 3);
      buildOrderbook(stock);

      if (stock.code === state.selectedCode && next !== oldPrice) stock.flash = next > oldPrice ? 1 : -1;
    });

    processAutoOrders();
  }

  render();
  queueSave();
}

function selectedStock() { return state.stocks.find(s => s.code === state.selectedCode) || state.stocks[0]; }

function setSpeed(speed) {
  const n = toInt(speed, 1);
  const normal = [1,2,5,10,20,50];
  const admin = [100,200,300];
  if (normal.includes(n) || (state.settings.adminHighSpeedEnabled && admin.includes(n))) {
    state.speed = n;
    renderSpeedButtons();
    queueSave();
  } else {
    addAlert('이 배속은 관리자 모드에서만 켤 수 있어요', 'normal');
    renderHistory();
  }
}

function renderSpeedButtons() {
  const wrap = els.speedButtons;
  if (!wrap) return;
  const wanted = [1,2,5,10,20,50].concat(state.settings.adminHighSpeedEnabled ? [100,200,300] : []);
  wrap.innerHTML = wanted.map(v => `<button type="button" data-speed="${v}" class="${state.speed === v ? 'active' : ''}">${v}x</button>`).join('');
  qa('button', wrap).forEach(btn => btn.addEventListener('click', () => setSpeed(btn.dataset.speed)));
}

function setOrderMode(mode) {
  state.orderMode = mode === 'sell' ? 'sell' : 'buy';
  if (els.buyModeBtn) els.buyModeBtn.classList.toggle('active', state.orderMode === 'buy');
  if (els.sellModeBtn) els.sellModeBtn.classList.toggle('active', state.orderMode === 'sell');
  if (els.submitOrderBtn) {
    els.submitOrderBtn.textContent = state.orderMode === 'buy' ? '매수 실행' : '매도 실행';
    els.submitOrderBtn.classList.toggle('buy', state.orderMode === 'buy');
    els.submitOrderBtn.classList.toggle('sell', state.orderMode === 'sell');
  }
  updateOrderInputs();
}

function updateOrderInputs() {
  const stock = selectedStock();
  if (!stock) return;

  if (els.orderPrice) {
    els.orderPrice.value = String(stock.currentPrice);
    els.orderPrice.setAttribute('readonly', 'readonly');
  }

  const qty = Math.max(1, toInt(els.orderQty?.value, 1));
  const amount = stock.currentPrice * qty;
  const fee = feeOf(amount);

  setText(els.currentTradePriceLabel, formatKRW(stock.currentPrice));
  setText(els.estimatedFee, formatKRW(fee));
  setText(els.estimatedCost, formatKRW(state.orderMode === 'buy' ? amount + fee : Math.max(0, amount - fee)));
  setText(els.availableCash, formatKRW(state.portfolio.cash));

  const maxBuy = Math.floor(state.portfolio.cash / (stock.currentPrice * (1 + state.settings.feeRate)));
  setText(els.maxBuyQty, formatQty(maxBuy));

  const h = holdingOf(stock.code);
  setText(els.currentHoldingQty, formatQty(h.qty));
  setText(els.currentAvgPrice, formatKRW(h.avgPrice));
  setText(els.holdingQtyInline, formatQty(h.qty));
  setText(els.avgPriceInline, formatKRW(h.avgPrice));
}

function placeOrder(mode, code, qtyInput) {
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return false;

  const qty = Math.max(1, toInt(qtyInput, 1));
  const price = stock.currentPrice;
  const amount = price * qty;
  const fee = feeOf(amount);
  const holding = holdingOf(code);

  if (mode === 'buy') {
    const needed = amount + fee;
    if (needed > state.portfolio.cash) {
      addAlert(`${stock.name} 매수 실패 · 예수금이 부족해요`, 'down');
      renderHistory();
      return false;
    }

    const newQty = holding.qty + qty;
    const newAvg = newQty > 0 ? Math.round(((holding.avgPrice * holding.qty) + amount) / newQty) : 0;
    state.portfolio.cash -= needed;
    state.portfolio.holdings[code] = { qty: newQty, avgPrice: newAvg };

    recordOrder({ side: '매수', code, name: stock.name, qty, price, fee, value: amount, pnl: 0, auto: false });
    addAlert(`${stock.name} ${qty.toLocaleString('ko-KR')}주 매수 체결 · ${formatKRW(price)}`, 'up');
  } else {
    if (qty > holding.qty) {
      addAlert(`${stock.name} 매도 실패 · 보유 수량이 부족해요`, 'down');
      renderHistory();
      return false;
    }

    const receive = amount - fee;
    const realized = (price - holding.avgPrice) * qty - fee;
    state.realizedProfit += realized;
    state.portfolio.cash += receive;

    const left = holding.qty - qty;
    if (left <= 0) delete state.portfolio.holdings[code];
    else state.portfolio.holdings[code] = { qty: left, avgPrice: holding.avgPrice };

    recordOrder({ side: '매도', code, name: stock.name, qty, price, fee, value: amount, pnl: realized, auto: false });
    addAlert(`${stock.name} ${qty.toLocaleString('ko-KR')}주 매도 체결 · ${formatKRW(price)} · ${formatSignedKRW(realized)}`, realized >= 0 ? 'up' : 'down');
  }

  updateOrderInputs();
  render();
  queueSave();
  return true;
}

function processAutoOrders() {
  const autoSells = [];
  state.autoSellOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    const holding = holdingOf(order.code);
    if (!stock || holding.qty <= 0) return;

    const hitTarget = order.targetPrice > 0 && stock.currentPrice >= order.targetPrice;
    const hitStop = order.stopPrice > 0 && stock.currentPrice <= order.stopPrice;

    if (!hitTarget && !hitStop) {
      autoSells.push(order);
      return;
    }

    const qty = order.all ? holding.qty : Math.min(holding.qty, order.qty);
    if (qty <= 0) return;

    const price = stock.currentPrice;
    const amount = price * qty;
    const fee = feeOf(amount);
    const realized = (price - holding.avgPrice) * qty - fee;

    state.realizedProfit += realized;
    state.portfolio.cash += (amount - fee);

    const left = holding.qty - qty;
    if (left <= 0) delete state.portfolio.holdings[order.code];
    else state.portfolio.holdings[order.code] = { qty: left, avgPrice: holding.avgPrice };

    recordOrder({ side: '자동매도', code: order.code, name: stock.name, qty, price, fee, value: amount, pnl: realized, auto: true });
    addAlert(`${stock.name} 자동매도 실행 · ${qty.toLocaleString('ko-KR')}주 · ${hitStop ? '손절가 도달' : '목표가 도달'}`, realized >= 0 ? 'up' : 'down');
  });
  state.autoSellOrders = autoSells;

  const autoBuys = [];
  state.autoBuyOrders.forEach(order => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) return;

    if (stock.currentPrice > order.targetPrice) {
      autoBuys.push(order);
      return;
    }

    const unitCost = stock.currentPrice * (1 + state.settings.feeRate);
    let qty = order.max ? Math.floor(state.portfolio.cash / unitCost) : Math.max(1, toInt(order.qty, 1));
    if (order.budget > 0) qty = Math.min(qty, Math.floor(order.budget / unitCost));
    if (qty <= 0) {
      autoBuys.push(order);
      return;
    }

    const amount = stock.currentPrice * qty;
    const fee = feeOf(amount);
    const needed = amount + fee;
    if (needed > state.portfolio.cash) {
      autoBuys.push(order);
      return;
    }

    const holding = holdingOf(order.code);
    const newQty = holding.qty + qty;
    const newAvg = Math.round(((holding.avgPrice * holding.qty) + amount) / newQty);

    state.portfolio.cash -= needed;
    state.portfolio.holdings[order.code] = { qty: newQty, avgPrice: newAvg };

    recordOrder({ side: '자동매수', code: order.code, name: stock.name, qty, price: stock.currentPrice, fee, value: amount, pnl: 0, auto: true });
    addAlert(`${stock.name} 자동매수 실행 · ${qty.toLocaleString('ko-KR')}주 · 목표가 도달`, 'up');
  });
  state.autoBuyOrders = autoBuys;
}

function registerAutoSell() {
  const stock = selectedStock();
  const targetPrice = toInt(els.autoSellTargetPrice?.value, 0);
  const stopPrice = toInt(els.autoSellStopPrice?.value, 0);
  const qty = Math.max(1, toInt(els.autoSellQty?.value, 1));
  const all = !!els.autoSellAll?.checked;
  const holding = holdingOf(stock.code);

  if (!targetPrice && !stopPrice) {
    addAlert('목표가나 손절가 중 하나는 넣어야 해요', 'down');
    renderHistory();
    return;
  }
  if (holding.qty <= 0) {
    addAlert('자동매도를 등록하려면 먼저 보유 수량이 있어야 해요', 'down');
    renderHistory();
    return;
  }
  if (!all && qty > holding.qty) {
    addAlert('자동매도 수량이 보유 수량보다 많아요', 'down');
    renderHistory();
    return;
  }

  state.autoSellOrders.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    code: stock.code,
    name: stock.name,
    targetPrice,
    stopPrice,
    qty,
    all
  });

  addAlert(`${stock.name} 자동매도 예약이 등록됐어요`, 'up');
  if (els.autoSellTargetPrice) els.autoSellTargetPrice.value = '';
  if (els.autoSellStopPrice) els.autoSellStopPrice.value = '';
  if (els.autoSellQty) els.autoSellQty.value = '1';
  if (els.autoSellAll) els.autoSellAll.checked = false;
  renderAutoLists();
  queueSave();
}

function registerAutoBuy() {
  const stock = selectedStock();
  const targetPrice = toInt(byId('autoBuyTargetPrice')?.value, 0);
  const qty = Math.max(1, toInt(byId('autoBuyQty')?.value, 1));
  const budget = Math.max(0, toInt(byId('autoBuyBudget')?.value, 0));
  const max = !!byId('autoBuyMax')?.checked;

  if (!targetPrice) {
    addAlert('자동매수 목표가는 꼭 넣어줘야 해요', 'down');
    renderHistory();
    return;
  }

  state.autoBuyOrders.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    code: stock.code,
    name: stock.name,
    targetPrice,
    qty,
    budget,
    max
  });

  addAlert(`${stock.name} 자동매수 예약이 등록됐어요`, 'up');
  byId('autoBuyTargetPrice').value = '';
  byId('autoBuyQty').value = '1';
  byId('autoBuyBudget').value = '';
  byId('autoBuyMax').checked = false;
  renderAutoLists();
  queueSave();
}

function renderAutoLists() {
  if (els.autoSellList) {
    if (!state.autoSellOrders.length) {
      els.autoSellList.innerHTML = `<div class="empty-state-box">등록된 자동매도가 없어요</div>`;
    } else {
      els.autoSellList.innerHTML = state.autoSellOrders.map(order => `
        <div class="news-item">
          <div class="news-top"><b>${order.name}</b><span class="micro-tag ${order.stopPrice ? 'down' : 'up'}">자동매도</span></div>
          <div class="news-text">${order.targetPrice ? `목표가 ${formatKRW(order.targetPrice)}` : '목표가 없음'} · ${order.stopPrice ? `손절가 ${formatKRW(order.stopPrice)}` : '손절가 없음'} · ${order.all ? '전량' : `${order.qty}주`}</div>
          <div class="news-time"><button data-auto-sell-remove="${order.id}" class="ghost-btn" type="button">삭제</button></div>
        </div>
      `).join('');
      qa('[data-auto-sell-remove]', els.autoSellList).forEach(btn => btn.addEventListener('click', () => {
        state.autoSellOrders = state.autoSellOrders.filter(x => x.id !== btn.dataset.autoSellRemove);
        renderAutoLists();
        queueSave();
      }));
    }
  }

  const autoBuyList = byId('autoBuyList');
  if (autoBuyList) {
    if (!state.autoBuyOrders.length) {
      autoBuyList.innerHTML = `<div class="empty-state-box">등록된 자동매수가 없어요</div>`;
    } else {
      autoBuyList.innerHTML = state.autoBuyOrders.map(order => `
        <div class="news-item">
          <div class="news-top"><b>${order.name}</b><span class="micro-tag up">자동매수</span></div>
          <div class="news-text">목표 매수가 ${formatKRW(order.targetPrice)} · ${order.max ? '가능한 최대 수량' : `${order.qty}주`} · ${order.budget ? `예산 ${formatKRW(order.budget)}` : '예산 제한 없음'}</div>
          <div class="news-time"><button data-auto-buy-remove="${order.id}" class="ghost-btn" type="button">삭제</button></div>
        </div>
      `).join('');
      qa('[data-auto-buy-remove]', autoBuyList).forEach(btn => btn.addEventListener('click', () => {
        state.autoBuyOrders = state.autoBuyOrders.filter(x => x.id !== btn.dataset.autoBuyRemove);
        renderAutoLists();
        queueSave();
      }));
    }
  }
}

function renderHeader() {
  setText(els.totalAssetTop, `${formatKRW(totalAsset())} · ${formatSignedPct(baselineProfitRate())}`);
  setText(els.profitLossTop, `${formatSignedKRW(baselineProfit())} · ${formatSignedPct(baselineProfitRate())}`);
  setText(els.cashTop, formatKRW(state.portfolio.cash));

  if (els.supportFundBtn) {
    els.supportFundBtn.textContent = `긴급지원금 +${Math.round(state.settings.supportFundAmount / 10000).toLocaleString('ko-KR')}만원`;
    els.supportFundBtn.disabled = state.emergencyFundClaimed || state.portfolio.cash > state.settings.supportFundCashLimit;
    els.supportFundBtn.style.opacity = els.supportFundBtn.disabled ? '.5' : '1';
  }

  setText(els.alertBadge, String(state.alerts.length));
  setText(els.marketAlertBadge, String(state.news.length));

  if (els.adminEntryBtn) {
    els.adminEntryBtn.classList.toggle('active-admin', state.isAdmin);
    els.adminEntryBtn.textContent = state.isAdmin ? '관리자 ON' : '관리자';
  }
}

function renderHero() {
  const stock = selectedStock();
  if (!stock) return;

  setText(els.symbolLogo, stock.logo);
  setText(els.selectedName, stock.name);
  setText(els.selectedCode, `${stock.code} · ${stock.theme}`);
  setText(els.selectedPrice, formatKRW(stock.currentPrice));
  setText(els.dayHigh, formatKRW(stock.dayHigh));
  setText(els.dayLow, formatKRW(stock.dayLow));
  setText(els.dayOpen, formatKRW(stock.openPrice));
  setText(els.dayVolume, formatVolume(stock.volume));

  const changeValue = stockChangeValue(stock);
  const rate = stockRate(stock);

  setText(els.selectedChange, `${formatSignedKRW(changeValue)} (${formatSignedPct(rate)})`);
  if (els.selectedChange) els.selectedChange.style.color = rate >= 0 ? 'var(--green)' : 'var(--red)';

  if (els.selectedPrice) {
    els.selectedPrice.style.color = rate >= 0 ? 'var(--green)' : 'var(--red)';
    if (stock.flash !== 0) {
      els.selectedPrice.classList.remove('price-flash-up', 'price-flash-down');
      void els.selectedPrice.offsetWidth;
      els.selectedPrice.classList.add(stock.flash > 0 ? 'price-flash-up' : 'price-flash-down');
      stock.flash = 0;
    }
  }

  if (els.heroStockSelect && !els.heroStockSelect.options.length) {
    els.heroStockSelect.innerHTML = state.stocks.map(s => `<option value="${s.code}">${s.name} · ${s.theme}</option>`).join('');
  }
  if (els.heroStockSelect) els.heroStockSelect.value = stock.code;

  const mood = clamp(state.stocks.reduce((sum, s) => sum + stockRate(s), 0) / state.stocks.length, -15, 15);
  const pct = ((mood + 15) / 30) * 100;

  if (els.moodFill) {
    els.moodFill.style.width = `${pct}%`;
    els.moodFill.style.background = mood >= 0 ? 'linear-gradient(90deg,#2f71ff,#67c2ff,#4ee18f)' : 'linear-gradient(90deg,#ff92ad,#ff5f82,#8f4bff)';
  }

  setText(
    els.moodText,
    mood >= 4 ? '지금은 매수 심리가 꽤 강한 분위기예요' :
    mood >= 1 ? '전체적으로 살짝 강한 흐름이에요' :
    mood > -1 ? '지금은 중립적인 분위기예요' :
    mood > -4 ? '조금 조심스러운 흐름이에요' :
    '매도 압력이 제법 강한 장이에요'
  );

  if (els.favoriteToggleBtn) {
    const liked = state.favorites.includes(stock.code);
    els.favoriteToggleBtn.textContent = liked ? '★' : '☆';
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
  if (els.portfolioPL) els.portfolioPL.style.color = baselineProfit() >= 0 ? 'var(--green)' : 'var(--red)';

  setText(els.portfolioCash, formatKRW(state.portfolio.cash));
  setText(els.portfolioStockValue, formatKRW(stockValue()));
  setText(els.portfolioInvested, formatKRW(investedAmount()));
  setText(els.portfolioRate, formatSignedPct(baselineProfitRate()));
  setText(byId('portfolioAbsoluteRate'), formatSignedPct(absoluteProfitRate()));
  setText(byId('portfolioRealized'), formatSignedKRW(state.realizedProfit));
  setText(byId('portfolioBaselineRate'), formatSignedPct(baselineProfitRate()));
  setText(byId('portfolioUnrealized'), formatSignedKRW(unrealized));
}

function renderOrderbook() {
  const stock = selectedStock();
  if (!stock || !els.orderbookRows) return;

  const asks = stock.orderbook.filter(x => x.type === 'ask').sort((a,b)=>b.price-a.price);
  const bids = stock.orderbook.filter(x => x.type === 'bid').sort((a,b)=>b.price-a.price);
  const maxQty = Math.max(1, ...stock.orderbook.map(x => x.qty));

  const rows = [];
  for (let i = 0; i < 5; i++) {
    const ask = asks[i];
    const bid = bids[i];
    rows.push(`
      <div class="orderbook-row">
        <div class="ask-cell"><span class="bar red" style="width:${(ask.qty/maxQty)*100}%"></span><b>${ask.qty.toLocaleString('ko-KR')}</b></div>
        <div class="price-cell">${formatKRW(i === 4 ? stock.currentPrice : ask.price)}</div>
        <div class="bid-cell"><span class="bar blue" style="width:${(bid.qty/maxQty)*100}%"></span><b>${bid.qty.toLocaleString('ko-KR')}</b></div>
      </div>
    `);
  }
  els.orderbookRows.innerHTML = rows.join('');
}

function getChartSeries(stock) {
  const hist = stock.history || [];
  if (state.chartRange === '1m') return hist.slice(-60);
  if (state.chartRange === '5m') return hist.filter((_, i) => i % 2 === 0).slice(-80);
  if (state.chartRange === '1d') return hist.slice(-140);
  return hist.slice(-220);
}

function movingAverage(series, period) {
  return series.map((_, idx) => {
    if (idx < period - 1) return null;
    const slice = series.slice(idx - period + 1, idx + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function drawChart() {
  const canvas = els.priceChart;
  if (!canvas || !canvas.getContext) return;

  const stock = selectedStock();
  const ctx = canvas.getContext('2d');
  const series = getChartSeries(stock);
  const ma5 = movingAverage(series, 5);
  const ma20 = movingAverage(series, 20);
  const ma60 = movingAverage(series, 60);

  ctx.clearRect(0,0,canvas.width,canvas.height);

  const padding = { top: 42, right: 36, bottom: 52, left: 52 };
  const w = canvas.width - padding.left - padding.right;
  const h = canvas.height - padding.top - padding.bottom;
  const min = Math.min(...series) * 0.98;
  const max = Math.max(...series) * 1.02;
  const xOf = i => padding.left + (i / Math.max(1, series.length - 1)) * w;
  const yOf = v => padding.top + (1 - (v - min) / (max - min || 1)) * h;

  const grad = ctx.createLinearGradient(0,padding.top,0,padding.top+h);
  const up = stockRate(stock) >= 0;
  grad.addColorStop(0, up ? 'rgba(78,225,143,.28)' : 'rgba(255,95,130,.22)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = padding.top + (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + w, y);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const x = padding.left + (w / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + h);
    ctx.stroke();
  }

  ctx.beginPath();
  series.forEach((v, i) => {
    const x = xOf(i), y = yOf(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(padding.left + w, padding.top + h);
  ctx.lineTo(padding.left, padding.top + h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  function drawLine(arr, color, width) {
    ctx.beginPath();
    let started = false;
    arr.forEach((v, i) => {
      if (v == null) return;
      const x = xOf(i), y = yOf(v);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  drawLine(series, up ? '#4ee18f' : '#ff5f82', 3);
  drawLine(ma5, '#67c2ff', 1.8);
  drawLine(ma20, '#f2c86a', 1.6);
  drawLine(ma60, '#a37dff', 1.4);

  const last = series[series.length - 1];
  ctx.fillStyle = up ? '#4ee18f' : '#ff5f82';
  ctx.beginPath();
  ctx.arc(xOf(series.length - 1), yOf(last), 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 18px Pretendard, sans-serif';
  ctx.fillStyle = '#f5f8ff';
  ctx.fillText(stock.name, padding.left, 22);
  ctx.font = '13px Pretendard, sans-serif';
  ctx.fillStyle = '#93a4c9';
  ctx.fillText(`${formatKRW(stock.currentPrice)} · ${formatSignedPct(stockRate(stock))} · ${stock.theme}`, padding.left, canvas.height - 18);
}

function renderSelectedNews() {
  const stock = selectedStock();
  const items = state.news.filter(x => x.code === stock.code).slice(0, 8);
  setText(els.selectedNewsTitleName, stock.name);
  setText(els.selectedNewsCount, `${items.length}건`);

  if (!els.selectedNewsFeed) return;
  if (!items.length) {
    els.selectedNewsFeed.innerHTML = `<div class="empty-state-box">아직 ${stock.name} 관련 뉴스가 없어요</div>`;
    return;
  }

  els.selectedNewsFeed.innerHTML = items.map(item => `
    <div class="news-item ${item.impact >= 0 ? 'up' : 'down'}">
      <div class="news-top"><b>${typeLabel(item.type)}</b><span>${item.time}</span></div>
      <div class="news-text">${item.text}</div>
    </div>
  `).join('');
}

function renderNewsFeed() {
  setText(els.newsCountChip, `${state.news.length}건`);
  if (!els.newsFeed) return;

  if (!state.news.length) {
    els.newsFeed.innerHTML = `<div class="empty-state-box">아직 뉴스가 없어요</div>`;
    return;
  }

  els.newsFeed.innerHTML = state.news.slice(0, 20).map(item => `
    <div class="news-item ${item.impact >= 0 ? 'up' : 'down'}">
      <div class="news-top"><b>${item.name}</b><span>${item.time} · ${typeLabel(item.type)}</span></div>
      <div class="news-text">${item.text}</div>
      <div class="news-time"><span class="micro-tag ${item.impact >= 0 ? 'up' : 'down'}">${item.theme}</span></div>
    </div>
  `).join('');
}

function renderHistory() {
  qa('.history-tab').forEach(btn => btn.classList.toggle('active', btn.dataset.historyTab === state.historyTab));
  if (els.orderHistoryList) els.orderHistoryList.classList.toggle('hidden', state.historyTab !== 'orders');
  if (els.alertHistoryList) els.alertHistoryList.classList.toggle('hidden', state.historyTab !== 'alerts');

  if (els.orderHistoryList) {
    if (!state.orderHistory.length) {
      els.orderHistoryList.innerHTML = `<div class="empty-state-box">아직 주문 기록이 없어요</div>`;
    } else {
      els.orderHistoryList.innerHTML = state.orderHistory.slice(0, 30).map(item => `
        <div class="news-item ${item.side.includes('매도') ? (item.pnl >= 0 ? 'up' : 'down') : ''}">
          <div class="news-top"><b>${item.name}</b><span>${item.time} · ${item.side}</span></div>
          <div class="news-text">${formatKRW(item.price)} · ${item.qty.toLocaleString('ko-KR')}주 · 수수료 ${formatKRW(item.fee)}</div>
          <div class="history-pnl">${item.side.includes('매도') ? `실현손익 ${formatSignedKRW(item.pnl)}` : `주문금액 ${formatKRW(item.value)}`}</div>
        </div>
      `).join('');
    }
  }

  if (els.alertHistoryList) {
    if (!state.alerts.length) {
      els.alertHistoryList.innerHTML = `<div class="empty-state-box">아직 알림이 없어요</div>`;
    } else {
      els.alertHistoryList.innerHTML = state.alerts.slice(0, 40).map(item => `
        <div class="news-item ${item.tone === 'up' ? 'up' : item.tone === 'down' ? 'down' : ''}">
          <div class="news-top"><b>${item.time}</b></div>
          <div class="news-text">${item.text}</div>
        </div>
      `).join('');
    }
  }
}

function renderWatchItem(stock) {
  const rate = stockRate(stock);
  const liked = state.favorites.includes(stock.code);
  return `
    <div class="watch-item watch-item-glow ${stock.code === state.selectedCode ? 'active' : ''}" data-select-code="${stock.code}">
      <div class="watch-left">
        <div class="stock-logo small">${stock.logo}</div>
        <div>
          <div class="watch-name">${stock.name}</div>
          <div class="watch-sub">${stock.theme} · 시총감 ${stock.marketCapHint.toLocaleString('ko-KR')}억</div>
        </div>
      </div>
      <div class="watch-right">
        <button class="favorite-toggle" data-toggle-favorite="${stock.code}" type="button">${liked ? '★' : '☆'}</button>
        <div class="watch-price">${formatKRW(stock.currentPrice)}</div>
        <div class="watch-rate ${rate >= 0 ? 'up' : 'down'}">${formatSignedPct(rate)}</div>
        <div class="watch-sub">거래량 ${formatVolume(stock.volume)}</div>
      </div>
    </div>
  `;
}

function renderWatchlist() {
  const term = (state.searchTerm || '').trim().toLowerCase();
  let items = [...state.stocks];

  if (term) {
    items = items.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.code.toLowerCase().includes(term) ||
      s.theme.toLowerCase().includes(term)
    );
  }

  items.sort((a,b) => state.sortBy === 'volume' ? b.volume - a.volume : stockRate(b) - stockRate(a));

  const favs = items.filter(s => state.favorites.includes(s.code));

  if (els.favoritesList) {
    if (!favs.length) els.favoritesList.innerHTML = '즐겨찾기한 종목이 아직 없어요';
    else els.favoritesList.innerHTML = favs.map(renderWatchItem).join('');
  }
  if (els.watchlist) els.watchlist.innerHTML = items.map(renderWatchItem).join('');

  qa('[data-select-code]').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedCode = el.dataset.selectCode;
      updateOrderInputs();
      render();
      queueSave();
    });
  });

  qa('[data-toggle-favorite]').forEach(el => {
    el.addEventListener('click', ev => {
      ev.stopPropagation();
      const code = el.dataset.toggleFavorite;
      if (state.favorites.includes(code)) state.favorites = state.favorites.filter(x => x !== code);
      else state.favorites.unshift(code);
      renderWatchlist();
      renderHero();
      queueSave();
    });
  });
}

function renderQuickButtons() {
  if (!els.quickRow) return;
  const stock = selectedStock();
  const cash = state.portfolio.cash;
  const h = holdingOf(stock.code);
  const maxBuy = Math.max(0, Math.floor(cash / (stock.currentPrice * (1 + state.settings.feeRate))));
  const sellAll = h.qty;

  const buttons = state.orderMode === 'buy'
    ? [1,5,10,Math.max(1,Math.floor(maxBuy*0.25)),Math.max(1,Math.floor(maxBuy*0.5)),maxBuy].filter((v,i,a)=>v>0&&a.indexOf(v)===i)
    : [1,5,10,Math.max(1,Math.floor(sellAll*0.25)),Math.max(1,Math.floor(sellAll*0.5)),sellAll].filter((v,i,a)=>v>0&&a.indexOf(v)===i);

  els.quickRow.innerHTML = buttons.map(v => `<button type="button" class="ghost-btn" data-quick-qty="${v}">${state.orderMode === 'buy' && v === maxBuy ? '최대' : state.orderMode === 'sell' && v === sellAll ? '전량' : v + '주'}</button>`).join('');

  qa('[data-quick-qty]', els.quickRow).forEach(btn => btn.addEventListener('click', () => {
    if (els.orderQty) els.orderQty.value = btn.dataset.quickQty;
    updateOrderInputs();
  }));
}

function renderAdminPanel() {
  const loginBox = byId('adminLoginBox');
  const panelBox = byId('adminPanelBox');
  if (!loginBox || !panelBox) return;

  loginBox.classList.toggle('hidden', state.isAdmin);
  panelBox.classList.toggle('hidden', !state.isAdmin);
  if (!state.isAdmin) return;

  byId('adminInitialCash').value = Math.round(state.settings.initialCash);
  byId('adminSupportAmount').value = Math.round(state.settings.supportFundAmount);
  byId('adminSupportLimit').value = Math.round(state.settings.supportFundCashLimit);
  byId('adminFeeRate').value = (state.settings.feeRate * 100).toFixed(2);
  byId('adminVolatility').value = Number(state.settings.volatilityMultiplier).toFixed(1);
  byId('adminNewsFreq').value = Number(state.settings.newsFrequencyMultiplier).toFixed(1);
  byId('adminHighSpeedEnabled').checked = !!state.settings.adminHighSpeedEnabled;
  byId('adminPresetSelect').value = state.settings.marketPreset || 'normal';

  const stockSel = byId('adminStockSelect');
  stockSel.innerHTML = state.stocks.map(s => `<option value="${s.code}">${s.name}</option>`).join('');
  stockSel.value = state.selectedCode;
  byId('adminStockPrice').value = selectedStock().currentPrice;
}

function resetBaseline() {
  state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() };
  addAlert('수익률 기준선이 현재 자산 기준으로 다시 잡혔어요', 'up');
  render();
  queueSave();
}

function claimSupportFund() {
  if (state.emergencyFundClaimed) return;
  if (state.portfolio.cash > state.settings.supportFundCashLimit) {
    addAlert(`긴급지원금은 현금이 ${formatKRW(state.settings.supportFundCashLimit)} 이하일 때만 받을 수 있어요`, 'down');
    renderHistory();
    return;
  }

  state.portfolio.cash += state.settings.supportFundAmount;
  state.emergencyFundClaimed = true;
  addAlert(`긴급지원금 ${formatKRW(state.settings.supportFundAmount)}이 지급됐어요`, 'up');
  render();
  queueSave();
}

function hardReset() {
  if (!confirm('전체 데이터를 초기화할까요?')) return;
  localStorage.removeItem(STORAGE_KEY);
  defaultState();
  render();
  queueSave();
}

function bindEvents() {
  addEvent(els.heroStockSelect, 'change', e => {
    state.selectedCode = e.target.value;
    updateOrderInputs();
    render();
    queueSave();
  });

  addEvent(els.buyModeBtn, 'click', () => setOrderMode('buy'));
  addEvent(els.sellModeBtn, 'click', () => setOrderMode('sell'));
  addEvent(els.orderQty, 'input', updateOrderInputs);
  addEvent(els.orderPrice, 'input', updateOrderInputs);
  addEvent(els.submitOrderBtn, 'click', () => placeOrder(state.orderMode, state.selectedCode, els.orderQty?.value));
  addEvent(els.addAutoSellBtn, 'click', registerAutoSell);
  addEvent(byId('addAutoBuyBtn'), 'click', registerAutoBuy);

  addEvent(els.searchInput, 'input', e => {
    state.searchTerm = e.target.value || '';
    renderWatchlist();
  });

  qa('.sort-btn').forEach(btn => btn.addEventListener('click', () => {
    state.sortBy = btn.dataset.sort;
    qa('.sort-btn').forEach(x => x.classList.toggle('active', x === btn));
    renderWatchlist();
    queueSave();
  }));

  qa('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
    state.chartRange = btn.dataset.chartRange;
    qa('.tab-btn').forEach(x => x.classList.toggle('active', x === btn));
    drawChart();
    queueSave();
  }));

  qa('.history-tab').forEach(btn => btn.addEventListener('click', () => {
    state.historyTab = btn.dataset.historyTab;
    renderHistory();
    queueSave();
  }));

  addEvent(els.clearHistoryBtn, 'click', () => {
    if (state.historyTab === 'orders') state.orderHistory = [];
    else state.alerts = [];
    renderHistory();
    queueSave();
  });

  addEvent(els.supportFundBtn, 'click', claimSupportFund);
  addEvent(els.pauseBtn, 'click', () => { state.isPaused = true; addAlert('시뮬레이션을 잠깐 멈췄어요', 'normal'); renderHistory(); });
  addEvent(els.resumeBtn, 'click', () => { state.isPaused = false; state.isStopped = false; addAlert('시뮬레이션을 다시 시작했어요', 'up'); renderHistory(); });
  addEvent(els.stopBtn, 'click', () => { state.isStopped = true; addAlert('시뮬레이션을 정지했어요', 'down'); renderHistory(); });
  addEvent(els.resetBtn, 'click', hardReset);
  addEvent(byId('resetBaselineBtn'), 'click', resetBaseline);

  addEvent(byId('toggleActiveOrdersBtn'), 'click', () => {
    const wrap = byId('autoBuyList')?.closest('.auto-sell-block');
    if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  addEvent(els.favoriteToggleBtn, 'click', () => {
    const code = state.selectedCode;
    if (state.favorites.includes(code)) state.favorites = state.favorites.filter(x => x !== code);
    else state.favorites.unshift(code);
    renderHero();
    renderWatchlist();
    queueSave();
  });

  addEvent(els.adminEntryBtn, 'click', () => byId('adminOverlay')?.classList.remove('hidden'));
  addEvent(byId('closeAdminModalBtn'), 'click', () => byId('adminOverlay')?.classList.add('hidden'));

  addEvent(byId('adminLoginBtn'), 'click', () => {
    const code = byId('adminCodeInput')?.value || '';
    if (code === ADMIN_CODE) {
      state.isAdmin = true;
      renderAdminPanel();
      renderHeader();
      queueSave();
      addAlert('관리자 모드가 활성화됐어요', 'up');
      renderHistory();
    } else {
      addAlert('관리자 코드가 맞지 않아요', 'down');
      renderHistory();
    }
  });

  addEvent(byId('saveAdminSettingsBtn'), 'click', () => {
    if (!state.isAdmin) return;

    state.settings.initialCash = Math.max(1000, toInt(byId('adminInitialCash')?.value, state.settings.initialCash));
    state.settings.supportFundAmount = Math.max(0, toInt(byId('adminSupportAmount')?.value, state.settings.supportFundAmount));
    state.settings.supportFundCashLimit = Math.max(0, toInt(byId('adminSupportLimit')?.value, state.settings.supportFundCashLimit));
    state.settings.feeRate = clamp(toNum(byId('adminFeeRate')?.value, state.settings.feeRate * 100) / 100, 0, 0.3);
    state.settings.volatilityMultiplier = clamp(toNum(byId('adminVolatility')?.value, state.settings.volatilityMultiplier), 0.2, 5);
    state.settings.newsFrequencyMultiplier = clamp(toNum(byId('adminNewsFreq')?.value, state.settings.newsFrequencyMultiplier), 0.2, 5);
    state.settings.adminHighSpeedEnabled = !!byId('adminHighSpeedEnabled')?.checked;
    state.settings.marketPreset = byId('adminPresetSelect')?.value || 'normal';

    if (!state.settings.adminHighSpeedEnabled && [100,200,300].includes(state.speed)) state.speed = 50;

    addAlert('관리자 설정을 저장했어요', 'up');
    render();
    queueSave();
  });

  addEvent(byId('applyAdminStockPriceBtn'), 'click', () => {
    if (!state.isAdmin) return;
    const code = byId('adminStockSelect')?.value;
    const stock = state.stocks.find(s => s.code === code);
    const price = Math.max(1, toInt(byId('adminStockPrice')?.value, stock?.currentPrice || 1));
    if (!stock) return;

    stock.currentPrice = price;
    stock.dayHigh = Math.max(stock.dayHigh, price);
    stock.dayLow = Math.min(stock.dayLow, price);
    stock.history.push(price);
    if (stock.history.length > 240) stock.history.shift();
    buildOrderbook(stock);

    addAlert(`${stock.name} 가격을 ${formatKRW(price)}로 조정했어요`, 'normal');
    render();
    queueSave();
  });

  addEvent(byId('forceBaselineResetBtn'), 'click', resetBaseline);
  addEvent(byId('adminCancelAllAutoSellBtn'), 'click', () => { state.autoSellOrders = []; renderAutoLists(); queueSave(); });
  addEvent(byId('adminCancelAllAutoBuyBtn'), 'click', () => { state.autoBuyOrders = []; renderAutoLists(); queueSave(); });
  addEvent(byId('adminResetAllBtn'), 'click', hardReset);
}

function render() {
  renderHeader();
  renderHero();
  renderPortfolio();
  renderSpeedButtons();
  renderQuickButtons();
  updateOrderInputs();
  renderOrderbook();
  drawChart();
  renderSelectedNews();
  renderNewsFeed();
  renderHistory();
  renderWatchlist();
  renderAutoLists();
  renderAdminPanel();
}

function init() {
  loadState();
  collectEls();
  injectExtraUI();
  bindEvents();
  setOrderMode(state.orderMode);
  render();

  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(tickOnce, 1000);
}

document.addEventListener('DOMContentLoaded', init);
