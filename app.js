const STORAGE_KEY = 'k_mock_trading_pro_v30';
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
  marketPreset: 'normal',
  marketTrend: 'neutral',
  marketTheme: 'all',
  marketThemeBias: 0,
  forceAutoTradingPause: false
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
  autoBuyOrders: [],
  adminControl: {
    marketMode: 'normal',
    marketTrend: 'neutral',
    themeTarget: 'all',
    themeBias: 0,
    stockControl: {},
    forcedNewsQueue: [],
    pauseAutoTrading: false
  },
  chartHoverIndex: -1
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
  state.adminControl = { marketMode: 'normal', marketTrend: 'neutral', themeTarget: 'all', themeBias: 0, stockControl: {}, forcedNewsQueue: [], pauseAutoTrading: false };
  state.chartHoverIndex = -1;
  state.stocks.forEach(buildOrderbook);
}

function sanitizeStock(raw) {
  const base = STOCK_BLUEPRINTS.find(x => x[0] === raw?.code);
  const stock = base ? makeStock(base) : makeStock(['TMP','임시종목','임','기타',10000,'mid','stable']);
  const currentPrice = Math.max(1, toInt(raw?.currentPrice, stock.currentPrice));
  const prevClose = Math.max(1, toInt(raw?.prevClose, stock.prevClose));
  const openPrice = Math.max(1, toInt(raw?.openPrice, prevClose));
  let history = Array.isArray(raw?.history) ? raw.history.map(v => Math.max(1, toInt(v, currentPrice))) : stock.history.slice();
  if (!history.length) history = [currentPrice];
  history = history.slice(-260);
  const merged = {
    ...stock,
    ...raw,
    currentPrice,
    prevClose,
    openPrice,
    dayHigh: Math.max(currentPrice, toInt(raw?.dayHigh, currentPrice)),
    dayLow: Math.max(1, Math.min(currentPrice, toInt(raw?.dayLow, currentPrice))),
    volume: Math.max(0, toInt(raw?.volume, stock.volume)),
    history,
    haltedTicks: Math.max(0, toInt(raw?.haltedTicks, 0)),
    eventTicks: Math.max(0, toInt(raw?.eventTicks, 0)),
    eventBias: toNum(raw?.eventBias, 0),
    heat: toNum(raw?.heat, 0),
    intradayBias: toNum(raw?.intradayBias, 0),
    flash: Math.max(0, toInt(raw?.flash, 0))
  };
  merged.orderbook = [];
  buildOrderbook(merged);
  return merged;
}

function sanitizeHoldings(obj) {
  const holdings = {};
  if (!obj || typeof obj !== 'object') return holdings;
  Object.entries(obj).forEach(([code, h]) => {
    const qty = Math.max(0, toInt(h?.qty, 0));
    const avgPrice = Math.max(0, toNum(h?.avgPrice, 0));
    if (qty > 0) holdings[code] = { qty, avgPrice };
  });
  return holdings;
}

function sanitizeAdminControl(raw) {
  const base = { marketMode: 'normal', marketTrend: 'neutral', themeTarget: 'all', themeBias: 0, stockControl: {}, forcedNewsQueue: [], pauseAutoTrading: false };
  if (!raw || typeof raw !== 'object') return base;
  const out = { ...base, ...raw };
  const control = {};
  if (out.stockControl && typeof out.stockControl === 'object') {
    Object.entries(out.stockControl).forEach(([code, v]) => {
      control[code] = {
        priceLock: !!v?.priceLock,
        lockedPrice: Math.max(1, toInt(v?.lockedPrice, 0)),
        trend: ['up','down','neutral'].includes(v?.trend) ? v.trend : 'neutral',
        volatilityScale: clamp(toNum(v?.volatilityScale, 1), 0.1, 6),
        volumeBoost: clamp(toNum(v?.volumeBoost, 1), 0.2, 20),
        limitEvent: ['none','up','down'].includes(v?.limitEvent) ? v.limitEvent : 'none'
      };
    });
  }
  out.stockControl = control;
  out.themeBias = clamp(toNum(out.themeBias, 0), -1, 1);
  out.forcedNewsQueue = Array.isArray(out.forcedNewsQueue) ? out.forcedNewsQueue.slice(-20) : [];
  out.pauseAutoTrading = !!out.pauseAutoTrading;
  return out;
}

function loadState() {
  defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.speed = [1,2,5,10,20,50,100,200,300].includes(toInt(parsed?.speed, 1)) ? toInt(parsed.speed, 1) : 1;
    state.selectedCode = typeof parsed?.selectedCode === 'string' ? parsed.selectedCode : 'KQ001';
    state.orderMode = parsed?.orderMode === 'sell' ? 'sell' : 'buy';
    state.sortBy = ['change','volume','price','name'].includes(parsed?.sortBy) ? parsed.sortBy : 'change';
    state.chartRange = ['1m','5m','15m','all'].includes(parsed?.chartRange) ? parsed.chartRange : '1m';
    state.historyTab = ['orders','news','alerts'].includes(parsed?.historyTab) ? parsed.historyTab : 'orders';
    state.emergencyFundClaimed = !!parsed?.emergencyFundClaimed;
    state.settings = {
      ...DEFAULT_SETTINGS,
      ...(parsed?.settings || {})
    };
    state.settings.initialCash = Math.max(10000, toInt(state.settings.initialCash, 1000000));
    state.settings.supportFundAmount = Math.max(0, toInt(state.settings.supportFundAmount, 500000));
    state.settings.supportFundCashLimit = Math.max(0, toInt(state.settings.supportFundCashLimit, 500000));
    state.settings.feeRate = clamp(toNum(state.settings.feeRate, 0.0015), 0, 0.1);
    state.settings.volatilityMultiplier = clamp(toNum(state.settings.volatilityMultiplier, 1), 0.2, 6);
    state.settings.newsFrequencyMultiplier = clamp(toNum(state.settings.newsFrequencyMultiplier, 1), 0.2, 5);
    state.settings.adminHighSpeedEnabled = !!state.settings.adminHighSpeedEnabled;
    state.settings.marketPreset = ['normal','calm','mania','crash'].includes(state.settings.marketPreset) ? state.settings.marketPreset : 'normal';
    state.settings.marketTrend = ['neutral','up','down'].includes(state.settings.marketTrend) ? state.settings.marketTrend : 'neutral';
    state.settings.marketTheme = typeof state.settings.marketTheme === 'string' ? state.settings.marketTheme : 'all';
    state.settings.marketThemeBias = clamp(toNum(state.settings.marketThemeBias, 0), -1, 1);
    state.settings.forceAutoTradingPause = !!state.settings.forceAutoTradingPause;
    state.baseline = {
      totalAsset: Math.max(0, toNum(parsed?.baseline?.totalAsset, state.settings.initialCash)),
      startedAt: toInt(parsed?.baseline?.startedAt, Date.now())
    };
    state.realizedProfit = toNum(parsed?.realizedProfit, 0);
    state.portfolio = {
      cash: Math.max(0, toInt(parsed?.portfolio?.cash, state.settings.initialCash)),
      holdings: sanitizeHoldings(parsed?.portfolio?.holdings)
    };
    state.favorites = Array.isArray(parsed?.favorites) ? parsed.favorites.filter(v => typeof v === 'string').slice(0, 30) : [];
    if (Array.isArray(parsed?.stocks) && parsed.stocks.length) {
      const stockMap = new Map(parsed.stocks.map(s => [s.code, s]));
      state.stocks = STOCK_BLUEPRINTS.map(bp => sanitizeStock(stockMap.get(bp[0]) || makeStock(bp)));
    } else {
      state.stocks = STOCK_BLUEPRINTS.map(makeStock);
    }
    state.news = Array.isArray(parsed?.news) ? parsed.news.slice(0, 120).filter(Boolean) : [];
    state.alerts = Array.isArray(parsed?.alerts) ? parsed.alerts.slice(0, 120).filter(Boolean) : [];
    state.orderHistory = Array.isArray(parsed?.orderHistory) ? parsed.orderHistory.slice(0, 300).filter(Boolean) : [];
    state.autoSellOrders = Array.isArray(parsed?.autoSellOrders) ? parsed.autoSellOrders.filter(Boolean).slice(0, 200) : [];
    state.autoBuyOrders = Array.isArray(parsed?.autoBuyOrders) ? parsed.autoBuyOrders.filter(Boolean).slice(0, 200) : [];
    state.adminControl = sanitizeAdminControl(parsed?.adminControl);
  } catch (err) {
    console.warn('저장 데이터 로드 실패', err);
    defaultState();
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
      autoBuyOrders: state.autoBuyOrders,
      adminControl: state.adminControl
    }));
  } catch (err) {
    console.warn('저장 실패', err);
  }
}

function queueSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveState();
  }, 120);
}

