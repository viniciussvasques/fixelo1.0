import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    providers: [], // Providers configured in auth.ts
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.userId = user.id;
                token.referralCode = (user as any).referralCode;
                token.credits = (user as any).credits;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.role = token.role as any;
                session.user.id = token.userId as string;
                session.user.referralCode = token.referralCode as string;
                session.user.credits = token.credits as number;
            }
            return session;
        },
        authorized({ auth: _auth, request: { nextUrl: _nextUrl } }) {
            return true; // Simple allow-all here, explicit protection in middleware function
        }
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: "J/z+u72W6Q92j+8l5X+9d9d9d9d9d9d9d9d9d9d9d9=",
} satisfies NextAuthConfig;
