---
name: tiktok-outlier-research
description: Find the TikTok videos in a niche or on a topic that beat their creator's usual views, and explain what they have in common (hooks, formats, length, sounds, hashtags). Use when the user asks what is working on TikTok in a niche, wants viral examples to study, or asks why some videos in a niche blow up. Needs the Viewlify MCP server.
---

# TikTok outlier research

Raw views mislead: 50K views is a flop for a creator who usually gets 500K and a breakout for one who usually
gets 2K. This skill looks at the **multiple**, views divided by the creator's usual views, so the user studies
videos that really broke out for their size.

## Before you start

The Viewlify MCP server must be connected (tools `get_outliers`, `get_trending`, `get_trending_hashtags`).
If it is missing, tell the user to run:

```
claude mcp add --transport http viewlify https://viewlify.app/api/mcp --header "Authorization: Bearer vf_live_YOUR_KEY"
```

Without a key the tools still answer, with a 5-result preview and no multiple. A key is free to create in
viewlify.app Settings > API & MCP (every account gets $1 of credit, then $0.02 per video returned). Say so once if the
results come back as a preview, then work with what you have.

## Steps

1. **Pin the scope.** A niche (one of: beauty, gaming, food, fitness, fashion, comedy, dance, pets, football,
   sports, music, travel, tech, cars, money, learning, home, art, motivation, anime) or a free-text topic
   (keyword, #hashtag, @creator). Ask only if the request gives neither.
2. **Pull the outliers.** `get_outliers` with `niche` or `search`, `limit` 20 to 30. If a key is set and the
   topic is narrow, `search_trending_videos` with `q`, `sort: "outlier"` and `days: 30` reaches the whole base.
3. **Keep the real breakouts.** A multiple of 3 or more. Drop videos under 48 hours old if the data flags them.
   If fewer than 5 remain, say the sample is thin rather than stretching it.
4. **Find the patterns.** Read captions, hashtags and sounds. Group the videos by what they share: the hook
   (first line or promise), the format (tutorial, list, before/after, story, reaction, POV), the length when
   known, the sound (original or trending), the posting day. Only name a pattern seen in at least 3 videos.
5. **Add context.** `get_trending_hashtags` for the same niche shows which tags are recurring under what is
   breaking out right now.

## Output

- One sentence: what is working in this niche right now.
- 3 to 5 patterns, each with the number of videos that show it and 2 example links.
- A table of the top 10 outliers: creator, multiple, views, shares per 1,000 views when available, link.
- What to try next: 2 or 3 concrete angles the user could film this week, each tied to a pattern above.

Never invent a number. If a field is missing from the data, leave it out.
