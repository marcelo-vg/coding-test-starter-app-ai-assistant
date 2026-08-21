# assistant-listing

A gig listing page with a conversational assistant in the bottom-right corner.

The listing shows 10 gigs and can be filtered by category and by remote/on-site.
The assistant is a general-purpose chat interface backed by an LLM.

## Getting started

```bash
npm install
cd client && npm install && cd ..

cp .env.example .env   # then paste in the API key
npm run dev
```

`npm run dev` starts the Express API on port 3001 and the Vite dev server on
port 3000. Open http://localhost:3000.

## Project layout

```
shared/types.ts     Types used by both the server and the client
server/             Express API
  index.ts            App setup and route mounting
  config.ts           Environment variables
  llm.ts              LLM client
  data/gigs.ts        Mock listing data
  routes/             Route handlers
client/src/
  api/request.ts      fetch wrapper for the JSON API
  gigs/               Listing page: data loading, filtering, presentation
  chat/               Chat widget: transcript, composer, request lifecycle
```

## API

### `GET /api/gigs`

Filtering and pagination both happen on the server, so the client only ever
holds the page it is showing.

| Parameter    | Default | Notes                                          |
| ------------ | ------- | ---------------------------------------------- |
| `category`   | all     | Must be a known category, or the request 400s  |
| `remoteOnly` | `false` | `true` to exclude on-site gigs                 |
| `page`       | `1`     | 1-based                                        |
| `pageSize`   | `10`    | Capped at 50                                   |

```json
{
  "gigs": [{ "id": "gig-001", "title": "…", "category": "Warehouse", "payRate": 24, "location": "Denver, CO", "remote": false, "postedAt": "2026-08-10", "description": "…" }],
  "page": 1,
  "pageSize": 10,
  "total": 30,
  "categories": ["Admin", "Cleaning", "Customer Support", "Delivery", "Events", "Hospitality", "Retail", "Warehouse"]
}
```

`total` counts every gig matching the filters, not just the current page.
`categories` lists the whole catalogue so the filter dropdown does not shrink to
whatever happens to be on screen.

### `POST /api/chat`

```json
{ "messages": [{ "role": "user", "content": "hello" }] }
```

Streams the assistant's reply back as `text/plain`, a chunk at a time.

Errors come back as `{ "error": "…" }` with a 4xx or 5xx status. The response
status is held back until the first chunk arrives, so a request that fails
before the reply starts is still reported as JSON; a failure part-way through a
reply can only close the stream early.

## Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Run the API and the client together          |
| `npm run dev:server`| API only, with reload on change              |
| `npm run dev:client`| Client only                                  |
| `npm run typecheck` | Typecheck both the server and the client     |
