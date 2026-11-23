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
const selected = monthly[month - 1].map((key) => produce[key]);
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
const categoryColors = new Map([
  ['水果', 'orange'], ['蔬菜', 'green'], ['海鮮', 'red'], ['肉品', 'rose'],
  ['食用花卉/天然調味', 'pink'], ['懶人料理包', 'blue'], ['蛋奶類', 'neutral'],
  ['米麵雜糧', 'gray'], ['天然清潔用品', 'brown'], ['官方平台', 'yellow'],
]);
const channels = new Map([
  ['官方line', {name: 'LINE 訂購', action: '前往 LINE 詢購', color: 'neutral'}],
  ['私訊訂購', {name: '私訊訂購', action: '私訊店家', color: 'orange'}],
  ['官方網站', {name: '官方網站', action: '前往店家網站', color: 'red'}],
  ['FB社團', {name: 'Facebook 社團', action: '前往 Facebook 社團', color: 'green'}],
  ['賣貨便', {name: '賣貨便', action: '到賣貨便選購', color: 'brown'}],
  ['google表單', {name: 'Google 表單', action: '開啟訂購表單', color: 'yellow'}],
  ['全家', {name: '全家賣場', action: '前往全家賣場', color: 'pink'}],
  ['蝦皮', {name: '蝦皮賣場', action: '前往蝦皮賣場', color: 'gray'}],
  ['momo', {name: 'momo 賣場', action: '前往 momo 賣場', color: 'blue'}],
]);
const threadsChannel = {name: 'Threads 聯絡', color: 'gray'};
const otherChannel = {name: '其他購買方式', color: 'neutral'};
const byStroke = new Intl.Collator('zh-Hant-TW', {collation: 'stroke'});
let visibleCount = pageSize;
let farms = [];
let directoryReady = false;

function element(tag, value, className) {
  const item = document.createElement(tag);
  item.textContent = value;
  if (className) item.className = className;
  return item;
}

function sentenceLines(value) {
  return value.replace(/。([」』”’）》】]*)[ \t]*(?=[^\s」』”’）》】])/g, '。$1\n');
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
  const lists = {'蔬菜': $('vegetable-picks'), '水果': $('fruit-picks')};
  if (!home && !$('picks')) return;
  for (const [name, category, , query, note] of selected) {
    const key = searchKey(query);
    const shopCount = farms.filter((farm) => itemsForQuery(farm, key).length).length;
    if (home) {
      if (!shopCount) continue;
      const link = element('a', '');
      link.href = 'farms.html?q=' + encodeURIComponent(query) + '&from=home-picks';
      link.append(element('strong', name), element('span', shopCount + ' 家', 'meta'));
      home.append(link);
      continue;
    }
    const card = element('li', '', 'card pick');
    card.append(element('h4', name), element('p', sentenceLines(note), 'sentence-lines'));
    if (shopCount) {
      const link = element('a', '找' + name + '店家', 'pick-link');
      link.href = 'farms.html?q=' + encodeURIComponent(query) + '&from=season';
      card.append(link);
    } else {
      card.append(element('p', '名錄暫無販售店家', 'meta'));
    }
    lists[category].append(card);
  }
}

const reportSections = [
  {key: 'vegetables', label: '蔬菜', period: 'vegetable-period', content: 'vegetable-weekly-content', origin: 'vegetable-weekly', anchor: 'vegetable-weekly'},
  {key: 'fruits', label: '水果', period: 'fruit-period', content: 'fruit-weekly-content', origin: 'fruit-weekly', anchor: 'weekly'},
];
const reportGroups = [
  ['priority', '優先看'],
  ['steady', '價格較穩'],
  ['compare', '先比價'],
];

function reportPeriod(report) {
  const shortDate = (date) => date.slice(5).split('-').map(Number).join('/');
  return shortDate(report.start) + '–' + shortDate(report.end);
}

