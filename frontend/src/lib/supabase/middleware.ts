import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Avoid failing all routes in deployments where env vars are not set yet.
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: User | null = null;
  try {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch {
    return supabaseResponse;
  }

  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdminPage = pathname === "/admin";
  const isDeveloperPage = pathname === "/developer";
  const isCatalogPage = pathname.startsWith("/dashboard/catalog");
  const isOldAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Redirect old auth URLs to /admin
  if (isOldAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Protect dashboard routes.
  if (isDashboard) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    const isAdmin = user.user_metadata?.is_admin === true;
    const isDeveloper = user.user_metadata?.is_developer === true;

    // Catalog page is developer-only.
    if (isCatalogPage) {
      if (!isDeveloper) {
        const url = request.nextUrl.clone();
        url.pathname = isAdmin ? "/dashboard" : "/developer";
        return NextResponse.redirect(url);
      }
    } else if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = isDeveloper ? "/dashboard/catalog" : "/admin";
      return NextResponse.redirect(url);
    }
  }

  // If admin is already logged in, skip the admin auth page
  if (isAdminPage && user?.user_metadata?.is_admin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If developer is already logged in, skip the developer auth page
  if (isDeveloperPage && user?.user_metadata?.is_developer) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/catalog";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