function pushNews(type, title, message, meta = {}) {
  const item = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: nowTime(),
    type,
    title,
    message,
    ...meta
  };
  state.news.unshift(item);
  state.news = state.news.slice(0, 80);
  if (type === 'breaking' || type === 'bad' || type === 'good') {
    state.alerts.unshift({
      id: item.id,
      time: item.time,
      title: item.title,
      message: item.message,
      level: type
    });
    state.alerts = state.alerts.slice(0, 80);
  }
  queueSave();
  renderHistory();
  renderTicker();
}

function pushOrderHistory(entry) {
  state.orderHistory.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    time: nowTime(),
    ...entry
  });
  state.orderHistory = state.orderHistory.slice(0, 160);
  queueSave();
  renderHistory();
}

function toast(msg, type = 'info') {
  if (!els.toastLayer) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  els.toastLayer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 240);
  }, 2100);
}

function selectedStock() {
  return state.stocks.find(s => s.code === state.selectedCode) || state.stocks[0];
}

function getThemeList() {
  return Array.from(new Set(state.stocks.map(s => s.theme)));
}

function buildOrderbook(stock) {
  const levels = 8;
  const price = stock.currentPrice;
  const spacingRate = price < 1000 ? 0.01 : price < 10000 ? 0.004 : price < 100000 ? 0.002 : 0.0012;
  const step = Math.max(1, Math.round(price * spacingRate));
  const rows = [];
  for (let i = levels; i >= 1; i--) {
    rows.push({
      side: 'ask',
      price: Math.max(1, Math.round(price + (step * i))),
      qty: randInt(30, 9000)
    });
  }
  rows.push({
    side: 'mid',
    price,
    qty: 0
  });
  for (let i = 1; i <= levels; i++) {
    rows.push({
      side: 'bid',
      price: Math.max(1, Math.round(price - (step * i))),
      qty: randInt(30, 9000)
    });
  }
  stock.orderbook = rows;
}

function getSpeedProfile(speed) {
  const map = {
    1: { delay: 950, steps: 1 },
    2: { delay: 520, steps: 1 },
    5: { delay: 250, steps: 1 },
    10: { delay: 140, steps: 1 },
    20: { delay: 80, steps: 2 },
    50: { delay: 34, steps: 3 },
    100: { delay: 18, steps: 4 },
    200: { delay: 10, steps: 6 },
    300: { delay: 7, steps: 8 }
  };
  const out = map[speed] || map[1];
  if (speed >= 100 && !state.settings.adminHighSpeedEnabled) return map[50];
  return out;
}

function scheduleTickLoop() {
  if (tickTimer) clearTimeout(tickTimer);
  const run = () => {
    tickOnce();
    const profile = getSpeedProfile(state.speed);
    tickTimer = setTimeout(run, profile.delay);
  };
  const profile = getSpeedProfile(state.speed);
  tickTimer = setTimeout(run, profile.delay);
}

function adminStockControl(code) {
  if (!state.adminControl.stockControl[code]) {
    state.adminControl.stockControl[code] = {
      priceLock: false,
      lockedPrice: 0,
      trend: 'neutral',
      volatilityScale: 1,
      volumeBoost: 1,
      limitEvent: 'none'
    };
  }
  return state.adminControl.stockControl[code];
}

function marketPresetState() {
  return PRESETS[state.adminControl.marketMode || state.settings.marketPreset] || PRESETS.normal;
}

function applyForcedNewsFromQueue() {
  const job = state.adminControl.forcedNewsQueue.shift();
  if (!job) return;
  const stock = state.stocks.find(s => s.code === job.code);
  if (!stock) return;
  let effect = 0;
  let titleType = 'event';
  if (job.kind === 'good') {
    effect = rand(0.018, 0.055);
    titleType = 'good';
  } else if (job.kind === 'bad') {
    effect = rand(-0.055, -0.018);
    titleType = 'bad';
  } else {
    effect = rand(0.04, 0.09) * (Math.random() > 0.5 ? 1 : -1);
    titleType = 'breaking';
  }
  stock.eventBias = effect * stock.newsSensitivity;
  stock.eventTicks = randInt(10, 26);
  stock.flash = 10;
  pushNews(titleType, `${stock.name} ${job.kind === 'good' ? '호재' : job.kind === 'bad' ? '악재' : '속보'}`, job.message || `${stock.name} 관련 강제 뉴스가 반영되었어요.`, { code: stock.code });
}

function maybeCreateNaturalNews(stock) {
  const preset = marketPresetState();
  const chanceBase = 0.009 * preset.newsFrequencyMultiplier * state.settings.newsFrequencyMultiplier * stock.newsSensitivity;
  if (Math.random() >= chanceBase) return;
  const kinds = ['good','bad','event','breaking'];
  const kind = pick(kinds);
  let effect = 0;
  if (kind === 'good') effect = rand(0.01, 0.04) * stock.newsSensitivity;
  if (kind === 'bad') effect = rand(-0.04, -0.01) * stock.newsSensitivity;
  if (kind === 'event') effect = rand(-0.02, 0.03) * stock.newsSensitivity;
  if (kind === 'breaking') effect = rand(-0.06, 0.06) * stock.newsSensitivity;
  stock.eventBias = effect;
  stock.eventTicks = randInt(8, 24);
  stock.flash = 7;
  const titlePool = THEME_EVENT_TEXT[stock.theme] || [stock.theme];
  const title = `${stock.name} - ${pick(titlePool)}`;
  const messagePool = GENERIC_NEWS[kind] || GENERIC_NEWS.event;
  pushNews(kind, title, pick(messagePool), { code: stock.code });
}

function forceLimitEvent(stock, direction) {
  const limitUp = Math.round(stock.prevClose * 1.3);
  const limitDown = Math.max(1, Math.round(stock.prevClose * 0.7));
  if (direction === 'up') {
    stock.currentPrice = limitUp;
    stock.haltedTicks = 8;
    stock.flash = 10;
    pushNews('breaking', `${stock.name} 상한가 이벤트`, '관리자 강제 이벤트로 상한가에 도달했어요.', { code: stock.code });
  } else if (direction === 'down') {
    stock.currentPrice = limitDown;
    stock.haltedTicks = 8;
    stock.flash = 10;
    pushNews('bad', `${stock.name} 하한가 이벤트`, '관리자 강제 이벤트로 하한가에 도달했어요.', { code: stock.code });
  }
  buildOrderbook(stock);
}

function stepStock(stock) {
  const control = adminStockControl(stock.code);
  if (control.limitEvent && control.limitEvent !== 'none') {
    forceLimitEvent(stock, control.limitEvent);
    control.limitEvent = 'none';
    return;
  }
  if (stock.haltedTicks > 0) {
    stock.haltedTicks -= 1;
    stock.flash = Math.max(0, stock.flash - 1);
    buildOrderbook(stock);
    return;
  }

  maybeCreateNaturalNews(stock);

  const preset = marketPresetState();
  const globalVol = state.settings.volatilityMultiplier * preset.volatilityMultiplier;
  const globalTrend = state.adminControl.marketTrend || state.settings.marketTrend || 'neutral';
  const themeTarget = state.adminControl.themeTarget || state.settings.marketTheme || 'all';
  const themeBias = toNum(state.adminControl.themeBias ?? state.settings.marketThemeBias, 0);
  const volScale = control.volatilityScale || 1;
  const trendForce =
    globalTrend === 'up' ? 0.0023 :
    globalTrend === 'down' ? -0.0023 : 0;

  const stockTrendForce =
    control.trend === 'up' ? 0.0032 :
    control.trend === 'down' ? -0.0032 : 0;

  const themeForce = themeTarget !== 'all' && themeTarget === stock.theme ? (themeBias * 0.004) : 0;
  const heatForce = stock.heat * 0.0014 * stock.momentumFactor;
  const eventForce = stock.eventTicks > 0 ? stock.eventBias : 0;
  const intraday = stock.intradayBias * 0.8;
  const baseMove = rand(-stock.volatility, stock.volatility) * globalVol * volScale;
  const momentum = (stock.history.length > 2 ? ((stock.history[stock.history.length - 1] - stock.history[stock.history.length - 3]) / Math.max(1, stock.history[stock.history.length - 3])) : 0) * 0.35;
  let move = baseMove + trendForce + stockTrendForce + themeForce + heatForce + eventForce + intraday + momentum;

  if (stock.style === 'stable') move *= 0.72;
  if (stock.style === 'momentum') move *= 1.12;
  if (stock.style === 'news') move *= 1.06;
  if (stock.style === 'theme') move *= 1.08;
  if (stock.style === 'cyclical') move *= 0.98;

  const limitUp = Math.round(stock.prevClose * 1.3);
  const limitDown = Math.max(1, Math.round(stock.prevClose * 0.7));

  if (control.priceLock && control.lockedPrice > 0) {
    stock.currentPrice = Math.max(1, control.lockedPrice);
  } else {
    let next = Math.round(stock.currentPrice * (1 + move));
    if (Math.random() < 0.004 * globalVol * volScale) {
      next = Math.round(next * (1 + rand(-0.12, 0.12)));
      stock.flash = 9;
    }
    if (next >= limitUp) {
      next = limitUp;
      stock.haltedTicks = 6;
      pushNews('breaking', `${stock.name} 상한가 접근`, '상한가에 도달하며 거래가 잠시 과열 상태예요.', { code: stock.code });
    }
    if (next <= limitDown) {
      next = limitDown;
      stock.haltedTicks = 6;
      pushNews('bad', `${stock.name} 하한가 접근`, '하한가에 도달하며 변동성이 크게 확대되었어요.', { code: stock.code });
    }
    stock.currentPrice = clamp(next, limitDown, limitUp);
  }

  stock.dayHigh = Math.max(stock.dayHigh, stock.currentPrice);
  stock.dayLow = Math.min(stock.dayLow, stock.currentPrice);
  stock.history.push(stock.currentPrice);
  stock.history = stock.history.slice(-260);

  const volumeJump = randInt(60, 2800) * (control.volumeBoost || 1) * (1 + Math.abs(move) * 40);
  stock.volume = Math.round(Math.max(0, stock.volume + volumeJump));

  stock.heat += rand(-0.05, 0.05) + (move * 10);
  stock.heat = clamp(stock.heat, -2.5, 2.5);

  if (stock.eventTicks > 0) stock.eventTicks -= 1;
  if (stock.eventTicks <= 0) stock.eventBias *= 0.6;
  stock.flash = Math.max(0, stock.flash - 1);

  buildOrderbook(stock);
}