function renderWeeklyReport(section, report) {
  const period = reportPeriod(report);
  const homeLabel = $('home-' + section.period);
  if (homeLabel) {
    homeLabel.textContent = section.label + ' ' + period + (taipeiDay > report.end ? '（已過期）' : '');
  }
  const content = $(section.content);
  if (!content) return;
  $(section.period).textContent = period;
  const expired = taipeiDay > report.end;
  const status = expired ? '本期週報已過期。點有底色的品項找店家。' : '市場預測。點有底色的品項找店家。';
  const rows = element('dl', '', 'weekly-rows');
  for (const [key, label] of reportGroups) {
    const group = report.groups[key];
    const row = element('div', '');
    const choices = element('dd', '');
    group.items.forEach((item, index) => {
      if (index) choices.append(document.createTextNode('、'));
      if (item.farmQuery) {
        const link = element('a', item.name, 'produce-link');
        link.href = 'farms.html?' + new URLSearchParams({q: item.farmQuery, from: section.origin});
        choices.append(link);
      } else {
        choices.append(element('span', item.name));
      }
      if (item.note) choices.append(element('span', '（' + item.note + '）', 'meta'));
    });
    if (group.note) choices.append(element('span', '（' + group.note + '）', 'meta'));
    row.append(element('dt', label), choices);
    rows.append(row);
  }
  const source = element('p', '來源 ', 'meta');
  const attribution = safeLink('Threads ' + report.source.account + '〈' + report.source.title + '〉', report.source.url);
  if (attribution) source.append(attribution);
  content.replaceChildren(element('p', sentenceLines(status), 'meta sentence-lines'), rows, source);
  if (report.fullText) {
    const full = element('details', '', 'full-weekly');
    full.append(
      element('summary', '展開完整' + section.label + '週報'),
      element('div', sentenceLines(report.fullText), 'weekly-original')
    );
    content.append(full);
  }
}

function showPriceCards(reports) {
  const cards = [];
  for (const section of reportSections) {
    const report = reports[section.key];
    const wrapper = element('section', '', 'price-section');
    const suffix = taipeiDay > report.end ? '（週報已過期）' : '';
    wrapper.append(element('h2', section.label + ' ' + reportPeriod(report) + suffix));
    const grid = element('div', '', 'grid');
    const foods = new Map();
    for (const [key, label] of reportGroups.slice(0, 2)) {
      for (const item of report.groups[key].items) {
        if (!foods.has(item.name)) foods.set(item.name, {item, label});
      }
    }
    for (const {item, label} of foods.values()) {
      const card = element('article', '', 'card');
      const quote = element('div', '讀取行情中', 'price-quotes');
      card.append(element('span', label, 'tag'), element('h3', item.name), quote);
      cards.push({item, quote});
      grid.append(card);
    }
    wrapper.append(grid);
    $('quotes').append(wrapper);
  }
  return cards;
}

async function loadWeeklyReports() {
  try {
    const response = await fetch('weekly-reports.json', {cache: 'no-cache'});
    if (!response.ok) throw new Error('週報讀取失敗');
    const reports = await response.json();
    for (const section of reportSections) renderWeeklyReport(section, reports[section.key]);
    if ($('home-weekly')) {
      $('home-weekly').hidden = !reportSections.every(({key}) => taipeiDay > reports[key].end);
    }
    if ($('quotes')) loadPrices(showPriceCards(reports));
  } catch {
    if ($('quote-status')) $('quote-status').textContent = '暫時無法載入週報推薦品項。';
    for (const {content} of reportSections) {
      if ($(content)) $(content).textContent = '暫時無法載入週報。';
    }
  }
}

function browseLabels(items) {
  const labels = new Map();
  for (const {name, key} of items) {
    const group = browseGroups.get(key) || key;
    if (!labels.has(group)) labels.set(group, name);
    if (group !== key || labels.get(group) !== name) labels.set(group, group);
  }
  return [...labels.values()].sort((a, b) => a.localeCompare(b, 'zh-TW'));
}

function renderSuggestions(query, category) {
  const suggestions = $('product-suggestions');
  if (!suggestions) return;
  const products = browseLabels(farms
    .filter((farm) => !category || farm.categories.includes(category))
    .flatMap((farm) => query ? itemsForQuery(farm, query) : farm.items));
  const common = ['高麗菜', '小黃瓜', '地瓜', '芭樂', '柳丁', '草莓'];
  const matches = query ? products.filter((name) => searchKey(name) !== query) : common.filter((name) => products.includes(name));
  const shown = (query || !category ? matches : [...new Set([...matches, ...products])]).slice(0, 6);
  $('suggestion-label').textContent = query ? '相符品項' : category ? '此類別的品項' : '常見品項';
  $('suggestion-list').replaceChildren(...shown.map(productButton));
  suggestions.hidden = shown.length === 0;
}

