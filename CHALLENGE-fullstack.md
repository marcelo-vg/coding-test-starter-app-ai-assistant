# Challenge: Full-stack / Back-end

This is a working starter app: a gig listing page with a conversational
assistant already embedded (see `README.md` for setup and how the pieces fit
together). The back end is a FastAPI service backed by SQLite; the front end is
a small React app. The assistant can hold a conversation and has one tool, which
tells it today's date. But it knows nothing about the gigs in the catalogue and
cannot act on the listing — ask it what gigs pay the most, or ask it to show only
remote warehouse work, and it will tell you plainly that it can't.

**Your task: make it useful.** At minimum, a user should be able to ask the
assistant questions about the gigs and get answers grounded in the real data,
and ask it to take actions — like filtering or sorting — on their behalf.

There's no skeleton to fill in and no hints about where to hook in. Reading
and understanding the existing code is part of this.

## How we'll work

This is a pairing session — you'll drive, we'll talk through your thinking as you
go. Before you start changing anything, be ready to walk us through how the
starter app works: what happens between a message leaving the chat widget and the
reply arriving back, and where the LLM call lives.

There are several reasonable ways to approach this. Pick one, and be able to
explain why and what the tradeoffs are.

AI assistance is allowed.

## Getting started

Follow `README.md` to install dependencies and run the app locally. You'll need
Node 22+ and [uv](https://docs.astral.sh/uv/). If you're joining via a shared
environment for the session, you won't need to do this yourself.
