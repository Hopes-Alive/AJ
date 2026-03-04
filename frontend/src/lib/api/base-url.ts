const LOCAL_BACKEND_FALLBACK = "http://localhost:4000";

function looksLikeHost(value: string): boolean {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function normalizeBaseUrl(value?: string): string {
  const raw = (value ?? "").trim();
  if (!raw) return LOCAL_BACKEND_FALLBACK;

  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    try {
      const parsed = new URL(withoutTrailingSlash);
      // Handle values accidentally set like:
      // https://frontend.vercel.app/backend-project.vercel.app
      const firstPathSegment = parsed.pathname.split("/").filter(Boolean)[0];
      if (firstPathSegment && looksLikeHost(firstPathSegment)) {
        return `https://${firstPathSegment}`;
      }
    } catch {
      // Fall back to original value if URL parsing fails.
    }
    return withoutTrailingSlash;
  }
  if (withoutTrailingSlash.startsWith("//")) {
    return `https:${withoutTrailingSlash}`;
  }

  // Handle accidental leading slash values like "/my-backend.vercel.app".
  const withoutLeadingSlash = withoutTrailingSlash.replace(/^\/+/, "");
  if (!withoutLeadingSlash) return LOCAL_BACKEND_FALLBACK;

  return `https://${withoutLeadingSlash}`;
}

export const BACKEND_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_BACKEND_URL
);
