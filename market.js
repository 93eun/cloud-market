const $ = (id) => document.getElementById(id);
const terms = '春分 清明 穀雨 立夏 小滿 芒種 夏至 小暑 大暑 立秋 處暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至 小寒 大寒 立春 雨水 驚蟄'.split(' ');

const produce = {
  cabbage: ['高麗菜', '蔬菜', 'LA1', '高麗菜', '適合清炒或煮湯。'],
  tomato: ['小番茄', '水果', '72', '小番茄', '適合鮮食，也可以做成沙拉。'],
  strawberry: ['草莓', '水果', '45', '草莓', '冬春常見，購買前可先確認採收與配送日。'],
  guava: ['芭樂', '水果', 'P1', '芭樂', '台灣全年可見，想吃脆口可找珍珠芭樂。'],
  ponkan: ['椪柑', '水果', 'C1', '椪柑', '秋冬常見，果皮帶綠也可能已成熟。'],
  orange: ['柳丁', '水果', 'E1', '柳丁', '秋末至冬季常見，可鮮食或榨汁。'],
  pineapple: ['鳳梨', '水果', 'B2', '鳳梨', '春夏可留意金鑽鳳梨。'],
  cucumber: ['小黃瓜', '蔬菜', 'FD1', '小黃瓜', '適合涼拌，挑選時可留意果身是否緊實。'],
  luffa: ['絲瓜', '蔬菜', 'FF1', '絲瓜', '暖季常見，適合清炒或煮湯。'],
  sweetpotato: ['地瓜', '蔬菜', 'SO1', '地瓜', '想簡單煮晚餐，可以蒸熟當主食。'],
  pumpkin: ['南瓜', '蔬菜', 'FT2', '南瓜', '適合蒸煮，切開後可分裝料理。'],
  watermelon: ['西瓜', '水果', 'T5', '西瓜', '夏季水果，購買前可確認品種與大小。'],
  pomelo: ['文旦', '水果', 'H1', '文旦', '初秋可留意文旦，依產地確認採收時間。'],
  mango: ['芒果', '水果', 'R3', '芒果', '夏季可留意愛文等品種，各產地到貨時間不同。'],
};
const monthly = [
  ['cabbage','strawberry','orange'], ['cabbage','strawberry','tomato'],
  ['cabbage','strawberry','pineapple'], ['cucumber','pineapple','guava'],
  ['cucumber','pineapple','watermelon'], ['luffa','watermelon','mango'],
  ['luffa','watermelon','mango'], ['luffa','mango','guava'],
  ['pumpkin','pomelo','guava'], ['pumpkin','guava','orange'],
  ['cabbage','sweetpotato','orange','ponkan'], ['cabbage','tomato','orange'],
];

function solarTerm(date) {
  const days = date.getTime() / 86400000 - 10957.5;
  const anomaly = (357.529 + 0.98560028 * days) * Math.PI / 180;
  const longitude = 280.459 + 0.98564736 * days + 1.915 * Math.sin(anomaly) + 0.020 * Math.sin(2 * anomaly);
  return terms[Math.floor(((longitude % 360 + 360) % 360) / 15)];
}