function renderFarms() {
  const query = searchKey($('search').value);
  const select = $('category');
  const category = select?.value;
  if (select) select.className = category ? 'tone-' + (categoryColors.get(category) || 'neutral') : '';
  const homeResults = $('search-results');
  if (homeResults) {
    homeResults.hidden = !query;
    $('shop-ideas').hidden = Boolean(query);
    if ($('home-cheapest')) $('home-cheapest').hidden = Boolean(query);
  }
  if (!directoryReady || (homeResults && !query)) return;
  renderSuggestions(query, category);
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
    sentenceLines('名錄目前沒有符合的店家。可換個名稱，或清除篩選重找。');
  $('no-results').hidden = Boolean(results.length);
  const listing = $('farms');
  const channelLinks = $('channel-links');
  const grouped = Boolean(category && channelLinks);
  $('more').hidden = grouped || results.length <= visibleCount;
  if (channelLinks) {
    channelLinks.hidden = !grouped || !results.length;
    channelLinks.replaceChildren();
  }
  if (!grouped) {
    listing.replaceChildren(...results.slice(0, visibleCount).map(farmCard));
    return;
  }

  const groups = new Map();
  for (const result of results) {
    const farm = result.farm;
    const channel = farm['傳送門'] ? channels.get(farm['購買管道']) || otherChannel :
      farm['@帳號'] ? threadsChannel : otherChannel;
    if (!groups.has(channel)) groups.set(channel, []);
    groups.get(channel).push(result);
  }
  const sections = [];
  const sortedGroups = [...groups].sort(([a], [b]) => byStroke.compare(a.name, b.name));
  for (const [channel, entries] of sortedGroups) {
    entries.sort((a, b) => byStroke.compare(a.farm['品牌名稱'], b.farm['品牌名稱']));
    const id = 'purchase-group-' + (sections.length + 1);
    const jump = element('a', channel.name, 'channel-label tone-' + channel.color);
    jump.href = '#' + id;
    channelLinks.append(jump);
    const section = element('section', '', 'purchase-group');
    section.setAttribute('aria-labelledby', id);
    const heading = element('h2', channel.name, 'channel-label tone-' + channel.color);
    heading.id = id;
    const cards = element('div', '', 'grid farm-grid');
    cards.append(...entries.map(farmCard));
    section.append(heading, cards);
    sections.push(section);
  }
  listing.replaceChildren(...sections);
}

function farmCard({farm, items}) {
  const card = element('article', '', 'card farm-card');
  card.append(
    element('h3', farm['品牌名稱']),
    element('p', '產地 ' + (farm['產地縣市'] || '未提供'), 'farm-origin')
  );
  if (farm.categories.length) {
    const categories = element('div', '', 'farm-categories');
    for (const category of farm.categories) {
      categories.append(element('span', category, 'tag tone-' + (categoryColors.get(category) || 'neutral')));
    }
    card.append(categories);
  }
  if (items.length) {
    card.append(element('p', items.map(({name}) => name).join('、'), 'matched-products'));
  }
  const otherItems = farm.items.filter((item) => !items.includes(item));
  if (otherItems.length) {
    card.append(element('p', (items.length ? '也販售 ' : '') + otherItems.map(({name}) => name).join('、')));
  }
  if (farm['備註']) card.append(element('p', sentenceLines(farm['備註']), 'meta sentence-lines'));
  const links = element('div', '', 'links');
  const purchase = safeLink(channels.get(farm['購買管道'])?.action || '前往購買管道', farm['傳送門']);
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
      const labels = browseLabels(farms.flatMap((farm) => farm.items));
      list.append(...labels.map(productButton));
    }
    directoryReady = true;
    if ($('filters')) renderFarms();
    showSeasonalPicks();
  } catch {
    if ($('count')) $('count').textContent = '暫時無法讀取名錄，請稍後重新整理。';
    if ($('picks')) $('picks').textContent = '暫時無法查詢當季品項的販售店家。';
  }
}

async function loadMarketSnapshot() {
  const response = await fetch('tapmc-quotes.json', {cache: 'no-cache'});
  if (!response.ok) throw new Error('行情讀取失敗');
  const snapshot = await response.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.tradeDate) ||
      !Array.isArray(snapshot.records) || !snapshot.records.length) {
    throw new Error('無交易資料');
  }
  const records = snapshot.records.filter((record) => record.originCategory === 'domestic' &&
    !/進口|外國|國外/.test(record.name));
  return {...snapshot, records};
}

