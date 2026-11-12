import { test } from "node:test";
import assert from "node:assert/strict";
import { formatBalance, formatSearch, looksLikeKey, mcpCommand, parseArgs, searchQuery, topupAmount } from "../lib/args.mjs";

test("parseArgs: command, positional, flags", () => {
  assert.deepEqual(parseArgs(["search", "skincare", "routine", "--sort", "outlier", "--limit=5", "--json"]), {
    command: "search",
    positional: ["skincare", "routine"],
    flags: { sort: "outlier", limit: "5", json: true },
  });
  assert.equal(parseArgs([]).command, "help");
  assert.equal(parseArgs(["balance", "--help"]).command, "help");
  assert.equal(parseArgs(["-v"]).command, "version");
  assert.deepEqual(parseArgs(["topup", "10", "--no-open"]).flags, { "no-open": true });
  assert.deepEqual(parseArgs(["search", "--", "--weird"]).positional, ["--weird"]);
});

test("searchQuery builds the API query and validates", () => {
  assert.deepEqual(searchQuery(["skincare"], { sort: "Outlier", limit: "5", days: "30" }), { query: "q=skincare&sort=outlier&days=30&limit=5" });
  assert.deepEqual(searchQuery([], { niche: "beauty" }), { query: "niche=beauty" });
  assert.ok(searchQuery([], {}).error);
  assert.ok(searchQuery(["x"], { sort: "random" }).error);
  assert.ok(searchQuery(["x"], { limit: "ten" }).error);
});

test("topupAmount accepts only fixed amounts", () => {
  assert.equal(topupAmount(["10"]), 10);
  assert.equal(topupAmount(["$50"]), 50);
  assert.equal(topupAmount(["49"]), null);
  assert.equal(topupAmount([]), null);
});

test("looksLikeKey", () => {
  assert.ok(looksLikeKey("vf_live_abcdefghijklmnopqrstuvwxyz0123"));
  assert.ok(!looksLikeKey("sk_live_abc"));
  assert.ok(!looksLikeKey(""));
});

test("formatting", () => {
  const out = formatSearch({
    query: "skincare",
    sort: "outlier",
    matches: 41,
    videos: [{ handle: "a", views: 1840000, vsUsual: 23.6, sharesPer1k: 17.07, caption: "routine", url: "https://t/1" }],
    usage: { billing: "credit", charged_usd: 0.005, balance_usd: 0.87 },
  });
  assert.match(out, /1 of 41 videos for "skincare"/);
  assert.match(out, /@a {2}1\.8M views {2}23\.6x usual/);
  assert.match(out, /Balance: \$0\.87/);
  assert.match(formatBalance({ balance: "$0.87", calls_left: 174, call_cost_usd: 0.005, usage_last_days: [] }), /\$0\.87 \(about 174 calls/);
  assert.match(mcpCommand(null), /vf_live_YOUR_KEY/);
});
