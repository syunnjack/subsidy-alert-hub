# Subsidy Alert Hub

補助金・助成金・自治体募集通知

## Repository

Recommended repository name: `subsidy-alert-hub`

## Domain candidates

First candidate: `subsidyalert.jp`

Other candidates:

- `subsidyalert.jp`
- `hojokinwatch.jp`
- `joseikin.jp`
- `localgrant.jp`

## Concept

補助金、助成金、公募、自治体募集の期限を通知し、士業相談、資料販売、申請支援へつなげる。

## Technical Selection

- Frontend: Vite + React 19
- Styling: Plain CSS
- Initial data: Static alert seed records in `src/App.jsx`
- Local state: localStorage for MVP saved alerts and UGC requests
- Notification integrations: LINE Messaging API, X API, transactional email provider, Slack Incoming Webhooks
- Future data layer: Supabase or Cloudflare D1
- SEO/AIO/LLMO: structured data, answer block, FAQ, sitemap, robots and `llms.txt`

## Revenue Paths

- 士業紹介
- 相談送客
- 資料販売
- 申請支援
- 法人プラン

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```
