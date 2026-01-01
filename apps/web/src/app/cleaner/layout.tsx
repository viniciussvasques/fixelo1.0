import { auth } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    CalendarDays,
    Briefcase,
    UserCircle,
    Menu,
    LogOut,
    Bell
} from "lucide-react";

const navItems = [
    { href: '/cleaner/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/cleaner/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/cleaner/schedule', icon: CalendarDays, label: 'Schedule' },
    { href: '/cleaner/notifications', icon: Bell, label: 'Alerts' },
    { href: '/cleaner/profile', icon: UserCircle, label: 'Profile' },
];

export default async function CleanerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/cleaner/dashboard");
    }

    if (session.user.role !== UserRole.CLEANER && session.user.role !== UserRole.ADMIN) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            {/* Desktop Header */}
            <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
                <Link href="/cleaner/dashboard" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Fixelo" width={120} height={35} className="h-8 w-auto" />
                    <span className="text-sm font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">Pro</span>
                </Link>

                <nav className="flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium transition-colors"
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="block text-sm font-medium">{session.user.name}</span>
                        <span className="text-xs text-[var(--accent)]">● Active</span>
                    </div>
                    <Link href="/api/auth/signout" className="p-2 text-[var(--text-muted)] hover:text-[var(--error)] transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Link>
                </div>
            </header>

            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-20">
                <Link href="/cleaner/dashboard" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Fixelo" width={100} height={30} className="h-7 w-auto" />
                    <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">Pro</span>
                </Link>
                <button className="p-2 text-[var(--text-secondary)]">
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-24 md:pb-8 p-4 md:p-8 max-w-5xl mx-auto w-full">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] flex justify-around py-3 px-2 z-30">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                    >
                        <item.icon size={22} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
