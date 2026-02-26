import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Edge-compatible auth config (no Prisma/Node.js dependencies)
// Used by middleware for route protection
export const authConfig: NextAuthConfig = {
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // Credentials provider placeholder for middleware compatibility
        // Full authorize logic is in auth.ts (Node.js runtime)
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: () => null, // Actual logic in auth.ts
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isAuthPage = ["/login", "/signup"].some((p) =>
                nextUrl.pathname.startsWith(p)
            );

            if (isOnDashboard && !isLoggedIn) {
                return false; // Redirect to login
            }

            if (isAuthPage && isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};
