import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

/** POST — Send or resend a verification email */
export async function POST(request: Request) {
    try {
        // Allow both authenticated users and unauthenticated requests (with email in body)
        const session = await auth();
        let email: string | undefined;

        if (session?.user?.email) {
            email = session.user.email;
        } else {
            const body = await request.json();
            email = body.email;
        }

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Ensure the user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal that the user doesn't exist
            return NextResponse.json({
                success: true,
                message: "If an account exists, a verification email has been sent.",
            });
        }

        if (user.emailVerified) {
            return NextResponse.json({
                success: true,
                message: "Email is already verified.",
                alreadyVerified: true,
            });
        }

        // Generate token and send email
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token);

        return NextResponse.json({
            success: true,
            message: "Verification email sent. Please check your inbox.",
        });
    } catch (error) {
        console.error("Send verification error:", error);
        return NextResponse.json(
            { error: "Failed to send verification email" },
            { status: 500 }
        );
    }
}
