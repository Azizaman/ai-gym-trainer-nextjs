import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * Generate a new verification token for an email.
 * Deletes any existing tokens for that email first.
 */
export async function generateVerificationToken(email: string) {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete existing tokens for this email
    await prisma.verificationToken.deleteMany({
        where: { identifier: email },
    });

    const verificationToken = await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });

    return verificationToken;
}

/**
 * Look up a verification token by its token string.
 */
export async function getVerificationTokenByToken(token: string) {
    return prisma.verificationToken.findUnique({
        where: { token },
    });
}
