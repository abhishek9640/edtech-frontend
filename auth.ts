import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { api } from './lib/api';

export const authConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const response = await api.auth.login({
                        email: credentials.email as string,
                        password: credentials.password as string,
                    });

                    const { user, accessToken } = response.data.data;

                    if (user && accessToken) {
                        return {
                            id: user._id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            accessToken: accessToken,
                        };
                    }

                    return null;
                } catch (error: unknown) {
                    const err = error as { response?: { data?: unknown }; message?: string };
                    console.error('Auth error:', err.response?.data || err.message);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
