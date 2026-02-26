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
            const isVerifyPage = nextUrl.pathname.startsWith("/verify-email");

            // Unauthenticated users can't access dashboard
            if (isOnDashboard && !isLoggedIn) {
                return false; // Redirect to login
            }

            // Logged-in users trying to access dashboard — check email verification
            if (isOnDashboard && isLoggedIn) {
                const emailVerified = auth?.user?.emailVerified;
                if (!emailVerified) {
                    return Response.redirect(new URL("/verify-email", nextUrl));
                }
            }

            // Authenticated & verified users on auth pages → go to dashboard
            // Unverified users can access auth pages (e.g. "Back to Sign In" from verify-email)
            if (isAuthPage && isLoggedIn) {
                const emailVerified = auth?.user?.emailVerified;
                if (emailVerified) {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
            }

            // Verify page is always accessible (for both logged-in and not)
            if (isVerifyPage) {
                return true;
            }

            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.emailVerified = user.emailVerified || null;
            }
            // When session is updated (e.g., after email verification)
            if (trigger === "update" && session?.emailVerified) {
                token.emailVerified = session.emailVerified;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.emailVerified = token.emailVerified as Date | null;
            }
            return session;
        },
    },
};