function executeAutoOrders() {
  if (state.settings.forceAutoTradingPause || state.adminControl.pauseAutoTrading) return;

  const removeSell = [];
  state.autoSellOrders.forEach((order, idx) => {
    const stock = state.stocks.find(s => s.code === order.code);
    const holding = holdingOf(order.code);
    if (!stock || holding.qty <= 0) {
      removeSell.push(idx);
      return;
    }
    const qty = order.useAll ? holding.qty : Math.min(holding.qty, Math.max(0, toInt(order.qty, 0)));
    if (qty <= 0) {
      removeSell.push(idx);
      return;
    }
    const hitTake = order.takePrice > 0 && stock.currentPrice >= order.takePrice;
    const hitStop = order.stopPrice > 0 && stock.currentPrice <= order.stopPrice;
    if (!hitTake && !hitStop) return;
    const reason = hitTake ? '자동매도(목표가)' : '자동매도(손절가)';
    executeSell(order.code, qty, stock.currentPrice, reason);
    removeSell.push(idx);
  });
  state.autoSellOrders = state.autoSellOrders.filter((_, idx) => !removeSell.includes(idx));

  const removeBuy = [];
  state.autoBuyOrders.forEach((order, idx) => {
    const stock = state.stocks.find(s => s.code === order.code);
    if (!stock) {
      removeBuy.push(idx);
      return;
    }
    if (stock.currentPrice > order.targetPrice) return;
    const price = stock.currentPrice;
    let qty = 0;
    if (order.useMax) {
      qty = Math.floor(state.portfolio.cash / (price + feeOf(price)));
    } else {
      qty = Math.max(0, toInt(order.qty, 0));
    }
    if (qty <= 0) {
      removeBuy.push(idx);
      return;
    }
    const totalCost = (price * qty) + feeOf(price * qty);
    if (state.portfolio.cash < totalCost) {
      removeBuy.push(idx);
      return;
    }
    executeBuy(order.code, qty, price, '자동매수(예약구매)');
    removeBuy.push(idx);
  });
  state.autoBuyOrders = state.autoBuyOrders.filter((_, idx) => !removeBuy.includes(idx));

  renderAutoTradeList();
  queueSave();
}

function tickOnce() {
  if (state.isStopped || state.isPaused) return;
  applyForcedNewsFromQueue();
  const profile = getSpeedProfile(state.speed);
  for (let step = 0; step < profile.steps; step++) {
    state.stocks.forEach(stepStock);
    executeAutoOrders();
  }
  renderAll();
  queueSave();
}

function executeBuy(code, qty, price, reason = '매수') {
  qty = Math.max(0, toInt(qty, 0));
  if (qty <= 0) return false;
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return false;
  price = Math.max(1, toInt(price, stock.currentPrice));
  const gross = price * qty;
  const fee = feeOf(gross);
  const total = gross + fee;
  if (state.portfolio.cash < total) {
    toast('현금이 부족해요.', 'error');
    return false;
  }
  state.portfolio.cash -= total;
  const h = holdingOf(code);
  const newQty = h.qty + qty;
  const newAvg = newQty > 0 ? (((h.avgPrice * h.qty) + gross) / newQty) : 0;
  state.portfolio.holdings[code] = { qty: newQty, avgPrice: newAvg };
  pushOrderHistory({ type: 'buy', code, stockName: stock.name, qty, price, fee, total, reason });
  toast(`${stock.name} ${qty.toLocaleString('ko-KR')}주 매수 완료`, 'success');
  renderAll();
  queueSave();
  return true;
}

function executeSell(code, qty, price, reason = '매도') {
  qty = Math.max(0, toInt(qty, 0));
  if (qty <= 0) return false;
  const stock = state.stocks.find(s => s.code === code);
  if (!stock) return false;
  const h = holdingOf(code);
  if (h.qty < qty) {
    toast('보유 수량이 부족해요.', 'error');
    return false;
  }
  price = Math.max(1, toInt(price, stock.currentPrice));
  const gross = price * qty;
  const fee = feeOf(gross);
  const total = gross - fee;
  state.portfolio.cash += total;
  const remainQty = h.qty - qty;
  state.realizedProfit += ((price - h.avgPrice) * qty) - fee;
  if (remainQty <= 0) {
    delete state.portfolio.holdings[code];
  } else {
    state.portfolio.holdings[code] = { qty: remainQty, avgPrice: h.avgPrice };
  }
  pushOrderHistory({ type: 'sell', code, stockName: stock.name, qty, price, fee, total, reason });
  toast(`${stock.name} ${qty.toLocaleString('ko-KR')}주 매도 완료`, 'success');
  renderAll();
  queueSave();
  return true;
}

function resetBaseline() {
  state.baseline = { totalAsset: totalAsset(), startedAt: Date.now() };
  toast('현재 총자산 기준으로 수익률 기준선을 리셋했어요.', 'info');
  renderTopSummary();
  queueSave();
}

function claimEmergencyFund() {
  if (state.emergencyFundClaimed) {
    toast('긴급지원금은 이미 사용했어요.', 'error');
    return;
  }
  if (state.portfolio.cash > state.settings.supportFundCashLimit) {
    toast(`현금이 ${formatKRW(state.settings.supportFundCashLimit)} 이하일 때만 사용할 수 있어요.`, 'error');
    return;
  }
  state.portfolio.cash += state.settings.supportFundAmount;
  state.emergencyFundClaimed = true;
  toast(`${formatKRW(state.settings.supportFundAmount)} 긴급지원금이 지급되었어요.`, 'success');
  queueSave();
  renderAll();
}

function clearAllData() {
  if (!confirm('전체 데이터를 초기화할까요?')) return;
  localStorage.removeItem(STORAGE_KEY);
  defaultState();
  renderAll();
  scheduleTickLoop();
  toast('전체 데이터를 초기화했어요.', 'info');
}

function toggleFavorite(code) {
  const idx = state.favorites.indexOf(code);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.unshift(code);
  state.favorites = state.favorites.slice(0, 20);
  renderHero();
  renderWatchlist();
  queueSave();
}

