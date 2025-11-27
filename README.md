# EDBP - Easy Discord Bot Plugin

EDBPプラグインの紹介サイトです。GitHub Pagesでホスティングできます。

## ファイル構成

- `index.html` - メインHTMLファイル
- `スタイル.css` - スタイルシート
- `script.js` - JavaScriptファイル（GitHub API統合含む）

## 機能

### ホームページ（家）
- EDBPの説明
- プラグイン導入方法の説明
- ショップへのリンク

### ショップページ（店）
- GitHubから「edbp-plugin」タグを持つリポジトリを自動取得
- プラグイン情報の表示：
  - 名前
  - 作成日
  - 作成者
  - バージョン
  - 星の数
  - 説明
- 検索機能
- プラグインカードをクリックするとGitHubリポジトリが開きます

## GitHub Pagesへのデプロイ方法

1. GitHubで新しいリポジトリを作成
2. このフォルダ内のファイルをリポジトリにプッシュ：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. GitHubリポジトリの設定で「Pages」セクションに移動
4. ソースを「main」ブランチに設定
5. 数分後、`https://YOUR_USERNAME.github.io/YOUR_REPO/`でサイトが公開されます

## 技術仕様

- **HTML5** - セマンティックなマークアップ
- **CSS3** - レスポンシブデザイン、モダンなスタイリング
- **Vanilla JavaScript** - フレームワーク不要
- **GitHub API** - リポジトリ検索機能
- **完全静的** - サーバーサイド処理不要

## カスタマイズ

### プラグインタグの変更
`script.js`の以下の行を編集：
```javascript
const response = await fetch('https://api.github.com/search/repositories?q=topic:edbp-plugin&sort=stars&order=desc&per_page=50');
```

`edbp-plugin`を別のタグに変更できます。

### スタイルの変更
`スタイル.css`の`:root`セクションでカラースキームを変更：
```css
:root {
    --primary-color: #5865F2;
    --secondary-color: #57F287;
    /* ... */
}
```

## ライセンス

このプロジェクトは自由に使用・改変できます。
