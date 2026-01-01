import 'next-auth';
import { UserRole } from '@fixelo/database';

declare module 'next-auth' {
    interface User {
        role: UserRole;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            referralCode?: string;
            credits?: number;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId: string;
        role: UserRole;
        referralCode?: string;
        credits?: number;
    }
}
