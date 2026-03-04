const LOCAL_BACKEND_FALLBACK = "http://localhost:4000";

function normalizeBaseUrl(value?: string): string {
  const raw = (value ?? "").trim();
  if (!raw) return LOCAL_BACKEND_FALLBACK;

  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }
  if (withoutTrailingSlash.startsWith("//")) {
    return `https:${withoutTrailingSlash}`;
  }
  return `https://${withoutTrailingSlash}`;
}

export const BACKEND_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_BACKEND_URL
);
