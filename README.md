# Viewlify MCP: TikTok data for Claude and AI agents

Ask Claude which TikTok videos are really breaking out in a niche, and why. Viewlify tracks public TikTok
videos and compares each one with its creator's usual views: a video at 50K views is a flop for an account
that usually gets 500K and a breakout for one that usually gets 2K. That ratio, the **multiple**, is what this
server returns, along with the videos, hashtags and sounds gaining views fastest by niche.

This repository holds everything you need to use Viewlify from Claude Code, Claude, Cursor or any MCP client:

- the remote **MCP server** configuration (`https://viewlify.app/api/mcp`),
- a **Claude Code plugin** with three skills built on it,
- the source of the **`viewlify` command-line tool** published on npm.

The server itself is hosted by Viewlify; there is nothing to run locally.

## Quick start

**Claude Code, as a plugin** (MCP server and the three skills):

```
/plugin marketplace add benjaminb10/viewlify-mcp
/plugin install viewlify@viewlify
```

Then set your key in the environment before starting Claude Code (optional, see below):

```
export VIEWLIFY_API_KEY=vf_live_YOUR_KEY
```

**Claude Code, the MCP server only:**

```
claude mcp add --transport http viewlify https://viewlify.app/api/mcp --header "Authorization: Bearer vf_live_YOUR_KEY"
```

**Claude (claude.ai or Desktop):** Settings > Connectors > Add custom connector, URL `https://viewlify.app/api/mcp`.

**Cursor and other clients:** a Streamable HTTP server at `https://viewlify.app/api/mcp`, with the header
`Authorization: Bearer vf_live_YOUR_KEY`.

**Terminal:** `npx viewlify login`, then `npx viewlify search "skincare" --sort outlier --limit 5`.
`npx viewlify mcp` prints the `claude mcp add` command with your key.

## API key and price

The key is optional. Without it, the public tools answer with a 5-result preview (20 calls a day per IP).

With a key you get full results, the outlier multiple, shares per 1,000 views, the view history Viewlify
recorded, and search across every video in the base. Any Viewlify account can create a key in
[Settings > API & MCP](https://viewlify.app/settings#api), free plan included, with $1 of free credit.
After that it is $0.005 per call from a prepaid credit (top-ups of 5 to 100 USD), or included in the Pro
and Agency plans. Prices: [viewlify.app/tiktok-data-api](https://viewlify.app/tiktok-data-api).

## Tools

| Tool | Key | What it returns |
|---|---|---|
| `get_trending` | optional | Videos, hashtags and sounds breaking out right now, by niche |
| `get_outliers` | optional | Videos beating their creator's usual views by the widest margin, by niche or search |
| `get_trending_hashtags` | optional | Hashtags recurring under what is breaking out, by niche |
| `search_trending_videos` | required | Search the whole base by keyword, @creator or #hashtag; sort by trending, outlier, views, recent, engagement or shares |
| `get_balance`, `top_up` | required | API credit, and a payment link to add more |
| `list_my_accounts`, `get_account_growth`, `get_account_videos`, `get_my_niche_watch`, `get_my_video_checks` | Pro or Agency | Your own tracked accounts, their growth and videos, your niche watch and AI video checks |

Niches: beauty, gaming, food, fitness, fashion, comedy, dance, pets, football, sports, music, travel, tech,
cars, money, learning, home, art, motivation, anime. Read only: the server never posts or changes anything.

## Skills

| Skill | Use it to |
|---|---|
| [tiktok-outlier-research](skills/tiktok-outlier-research/SKILL.md) | Find what really breaks out in a niche and the patterns behind it |
| [tiktok-video-ideas](skills/tiktok-video-ideas/SKILL.md) | Get 5 video ideas with hooks, each modeled on a real breakout |
| [tiktok-trend-watch](skills/tiktok-trend-watch/SKILL.md) | A one-screen weekly brief of rising formats, hashtags and sounds |

Skills also work on claude.ai: download a skill folder and add it in Settings > Capabilities > Skills.

## Example prompts

- "What is breaking out in fitness on TikTok this month, and what do those videos have in common?"
- "Give me 5 video ideas for a cooking account that films at home, based on what works right now."
- "Weekly trend brief for beauty and fashion."
- "Search TikTok for videos about protein bars sorted by outlier, last 30 days."

## Data

Public TikTok data only: videos, captions, hashtags, sounds and public counters, refreshed daily. Viewlify is
not affiliated with TikTok.

## Repository layout

```
.claude-plugin/   plugin and marketplace manifests for Claude Code
.mcp.json         the MCP server the plugin connects (reads VIEWLIFY_API_KEY)
server.json       entry for the official MCP registry
skills/           the three skills
cli/              source of the viewlify npm package (zero dependencies, Node 18+)
```

## License

MIT. Issues and pull requests are welcome. Built by [Viewlify](https://viewlify.app/?utm_source=github&utm_medium=readme&utm_campaign=viewlify-mcp).
