// === プロフィールデータ ===
export const profileData = { 
  title: "〇〇のプロフィール", 
  description: `
    <p>はじめまして、〇〇と申します。</p>
    <p>ゲーム開発やWebアプリケーション開発に興味があります。</p>
    <p>スキル：JavaScript, Three.js, HTML, CSS</p>
    <p>詳細は以下をご覧ください。</p>
    <p>
      <a href="https://github.com/あなたのユーザー名" target="_blank">GitHub</a> | 
      <a href="https://x.com/あなたのユーザー名" target="_blank">X (旧Twitter)</a> |
      <a href="mailto:あなたのメールアドレス">メールで連絡</a>
    </p>
  `
};

// === マスごとの実績データ ===
export const eventData = [
  { 
    title: "スタート地点", 
    description: "俺のポートフォリオへようこそ！<br>◀️ ▶️ キーで駒を動かそう！<br>駒やマスをクリックすると詳細が表示されるよ", // ID 0
    image: null, 
    url: null
  }, 
  { 
    title: "〇〇ハッカソン", 
    description: "ここで「〇〇賞」を優勝しました！",
    image: "./assets/images/hackathon-prize.jpg", 
    url: "https://example.com/hackathon-project"
  }, 
  { 
    title: "イベント 2", 
    description: "ここに実績2が入ります。",
    image: null, 
    url: "https://example.com/event2"
  }, 
  { title: "イベント 3", description: "ここに実績3が入ります。", image: null, url: null }, 
  { title: "イベント 4", description: "ここに実績4が入ります。", image: null, url: null }, 
  { title: "イベント 5", description: "ここに実績5が入ります。", image: null, url: null }, 
  { title: "イベント 6", description: "ここに実績6が入ります。", image: null, url: null }, 
  { title: "イベント 7", description: "ここに実績7が入ります。", image: null, url: null }, 
  { title: "イベント 8", description: "ここに実績8が入ります。", image: null, url: null }, 
  { title: "イベント 9", description: "ここに実績9が入ります。", image: null, url: null }, 
  { title: "イベント 10", description: "ここに実績10が入ります。", image: null, url: null }, 
  { 
    title: "ゴール！", 
    description: "最後まで見てくれてありがとう！",
    image: "./assets/images/thanks.jpg",
    url: null
  }
];