const now = new Date();
const month = Number(new Intl.DateTimeFormat('en', {timeZone:'Asia/Taipei',month:'numeric'}).format(now));
if ($('term')) $('term').textContent = solarTerm(now);
const taipeiDay = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(now);
const weeklyIsCurrent = taipeiDay >= '2026-11-19' && taipeiDay <= '2026-11-22';
if ($('weekly-status') && !weeklyIsCurrent) {
  $('weekly-status').textContent = '歷史週報｜2026 年 11 月 19 日至 22 日。近期價格請查看蔬果批發行情。';
}
const selected = monthly[month - 1].map((key) => produce[key]);
const priceElements = new Map();
const number = new Intl.NumberFormat('zh-TW', {maximumFractionDigits:1});
const pageSize = 9;
const browseGroups = new Map([
  ['珍珠芭樂', '芭樂'],
  ['履歷生菜', '生菜'],
  ['歐式生菜', '生菜'],
  ['生菜萵苣', '生菜'],
  ['高山櫛瓜', '櫛瓜'],
  ['高山有機櫛瓜', '櫛瓜'],
  ['韓國櫛瓜', '櫛瓜'],
  ['溫室小黃瓜', '小黃瓜'],
  ['溫室葡萄', '葡萄'],
  ['麻豆文旦', '文旦'],
]);
const channelLabels = new Map([
  ['官方line', '前往 LINE 詢購'],
  ['私訊訂購', '私訊店家'],
  ['官方網站', '前往店家網站'],
  ['FB社團', '前往 Facebook 社團'],
  ['賣貨便', '到賣貨便選購'],
  ['google表單', '開啟訂購表單'],
  ['全家', '前往全家賣場'],
  ['蝦皮', '前往蝦皮賣場'],
  ['momo', '前往 momo 賣場'],
]);
let visibleCount = pageSize;
let farms = [];
let directoryReady = false;

function element(tag, value, className) {
  const item = document.createElement(tag);
  item.textContent = value;
  if (className) item.className = className;
  return item;
}

function safeLink(label, value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const link = element('a', label);
    link.href = url.href;
    return link;
  } catch {
    return null;
  }
}

const aliases = [
  [/番石榴|拔仔|芭辣/g, '芭樂'],
  [/蕃茄|西紅柿/g, '番茄'],
  [/番薯|甘藷|甘薯|紅薯/g, '地瓜'],
  [/包心菜|捲心菜|^甘藍$/g, '高麗菜'],
  [/柳橙|甜橙/g, '柳丁'],
  [/紅龍果/g, '火龍果'],
  [/筊白筍|茭白筍?/g, '茭白筍'],
  [/文旦柚/g, '文旦'],
  [/芭乐/g, '芭樂'],
];

function searchKey(value) {
  const normalized = value.normalize('NFKC').toLocaleLowerCase('zh-TW').replace(/[\s\p{P}]+/gu, '');
  return aliases.reduce((key, [pattern, replacement]) => key.replace(pattern, replacement), normalized);
}

function productButton(name) {
  const button = element('button', name);
  button.type = 'button';
  button.dataset.product = name;
  return button;
}

function itemsForQuery(farm, query) {
  return farm.items.filter(({key}) => query && key.includes(query) &&
    !(query === '西瓜' && key.includes('西瓜李')));
}

function showSeasonalPicks() {
  const home = $('home-picks');
  const target = home || $('picks');
  if (!target) return;
  for (const [name, category, , query, note] of selected) {
    const shopCount = farms.filter((farm) => itemsForQuery(farm, searchKey(query)).length).length;
    if (home && !shopCount) continue;
    if (home) {
      const link = element('a', '');
      link.href = 'farms.html?q=' + encodeURIComponent(query);
      link.append(element('strong', name), element('span', shopCount + ' 家有列出此品項', 'meta'));
      target.append(link);
      continue;
    }
    const card = element('article', '', 'card pick');
    card.append(element('span', category, 'tag'), element('h3', name), element('p', note));
    if (shopCount) {
      const link = element('a', '找' + name + '店家', 'pick-link');
      link.href = 'farms.html?q=' + encodeURIComponent(query);
      card.append(link);
    } else {
      card.append(element('p', '名錄暫無販售店家', 'meta'));
    }
    target.append(card);
  }
}

if ($('home-weekly') && !weeklyIsCurrent) {
  $('home-weekly').textContent = '水果週報存檔 11/19–11/22 · Threads @abc89151207';
}

function showPriceCards() {
  const priceItems = new Map(selected.map(([name, , code]) => [code, name]));
  if (weeklyIsCurrent) {
    for (const [code, name] of [['E1', '柳橙'], ['C1', '椪柑'], ['W1', '網紋紅肉洋香瓜'], ['W2', '網紋綠肉洋香瓜']]) {
      priceItems.set(code, name);
    }
  }
  for (const [code, name] of priceItems) {
    const card = element('article', '', 'card');
    const price = element('p', '讀取行情中', 'price');
    priceElements.set(code, price);
    card.append(element('h3', name), price);
    $('quotes').append(card);
  }
}

