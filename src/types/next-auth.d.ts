import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        emailVerified?: Date | null;
    }

    interface Session extends DefaultSession {
        user: {
            id: string;
            emailVerified?: Date | null;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: string;
        emailVerified?: Date | null;
    }
}
