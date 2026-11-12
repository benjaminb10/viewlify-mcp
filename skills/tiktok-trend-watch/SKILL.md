---
name: tiktok-trend-watch
description: A short weekly brief of what is rising on TikTok in a niche (videos, hashtags and sounds gaining views fastest) and what it means for the user's next posts. Use when the user asks what is trending on TikTok, wants a weekly trend report for a niche or a client, or asks which hashtags or sounds to use. Needs the Viewlify MCP server.
---

# TikTok trend watch

## Before you start

Needs the Viewlify MCP server (`get_trending`, `get_trending_hashtags`, `get_outliers`). Setup:
`claude mcp add --transport http viewlify https://viewlify.app/api/mcp --header "Authorization: Bearer vf_live_YOUR_KEY"`.
Without a key the tools return a short preview; a free key comes from viewlify.app Settings > API & MCP.

## Steps

1. **Niche.** One of: beauty, gaming, food, fitness, fashion, comedy, dance, pets, football, sports, music,
   travel, tech, cars, money, learning, home, art, motivation, anime. Several niches = one section each.
2. **Pull the week.** `get_trending` (videos, hashtags and sounds ranked by view velocity),
   `get_trending_hashtags`, then `get_outliers` with `limit: 10` for the breakouts behind the trend.
3. **Separate signal from noise.** A hashtag or sound counts as a trend only if it shows up under several
   different creators. One creator posting the same tag ten times is not a trend.

## Output

A brief that fits on one screen:

- **This week in <niche>**: two sentences.
- **Rising formats**: 2 or 3, each with one example link.
- **Hashtags worth using**: up to 8, the ones recurring across creators, not the generic ones (#fyp, #viral).
- **Sounds**: up to 5 with an example video each, when the data has them.
- **Breakouts to study**: 5 videos with their multiple and link.
- **For your next post**: one concrete suggestion.

Date the brief. Never invent a number or a trend that is not in the data.
