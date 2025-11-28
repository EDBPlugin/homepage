// 言語データ
const translations = {
  ja: {
    homeTitle: "EDBP プラグイン・ネクサス",
    whatIsEdbp: "🚀 EDBPとは？",
    desc1: "EDBP (Easy Discord Bot Plugin) は、コーディング不要でDiscordボットを強化するモジュール式拡張システムです。",
    desc2: "EDBB (Easy Discord Bot Builder) に組み込まれており、初心者からプロまで誰でも簡単に高機能ボットを構築できます。",
    installMethod: "🤖 導入方法",
    installList: [
      "1. 公式ショップ（推奨） — ネクサスから即時インストール。ファイル操作不要。",
      "2. 手動インポート — カスタムプラグインをファイルから読み込み。"
    ],
    fetchedData: "📥 取得データ（GitHub経由）",
    field: "項目",
    desc: "説明",
    nameDesc: "プラグイン名",
    authorDesc: "開発者名",
    starsDesc: "人気度（スター数）",
    versionDesc: "最新バージョン",
    descDesc: "機能概要",
    shopTitle: "プラグイン・ネクサス",
    backToHome: "← Homeに戻る",
    backToNexus: "← ネクサスに戻る",
    changelog: "📜 更新履歴",
    footer: "© 2025 EDBP | すべてのクリエイターへ、すべてのクリエイターによって。"
  },
  en: {
    homeTitle: "EDBP PLUGIN NEXUS",
    whatIsEdbp: "🚀 What is EDBP?",
    desc1: "EDBP (Easy Discord Bot Plugin) is a modular extension system that supercharges your Discord bot—no coding required.",
    desc2: "Built into EDBB (Easy Discord Bot Builder), it empowers creators of all skill levels to customize bots with powerful, plug-and-play features.",
    installMethod: "🤖 How to Install",
    installList: [
      "1. Official Shop (Recommended) — Install plugins instantly from the Nexus. No file management.",
      "2. Manual Import — Load custom or community plugins via file import."
    ],
    fetchedData: "📥 Fetched Data (via GitHub)",
    field: "Field",
    desc: "Description",
    nameDesc: "Plugin title",
    authorDesc: "Developer handle",
    starsDesc: "Community popularity",
    versionDesc: "Latest release tag",
    descDesc: "Plugin functionality",
    shopTitle: "Plugin Nexus",
    backToHome: "← Back to Home",
    backToNexus: "← Back to Nexus",
    changelog: "📜 Changelog",
    footer: "© 2025 EDBP | Built for creators, by creators."
  }
};

// 言語管理
let currentLang = 'ja';

const detectLanguage = () => {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang === 'en' || urlLang === 'ja') return urlLang;
  return navigator.language.startsWith('ja') ? 'ja' : 'en';
};

const setLanguage = (lang) => {
  currentLang = lang;
  const t = translations[lang];

  // ホーム
  document.getElementById('home-title').textContent = t.homeTitle;
  document.getElementById('what-is-edbp').textContent = t.whatIsEdbp;
  document.getElementById('desc1').textContent = t.desc1;
  document.getElementById('desc2').textContent = t.desc2;
  document.getElementById('install-method').textContent = t.installMethod;
  const installList = document.getElementById('install-list');
  installList.innerHTML = t.installList.map(item => `<li>${item}</li>`).join('');
  document.getElementById('fetched-data').textContent = t.fetchedData;
  document.getElementById('field').textContent = t.field;
  document.getElementById('desc').textContent = t.desc;
  document.getElementById('name-desc').textContent = t.nameDesc;
  document.getElementById('author-desc').textContent = t.authorDesc;
  document.getElementById('stars-desc').textContent = t.starsDesc;
  document.getElementById('version-desc').textContent = t.versionDesc;
  document.getElementById('desc-desc').textContent = t.descDesc;

  // ショップ
  document.getElementById('shop-title').textContent = t.shopTitle;
  document.getElementById('homeFromShopBtn').textContent = t.backToHome;
  document.getElementById('backToShopBtn').textContent = t.backToNexus;

  // フッター
  document.getElementById('footer-text').textContent = t.footer;

  // 言語ボタン
  document.getElementById('langToggle').textContent = lang === 'ja' ? 'EN' : 'JP';

  // URLにlangを追加
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
};

