import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: any) {
  const publicPaths = ["/login", "/register", "/landing", "/api/auth"];
  if (publicPaths.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const session = await auth(request);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/landing", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
