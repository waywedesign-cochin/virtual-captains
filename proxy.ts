import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ============================================================================
 * UNDER DEVELOPMENT TOGGLE
 * ============================================================================
 *
 * • Set `UNDER_DEVELOPMENT_ACTIVE = true` (default) when presenting to clients
 *   or deploying to production. Any page other than Home ("/") will redirect
 *   to `/under-development`.
 *
 * • Set `UNDER_DEVELOPMENT_ACTIVE = false` during local development whenever
 *   you want to access and work on subpages (/about, /salesx, /organisations, etc.).
 *
 * • Can also be controlled dynamically via environment variable:
 *   NEXT_PUBLIC_UNDER_DEVELOPMENT=true|false
 */
export const UNDER_DEVELOPMENT_ACTIVE = true;

export function proxy(request: NextRequest) {
  // Respect environment variable if provided, otherwise fallback to the toggle constant
  const isEnabled =
    process.env.NEXT_PUBLIC_UNDER_DEVELOPMENT === "true" ||
    process.env.ENABLE_UNDER_DEVELOPMENT === "true" ||
    (process.env.NEXT_PUBLIC_UNDER_DEVELOPMENT !== "false" &&
      UNDER_DEVELOPMENT_ACTIVE);

  if (!isEnabled) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // 1. Allow the Home Page ("/")
  if (pathname === "/") {
    return NextResponse.next();
  }

  // 2. Allow the Under Development page itself to avoid redirect loops
  if (pathname.startsWith("/under-development")) {
    return NextResponse.next();
  }

  // 3. Allow internal API routes and static asset paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 4. Redirect all other subpages to /under-development with referring path
  const redirectUrl = new URL("/under-development", request.url);
  redirectUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(redirectUrl);
}

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata file)
     * - common static files with extensions (.svg, .png, .jpg, .webp, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|ico|woff|woff2)$).*)",
  ],
};
