# assistant-listing

A gig listing page with a conversational assistant in the bottom-right corner.

The listing shows 10 gigs and can be filtered by category and by remote/on-site.
The assistant is a general-purpose chat interface backed by an LLM.

## Getting started

Requires [Node](https://nodejs.org) 22+ and [uv](https://docs.astral.sh/uv/)
(which installs Python 3.11+ for you if needed).

```bash
npm install
npm run setup          # installs the Python and client dependencies

cp .env.example .env   # then paste in the API key
npm run dev
```

`npm run dev` starts the FastAPI server on port 3001 and the Vite dev server on
port 3000. Open http://localhost:3000. The SQLite database is created and
seeded with the gigs on first start.

## Project layout

```
backend/            FastAPI API (Python, managed with uv)
  app/main.py         App setup and route mounting
  app/config.py       Environment variables
  app/db.py           SQLite schema and seeding (seed_gigs.json)
  app/gigs.py         Gig queries
  app/conversations.py  Stored conversations and messages
  app/agent.py        LLM client and the tool-calling loop
  app/tools.py        Tool registry (validates the model's tool inputs)
  app/assistant_tools.py  The assistant's tools, starting with a date tool
  app/context.py      Trims the history sent to the model
  app/routes/         Route handlers
  tests/              pytest suite
client/src/
  types.ts            API types (mirror backend/app/models.py)
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
{ "messages": [{ "role": "user", "content": "hello" }], "conversationId": "…" }
```

`conversationId` is optional. Streams the assistant's reply back as
`text/plain`, a chunk at a time. The `X-Conversation-Id` response header names
the stored conversation; the newest message and the reply are recorded under it.

### `GET /api/chat/{conversationId}`

Returns `{ "id": "…", "messages": [{ "role": "…", "content": "…" }] }`, or a 404
for an unknown id.

Errors come back as `{ "error": "…" }` with a 4xx or 5xx status. The response
status is held back until the first chunk arrives, so a request that fails
before the reply starts is still reported as JSON; a failure part-way through a
reply can only close the stream early.

## Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run setup`      | Install the Python and client dependencies   |
| `npm run dev`        | Run the API and the client together          |
| `npm run dev:server` | API only, with reload on change              |
| `npm run dev:client` | Client only                                  |
| `npm test`           | Run the backend tests                        |
| `npm run typecheck`  | Typecheck the client                         |
