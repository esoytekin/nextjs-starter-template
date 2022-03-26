import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '.keystone/api';
import { gql } from '@apollo/client';
import client from '../../../apollo-client';

const AUTH_USER = gql`
    mutation Auth($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    id
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                message
            }
        }
    }
`;

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
                const {
                    data: { authenticateUserWithPassword },
                } = await client.mutate({
                    mutation: AUTH_USER,
                    variables: credentials,
                });

                if (authenticateUserWithPassword.message) {
                    throw new Error(authenticateUserWithPassword.message);
                }

                const {
                    item: { id },
                } = authenticateUserWithPassword;

                const u = await query.User.findOne({
                    where: {
                        id,
                    },
                    query: 'id email',
                });

                return u;
            },
        }),
    ],
    callbacks: {
        jwt({ token }) {
            return { ...token, userRole: 'admin' };
        },
    },
});
