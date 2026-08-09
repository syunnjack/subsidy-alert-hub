import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'subsidy-alert-hub.saved'
const postKey = 'subsidy-alert-hub.posts'
// 20の政令指定都市が実施する市独自の補助金・助成金制度（2026-08-09時点で
// 各市公式サイトを確認）。募集期間は制度ごとに異なり、多くが年度内の
// 数週間〜数ヶ月しか開いていないため、status（受付中/締切済/要確認）を
// 必ず表示し、期限切れの制度も「参考情報」として隠さず出す。
// 定期的な出典URLの再確認・更新が必要。
const alerts = [
  { "id": "subsidy-alert-hub-1", "area": "札幌市", "title": "札幌市先端設備等導入促進補助金（令和8年度事業）", "status": "受付中", "period": "令和8年4月1日〜11月30日", "summary": "市内中小企業が労働生産性を向上させる先端設備等を導入する経費を補助（補助率20%、上限500万円）。", "sourceUrl": "https://www.city.sapporo.jp/keizai/chusho/r8sentanhojyokin.html", "sourceLabel": "札幌市" },
  { "id": "subsidy-alert-hub-2", "area": "仙台市", "title": "令和8年度アクセル・アップ支援（成長促進補助金）", "status": "締切済", "period": "令和8年4月16日〜7月24日", "summary": "市内地域企業の新事業展開・生産性向上・販路開拓等の取組を支援（上限400万円、補助率1/2）。", "sourceUrl": "https://www.city.sendai.jp/kikakushien/r8accelup.html", "sourceLabel": "仙台市" },
  { "id": "subsidy-alert-hub-3", "area": "さいたま市", "title": "イノベーション技術創出支援補助金（令和8年度「産学連携枠」・二次募集）", "status": "締切済", "period": "令和8年6月30日〜7月9日", "summary": "市内中小企業者等が理工系大学と行う研究開発・実証実験を補助（研究開発上限100万円／実証実験上限500万円）。", "sourceUrl": "https://www.city.saitama.lg.jp/005/002/010/012/p131834.html", "sourceLabel": "さいたま市" },
  { "id": "subsidy-alert-hub-4", "area": "千葉市", "title": "千葉市中小企業人材育成・能力開発推進支援補助金", "status": "受付中", "period": "令和8年4月1日募集開始（実績報告は令和9年3月31日まで）", "summary": "市内中小企業者が従業員の研修・資格取得に要した経費の一部を補助（上限10万円/5万円）。", "sourceUrl": "https://www.city.chiba.jp/keizainosei/keizai/koyosuishin/chushokigyo-jinzaiikusei-hojokin.html", "sourceLabel": "千葉市" },
  { "id": "subsidy-alert-hub-5", "area": "横浜市", "title": "中小企業新技術・新製品開発促進助成金（令和8年度）", "status": "締切済", "period": "事前相談：令和8年4月15日〜5月29日／申請〜6月4日", "summary": "創業5年以上の市内中小企業の新技術・新製品研究開発費（原材料費・機械装置費・人件費等）を助成（上限1,000万円）。", "sourceUrl": "https://www.city.yokohama.lg.jp/business/kigyoshien/keieishien/kaihatsu/gijutsu/kaihatsu.html", "sourceLabel": "横浜市" },
  { "id": "subsidy-alert-hub-6", "area": "川崎市", "title": "川崎市がんばる中小企業応援補助金", "status": "締切済", "period": "令和8年4月1日〜4月30日（先着順）", "summary": "市内中小企業者等の販路開拓の取組経費を補助（上限25万円〜30万円、補助率1/2）。", "sourceUrl": "https://www.city.kawasaki.jp/280/page/0000113751.html", "sourceLabel": "川崎市" },
  { "id": "subsidy-alert-hub-7", "area": "相模原市", "title": "中小企業生産性向上支援補助金", "status": "受付中", "period": "実施期間：令和8年4月1日〜令和9年1月31日", "summary": "市内中小企業者の労働生産性向上に資する設備投資経費を補助（上限1,000万円、市内調達2/3・市外調達1/2）。", "sourceUrl": "https://www.city.sagamihara.kanagawa.jp/sangyo/sangyo/1026664/1003291/josei/1035055.html", "sourceLabel": "相模原市" },
  { "id": "subsidy-alert-hub-8", "area": "新潟市", "title": "新潟市新規採用活動支援事業補助金", "status": "受付中", "period": "令和8年4月27日受付開始（実績報告は令和9年2月28日まで）", "summary": "市内中小企業の採用関連ウェブサイト制作・改修や企業紹介動画制作費を補助（上限20万円、補助率1/2）。", "sourceUrl": "https://www.city.niigata.lg.jp/business/shoko/koyo_link/koyosinkisaiyou.html", "sourceLabel": "新潟市" },
  { "id": "subsidy-alert-hub-9", "area": "静岡市", "title": "中小企業等デジタル活用事業補助金", "status": "締切済", "period": "令和8年5月15日〜7月3日", "summary": "市内中小企業のEC化・非対面ビジネス転換・業務効率化等のデジタル導入費を補助（上限50万円、補助率2/3）。", "sourceUrl": "https://www.city.shizuoka.lg.jp/s2746/s003772.html", "sourceLabel": "静岡市" },
  { "id": "subsidy-alert-hub-10", "area": "浜松市", "title": "令和8年度浜松市中小事業者等AIエージェント導入支援事業費補助金", "status": "締切済", "period": "令和8年4月20日〜5月29日", "summary": "市内中小事業者のAIエージェント導入費用を補助（上限500万円、下限50万円、補助率1/2）。", "sourceUrl": "https://www.city.hamamatsu.shizuoka.jp/sangyoshinko/shinsangyo/hojokin/r8/ai-agent.html", "sourceLabel": "浜松市" },
  { "id": "subsidy-alert-hub-11", "area": "名古屋市", "title": "令和8年度名古屋市スタートアップ企業支援補助金", "status": "締切済", "period": "令和8年5月1日〜6月1日", "summary": "名古屋市内で新規創業する者・創業5年以内の中小企業者の創業時経費等を助成（上限100万円）。", "sourceUrl": "https://www.city.nagoya.jp/jigyou/sangyou/1026356/1035070/1035072/1026817.html", "sourceLabel": "名古屋市" },
  { "id": "subsidy-alert-hub-12", "area": "京都市", "title": "中小企業ひと・しごと環境魅力向上支援事業補助金", "status": "締切済", "period": "令和8年4月1日〜5月31日", "summary": "市内中小企業の生産性向上・従業員エンゲージメント向上（人材確保・定着）の取組を補助（上限60万円、補助率4/5）。", "sourceUrl": "https://www.city.kyoto.lg.jp/sankan/page/0000351813.html", "sourceLabel": "京都市" },
  { "id": "subsidy-alert-hub-13", "area": "大阪市", "title": "令和8年度省エネ・省CO₂加速化支援事業費補助金", "status": "要確認", "period": "執行団体の募集：令和8年4月10日〜5月1日（執行団体は決定済み）", "summary": "家庭・中小企業向けの省エネ設備導入を、市が選定した執行団体を通じて支援するスキーム。中小企業への直接公募ではない点に注意。", "sourceUrl": "https://www.city.osaka.lg.jp/kankyo/page/0000677033.html", "sourceLabel": "大阪市" },
  { "id": "subsidy-alert-hub-14", "area": "堺市", "title": "令和8年度堺市中小企業デジタル化促進補助金", "status": "受付中", "period": "令和8年5月1日〜8月31日（事前相談締切7月17日）", "summary": "市内中小企業がデジタルツールを導入する経費を補助（上限100万円、補助率1/2、DX支援センターの伴走支援が要件）。", "sourceUrl": "https://www.city.sakai.lg.jp/sangyo/shienyuushi/dx_shien/digitalka.html", "sourceLabel": "堺市" },
  { "id": "subsidy-alert-hub-15", "area": "神戸市", "title": "2026年度神戸市中小企業DX推進支援補助制度【システム導入事業】", "status": "締切済", "period": "令和8年6月1日〜8月7日", "summary": "市内中小企業のDXシステム導入経費を補助（通常枠上限100万円／DXモデル事業枠上限250万円、補助率1/2）。", "sourceUrl": "https://www.city.kobe.lg.jp/a93457/2026dxsystem.html", "sourceLabel": "神戸市" },
  { "id": "subsidy-alert-hub-16", "area": "岡山市", "title": "岡山市中小企業設備投資支援補助金（中小企業者枠）", "status": "締切済", "period": "令和8年4月27日〜6月26日", "summary": "市内中小企業の生産性向上・競争力強化のための設備投資経費を補助（上限300万円、補助率1/2）。", "sourceUrl": "https://www.city.okayama.jp/jigyosha/0000010819.html", "sourceLabel": "岡山市" },
  { "id": "subsidy-alert-hub-17", "area": "広島市", "title": "2026広島市生産性向上等チャレンジ応援金", "status": "締切済", "period": "令和8年5月11日〜6月19日", "summary": "市内中小企業者等（従業員なし事業者含む）の賃上げ環境整備・生産性/付加価値向上・販路開拓経費を補助（上限200万円、補助率3/4）。", "sourceUrl": "https://www.city.hiroshima.lg.jp/business/sangyo/1021490/1024252/1017503.html", "sourceLabel": "広島市" },
  { "id": "subsidy-alert-hub-18", "area": "北九州市", "title": "北九州市中小企業の3E-Action（創エネ・省エネ・蓄エネ）応援事業", "status": "締切済", "period": "令和8年5月11日〜7月15日", "summary": "市内中小企業の自家消費型太陽光発電・蓄電池等の導入費用を補助。", "sourceUrl": "https://www.city.kitakyushu.lg.jp/contents/29000025.html", "sourceLabel": "北九州市" },
  { "id": "subsidy-alert-hub-19", "area": "福岡市", "title": "令和8年度福岡市新規創業促進補助金", "status": "受付中", "period": "令和8年4月1日〜令和9年3月31日（予算到達次第終了）", "summary": "国の特定創業支援等事業の証明を受け登録免許税の軽減を受けた創業者に、残りの登録免許税相当額を補助（株式会社7.5万円／合同会社3万円・定額）。", "sourceUrl": "https://www.city.fukuoka.lg.jp/keizai/r-support/business/tokutei-sougyou-sientoujigyou_08.html", "sourceLabel": "福岡市" },
  { "id": "subsidy-alert-hub-20", "area": "熊本市", "title": "令和8年度（2026年度）熊本市DX環境整備事業補助金", "status": "締切済", "period": "令和8年7月1日〜令和9年1月29日予定（予算額到達のため7月31日付で募集終了）", "summary": "熊本市内の小規模・中小企業者等の業務変革（デジタルツール導入・人材育成・セキュリティ対策等）経費を補助。", "sourceUrl": "https://www.city.kumamoto.jp/kiji00371665/index.html", "sourceLabel": "熊本市" }
]
const revenuePlans = [
  "士業紹介",
  "相談送客",
  "資料販売",
  "申請支援",
  "法人プラン"
]
const faqs = [
  ['掲載している制度は本当に実在しますか？', 'はい。各都市の公式サイト（city.◯◯.lg.jp等）を確認したうえで掲載しています。各カードの「出典」リンクから必ず公式ページで最新の募集状況をご確認ください。'],
  ['「締切済」の制度も載せているのはなぜですか？', '募集期間は年度ごとに数週間〜数ヶ月しかない制度が多く、今回締切済みでも来年度に同様の制度が再開されるケースが多いためです。次回募集の目安として参考にしてください。'],
  ['通知からどう収益化しますか？', '無料通知で接点を作り、条件一致時に予約、掲載、クーポン、有料通知、スポンサー枠へ誘導します。'],
  ['LINE・X・メール・Slackの使い分けは？', 'LINEは個人の即時通知、Xは拡散、メールは週次まとめ、Slackは店舗や法人運用向けです。'],
]

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

