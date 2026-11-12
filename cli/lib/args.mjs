// Argument parsing and output formatting, pure (unit tested in test/).

export const SORTS = ["trending", "outlier", "views", "recent", "engagement", "shares"];
export const TOPUP_AMOUNTS = [5, 10, 25, 50, 100];
export const COMMANDS = ["login", "logout", "balance", "topup", "search", "mcp", "help", "version"];

/**
 * parseArgs(["search", "skincare", "--sort", "outlier", "--limit=5", "--json"])
 * -> { command: "search", positional: ["skincare"], flags: { sort: "outlier", limit: "5", json: true } }
 */
export function parseArgs(argv) {
  const positional = [];
  const flags = {};
  const booleans = new Set(["json", "help", "h", "version", "v", "no-open"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") {
      positional.push(...argv.slice(i + 1));
      break;
    }
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      const name = eq > 0 ? a.slice(2, eq) : a.slice(2);
      if (eq > 0) flags[name] = a.slice(eq + 1);
      else if (booleans.has(name) || i + 1 >= argv.length || argv[i + 1].startsWith("-")) flags[name] = true;
      else flags[name] = argv[++i];
    } else if (a.startsWith("-") && a.length === 2) {
      const name = a.slice(1);
      if (booleans.has(name) || i + 1 >= argv.length || argv[i + 1].startsWith("-")) flags[name] = true;
      else flags[name] = argv[++i];
    } else positional.push(a);
  }
  let command = positional.shift() ?? "help";
  if (flags.help || flags.h) command = "help";
  if (flags.version || flags.v) command = "version";
  return { command, positional, flags };
}

/** Query string for /api/v1/trending/search, or { error }. */
export function searchQuery(positional, flags) {
  const q = positional.join(" ").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (flags.sort !== undefined) {
    const sort = String(flags.sort).toLowerCase();
    if (!SORTS.includes(sort)) return { error: `--sort must be one of: ${SORTS.join(", ")}` };
    params.set("sort", sort);
  }
  for (const k of ["niche", "days", "limit"]) {
    if (flags[k] === undefined || flags[k] === true) continue;
    if (k !== "niche" && !/^\d+$/.test(String(flags[k]))) return { error: `--${k} must be a number` };
    params.set(k, String(flags[k]));
  }
  if (!q && !params.has("niche")) return { error: 'Give a keyword, @creator or #hashtag, e.g. viewlify search "skincare" (or --niche beauty)' };
  return { query: params.toString() };
}

export function topupAmount(positional) {
  const n = Number(String(positional[0] ?? "").replace(/^\$/, ""));
  return TOPUP_AMOUNTS.includes(n) ? n : null;
}

export function looksLikeKey(s) {
  return /^vf_live_[A-Za-z0-9_-]{16,}$/.test(String(s ?? "").trim());
}

const compact = (n) => {
  const v = Number(n ?? 0);
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return String(v);
};

/** Human-readable search results. */
export function formatSearch(body) {
  const lines = [];
  const vids = body?.videos ?? [];
  lines.push(`${vids.length} of ${body?.matches ?? vids.length} videos${body?.query ? ` for "${body.query}"` : ""} (sort: ${body?.sort ?? "trending"})`);
  lines.push("");
  vids.forEach((v, i) => {
    const mult = v.vsUsual != null ? `  ${v.vsUsual}x usual` : "";
    const shares = v.sharesPer1k != null ? `  ${v.sharesPer1k} shares/1K` : "";
    lines.push(`${String(i + 1).padStart(2)}. @${v.handle ?? "?"}  ${compact(v.views)} views${mult}${shares}`);
    const cap = (v.caption ?? "").replace(/\s+/g, " ").trim();
    if (cap) lines.push(`    ${cap.length > 90 ? `${cap.slice(0, 89)}…` : cap}`);
    lines.push(`    ${v.url}`);
  });
  const u = body?.usage;
  if (u?.billing === "credit") lines.push("", `Charged $${u.charged_usd}. Balance: $${Number(u.balance_usd).toFixed(2)}`);
  else if (u?.billing === "included") lines.push("", `Included in your plan: ${u.today ?? "?"} of ${u.dailyLimit} searches today`);
  return lines.join("\n");
}

export function formatBalance(b) {
  const lines = [`Balance: ${b.balance} (about ${Number(b.calls_left).toLocaleString("en-US")} calls at $${b.call_cost_usd})`];
  if (b.included_searches_per_day) lines.push(`Plan: ${b.used_today ?? 0} of ${b.included_searches_per_day} included searches used today`);
  for (const u of (b.usage_last_days ?? []).slice(0, 7)) lines.push(`  ${u.day}  ${u.calls} calls  $${Number(u.spent_usd).toFixed(3)}`);
  lines.push(`Top up: viewlify topup 10   (amounts: ${TOPUP_AMOUNTS.join(", ")} USD)`);
  return lines.join("\n");
}

export function mcpCommand(key) {
  return `claude mcp add --transport http viewlify https://viewlify.app/api/mcp \\\n  --header "Authorization: Bearer ${key || "vf_live_YOUR_KEY"}"`;
}
