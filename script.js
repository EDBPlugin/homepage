// ページナビゲーション
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションリンクの処理
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // すべてのセクションを非表示
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // ターゲットセクションを表示
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // ショップセクションの場合、プラグインを読み込む
            if (targetId === 'shop') {
                loadPlugins();
            }
        });
    });

    // CTAボタンの処理
    const ctaButton = document.querySelector('.cta-button a');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById('shop').classList.add('active');
            loadPlugins();
        });
    }

    // 検索機能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterPlugins(this.value);
        });
    }

    // 初期表示時にホームセクションをアクティブに
    document.getElementById('home').classList.add('active');
});

// プラグインデータを保存する変数
let allPlugins = [];

// GitHubからプラグインを読み込む
async function loadPlugins() {
    const pluginList = document.getElementById('pluginList');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    // すでに読み込み済みの場合はスキップ
    if (allPlugins.length > 0) {
        return;
    }

    loading.style.display = 'block';
    error.style.display = 'none';
    pluginList.innerHTML = '';

    try {
        // GitHub APIでedbp-pluginタグを持つリポジトリを検索
        const response = await fetch('https://api.github.com/search/repositories?q=topic:edbp-plugin&sort=stars&order=desc&per_page=50');
        
        if (!response.ok) {
            throw new Error('GitHub APIからのデータ取得に失敗しました');
        }

        const data = await response.json();
        allPlugins = data.items || [];

        loading.style.display = 'none';

        if (allPlugins.length === 0) {
            pluginList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">現在、プラグインは見つかりませんでした。</p>';
            return;
        }

        displayPlugins(allPlugins);

    } catch (err) {
        console.error('プラグイン読み込みエラー:', err);
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

// プラグインを表示する
function displayPlugins(plugins) {
    const pluginList = document.getElementById('pluginList');
    pluginList.innerHTML = '';

    plugins.forEach(plugin => {
        const card = createPluginCard(plugin);
        pluginList.appendChild(card);
    });
}

// プラグインカードを作成する
function createPluginCard(plugin) {
    const card = document.createElement('div');
    card.className = 'plugin-card';
    
    // 日付のフォーマット
    const createdDate = new Date(plugin.created_at).toLocaleDateString('ja-JP');
    
    // 説明文を短縮
    const description = plugin.description || '説明がありません';
    const shortDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

    // バージョン情報（タグから取得、なければデフォルト）
    const version = 'v1.0.0'; // 実際のバージョンはreleases APIから取得可能

    card.innerHTML = `
        <div class="plugin-header">
            <div>
                <div class="plugin-name">${plugin.name}</div>
                <div class="plugin-meta">作成者: ${plugin.owner.login}</div>
                <div class="plugin-meta">作成日: ${createdDate}</div>
            </div>
            <div class="plugin-stars">
                <span>⭐</span>
                <span>${plugin.stargazers_count}</span>
            </div>
        </div>
        <div class="plugin-version">${version}</div>
        <div class="plugin-description">${shortDescription}</div>
    `;

    // クリックでGitHubリポジトリを開く
    card.addEventListener('click', function() {
        window.open(plugin.html_url, '_blank');
    });

    return card;
}

// プラグインをフィルタリングする
function filterPlugins(searchTerm) {
    if (allPlugins.length === 0) return;

    const term = searchTerm.toLowerCase();
    const filtered = allPlugins.filter(plugin => {
        const name = plugin.name.toLowerCase();
        const description = (plugin.description || '').toLowerCase();
        const author = plugin.owner.login.toLowerCase();
        
        return name.includes(term) || description.includes(term) || author.includes(term);
    });

    displayPlugins(filtered);

    // 結果がない場合のメッセージ
    if (filtered.length === 0) {
        const pluginList = document.getElementById('pluginList');
        pluginList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">検索結果が見つかりませんでした。</p>';
    }
}

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});
