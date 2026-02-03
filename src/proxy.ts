import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

  if (isBadUserAgent(ua)) {
    return new NextResponse(null, {
      status: 403,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf)$).*)",
  ],
};