function updateOrderMode(mode) {
  state.orderMode = mode === 'sell' ? 'sell' : 'buy';
  qa('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === state.orderMode));
  if (els.autoBuyBox) els.autoBuyBox.style.display = state.orderMode === 'buy' ? '' : 'none';
  if (els.autoSellBox) els.autoSellBox.style.display = state.orderMode === 'sell' ? '' : 'none';
  if (els.orderPrimaryBtn) {
    els.orderPrimaryBtn.textContent = state.orderMode === 'buy' ? '현재가 매수' : '현재가 매도';
    els.orderPrimaryBtn.classList.toggle('buy-style', state.orderMode === 'buy');
    els.orderPrimaryBtn.classList.toggle('sell-style', state.orderMode === 'sell');
  }
  queueSave();
}

function filteredStocks() {
  let arr = [...state.stocks];
  const term = state.searchTerm.trim();
  if (term) {
    arr = arr.filter(s => s.name.includes(term) || s.theme.includes(term) || s.code.includes(term));
  }
  if (state.sortBy === 'change') arr.sort((a, b) => stockRate(b) - stockRate(a));
  if (state.sortBy === 'volume') arr.sort((a, b) => b.volume - a.volume);
  if (state.sortBy === 'price') arr.sort((a, b) => b.currentPrice - a.currentPrice);
  if (state.sortBy === 'name') arr.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  return arr;
}

function ensureDomRefs() {
  Object.assign(els, {
    appShell: q('.app-shell'),
    toastLayer: byId('toastLayer'),
    tickerText: byId('tickerText'),
    adminBadge: byId('adminModeBadge'),
    totalAsset: byId('summaryTotalAsset'),
    cash: byId('summaryCash'),
    stockValue: byId('summaryStockValue'),
    profitValue: byId('summaryProfitValue'),
    profitRate: byId('summaryProfitRate'),
    absProfitRate: byId('summaryAbsProfitRate'),
    emergencyBtn: byId('emergencyBtn'),
    adminBtn: byId('adminBtn'),
    resetBaselineBtn: byId('resetBaselineBtn'),
    resetAllBtn: byId('resetAllBtn'),
    speedBar: byId('speedBar'),
    selectedName: byId('selectedName'),
    selectedCode: byId('selectedCode'),
    selectedTheme: byId('selectedTheme'),
    selectedPrice: byId('selectedPrice'),
    selectedChange: byId('selectedChange'),
    selectedChangeRate: byId('selectedChangeRate'),
    selectedHigh: byId('selectedHigh'),
    selectedLow: byId('selectedLow'),
    selectedVolume: byId('selectedVolume'),
    selectedCap: byId('selectedCap'),
    favoriteToggle: byId('favoriteToggle'),
    stockSelect: byId('stockSelect'),
    watchlistBody: byId('watchlistBody'),
    orderQty: byId('orderQty'),
    orderPrimaryBtn: byId('orderPrimaryBtn'),
    buyModeBtn: byId('buyModeBtn'),
    sellModeBtn: byId('sellModeBtn'),
    feeRateText: byId('feeRateText'),
    orderHintText: byId('orderHintText'),
    autoBuyBox: byId('autoBuyBox'),
    autoBuyPrice: byId('autoBuyPrice'),
    autoBuyQty: byId('autoBuyQty'),
    autoBuyUseMax: byId('autoBuyUseMax'),
    autoBuySaveBtn: byId('autoBuySaveBtn'),
    autoSellBox: byId('autoSellBox'),
    autoSellTakePrice: byId('autoSellTakePrice'),
    autoSellStopPrice: byId('autoSellStopPrice'),
    autoSellQty: byId('autoSellQty'),
    autoSellUseAll: byId('autoSellUseAll'),
    autoSellSaveBtn: byId('autoSellSaveBtn'),
    autoTradeList: byId('autoTradeList'),
    autoTradeClearBtn: byId('autoTradeClearBtn'),
    orderbookBody: byId('orderbookBody'),
    portfolioBody: byId('portfolioBody'),
    realizedProfit: byId('realizedProfit'),
    chartCanvas: byId('priceChart'),
    chartTooltip: byId('chartTooltip'),
    historyTabs: q('.history-tabs'),
    historyList: byId('historyList'),
    searchInput: byId('searchInput'),
    sortSelect: byId('sortSelect'),
    chartRangeSelect: byId('chartRangeSelect'),
    pauseBtn: byId('pauseBtn'),
    stopBtn: byId('stopBtn'),
    adminPanel: byId('adminPanel'),
    adminOpenBtn: byId('adminOpenBtn'),
    adminCloseBtn: byId('adminCloseBtn'),
    adminLoginBtn: byId('adminLoginBtn'),
    adminCodeInput: byId('adminCodeInput'),
    adminHighSpeed: byId('adminHighSpeed'),
    adminInitialCash: byId('adminInitialCash'),
    adminSupportAmount: byId('adminSupportAmount'),
    adminSupportLimit: byId('adminSupportLimit'),
    adminFeeRate: byId('adminFeeRate'),
    adminGlobalVol: byId('adminGlobalVol'),
    adminNewsFreq: byId('adminNewsFreq'),
    adminMarketMode: byId('adminMarketMode'),
    adminMarketTrend: byId('adminMarketTrend'),
    adminThemeTarget: byId('adminThemeTarget'),
    adminThemeBias: byId('adminThemeBias'),
    adminSaveSettingsBtn: byId('adminSaveSettingsBtn'),
    adminForceResetBaselineBtn: byId('adminForceResetBaselineBtn'),
    adminClearAutoBtn: byId('adminClearAutoBtn'),
    adminResetDataBtn: byId('adminResetDataBtn'),
    adminStockTarget: byId('adminStockTarget'),
    adminPriceLock: byId('adminPriceLock'),
    adminLockedPrice: byId('adminLockedPrice'),
    adminTrend: byId('adminTrend'),
    adminVolScale: byId('adminVolScale'),
    adminVolumeBoost: byId('adminVolumeBoost'),
    adminLimitEvent: byId('adminLimitEvent'),
    adminApplyStockCtrlBtn: byId('adminApplyStockCtrlBtn'),
    adminNewsKind: byId('adminNewsKind'),
    adminNewsMessage: byId('adminNewsMessage'),
    adminForceNewsBtn: byId('adminForceNewsBtn'),
    adminPauseAutoTrading: byId('adminPauseAutoTrading')
  });
}

function renderTicker() {
  if (!els.tickerText) return;
  const latest = state.news.slice(0, 12);
  if (!latest.length) {
    els.tickerText.textContent = '실시간 뉴스가 여기에 표시돼요.';
    return;
  }
  els.tickerText.innerHTML = latest.map(n => {
    const cls = n.type === 'good' ? 'up' : n.type === 'bad' ? 'down' : n.type === 'breaking' ? 'break' : 'normal';
    return `<span class="ticker-item ${cls}">[${n.time}] ${n.title}</span>`;
  }).join('<span class="ticker-sep">•</span>');
}

function renderTopSummary() {
  const ta = totalAsset();
  const cash = state.portfolio.cash;
  const sv = stockValue();
  const p = baselineProfit();
  const pr = baselineProfitRate();
  const ar = absoluteProfitRate();
  setText(els.totalAsset, formatKRW(ta));
  setText(els.cash, formatKRW(cash));
  setText(els.stockValue, formatKRW(sv));
  setText(els.profitValue, formatSignedKRW(p));
  setText(els.profitRate, formatSignedPct(pr));
  setText(els.absProfitRate, `누적 ${formatSignedPct(ar)}`);
  if (els.profitValue) els.profitValue.className = `summary-value ${p >= 0 ? 'up' : 'down'}`;
  if (els.profitRate) els.profitRate.className = `summary-value ${pr >= 0 ? 'up' : 'down'}`;
  if (els.absProfitRate) els.absProfitRate.className = `summary-sub ${ar >= 0 ? 'up' : 'down'}`;

  if (els.emergencyBtn) {
    els.emergencyBtn.disabled = state.emergencyFundClaimed || state.portfolio.cash > state.settings.supportFundCashLimit;
    els.emergencyBtn.textContent = state.emergencyFundClaimed ? '긴급지원금 사용완료' : `긴급지원금 ${formatKRW(state.settings.supportFundAmount)}`;
  }
  if (els.adminBadge) {
    els.adminBadge.textContent = state.isAdmin ? '관리자 모드 ON' : '일반 모드';
    els.adminBadge.classList.toggle('active', state.isAdmin);
  }
}

function renderSpeedBar() {
  if (!els.speedBar) return;
  const base = [1,2,5,10,20,50];
  const admin = [100,200,300];
  const allowed = state.isAdmin && state.settings.adminHighSpeedEnabled ? [...base, ...admin] : base;
  els.speedBar.innerHTML = allowed.map(v => {
    return `<button class="speed-btn ${state.speed === v ? 'active' : ''}" data-speed="${v}">${v}x</button>`;
  }).join('');
  qa('.speed-btn', els.speedBar).forEach(btn => {
    addEvent(btn, 'click', () => {
      state.speed = toInt(btn.dataset.speed, 1);
      renderSpeedBar();
      scheduleTickLoop();
      queueSave();
    });
  });
}

function renderStockSelect() {
  if (!els.stockSelect) return;
  els.stockSelect.innerHTML = state.stocks.map(s => {
    const r = stockRate(s);
    return `<option value="${s.code}">${s.name} · ${formatKRW(s.currentPrice)} · ${formatSignedPct(r)}</option>`;
  }).join('');
  els.stockSelect.value = state.selectedCode;
}

function renderHero() {
  const stock = selectedStock();
  if (!stock) return;
  setText(els.selectedName, stock.name);
  setText(els.selectedCode, `${stock.code} · ${stock.theme}`);
  setText(els.selectedTheme, stock.style === 'stable' ? '안정형' :
    stock.style === 'news' ? '뉴스 민감형' :
    stock.style === 'momentum' ? '급등형' :
    stock.style === 'theme' ? '테마주형' :
    stock.style === 'cyclical' ? '순환형' : '혼합형');
  setText(els.selectedPrice, formatKRW(stock.currentPrice));
  const chg = stockChangeValue(stock);
  const rate = stockRate(stock);
  setText(els.selectedChange, formatSignedKRW(chg));
  setText(els.selectedChangeRate, formatSignedPct(rate));
  setText(els.selectedHigh, formatKRW(stock.dayHigh));
  setText(els.selectedLow, formatKRW(stock.dayLow));
  setText(els.selectedVolume, formatVolume(stock.volume));
  setText(els.selectedCap, `${stock.marketCapHint.toLocaleString('ko-KR')}억`);
  if (els.selectedPrice) els.selectedPrice.className = `hero-price ${chg >= 0 ? 'up' : 'down'}`;
  if (els.selectedChange) els.selectedChange.className = `hero-sub-value ${chg >= 0 ? 'up' : 'down'}`;
  if (els.selectedChangeRate) els.selectedChangeRate.className = `hero-rate ${chg >= 0 ? 'up' : 'down'}`;
  if (els.favoriteToggle) els.favoriteToggle.textContent = state.favorites.includes(stock.code) ? '★' : '☆';
  if (els.favoriteToggle) els.favoriteToggle.title = state.favorites.includes(stock.code) ? '관심종목 해제' : '관심종목 추가';
}

function renderWatchlist() {
  if (!els.watchlistBody) return;
  const rows = filteredStocks().map(s => {
    const isSel = s.code === state.selectedCode;
    const rate = stockRate(s);
    const chg = stockChangeValue(s);
    const fav = state.favorites.includes(s.code);
    return `
      <tr class="${isSel ? 'selected' : ''}" data-code="${s.code}">
        <td class="left">
          <div class="wl-name-row">
            <span class="wl-logo">${s.logo}</span>
            <div>
              <div class="wl-name">${s.name}</div>
              <div class="wl-meta">${s.theme}</div>
            </div>
          </div>
        </td>
        <td class="right price ${chg >= 0 ? 'up' : 'down'}">${formatKRW(s.currentPrice)}</td>
        <td class="right change ${chg >= 0 ? 'up' : 'down'}">${formatSignedPct(rate)}</td>
        <td class="right volume">${formatVolume(s.volume)}</td>
        <td class="center"><button class="tiny-fav ${fav ? 'on' : ''}" data-fav="${s.code}">${fav ? '★' : '☆'}</button></td>
      </tr>
    `;
  }).join('');
  els.watchlistBody.innerHTML = rows;
  qa('tr[data-code]', els.watchlistBody).forEach(tr => {
    addEvent(tr, 'click', (e) => {
      const favBtn = e.target.closest('.tiny-fav');
      if (favBtn) return;
      state.selectedCode = tr.dataset.code;
      renderAll();
      queueSave();
    });
  });
  qa('.tiny-fav', els.watchlistBody).forEach(btn => {
    addEvent(btn, 'click', (e) => {
      e.stopPropagation();
      toggleFavorite(btn.dataset.fav);
    });
  });
}

function renderOrderPanel() {
  const stock = selectedStock();
  if (!stock) return;
  if (els.feeRateText) els.feeRateText.textContent = `수수료 ${Math.round(state.settings.feeRate * 10000) / 100}%`;
  if (els.orderHintText) {
    const price = stock.currentPrice;
    const fee1 = feeOf(price);
    const max = Math.floor(state.portfolio.cash / (price + fee1));
    els.orderHintText.textContent = state.orderMode === 'buy'
      ? `현재가 ${formatKRW(price)} 기준 · 최대 ${Math.max(0, max).toLocaleString('ko-KR')}주 가능`
      : `보유 ${formatQty(holdingOf(stock.code).qty)} · 현재가 ${formatKRW(price)} 기준`;
  }
  updateOrderMode(state.orderMode);
}

function renderAutoTradeList() {
  if (!els.autoTradeList) return;
  const sellItems = state.autoSellOrders.map((o, idx) => {
    const s = state.stocks.find(x => x.code === o.code);
    if (!s) return '';
    return `
      <div class="auto-item">
        <div class="auto-head"><span class="tag sell">예약판매</span><strong>${s.name}</strong></div>
        <div class="auto-body">목표가 ${o.takePrice ? formatKRW(o.takePrice) : '-'} / 손절가 ${o.stopPrice ? formatKRW(o.stopPrice) : '-'} / ${o.useAll ? '전량' : formatQty(o.qty)}</div>
        <button class="auto-del" data-kind="sell" data-index="${idx}">삭제</button>
      </div>
    `;
  }).join('');
  const buyItems = state.autoBuyOrders.map((o, idx) => {
    const s = state.stocks.find(x => x.code === o.code);
    if (!s) return '';
    return `
      <div class="auto-item">
        <div class="auto-head"><span class="tag buy">예약구매</span><strong>${s.name}</strong></div>
        <div class="auto-body">목표 매수가 ${formatKRW(o.targetPrice)} / ${o.useMax ? '가능한 최대 수량' : formatQty(o.qty)}</div>
        <button class="auto-del" data-kind="buy" data-index="${idx}">삭제</button>
      </div>
    `;
  }).join('');
  els.autoTradeList.innerHTML = sellItems + buyItems || `<div class="empty-block">설정된 자동매매가 없어요.</div>`;
  qa('.auto-del', els.autoTradeList).forEach(btn => {
    addEvent(btn, 'click', () => {
      const idx = toInt(btn.dataset.index, -1);
      if (btn.dataset.kind === 'sell') state.autoSellOrders.splice(idx, 1);
      else state.autoBuyOrders.splice(idx, 1);
      renderAutoTradeList();
      queueSave();
    });
  });
}

function renderOrderbook() {
  if (!els.orderbookBody) return;
  const stock = selectedStock();
  if (!stock) return;
  const maxQty = Math.max(...stock.orderbook.map(x => x.qty || 0), 1);
  els.orderbookBody.innerHTML = stock.orderbook.map(row => {
    if (row.side === 'mid') {
      return `
        <div class="orderbook-row mid">
          <div class="ob-cell ask"></div>
          <div class="ob-cell price mid-price">${formatKRW(row.price)}</div>
          <div class="ob-cell bid"></div>
        </div>
      `;
    }
    const ratio = clamp((row.qty || 0) / maxQty, 0.04, 1);
    const cls = row.side === 'ask' ? 'ask' : 'bid';
    return `
      <div class="orderbook-row ${cls}">
        <div class="ob-cell ask">
          ${row.side === 'ask' ? `<span class="bar ask-bar" style="width:${ratio * 100}%"></span><span class="qty">${row.qty.toLocaleString('ko-KR')}</span>` : ''}
        </div>
        <div class="ob-cell price ${cls}-price">${formatKRW(row.price)}</div>
        <div class="ob-cell bid">
          ${row.side === 'bid' ? `<span class="bar bid-bar" style="width:${ratio * 100}%"></span><span class="qty">${row.qty.toLocaleString('ko-KR')}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderPortfolio() {
  if (!els.portfolioBody) return;
  const entries = Object.entries(state.portfolio.holdings);
  if (!entries.length) {
    els.portfolioBody.innerHTML = `<div class="empty-block">보유 종목이 없어요.</div>`;
  } else {
    els.portfolioBody.innerHTML = entries.map(([code, h]) => {
      const s = state.stocks.find(x => x.code === code);
      if (!s) return '';
      const evalAmount = s.currentPrice * h.qty;
      const diff = ((s.currentPrice - h.avgPrice) * h.qty);
      const diffRate = h.avgPrice > 0 ? ((s.currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0;
      return `
        <div class="pf-item" data-code="${code}">
          <div class="pf-left">
            <div class="pf-name">${s.name}</div>
            <div class="pf-meta">보유 ${formatQty(h.qty)} · 평단 ${formatKRW(h.avgPrice)}</div>
          </div>
          <div class="pf-right">
            <div class="pf-value">${formatKRW(evalAmount)}</div>
            <div class="pf-diff ${diff >= 0 ? 'up' : 'down'}">${formatSignedKRW(diff)} · ${formatSignedPct(diffRate)}</div>
          </div>
        </div>
      `;
    }).join('');
    qa('.pf-item', els.portfolioBody).forEach(item => {
      addEvent(item, 'click', () => {
        state.selectedCode = item.dataset.code;
        renderAll();
      });
    });
  }
  setText(els.realizedProfit, formatSignedKRW(state.realizedProfit));
  if (els.realizedProfit) els.realizedProfit.className = `mini-summary-value ${state.realizedProfit >= 0 ? 'up' : 'down'}`;
}

function getChartData(stock) {
  if (!stock) return [];
  const history = stock.history || [];
  if (state.chartRange === '1m') return history.slice(-60);
  if (state.chartRange === '5m') return history.slice(-120);
  if (state.chartRange === '15m') return history.slice(-180);
  return history.slice(-260);
}

function renderChart() {
  const canvas = els.chartCanvas;
  if (!canvas || !canvas.getContext) return;
  const stock = selectedStock();
  if (!stock) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 980;
  const cssH = canvas.clientHeight || 480;
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.clearRect(0, 0, cssW, cssH);
  const pad = { l: 54, r: 18, t: 18, b: 34 };
  const w = cssW - pad.l - pad.r;
  const h = cssH - pad.t - pad.b;

  const data = getChartData(stock);
  if (data.length < 2) return;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const xOf = i => pad.l + (i / (data.length - 1)) * w;
  const yOf = v => pad.t + h - ((v - min) / range) * h;

  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + h);
  const rate = stockRate(stock);
  if (rate >= 0) {
    grad.addColorStop(0, 'rgba(255,107,107,.26)');
    grad.addColorStop(1, 'rgba(255,107,107,0)');
  } else {
    grad.addColorStop(0, 'rgba(91,136,255,.26)');
    grad.addColorStop(1, 'rgba(91,136,255,0)');
  }

  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (h * i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(cssW - pad.r, y);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '12px Pretendard, Noto Sans KR, sans-serif';
  for (let i = 0; i <= 4; i++) {
    const price = max - (range * i / 4);
    const y = pad.t + (h * i / 4) + 4;
    ctx.fillText(Math.round(price).toLocaleString('ko-KR'), 6, y);
  }

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = xOf(i);
    const y = yOf(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = rate >= 0 ? '#ff6b6b' : '#5b88ff';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xOf(0), pad.t + h);
  data.forEach((v, i) => ctx.lineTo(xOf(i), yOf(v)));
  ctx.lineTo(xOf(data.length - 1), pad.t + h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  const hoverIndex = clamp(toInt(state.chartHoverIndex, data.length - 1), 0, data.length - 1);
  const hx = xOf(hoverIndex);
  const hy = yOf(data[hoverIndex]);

  ctx.beginPath();
  ctx.moveTo(hx, pad.t);
  ctx.lineTo(hx, pad.t + h);
  ctx.strokeStyle = 'rgba(255,255,255,.22)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(hx, hy, 5, 0, Math.PI * 2);
  ctx.fillStyle = rate >= 0 ? '#ff6b6b' : '#5b88ff';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fff';
  ctx.stroke();

  if (els.chartTooltip) {
    const price = data[hoverIndex];
    const base = data[0];
    const pct = base > 0 ? ((price - base) / base) * 100 : 0;
    const volHint = Math.round((stock.volume / data.length) * (0.7 + (hoverIndex / data.length)));
    els.chartTooltip.innerHTML = `
      <div class="tt-title">${stock.name}</div>
      <div class="tt-row"><span>가격</span><strong>${formatKRW(price)}</strong></div>
      <div class="tt-row"><span>등락률</span><strong class="${pct >= 0 ? 'up' : 'down'}">${formatSignedPct(pct)}</strong></div>
      <div class="tt-row"><span>거래량 느낌</span><strong>${formatVolume(volHint)}</strong></div>
      <div class="tt-row"><span>인덱스</span><strong>${hoverIndex + 1}/${data.length}</strong></div>
    `;
    const left = clamp(hx + 18, 10, cssW - 220);
    const top = clamp(hy - 80, 10, cssH - 120);
    els.chartTooltip.style.left = `${left}px`;
    els.chartTooltip.style.top = `${top}px`;
    els.chartTooltip.style.opacity = 1;
  }
}

function renderHistory() {
  if (!els.historyList) return;
  const tab = state.historyTab;
  let source = [];
  if (tab === 'orders') source = state.orderHistory;
  if (tab === 'news') source = state.news;
  if (tab === 'alerts') source = state.alerts;

  if (!source.length) {
    els.historyList.innerHTML = `<div class="empty-block">표시할 기록이 없어요.</div>`;
    return;
  }

  els.historyList.innerHTML = source.map(item => {
    if (tab === 'orders') {
      const cls = item.type === 'buy' ? 'buy' : 'sell';
      return `
        <div class="history-item ${cls}">
          <div class="history-head"><span class="history-time">${item.time}</span><span class="pill ${cls}">${item.type === 'buy' ? '매수' : '매도'}</span></div>
          <div class="history-title">${item.stockName} ${formatQty(item.qty)}</div>
          <div class="history-body">${formatKRW(item.price)} / 수수료 ${formatKRW(item.fee)} / ${item.reason || ''}</div>
        </div>
      `;
    }
    const level = item.type || item.level || 'normal';
    return `
      <div class="history-item ${level}">
        <div class="history-head"><span class="history-time">${item.time}</span><span class="pill ${level}">${item.type || item.level || 'event'}</span></div>
        <div class="history-title">${item.title}</div>
        <div class="history-body">${item.message}</div>
      </div>
    `;
  }).join('');
}

function renderAdminThemeOptions() {
  const options = ['all', ...getThemeList()];
  if (els.adminThemeTarget) {
    els.adminThemeTarget.innerHTML = options.map(v => `<option value="${v}">${v === 'all' ? '전체 테마' : v}</option>`).join('');
    els.adminThemeTarget.value = state.adminControl.themeTarget || 'all';
  }
  if (els.adminStockTarget) {
    els.adminStockTarget.innerHTML = state.stocks.map(s => `<option value="${s.code}">${s.name} · ${s.theme}</option>`).join('');
    els.adminStockTarget.value = state.selectedCode;
  }
}

function renderAdminStockControl() {
  if (!state.isAdmin) return;
  const code = els.adminStockTarget?.value || state.selectedCode;
  const c = adminStockControl(code);
  if (els.adminPriceLock) els.adminPriceLock.checked = !!c.priceLock;
  if (els.adminLockedPrice) els.adminLockedPrice.value = c.lockedPrice || '';
  if (els.adminTrend) els.adminTrend.value = c.trend || 'neutral';
  if (els.adminVolScale) els.adminVolScale.value = c.volatilityScale ?? 1;
  if (els.adminVolumeBoost) els.adminVolumeBoost.value = c.volumeBoost ?? 1;
  if (els.adminLimitEvent) els.adminLimitEvent.value = c.limitEvent || 'none';
}

function renderAdminPanel() {
  if (!els.adminPanel) return;
  els.adminPanel.classList.toggle('open', state.isAdmin);
  if (els.adminHighSpeed) els.adminHighSpeed.checked = !!state.settings.adminHighSpeedEnabled;
  if (els.adminInitialCash) els.adminInitialCash.value = state.settings.initialCash;
  if (els.adminSupportAmount) els.adminSupportAmount.value = state.settings.supportFundAmount;
  if (els.adminSupportLimit) els.adminSupportLimit.value = state.settings.supportFundCashLimit;
  if (els.adminFeeRate) els.adminFeeRate.value = state.settings.feeRate;
  if (els.adminGlobalVol) els.adminGlobalVol.value = state.settings.volatilityMultiplier;
  if (els.adminNewsFreq) els.adminNewsFreq.value = state.settings.newsFrequencyMultiplier;
  if (els.adminMarketMode) els.adminMarketMode.value = state.adminControl.marketMode || state.settings.marketPreset || 'normal';
  if (els.adminMarketTrend) els.adminMarketTrend.value = state.adminControl.marketTrend || state.settings.marketTrend || 'neutral';
  if (els.adminThemeBias) els.adminThemeBias.value = state.adminControl.themeBias ?? state.settings.marketThemeBias ?? 0;
  if (els.adminPauseAutoTrading) els.adminPauseAutoTrading.checked = !!state.adminControl.pauseAutoTrading;
  renderAdminThemeOptions();
  renderAdminStockControl();
}

function renderAll() {
  renderTicker();
  renderTopSummary();
  renderSpeedBar();
  renderStockSelect();
  renderHero();
  renderWatchlist();
  renderOrderPanel();
  renderAutoTradeList();
  renderOrderbook();
  renderPortfolio();
  renderChart();
  renderHistory();
  renderAdminPanel();
}

function bindChartEvents() {
  if (!els.chartCanvas) return;
  const canvas = els.chartCanvas;
  addEvent(canvas, 'mousemove', (e) => {
    const stock = selectedStock();
    if (!stock) return;
    const data = getChartData(stock);
    if (data.length < 2) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padL = 54;
    const padR = 18;
    const width = Math.max(1, rect.width - padL - padR);
    const rel = clamp((x - padL) / width, 0, 1);
    state.chartHoverIndex = Math.round(rel * (data.length - 1));
    renderChart();
  });
  addEvent(canvas, 'mouseleave', () => {
    const stock = selectedStock();
    const data = getChartData(stock);
    state.chartHoverIndex = data.length ? data.length - 1 : -1;
    if (els.chartTooltip) els.chartTooltip.style.opacity = 0;
    renderChart();
  });
}

function bindEvents() {
  addEvent(els.emergencyBtn, 'click', claimEmergencyFund);
  addEvent(els.adminBtn, 'click', () => {
    const code = prompt('관리자 코드를 입력하세요');
    if (code === ADMIN_CODE) {
      state.isAdmin = true;
      toast('관리자 모드가 활성화되었어요.', 'success');
      renderAll();
      scheduleTickLoop();
    } else if (code !== null) {
      toast('관리자 코드가 올바르지 않아요.', 'error');
    }
  });
  addEvent(els.resetBaselineBtn, 'click', resetBaseline);
  addEvent(els.resetAllBtn, 'click', clearAllData);

  addEvent(els.stockSelect, 'change', () => {
    state.selectedCode = els.stockSelect.value;
    renderAll();
    queueSave();
  });

  addEvent(els.favoriteToggle, 'click', () => toggleFavorite(state.selectedCode));
  addEvent(els.buyModeBtn, 'click', () => updateOrderMode('buy'));
  addEvent(els.sellModeBtn, 'click', () => updateOrderMode('sell'));

  addEvent(els.orderPrimaryBtn, 'click', () => {
    const stock = selectedStock();
    const qty = Math.max(0, toInt(els.orderQty?.value, 0));
    if (!stock || qty <= 0) {
      toast('수량을 먼저 입력해 주세요.', 'error');
      return;
    }
    if (state.orderMode === 'buy') executeBuy(stock.code, qty, stock.currentPrice, '현재가 매수');
    else executeSell(stock.code, qty, stock.currentPrice, '현재가 매도');
  });

  addEvent(els.autoBuySaveBtn, 'click', () => {
    const stock = selectedStock();
    const targetPrice = Math.max(1, toInt(els.autoBuyPrice?.value, 0));
    const qty = Math.max(0, toInt(els.autoBuyQty?.value, 0));
    const useMax = !!els.autoBuyUseMax?.checked;
    if (!stock || targetPrice <= 0 || (!useMax && qty <= 0)) {
      toast('예약구매 값을 확인해 주세요.', 'error');
      return;
    }
    state.autoBuyOrders.unshift({ code: stock.code, targetPrice, qty, useMax });
    state.autoBuyOrders = state.autoBuyOrders.slice(0, 80);
    renderAutoTradeList();
    queueSave();
    toast('예약구매가 저장되었어요.', 'success');
  });

  addEvent(els.autoSellSaveBtn, 'click', () => {
    const stock = selectedStock();
    const takePrice = Math.max(0, toInt(els.autoSellTakePrice?.value, 0));
    const stopPrice = Math.max(0, toInt(els.autoSellStopPrice?.value, 0));
    const qty = Math.max(0, toInt(els.autoSellQty?.value, 0));
    const useAll = !!els.autoSellUseAll?.checked;
    if (!stock || (!takePrice && !stopPrice) || (!useAll && qty <= 0)) {
      toast('예약판매 값을 확인해 주세요.', 'error');
      return;
    }
    state.autoSellOrders.unshift({ code: stock.code, takePrice, stopPrice, qty, useAll });
    state.autoSellOrders = state.autoSellOrders.slice(0, 80);
    renderAutoTradeList();
    queueSave();
    toast('예약판매가 저장되었어요.', 'success');
  });

  addEvent(els.autoTradeClearBtn, 'click', () => {
    state.autoBuyOrders = [];
    state.autoSellOrders = [];
    renderAutoTradeList();
    queueSave();
    toast('자동매매를 모두 비웠어요.', 'info');
  });

  addEvent(els.searchInput, 'input', () => {
    state.searchTerm = els.searchInput.value || '';
    renderWatchlist();
  });

  addEvent(els.sortSelect, 'change', () => {
    state.sortBy = els.sortSelect.value;
    renderWatchlist();
    queueSave();
  });

  addEvent(els.chartRangeSelect, 'change', () => {
    state.chartRange = els.chartRangeSelect.value;
    const stock = selectedStock();
    const data = getChartData(stock);
    state.chartHoverIndex = data.length ? data.length - 1 : -1;
    renderChart();
    queueSave();
  });

  addEvent(els.pauseBtn, 'click', () => {
    state.isPaused = !state.isPaused;
    els.pauseBtn.textContent = state.isPaused ? '재생' : '일시정지';
    els.pauseBtn.classList.toggle('active', state.isPaused);
  });

  addEvent(els.stopBtn, 'click', () => {
    state.isStopped = !state.isStopped;
    els.stopBtn.textContent = state.isStopped ? '정지 해제' : '전체 정지';
    els.stopBtn.classList.toggle('active', state.isStopped);
  });

  if (els.historyTabs) {
    qa('button[data-tab]', els.historyTabs).forEach(btn => {
      addEvent(btn, 'click', () => {
        state.historyTab = btn.dataset.tab;
        qa('button[data-tab]', els.historyTabs).forEach(x => x.classList.toggle('active', x === btn));
        renderHistory();
        queueSave();
      });
    });
  }

  addEvent(els.adminStockTarget, 'change', renderAdminStockControl);

  addEvent(els.adminSaveSettingsBtn, 'click', () => {
    if (!state.isAdmin) return;
    state.settings.adminHighSpeedEnabled = !!els.adminHighSpeed?.checked;
    state.settings.initialCash = Math.max(10000, toInt(els.adminInitialCash?.value, state.settings.initialCash));
    state.settings.supportFundAmount = Math.max(0, toInt(els.adminSupportAmount?.value, state.settings.supportFundAmount));
    state.settings.supportFundCashLimit = Math.max(0, toInt(els.adminSupportLimit?.value, state.settings.supportFundCashLimit));
    state.settings.feeRate = clamp(toNum(els.adminFeeRate?.value, state.settings.feeRate), 0, 0.1);
    state.settings.volatilityMultiplier = clamp(toNum(els.adminGlobalVol?.value, state.settings.volatilityMultiplier), 0.2, 6);
    state.settings.newsFrequencyMultiplier = clamp(toNum(els.adminNewsFreq?.value, state.settings.newsFrequencyMultiplier), 0.2, 5);
    state.adminControl.marketMode = els.adminMarketMode?.value || 'normal';
    state.adminControl.marketTrend = els.adminMarketTrend?.value || 'neutral';
    state.adminControl.themeTarget = els.adminThemeTarget?.value || 'all';
    state.adminControl.themeBias = clamp(toNum(els.adminThemeBias?.value, 0), -1, 1);
    state.adminControl.pauseAutoTrading = !!els.adminPauseAutoTrading?.checked;
    renderAll();
    scheduleTickLoop();
    queueSave();
    toast('관리자 설정을 저장했어요.', 'success');
  });

  addEvent(els.adminForceResetBaselineBtn, 'click', () => {
    if (!state.isAdmin) return;
    resetBaseline();
  });

  addEvent(els.adminClearAutoBtn, 'click', () => {
    if (!state.isAdmin) return;
    state.autoBuyOrders = [];
    state.autoSellOrders = [];
    renderAutoTradeList();
    queueSave();
    toast('자동매매를 전체 초기화했어요.', 'info');
  });

  addEvent(els.adminResetDataBtn, 'click', () => {
    if (!state.isAdmin) return;
    clearAllData();
  });

  addEvent(els.adminApplyStockCtrlBtn, 'click', () => {
    if (!state.isAdmin) return;
    const code = els.adminStockTarget?.value || state.selectedCode;
    const c = adminStockControl(code);
    c.priceLock = !!els.adminPriceLock?.checked;
    c.lockedPrice = Math.max(0, toInt(els.adminLockedPrice?.value, 0));
    c.trend = els.adminTrend?.value || 'neutral';
    c.volatilityScale = clamp(toNum(els.adminVolScale?.value, 1), 0.1, 6);
    c.volumeBoost = clamp(toNum(els.adminVolumeBoost?.value, 1), 0.2, 20);
    c.limitEvent = els.adminLimitEvent?.value || 'none';
    queueSave();
    toast('종목 제어 설정을 적용했어요.', 'success');
  });

  addEvent(els.adminForceNewsBtn, 'click', () => {
    if (!state.isAdmin) return;
    const code = els.adminStockTarget?.value || state.selectedCode;
    const kind = els.adminNewsKind?.value || 'breaking';
    const stock = state.stocks.find(s => s.code === code);
    if (!stock) return;
    const message = (els.adminNewsMessage?.value || '').trim() || `${stock.name} 관련 강제 뉴스가 발생했어요.`;
    state.adminControl.forcedNewsQueue.push({ code, kind, message });
    state.adminControl.forcedNewsQueue = state.adminControl.forcedNewsQueue.slice(-12);
    queueSave();
    toast('강제 뉴스 예약이 등록되었어요.', 'success');
  });

  bindChartEvents();
}

function ensureInjectedUi() {
  if (!q('.app-shell')) return;

  if (!byId('toastLayer')) {
    const toastLayer = document.createElement('div');
    toastLayer.id = 'toastLayer';
    toastLayer.className = 'toast-layer';
    document.body.appendChild(toastLayer);
  }

  if (!byId('adminModeBadge')) {
    const topActionWrap = q('.header-actions') || q('.topbar-right') || q('.topbar') || document.body;
    const badge = document.createElement('div');
    badge.id = 'adminModeBadge';
    badge.className = 'admin-mode-badge';
    badge.textContent = '일반 모드';
    topActionWrap.appendChild(badge);
  }

  if (!byId('autoBuyBox') && q('.order-side-card')) {
    const target = q('.order-side-card');
    const div = document.createElement('div');
    div.id = 'autoBuyBox';
    div.className = 'trade-sub-card';
    div.innerHTML = `
      <div class="sub-card-title">예약구매</div>
      <div class="sub-grid two">
        <label><span>목표 매수가</span><input id="autoBuyPrice" type="number" min="1" placeholder="예: 50000"></label>
        <label><span>수량</span><input id="autoBuyQty" type="number" min="1" placeholder="예: 10"></label>
      </div>
      <label class="check-line"><input id="autoBuyUseMax" type="checkbox"> 가능한 최대 수량 사용</label>
      <button id="autoBuySaveBtn" class="sub-save-btn buy-style">예약구매 저장</button>
    `;
    target.appendChild(div);
  }

  if (!byId('autoSellBox') && q('.order-side-card')) {
    const target = q('.order-side-card');
    const div = document.createElement('div');
    div.id = 'autoSellBox';
    div.className = 'trade-sub-card';
    div.innerHTML = `
      <div class="sub-card-title">예약판매</div>
      <div class="sub-grid two">
        <label><span>목표가</span><input id="autoSellTakePrice" type="number" min="0" placeholder="예: 65000"></label>
        <label><span>손절가</span><input id="autoSellStopPrice" type="number" min="0" placeholder="예: 48000"></label>
      </div>
      <div class="sub-grid two">
        <label><span>수량</span><input id="autoSellQty" type="number" min="1" placeholder="예: 10"></label>
        <label class="check-line solo"><input id="autoSellUseAll" type="checkbox"> 전량 사용</label>
      </div>
      <button id="autoSellSaveBtn" class="sub-save-btn sell-style">예약판매 저장</button>
    `;
    target.appendChild(div);
  }

  if (!byId('adminPanel')) {
    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.className = 'admin-drawer';
    panel.innerHTML = `
      <div class="admin-drawer-inner">
        <div class="admin-title-row">
          <div>
            <div class="admin-kicker">ADMIN CONTROL</div>
            <h3>관리자 시장 제어 패널</h3>
          </div>
          <button id="adminCloseBtn" class="close-btn">×</button>
        </div>

        <div class="admin-block">
          <div class="admin-block-title">기본 설정</div>
          <div class="admin-grid">
            <label><span>초기 자산</span><input id="adminInitialCash" type="number" min="10000"></label>
            <label><span>긴급지원금 금액</span><input id="adminSupportAmount" type="number" min="0"></label>
            <label><span>긴급지원금 조건(현금 이하)</span><input id="adminSupportLimit" type="number" min="0"></label>
            <label><span>수수료율</span><input id="adminFeeRate" type="number" step="0.0001" min="0" max="0.1"></label>
            <label><span>시장 전체 변동성</span><input id="adminGlobalVol" type="number" step="0.1" min="0.2" max="6"></label>
            <label><span>뉴스 발생 빈도</span><input id="adminNewsFreq" type="number" step="0.1" min="0.2" max="5"></label>
          </div>
          <label class="check-line"><input id="adminHighSpeed" type="checkbox"> 100x / 200x / 300x 속도 활성화</label>
          <label class="check-line"><input id="adminPauseAutoTrading" type="checkbox"> 자동매매 전체 정지</label>
        </div>

        <div class="admin-block">
          <div class="admin-block-title">시장 전체 모드</div>
          <div class="admin-grid">
            <label><span>시장 모드</span>
              <select id="adminMarketMode">
                <option value="normal">보통장</option>
                <option value="calm">안정장</option>
                <option value="mania">폭등장</option>
                <option value="crash">폭락장</option>
              </select>
            </label>
            <label><span>시장 방향</span>
              <select id="adminMarketTrend">
                <option value="neutral">중립</option>
                <option value="up">우상향 유도</option>
                <option value="down">우하향 유도</option>
              </select>
            </label>
            <label><span>테마 타겟</span><select id="adminThemeTarget"></select></label>
            <label><span>테마 강세/약세</span><input id="adminThemeBias" type="number" step="0.1" min="-1" max="1"></label>
          </div>
        </div>

        <div class="admin-block">
          <div class="admin-block-title">종목 개별 제어</div>
          <div class="admin-grid">
            <label><span>대상 종목</span><select id="adminStockTarget"></select></label>
            <label><span>고정 가격</span><input id="adminLockedPrice" type="number" min="0"></label>
            <label><span>개별 추세</span>
              <select id="adminTrend">
                <option value="neutral">중립</option>
                <option value="up">우상향</option>
                <option value="down">우하향</option>
              </select>
            </label>
            <label><span>변동성 배율</span><input id="adminVolScale" type="number" step="0.1" min="0.1" max="6"></label>
            <label><span>거래량 배수</span><input id="adminVolumeBoost" type="number" step="0.1" min="0.2" max="20"></label>
            <label><span>상/하한 이벤트</span>
              <select id="adminLimitEvent">
                <option value="none">없음</option>
                <option value="up">상한가 강제</option>
                <option value="down">하한가 강제</option>
              </select>
            </label>
          </div>
          <label class="check-line"><input id="adminPriceLock" type="checkbox"> 특정 종목 가격 고정</label>
          <button id="adminApplyStockCtrlBtn" class="admin-apply-btn">종목 제어 적용</button>
        </div>

        <div class="admin-block">
          <div class="admin-block-title">강제 뉴스</div>
          <div class="admin-grid">
            <label><span>뉴스 종류</span>
              <select id="adminNewsKind">
                <option value="good">호재</option>
                <option value="bad">악재</option>
                <option value="breaking">속보</option>
              </select>
            </label>
            <label class="grow"><span>뉴스 문구</span><input id="adminNewsMessage" type="text" placeholder="예: 대규모 수주 기대감 부각"></label>
          </div>
          <button id="adminForceNewsBtn" class="admin-apply-btn">강제 뉴스 발생</button>
        </div>

        <div class="admin-bottom-actions">
          <button id="adminSaveSettingsBtn" class="admin-main-btn">관리자 설정 저장</button>
          <button id="adminForceResetBaselineBtn" class="admin-sub-btn">수익률 기준 리셋 강제 실행</button>
          <button id="adminClearAutoBtn" class="admin-sub-btn">자동매매 전체 초기화</button>
          <button id="adminResetDataBtn" class="admin-danger-btn">전체 데이터 초기화</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
  }

  if (!byId('adminOpenBtn')) {
    const target = q('.header-actions') || q('.topbar-right') || q('.topbar') || document.body;
    const btn = document.createElement('button');
    btn.id = 'adminOpenBtn';
    btn.className = 'top-action-btn control-btn';
    btn.textContent = '관리자 패널';
    target.appendChild(btn);
    addEvent(btn, 'click', () => {
      if (!state.isAdmin) {
        toast('먼저 관리자 모드를 활성화해 주세요.', 'error');
        return;
      }
      const panel = byId('adminPanel');
      if (panel) panel.classList.add('open');
    });
  }
}

function bindAdminDrawerStatic() {
  addEvent(byId('adminCloseBtn'), 'click', () => {
    byId('adminPanel')?.classList.remove('open');
  });
}

function initDomDefaults() {
  if (els.sortSelect) els.sortSelect.value = state.sortBy;
  if (els.chartRangeSelect) els.chartRangeSelect.value = state.chartRange;
  if (els.searchInput) els.searchInput.value = state.searchTerm || '';
  qa('button[data-tab]', els.historyTabs || document).forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === state.historyTab);
  });
  const stock = selectedStock();
  const data = getChartData(stock);
  state.chartHoverIndex = data.length ? data.length - 1 : -1;
}

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
    return;
  }
  loadState();
  ensureInjectedUi();
  ensureDomRefs();
  bindAdminDrawerStatic();
  initDomDefaults();
  bindEvents();
  renderAll();
  scheduleTickLoop();
}

init();
