import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth")?.value;

    
    const protectedRoutes = ["/dashboard", "/admin" , "/admin/snippets", "/admin/users", "/admin/problems", "/admin/snippets/new", "/admin/snippets/edit/[id]"];

    if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};