function App() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('すべて')
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [form, setForm] = useState({ title: '', channel: 'LINE', memo: '' })
  const statuses = ['すべて', ...new Set(alerts.map((item) => item.status))]

  const filtered = useMemo(() => alerts.filter((item) => {
    const text = [item.title, item.area, item.status, item.summary].join(' ')
    return text.includes(query) && (status === 'すべて' || item.status === status)
  }), [query, status])

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
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="都市名・制度名で検索" />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
      </section>
      <section className="metrics">
        <article><span>掲載都市数</span><strong>{alerts.length}</strong></article>
        <article><span>受付中</span><strong>{alerts.filter((item) => item.status === '受付中').length}</strong></article>
        <article><span>保存数</span><strong>{saved.length}</strong></article>
        <article><span>投稿数</span><strong>{posts.length}</strong></article>
      </section>
      <section className="alert-grid">
        {filtered.map((alert) => (
          <article className="alert-card" key={alert.id}>
            <div className="card-top">
              <span>{alert.area}</span>
              <b className={`status-badge status-${alert.status === '受付中' ? 'open' : alert.status === '締切済' ? 'closed' : 'check'}`}>{alert.status}</b>
            </div>
            <h2>{alert.title}</h2>
            <p>{alert.summary}</p>
            <p className="period">申請期間: {alert.period}</p>
            <p className="source"><a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer">出典: {alert.sourceLabel}公式サイトで見る</a></p>
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
