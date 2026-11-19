const $ = (id) => document.getElementById(id);
const terms = '春分 清明 穀雨 立夏 小滿 芒種 夏至 小暑 大暑 立秋 處暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至 小寒 大寒 立春 雨水 驚蟄'.split(' ');

const produce = {
  cabbage: ['高麗菜', '蔬菜', 'LA1', '高麗菜', '適合清炒或煮湯。'],
  tomato: ['小番茄', '水果', '72', '小番茄', '適合鮮食，也可以做成沙拉。'],
  strawberry: ['草莓', '水果', '45', '草莓', '冬春常見，購買前可先確認採收與配送日。'],
  guava: ['芭樂', '水果', 'P1', '芭樂', '台灣全年可見，想吃脆口可找珍珠芭樂。'],
  orange: ['柳丁', '水果', 'E1', '柳丁', '秋末至冬季常見，可鮮食或榨汁。'],
  pineapple: ['鳳梨', '水果', 'B2', '鳳梨', '春夏可留意金鑽鳳梨。'],
  cucumber: ['小黃瓜', '蔬菜', 'FD1', '小黃瓜', '適合涼拌，挑選時可留意果身是否緊實。'],
  luffa: ['絲瓜', '蔬菜', 'FF1', '絲瓜', '暖季常見，適合清炒或煮湯。'],
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
  ['cabbage','orange','guava'], ['cabbage','tomato','orange'],
];

function solarTerm(date) {
  const days = date.getTime() / 86400000 - 10957.5;
  const anomaly = (357.529 + 0.98560028 * days) * Math.PI / 180;
  const longitude = 280.459 + 0.98564736 * days + 1.915 * Math.sin(anomaly) + 0.020 * Math.sin(2 * anomaly);
  return terms[Math.floor(((longitude % 360 + 360) % 360) / 15)];
}

const now = new Date();
const month = Number(new Intl.DateTimeFormat('en', {timeZone:'Asia/Taipei',month:'numeric'}).format(now));
$('term').textContent = solarTerm(now);
const selected = monthly[month - 1].map((key) => produce[key]);
const priceElements = new Map();
const number = new Intl.NumberFormat('zh-TW', {maximumFractionDigits:1});
let farms = [];

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

const match = (value, query) => value.toLocaleLowerCase('zh-TW').includes(query.toLocaleLowerCase('zh-TW'));

for (const [name, category, code, query, note] of selected) {
  const card = element('article', '', 'card pick');
  const price = element('p', '讀取行情中', 'price');
  priceElements.set(code, price);
  const button = element('button', '查找' + name + '店家');
  button.type = 'button';
  button.addEventListener('click', () => {
    $('search').value = query;
    $('category').value = '';
    $('county').value = '';
    renderFarms();
    $('search').focus();
  });
  card.append(element('span', category, 'tag'), element('h3', name), element('p', note), price, button);
  $('picks').append(card);
}

function renderFarms() {
  const query = $('search').value.trim();
  const category = $('category').value;
  const county = $('county').value;
  const results = farms.filter((farm) =>
    (!category || farm.categories.includes(category)) &&
    (!county || farm['產地縣市'] === county) &&
    match([farm['品牌名稱'], farm['販售品項'], farm['產地縣市'], farm['備註']].join(' '), query));
  $('count').textContent = results.length ? '找到 ' + results.length + ' 筆' : '找不到符合的店家，可以換個品項或清除篩選。';
  $('farms').replaceChildren(...results.map((farm) => {
    const card = element('article', '', 'card');
    card.append(element('h3', farm['品牌名稱']));
    for (const tag of [farm['產地縣市'], ...farm.categories].filter(Boolean)) card.append(element('span', tag, 'tag'));
    if (farm['販售品項']) card.append(element('p', farm['販售品項']));
    if (farm['備註']) card.append(element('p', farm['備註'], 'meta'));
    if (farm['購買管道']) card.append(element('p', '購買管道：' + farm['購買管道'], 'meta'));
    const links = element('div', '', 'links');
    const purchase = safeLink('前往購買管道', farm['傳送門']);
    const profile = safeLink('Threads 帳號', farm['@帳號']);
    if (purchase) links.append(purchase);
    else if (farm['傳送門']) links.append(element('span', farm['傳送門'], 'meta'));
    if (profile && profile.href !== purchase?.href) links.append(profile);
    if (links.childNodes.length) card.append(links);
    return card;
  }));
}

$('filters').addEventListener('submit', (event) => event.preventDefault());
$('search').addEventListener('input', renderFarms);
$('category').addEventListener('change', renderFarms);
$('county').addEventListener('change', renderFarms);

async function loadFarms() {
  try {
    const response = await fetch('farms.json');
    if (!response.ok) throw new Error('名錄讀取失敗');
    farms = (await response.json()).map((farm) => ({
      ...farm, categories: JSON.parse(farm['販售類別'] || '[]'),
    }));
    const options = {
      category: farms.flatMap((farm) => farm.categories),
      county: farms.map((farm) => farm['產地縣市']),
    };
    for (const [id, values] of Object.entries(options)) {
      for (const value of [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b, 'zh-TW'))) {
        $(id).append(new Option(value, value));
      }
    }
    renderFarms();
  } catch {
    $('count').textContent = '暫時無法讀取名錄，請稍後重新整理。';
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

loadFarms();
loadPrices();
