import { NextResponse, NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

import {authRoutes, DEFAULT_LOGIN_REDIRECT, LOGIN} from '@/constants/routes';

const hankoApiUrl = process.env.NEXT_PUBLIC_HANKO_API_URL;

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const hanko = req.cookies.get('hanko')?.value;

  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${hankoApiUrl}/.well-known/jwks.json`)
    );

    const verifiedJWT = await jwtVerify(hanko ?? "", JWKS);

    if (isAuthRoute && verifiedJWT) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if(!verifiedJWT) {
      if(isApiRoute) return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
      if(!isAuthRoute) return NextResponse.redirect(new URL(LOGIN, nextUrl));
    }
  } catch {
    if(isApiRoute) return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    if(!isAuthRoute) return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};