function renderFarms() {
  const query = searchKey($('search').value);
  const category = $('category')?.value;
  const homeResults = $('search-results');
  if (homeResults) {
    homeResults.hidden = !query;
    $('shop-ideas').hidden = Boolean(query);
  }
  if (!directoryReady || (homeResults && !query)) return;
  const results = farms.flatMap((farm) => {
    if (category && !farm.categories.includes(category)) return [];
    const items = itemsForQuery(farm, query);
    const brandMatch = farm.brandKey.includes(query);
    const categoryMatch = farm.categories.some((value) => searchKey(value) === query);
    if (query && !items.length && !brandMatch && !categoryMatch) return [];
    const rank = items.some(({key}) => key === query) || farm.brandKey === query ? 0 : items.length ? 1 : 2;
    return [{farm, items, rank}];
  });
  if (query) results.sort((a, b) => a.rank - b.rank);
  $('count').textContent = results.length ? '找到 ' + results.length + ' 家店家' :
    '名錄目前沒有符合的店家。可換個名稱，或清除篩選重找。';
  $('no-results').hidden = Boolean(results.length);
  $('more').hidden = results.length <= visibleCount;
  $('farms').replaceChildren(...results.slice(0, visibleCount).map(({farm, items}) => {
    const card = element('article', '', 'card farm-card');
    card.append(element('h3', farm['品牌名稱']));
    const tags = element('div', '');
    for (const tag of [farm['產地縣市'], ...farm.categories].filter(Boolean)) {
      tags.append(element('span', tag, 'tag'));
    }
    if (tags.childNodes.length) card.append(tags);
    if (items.length) {
      card.append(element('p', items.map(({name}) => name).join('、'), 'matched-products'));
    }
    const otherItems = farm.items.filter((item) => !items.includes(item));
    if (otherItems.length) {
      card.append(element('p', (items.length ? '也販售 ' : '') + otherItems.map(({name}) => name).join('、')));
    }
    if (farm['備註']) card.append(element('p', farm['備註'], 'meta'));
    const links = element('div', '', 'links');
    const purchase = safeLink(channelLabels.get(farm['購買管道']) || '前往購買管道', farm['傳送門']);
    const profile = safeLink(purchase ? 'Threads 帳號' : '前往店家 Threads', farm['@帳號']);
    if (purchase) {
      purchase.className = 'purchase';
      links.append(purchase);
    }
    if (profile && profile.href !== purchase?.href) {
      if (!purchase) profile.className = 'purchase';
      links.append(profile);
    }
    if (links.childNodes.length) card.append(links);
    return card;
  }));
}

function resetResults() {
  visibleCount = pageSize;
  renderFarms();
}

async function loadFarms() {
  try {
    const response = await fetch('farms.json');
    if (!response.ok) throw new Error('名錄讀取失敗');
    farms = (await response.json()).map((farm) => {
      const items = new Map();
      for (const name of (farm['販售品項'] || '').split(/[｜|、]/).map((name) => name.trim()).filter(Boolean)) {
        const key = searchKey(name);
        if (!items.has(key)) items.set(key, {name, key});
      }
      return {
        ...farm,
        categories: JSON.parse(farm['販售類別'] || '[]'),
        brandKey: searchKey(farm['品牌名稱']),
        items: [...items.values()],
      };
    });
    const select = $('category');
    if (select) {
      const categories = [...new Set(farms.flatMap((farm) => farm.categories))];
      for (const category of categories.sort((a, b) => a.localeCompare(b, 'zh-TW'))) {
        select.append(new Option(category, category));
      }
      const requested = new URLSearchParams(location.search).get('category');
      if (categories.includes(requested)) select.value = requested;
    }
    const list = $('product-list');
    if (list) {
      const labels = new Map();
      for (const {name, key} of farms.flatMap((farm) => farm.items)) {
        const group = browseGroups.get(key) || key;
        if (!labels.has(group)) labels.set(group, name);
        if (group !== key || labels.get(group) !== name) labels.set(group, group);
      }
      list.append(...[...labels.values()].sort((a, b) => a.localeCompare(b, 'zh-TW')).map(productButton));
    }
    directoryReady = true;
    if ($('filters')) renderFarms();
    showSeasonalPicks();
  } catch {
    if ($('count')) $('count').textContent = '暫時無法讀取名錄，請稍後重新整理。';
    if ($('picks')) $('picks').textContent = '暫時無法查詢當季品項的販售店家。';
  }
}

