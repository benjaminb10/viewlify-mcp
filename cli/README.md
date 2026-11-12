# viewlify

Viewlify from your terminal: search TikTok videos that outperform their creator's usual views, check your API credit, top up, and set up the MCP server for Claude Code. Zero dependencies, Node 18+.

```sh
npx viewlify login                                     # paste a key from viewlify.app/settings#api
npx viewlify search "skincare" --sort outlier --limit 5
npx viewlify search "gym" --days 7 --json
npx viewlify balance
npx viewlify topup 10                                  # opens a Stripe payment page
npx viewlify mcp                                       # prints the `claude mcp add` command
```

- Sorts: `trending` (views per day, default), `outlier` (views divided by the creator's usual views), `views`, `recent`, `engagement`, `shares`. Filters: `--niche`, `--days`, `--limit` (up to 50).
- Every video comes with its views, likes, comments, shares, shares per 1,000 views, its multiple over the creator's usual views and the view history Viewlify recorded.
- Pricing: $0.005 per call from a prepaid credit ($1 free for every account, top-ups of 5, 10, 25, 50 or 100 USD, valid 12 months), or included in the Pro and Agency plans. Out of credit, the CLI prints a payment link and exits with code 2.
- The key is read from `VIEWLIFY_API_KEY`, else `~/.config/viewlify/key` (written by `login`, mode 600).

Docs and prices: https://viewlify.app/tiktok-data-api
