'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    BookOpen,
    LogOut,
    User,
    GraduationCap,
    Home,
    Library
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        localStorage.removeItem('accessToken');
        toast.success('Signed out successfully');
        router.push('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <span className="hidden sm:inline-block">EduLearn</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href="/courses"
                        className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <Library className="h-4 w-4" />
                        Courses
                    </Link>

                    {session && (
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                    )}

                    {session?.user?.role === 'instructor' && (
                        <Link
                            href="/instructor"
                            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <BookOpen className="h-4 w-4" />
                            My Courses
                        </Link>
                    )}
                </div>

                {/* Auth Section */}
                <div className="flex items-center space-x-4">
                    {status === 'loading' ? (
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        {/* <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} /> */}
                                        <AvatarFallback className="bg-primary text-white">
                                            {getInitials(session.user.name || 'User')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                                {session.user.role}
                                            </span>
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                {session.user.role === 'instructor' && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/instructor" className="cursor-pointer">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            My Courses
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