function marketDate(value) {
  const [year, month, day] = value.split('.').map(Number);
  return [year + 1911, month, day].join('/');
}

async function loadPrices() {
  try {
    const response = await fetch('https://data.moa.gov.tw/api/v1/AgriProductsTransType/', {signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('行情讀取失敗');
    const {Data: records} = await response.json();
    if (!Array.isArray(records) || !records.length) throw new Error('無交易資料');
    for (const [code, price] of priceElements) {
      const quote = records.find((record) => record.CropCode === code && record.MarketCode === '104' &&
        Number(record.Avg_Price) > 0 && Number(record.Trans_Quantity) > 0 &&
        /^\d{3}\.\d{1,2}\.\d{1,2}$/.test(record.TransDate));
      if (!quote) {
        price.textContent = '目前未取得此品項行情';
        continue;
      }
      price.textContent = 'NT$ ' + number.format(quote.Avg_Price) + '／公斤';
      price.after(element('p', quote.CropName + ' · ' + marketDate(quote.TransDate), 'meta'));
    }
    $('quote-status').textContent = '';
  } catch {
    for (const price of priceElements.values()) price.textContent = '行情暫時無法載入';
    $('quote-status').textContent = '可透過下方的農業部連結查詢。';
  }
}

if ($('filters')) {
  const search = $('search');
  const category = $('category');
  const resultHeading = $('results-heading') || $('count');
  const focusResults = () => {
    if (!searchKey(search.value)) return;
    resultHeading.tabIndex = -1;
    resultHeading.focus();
  };
  search.value = new URLSearchParams(location.search).get('q') || '';
  $('filters').addEventListener('submit', (event) => {
    event.preventDefault();
    resetResults();
    focusResults();
  });
  search.addEventListener('input', resetResults);
  category?.addEventListener('change', resetResults);
  $('clear').addEventListener('click', () => {
    search.value = '';
    if (category) category.value = '';
    resetResults();
    search.focus();
  });
  function chooseProduct(event) {
    const name = event.target.closest('button[data-product]')?.dataset.product;
    if (!name) return;
    search.value = name;
    if (category) category.value = '';
    event.currentTarget.closest('details')?.removeAttribute('open');
    resetResults();
    focusResults();
  }
  $('product-list')?.addEventListener('click', chooseProduct);
  $('more').addEventListener('click', () => {
    const firstNewCard = visibleCount;
    visibleCount += pageSize;
    renderFarms();
    const heading = $('farms').children[firstNewCard]?.querySelector('h3');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  });
  resetResults();
}
if ($('filters') || $('picks')) loadFarms();
if ($('quotes')) {
  showPriceCards();
  loadPrices();
}

async function loadPublishTime() {
  const display = $('published-at');
  if (!display) return;
  try {
    const response = await fetch('index.html', {method: 'HEAD', cache: 'no-cache', signal: AbortSignal.timeout(8000)});
    const modified = response.headers.get('Last-Modified');
    const time = new Date(modified || '');
    if (!response.ok || Number.isNaN(time.getTime())) throw new Error('無發布時間');
    display.dateTime = time.toISOString();
    display.textContent = new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).format(time) + '（台灣時間）';
  } catch {
    display.textContent = '暫時無法查詢';
  }
}

loadPublishTime();
