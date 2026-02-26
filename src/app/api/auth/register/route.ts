import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Hash password and create user with starter subscription
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.create({
            data: {
                name: name || null,
                email,
                password: hashedPassword,
                subscription: {
                    create: {
                        plan: "starter",
                        status: "active",
                    },
                },
            },
        });

        // Generate verification token and send email
        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(email, verificationToken.token);

        return NextResponse.json(
            {
                message: "Account created! Please check your email to verify your account.",
                requiresVerification: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