async function showHomeCheapest() {
  const status = $('cheapest-status');
  try {
    const {tradeDate, records} = await loadMarketSnapshot();
    const current = tradeDate === taipeiDay;
    $('cheapest-title').textContent = current ? '今日國產蔬果最低批發價' : '最近交易日國產蔬果最低批發價';
    const date = tradeDate.replaceAll('-', '/');
    status.textContent = sentenceLines((current ? '交易日 ' + date : '目前顯示最近交易日 ' + date) +
      '。依北農品項代碼排除進口與未能分類品項。依每公斤均價排序，同價時成交量多者優先。');
    const sections = [];
    for (const [category, tone] of [['蔬菜', 'green'], ['水果', 'orange']]) {
      const rows = records.filter((record) => record.category === category && record.unit === '公斤')
        .sort((a, b) => a.price - b.price || b.quantity - a.quantity);
      const seen = new Set();
      const list = element('ol', '', 'cheapest-items');
      for (const record of rows) {
        if (seen.has(record.baseName)) continue;
        seen.add(record.baseName);
        const item = element('li', '');
        item.append(
          element('strong', record.name),
          element('span', 'NT$ ' + number.format(record.price) + '／公斤', 'price')
        );
        list.append(item);
        if (seen.size === 3) break;
      }
      const section = element('div', '', 'cheapest-group');
      section.append(element('h3', category, 'seasonal-label tone-' + tone),
        seen.size ? list : element('p', '本次未取得國產行情', 'meta'));
      sections.push(section);
    }
    $('cheapest-groups').replaceChildren(...sections);
  } catch {
    status.textContent = '暫時無法載入北農行情。';
  }
}

async function loadPrices(cards) {
  try {
    const {tradeDate, records} = await loadMarketSnapshot();
    $('quote-status').textContent = '北農資料交易日 ' + tradeDate.replaceAll('-', '/');
    for (const {item, quote} of cards) {
      const seen = new Set();
      const matching = records.filter((record) => {
        if (seen.has(record.code)) return false;
        const codeMatch = item.quoteCodes?.includes(record.code);
        const nameMatch = item.quoteNames?.some((name) => record.name.includes(name));
        if (!codeMatch && !nameMatch) return false;
        seen.add(record.code);
        return true;
      });
      if (!matching.length) {
        quote.textContent = '北農該日未列此品項的國產行情';
        continue;
      }
      quote.replaceChildren(...matching.map((record) => {
        const row = element('p', '');
        row.append(element('strong', 'NT$ ' + number.format(record.price) + '／' + record.unit, 'price'),
          element('span', record.name, 'meta quote-detail'));
        return row;
      }));
    }
  } catch {
    for (const {quote} of cards) quote.textContent = '行情暫時無法載入';
    $('quote-status').textContent = '可透過下方連結到北農查詢。';
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
    if (category && event.currentTarget === $('product-list')) category.value = '';
    event.currentTarget.closest('details')?.removeAttribute('open');
    resetResults();
    focusResults();
  }
  $('product-list')?.addEventListener('click', chooseProduct);
  $('suggestion-list')?.addEventListener('click', chooseProduct);
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
if ($('home-vegetable-period') || $('vegetable-weekly-content') || $('quotes')) loadWeeklyReports();
if ($('cheapest-status')) showHomeCheapest();

const sourceReturn = $('source-return');
if (sourceReturn) {
  const origins = new Map([
    ['home-picks', ['index.html#shop-ideas', '回到首頁食材推薦']],
    ['vegetable-weekly', ['season.html#vegetable-weekly', '回到蔬菜週報']],
    ['fruit-weekly', ['season.html#weekly', '回到水果週報']],
    ['season', ['season.html#season', '回到當季推薦']],
    ['season-search', ['season.html#season-search', '回到當季頁搜尋']],
    ['price-search', ['prices.html#price-search', '回到批發行情搜尋']],
    ['directory', ['farms.html#filters', '回到名錄分類']],
  ]);
  const previous = origins.get(new URLSearchParams(location.search).get('from'));
  if (previous) {
    sourceReturn.href = previous[0];
    sourceReturn.textContent = previous[1];
  }
}

async function loadPublishDate() {
  const display = $('published-at');
  if (!display) return;
  try {
    const response = await fetch('index.html', {method: 'HEAD', cache: 'no-cache', signal: AbortSignal.timeout(8000)});
    const modified = response.headers.get('Last-Modified');
    const time = new Date(modified || '');
    if (!response.ok || Number.isNaN(time.getTime())) throw new Error('無發布時間');
    const date = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(time);
    display.dateTime = date;
    display.textContent = date.replaceAll('-', '/');
  } catch {
    display.textContent = '暫時無法查詢';
  }
}

loadPublishDate();
