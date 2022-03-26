import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '.keystone/api';

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in with...',
            credentials: {
                email: {
                    type: 'email',
                },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                const u = await query.User.findOne({
                    where: {
                        email: credentials?.email,
                    },
                    query: 'id email password',
                });

                if (!u) {
                    throw new Error('User not found');
                }

                if (credentials?.password === u.password) {
                    return u;
                }
                throw new Error('Password not match!');
            },
        }),
    ],
    callbacks: {
        jwt({ token }) {
            return { ...token, userRole: 'admin' };
        },
    },
});
