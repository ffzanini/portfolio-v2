import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Bots que devem ser bloqueados na borda (403) para não consumir edge requests. Alinhado ao robots.ts. */
const BLOCKED_BOT_PATTERNS = [
  /\bgptbot\b/i,
  /\bchatgpt-user\b/i,
  /\bccbot\b/i,
  /\banthropic-ai\b/i,
  /\bclaudebot\b/i,
  /\bcohere-ai\b/i,
];

const BAD_USER_AGENT_PATTERNS = [
  /\bsqlmap\b/i,
  /\bnikto\b/i,
  /\bmasscan\b/i,
  /\bnmap\b/i,
  /\bacunetix\b/i,
  /\bnessus\b/i,
  /\bdirbuster\b/i,
  /\bhydra\b/i,
  /\bzgrab\b/i,
  /\bcensys\b/i,
  /\bshodan\b/i,
  /\bheadlesschrome\b/i,
  /\bphantomjs\b/i,
  /\blibwww-perl\b/i,
  /^$/,
  /^-$/,
  /^\s*$/,
];

const ALLOWED_BOT_PREFIXES = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "vercel",
  "next",
];

const FORBIDDEN_HEADERS = {
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
};

function isBlockedBot(ua: string): boolean {
  return BLOCKED_BOT_PATTERNS.some((pattern) => pattern.test(ua));
}

function isAllowedBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  return ALLOWED_BOT_PREFIXES.some((prefix) => lower.includes(prefix));
}

function isBadUserAgent(ua: string | null): boolean {
  if (ua == null || ua.trim().length < 10) return true;
  if (isAllowedBot(ua)) return false;
  return BAD_USER_AGENT_PATTERNS.some((pattern) => pattern.test(ua));
}

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";

  if (isBlockedBot(ua) || isBadUserAgent(ua)) {
    return new NextResponse(null, {
      status: 403,
      headers: FORBIDDEN_HEADERS,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf)$).*)",
  ],
};
