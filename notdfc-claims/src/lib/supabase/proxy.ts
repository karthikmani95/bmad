import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Protect routes that require authentication (exclude /, /auth/*)
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname !== "/" &&
    !pathname.startsWith("/auth");

  if (isProtectedRoute) {
    // Accept either Supabase session OR SSO mock token
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    const ssoToken = request.cookies.get("notdfc_sso_token")?.value;

    let isAuthenticated = !!supabaseUser;
    if (!isAuthenticated && ssoToken) {
      const { verifyMockToken } = await import("@/../tests/__mocks__/bank-sso");
      const ssoUser = await verifyMockToken(ssoToken);
      isAuthenticated = !!ssoUser;
      if (isAuthenticated && ssoUser) {
        console.info(`Proxy: Validated SSO session for user ${ssoUser.email}`);
      } else {
        console.error("Proxy: Invalid SSO Token. Clearing cookie.");
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("notdfc_sso_token");
        supabaseResponse.cookies.getAll().forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
        return response;
      }
    }

    if (!isAuthenticated) {
      console.warn(`Proxy: Unauthenticated access to ${pathname}. Redirecting to /auth/login.`);
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      supabaseResponse.cookies.getAll().forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options)
      );
      return response;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
