#!/usr/bin/env node
// Viewlify CLI. Zero dependencies, Node >= 18 (global fetch).
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile, chmod, rm } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { COMMANDS, formatBalance, formatSearch, looksLikeKey, mcpCommand, parseArgs, searchQuery, topupAmount, TOPUP_AMOUNTS } from "../lib/args.mjs";

const VERSION = "0.1.0";
const BASE = process.env.VIEWLIFY_API_URL || "https://viewlify.app";
const DIR = join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "viewlify");
const KEY_FILE = join(DIR, "key");

const HELP = `viewlify ${VERSION}: TikTok videos that outperform, from your terminal

  viewlify login                     save your API key (opens Settings > API keys)
  viewlify search "skincare" [--sort trending|outlier|views|recent|engagement|shares]
                  [--niche beauty] [--days 30] [--limit 10] [--json]
  viewlify balance [--json]          your API credit
  viewlify topup 10 [--no-open]      payment link for 5, 10, 25, 50 or 100 USD
  viewlify mcp                       the "claude mcp add" command, ready to paste
  viewlify logout

Key: VIEWLIFY_API_KEY, else ${KEY_FILE}. Docs and prices: ${BASE}/tiktok-data-api`;

function openUrl(url) {
  const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  try {
    spawn(cmd, args, { stdio: "ignore", detached: true }).unref();
  } catch {
    /* the URL is printed anyway */
  }
}

async function readKey() {
  if (process.env.VIEWLIFY_API_KEY) return process.env.VIEWLIFY_API_KEY.trim();
  try {
    return (await readFile(KEY_FILE, "utf8")).trim();
  } catch {
    return null;
  }
}

async function api(method, path, body) {
  const key = await readKey();
  if (!key) throw new Error("No API key yet. Run: viewlify login");
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "User-Agent": `viewlify-cli/${VERSION}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

async function main() {
  const { command, positional, flags } = parseArgs(process.argv.slice(2));
  if (!COMMANDS.includes(command)) {
    console.error(`Unknown command "${command}".\n\n${HELP}`);
    process.exit(1);
  }
  if (command === "help") return console.log(HELP);
  if (command === "version") return console.log(VERSION);

  if (command === "login") {
    const url = `${BASE}/settings#api`;
    console.log(`Create a key in Settings > API & MCP (any account, $1 free credit):\n  ${url}`);
    openUrl(url);
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const key = (await rl.question("Paste your key (vf_live_...): ")).trim();
    rl.close();
    if (!looksLikeKey(key)) throw new Error("That does not look like a Viewlify key (vf_live_...).");
    await mkdir(DIR, { recursive: true, mode: 0o700 });
    await writeFile(KEY_FILE, `${key}\n`, { mode: 0o600 });
    await chmod(KEY_FILE, 0o600);
    console.log(`Saved to ${KEY_FILE}. Try: viewlify balance`);
    return;
  }
  if (command === "logout") {
    await rm(KEY_FILE, { force: true });
    return console.log("Key removed.");
  }
  if (command === "mcp") {
    console.log(mcpCommand(await readKey()));
    return;
  }
  if (command === "balance") {
    const b = await api("GET", "/api/v1/balance");
    return console.log(flags.json ? JSON.stringify(b, null, 2) : formatBalance(b));
  }
  if (command === "topup") {
    const amount = topupAmount(positional);
    if (!amount) throw new Error(`Usage: viewlify topup <amount>, amount in USD: ${TOPUP_AMOUNTS.join(", ")}`);
    const r = await api("POST", "/api/v1/topup", { amount });
    console.log(`Pay $${amount} (credit: $${r.credit_usd}) here:\n  ${r.checkout_url}`);
    if (!flags["no-open"]) openUrl(r.checkout_url);
    return;
  }
  if (command === "search") {
    const sq = searchQuery(positional, flags);
    if (sq.error) throw new Error(sq.error);
    const body = await api("GET", `/api/v1/trending/search?${sq.query}`);
    return console.log(flags.json ? JSON.stringify(body, null, 2) : formatSearch(body));
  }
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  if (e.data?.topup_url) console.error(`Top up: ${e.data.topup_url}`);
  process.exit(e.status === 402 ? 2 : 1);
});
