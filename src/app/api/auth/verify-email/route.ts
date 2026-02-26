import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getVerificationTokenByToken } from "@/lib/tokens";

/** GET /api/auth/verify-email?token=... — Verify the email token */
export async function GET(request: NextRequest) {
    try {
        const token = request.nextUrl.searchParams.get("token");

        if (!token) {
            return NextResponse.redirect(
                new URL("/verify-email?error=missing-token", request.url)
            );
        }

        const verificationToken = await getVerificationTokenByToken(token);

        if (!verificationToken) {
            return NextResponse.redirect(
                new URL("/verify-email?error=invalid-token", request.url)
            );
        }

        // Check if token has expired
        if (new Date() > verificationToken.expires) {
            // Delete the expired token
            await prisma.verificationToken.delete({
                where: { token },
            });

            return NextResponse.redirect(
                new URL("/verify-email?error=expired-token", request.url)
            );
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier },
        });

        if (!user) {
            return NextResponse.redirect(
                new URL("/verify-email?error=user-not-found", request.url)
            );
        }

        // Mark user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() },
        });

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { token },
        });

        // Redirect to login with success message
        return NextResponse.redirect(
            new URL("/login?verified=true", request.url)
        );
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.redirect(
            new URL("/verify-email?error=server-error", request.url)
        );
    }
}