// 切り替え
document.getElementById('langToggle').addEventListener('click', () => {
  setLanguage(currentLang === 'ja' ? 'en' : 'ja');
});

// セクション制御
const showSection = id => {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

document.getElementById('shopBtn').addEventListener('click', e => {
  e.preventDefault();
  showSection('shop');
  if (!window.shopLoaded) loadShopData();
});

document.getElementById('homeFromShopBtn').addEventListener('click', e => {
  e.preventDefault();
  showSection('home');
});

document.getElementById('backToShopBtn').addEventListener('click', e => {
  e.preventDefault();
  showSection('shop');
});

// GitHub
const fetchPlugins = async () => {
  try {
    const res = await fetch('https://api.github.com/search/repositories?q=topic:edbp-plugin&sort=stars&order=desc&per_page=30');
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
};

const getReleases = async (owner, repo) => {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`);
    if (res.ok) {
      const releases = await res.json();
      return releases.map(r => ({
        name: r.name || r.tag_name,
        published_at: r.published_at,
        body: r.body || 'No description.'
      }));
    }
  } catch {}
  return [];
};

const formatDate = (d, lang) => {
  if (!d) return lang === 'ja' ? '不明' : 'Unknown';
  return new Date(d).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US');
};

const loadShopData = async () => {
  const plugins = await fetchPlugins();
  const el = document.getElementById('shopContainer');
  if (plugins.length === 0) {
    el.innerHTML = `<div class="error">${currentLang === 'ja' ? 'プラグインが見つかりません' : 'No plugins found'}</div>`;
    return;
  }

  el.innerHTML = plugins.slice(0, 12).map(p => `
    <div class="shop-card" onclick="window.open('${p.html_url}', '_blank')">
      <h3>${p.name}</h3>
      <div class="plugin-meta">
        <span class="author">@${p.owner.login}</span>
        <span class="stars">★ ${p.stargazers_count}</span>
      </div>
      <p class="description">${p.description || (currentLang === 'ja' ? '説明なし' : 'No description.')}</p>
      <div style="display:flex; gap:0.6rem; margin-top:1rem;">
        <div class="view-releases" onclick="event.stopPropagation(); showPluginDetail('${p.owner.login}', '${p.name}')">
          ${translations[currentLang].changelog}
        </div>
      </div>
    </div>
  `).join('');
  window.shopLoaded = true;
};

window.showPluginDetail = async (owner, repo) => {
  const el = document.getElementById('detailContent');
  el.innerHTML = `<div class="loading">${currentLang === 'ja' ? '更新履歴を読み込み中...' : 'Loading changelog...'}</div>`;
  showSection('detail');

  try {
    const [repoData, releases] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`).then(r => r.json()),
      getReleases(owner, repo)
    ]);

    const desc = repoData.description || (currentLang === 'ja' ? '説明なし' : 'No description.');
    const releaseHtml = releases.length ? releases.map(r => `
      <div class="release-item">
        <div class="release-header">${r.name}</div>
        <div class="release-date">${formatDate(r.published_at, currentLang)}</div>
        <div class="release-body">${r.body.replace(/\n/g, '<br>')}</div>
      </div>
    `).join('') : `<p>${currentLang === 'ja' ? 'リリース履歴がありません' : 'No releases found.'}</p>`;

    el.innerHTML = `
      <h1>${repoData.name}</h1>
      <p class="description">${desc}</p>
      <div style="margin:1rem 0; color:var(--text-muted);">
        by <span class="author">@${owner}</span> • <span class="stars">★ ${repoData.stargazers_count}</span>
      </div>
      <h2>${currentLang === 'ja' ? `更新履歴 (${releases.length} 件)` : `Changelog (${releases.length} releases)`}</h2>
      ${releaseHtml}
    `;
  } catch {
    el.innerHTML = `<div class="error">${currentLang === 'ja' ? 'プラグイン情報の取得に失敗しました' : 'Failed to load plugin details.'}</div>`;
  }
};

// 初期化
window.addEventListener('load', () => {
  currentLang = detectLanguage();
  setLanguage(currentLang);

  const plugin = new URLSearchParams(window.location.search).get('plugin');
  if (plugin && plugin.includes('/')) {
    const [o, r] = plugin.split('/');
    showPluginDetail(o, r);
  }
});
