---
name: tiktok-video-ideas
description: Write TikTok video ideas grounded in what is breaking out right now in a niche, each with a hook, a 3-beat outline and the real video it is modeled on. Use when the user asks what to post on TikTok, needs content ideas for a niche or an account, or wants hooks and scripts. Needs the Viewlify MCP server.
---

# TikTok video ideas from real breakouts

Ideas guessed from nothing are generic. These are adapted from videos that beat their creator's usual views
this month, so every idea comes with its proof.

## Before you start

Needs the Viewlify MCP server (`get_outliers`, `get_trending`, and with a key `search_trending_videos`).
Setup: `claude mcp add --transport http viewlify https://viewlify.app/api/mcp --header "Authorization: Bearer vf_live_YOUR_KEY"`.
A free key comes from viewlify.app Settings > API & MCP ($1 of free credit). Without a key the tools return a
short preview: say so once and work with it.

## Steps

1. **Know the creator.** Niche, audience, what they can film (face to camera or not, at home or outside,
   language). Ask in one short message if the request does not say. If they give their @handle and a key with
   a Pro or Agency plan is set, `get_account_videos` shows their usual views and what worked for them before.
2. **Collect the proof.** `get_outliers` for the niche (or `search_trending_videos` with `sort: "outlier"`,
   `days: 30`) and `get_trending` for the same niche. Keep 8 to 12 videos with a multiple of 3 or more.
3. **Adapt, do not copy.** For each idea, take the mechanism of a breakout (the promise, the tension, the
   format) and move it to the creator's own topic and constraints.

## Output

5 ideas. For each:

- **Title** (a few words).
- **Hook**: the first sentence said or shown in the first 2 seconds. Concrete, under 15 words.
- **Outline** in 3 beats: setup, payoff, ending that invites a comment or a share.
- **Modeled on**: the source video link, its creator and its multiple.
- **Why it should work**: one sentence tied to the pattern.

Then one line on which idea to film first and why. Never promise views or virality.
