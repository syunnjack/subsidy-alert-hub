import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'subsidy-alert-hub.saved'
const postKey = 'subsidy-alert-hub.posts'
// 全20の政令指定都市を対象に、カテゴリ（補助金/助成金/公募/期限）を
// 一巡させたサンプル通知データ。実データ連携までのプレースホルダー。
const alerts = [
  { "id": "subsidy-alert-hub-1", "title": "札幌市 補助金通知（例）", "area": "札幌市", "category": "補助金", "score": 95, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 補助金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X"], "tags": ["補助金", "通知", "UGC", "収益導線"], "revenue": "士業紹介" },
  { "id": "subsidy-alert-hub-2", "title": "仙台市 助成金通知（例）", "area": "仙台市", "category": "助成金", "score": 93, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 助成金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール"], "tags": ["助成金", "通知", "UGC", "収益導線"], "revenue": "相談送客" },
  { "id": "subsidy-alert-hub-3", "title": "さいたま市 公募通知（例）", "area": "さいたま市", "category": "公募", "score": 91, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 公募の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール", "Slack"], "tags": ["公募", "通知", "UGC", "収益導線"], "revenue": "資料販売" },
  { "id": "subsidy-alert-hub-4", "title": "千葉市 申請期限通知（例）", "area": "千葉市", "category": "期限", "score": 89, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 申請期限の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "メール"], "tags": ["期限", "通知", "UGC", "収益導線"], "revenue": "申請支援" },
  { "id": "subsidy-alert-hub-5", "title": "横浜市 補助金通知（例）", "area": "横浜市", "category": "補助金", "score": 87, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 補助金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "Slack"], "tags": ["補助金", "通知", "UGC", "収益導線"], "revenue": "法人プラン" },
  { "id": "subsidy-alert-hub-6", "title": "川崎市 助成金通知（例）", "area": "川崎市", "category": "助成金", "score": 85, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 助成金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X"], "tags": ["助成金", "通知", "UGC", "収益導線"], "revenue": "士業紹介" },
  { "id": "subsidy-alert-hub-7", "title": "相模原市 公募通知（例）", "area": "相模原市", "category": "公募", "score": 83, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 公募の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール"], "tags": ["公募", "通知", "UGC", "収益導線"], "revenue": "相談送客" },
  { "id": "subsidy-alert-hub-8", "title": "新潟市 申請期限通知（例）", "area": "新潟市", "category": "期限", "score": 81, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 申請期限の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール", "Slack"], "tags": ["期限", "通知", "UGC", "収益導線"], "revenue": "資料販売" },
  { "id": "subsidy-alert-hub-9", "title": "静岡市 補助金通知（例）", "area": "静岡市", "category": "補助金", "score": 79, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 補助金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "メール"], "tags": ["補助金", "通知", "UGC", "収益導線"], "revenue": "申請支援" },
  { "id": "subsidy-alert-hub-10", "title": "浜松市 助成金通知（例）", "area": "浜松市", "category": "助成金", "score": 77, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 助成金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "Slack"], "tags": ["助成金", "通知", "UGC", "収益導線"], "revenue": "法人プラン" },
  { "id": "subsidy-alert-hub-11", "title": "名古屋市 公募通知（例）", "area": "名古屋市", "category": "公募", "score": 75, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 公募の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X"], "tags": ["公募", "通知", "UGC", "収益導線"], "revenue": "士業紹介" },
  { "id": "subsidy-alert-hub-12", "title": "京都市 申請期限通知（例）", "area": "京都市", "category": "期限", "score": 73, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 申請期限の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール"], "tags": ["期限", "通知", "UGC", "収益導線"], "revenue": "相談送客" },
  { "id": "subsidy-alert-hub-13", "title": "大阪市 補助金通知（例）", "area": "大阪市", "category": "補助金", "score": 71, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 補助金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール", "Slack"], "tags": ["補助金", "通知", "UGC", "収益導線"], "revenue": "資料販売" },
  { "id": "subsidy-alert-hub-14", "title": "堺市 助成金通知（例）", "area": "堺市", "category": "助成金", "score": 69, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 助成金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "メール"], "tags": ["助成金", "通知", "UGC", "収益導線"], "revenue": "申請支援" },
  { "id": "subsidy-alert-hub-15", "title": "神戸市 公募通知（例）", "area": "神戸市", "category": "公募", "score": 67, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 公募の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "Slack"], "tags": ["公募", "通知", "UGC", "収益導線"], "revenue": "法人プラン" },
  { "id": "subsidy-alert-hub-16", "title": "岡山市 申請期限通知（例）", "area": "岡山市", "category": "期限", "score": 65, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 申請期限の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X"], "tags": ["期限", "通知", "UGC", "収益導線"], "revenue": "士業紹介" },
  { "id": "subsidy-alert-hub-17", "title": "広島市 補助金通知（例）", "area": "広島市", "category": "補助金", "score": 63, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 補助金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール"], "tags": ["補助金", "通知", "UGC", "収益導線"], "revenue": "相談送客" },
  { "id": "subsidy-alert-hub-18", "title": "北九州市 助成金通知（例）", "area": "北九州市", "category": "助成金", "score": 61, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 助成金の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "メール", "Slack"], "tags": ["助成金", "通知", "UGC", "収益導線"], "revenue": "資料販売" },
  { "id": "subsidy-alert-hub-19", "title": "福岡市 公募通知（例）", "area": "福岡市", "category": "公募", "score": 59, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 公募の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "メール"], "tags": ["公募", "通知", "UGC", "収益導線"], "revenue": "申請支援" },
  { "id": "subsidy-alert-hub-20", "title": "熊本市 申請期限通知（例）", "area": "熊本市", "category": "期限", "score": 57, "summary": "補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。 申請期限の条件一致時に通知し、保存、送客、課金へつなげます。", "channels": ["LINE", "X", "Slack"], "tags": ["期限", "通知", "UGC", "収益導線"], "revenue": "法人プラン" }
]
const revenuePlans = [
  "士業紹介",
  "相談送客",
  "資料販売",
  "申請支援",
  "法人プラン"
]
const channels = [
  "LINE",
  "X",
  "メール",
  "Slack"
]
const faqs = [
  ['通知からどう収益化しますか？', '無料通知で接点を作り、条件一致時に予約、掲載、クーポン、有料通知、スポンサー枠へ誘導します。'],
  ['LINE・X・メール・Slackの使い分けは？', 'LINEは個人の即時通知、Xは拡散、メールは週次まとめ、Slackは店舗や法人運用向けです。'],
  ['SEO/AIO/LLMOの狙いは？', '地域名、カテゴリ、条件、通知、口コミ、FAQを組み合わせたロングテールページを作ります。'],
]

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('すべて')
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [form, setForm] = useState({ title: '', channel: 'LINE', memo: '' })
  const categories = ['すべて', ...new Set(alerts.map((item) => item.category))]

  const filtered = useMemo(() => alerts.filter((item) => {
    const text = [item.title, item.area, item.category, item.summary, item.channels.join(' '), item.tags.join(' ')].join(' ')
    return text.includes(query) && (category === 'すべて' || item.category === category)
  }), [query, category])

  function toggleSave(id) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  function addPost(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.memo.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), date: new Date().toLocaleDateString('ja-JP') }, ...posts]
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ title: '', channel: 'LINE', memo: '' })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">補助金・助成金・自治体募集通知</p>
          <h1>補助金アラートハブ</h1>
          <p className="lead">補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。</p>
        </div>
        <aside className="hero-panel">
          <span>subsidyalert.jp</span>
          <strong>通知の瞬間に、予約・掲載・クーポン・有料導線へつなげる。</strong>
          <p>LINE、X、メール、Slackを入口に、UGCで鮮度を作りながら収益導線を太くします。</p>
        </aside>
      </section>
      <section className="controls" aria-label="検索条件">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="地域・カテゴリ・通知条件で検索" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </section>
      <section className="metrics">
        <article><span>通知サンプル数</span><strong>{alerts.length}</strong></article>
        <article><span>通知チャネル数</span><strong>{channels.length}</strong></article>
        <article><span>保存数</span><strong>{saved.length}</strong></article>
        <article><span>投稿数</span><strong>{posts.length}</strong></article>
      </section>
      <section className="alert-grid">
        {filtered.map((alert) => (
          <article className="alert-card" key={alert.id}>
            <div className="card-top"><span>{alert.area} / {alert.category}</span><b>{alert.score}</b></div>
            <h2>{alert.title}</h2>
            <p>{alert.summary}</p>
            <div className="tag-row">{alert.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="channel-row">{alert.channels.map((channel) => <span key={channel}>{channel}</span>)}</div>
            <p className="revenue">収益導線: {alert.revenue}</p>
            <button type="button" onClick={() => toggleSave(alert.id)}>{saved.includes(alert.id) ? '保存済み' : '通知導線に保存'}</button>
          </article>
        ))}
      </section>
      <section className="split">
        <div className="panel">
          <h2>サービスの仕組み</h2>
          <article><b>画面構成</b><p>Vite + React 19。静的MVPとして軽く、GitHub Pagesへ展開しやすい構成です。</p></article>
          <article><b>通知連携</b><p>初期はUI設計、次段階でLINE Messaging API、X API、SendGrid/Mailgun、Slack Incoming Webhooksを接続します。</p></article>
          <article><b>データ基盤</b><p>MVPは静的サンプルデータ + localStorage。運用時はSupabaseまたはCloudflare D1へ移行します。</p></article>
          <article><b>収益ルート</b><p>{revenuePlans.join(' / ')}</p></article>
        </div>
        <div className="panel">
          <h2>UGC・通知リクエスト</h2>
          <p>現地確認、在庫、空席、価格、閉店、口コミ、通知希望条件を集めて、鮮度と検索ページを増やします。</p>
          <form className="ugc-form" onSubmit={addPost}>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="通知リクエスト名" />
            <input value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })} placeholder="LINE / X / メール / Slack" />
            <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="条件・口コミ・現地メモ" />
            <button>投稿</button>
          </form>
          <div className="post-list">
            {posts.length === 0 && <p className="empty">公開後は通知希望とUGCで鮮度を作ります。</p>}
            {posts.map((post) => <article key={post.id}><b>{post.title}</b><p>{post.memo}</p><small>{post.channel} / {post.date}</small></article>)}
          </div>
        </div>
      </section>
      <section className="seo-section">
        <h2>SEO / AIO / LLMO</h2>
        <div className="seo-grid">
          <article><b>地域ページ</b><p>地域名、駅名、施設名ごとに通知ニーズを拾います。</p></article>
          <article><b>条件ページ</b><p>空き、値下げ、閉店、在庫、混雑、期限など行動直前の検索を狙います。</p></article>
          <article><b>法人ページ</b><p>掲載、スポンサー、Slack通知、レポート、SaaS契約へつなげます。</p></article>
        </div>
      </section>
      <section className="faq-section">
        <h2>FAQ</h2>
        <div className="faq-grid">{faqs.map(([q, a]) => <article key={q}><h3>{q}</h3><p>{a}</p></article>)}</div>
      </section>
    </main>
  )
}

export default App
