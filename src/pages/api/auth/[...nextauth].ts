import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import AzureADProvider  from "next-auth/providers/azure-ad";

import { query } from  'faunadb';
import { fauna } from '../../../services/fauna';


export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider ({
      tenantId: 'consumers',
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_SECRET_ID,
      authorization: { params: { scope: "openid profile email", prompt: "consent", redirect_uri: "http://www.mundoxbox.com.br/api/auth/callback/azure-ad" } },

    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn(param) {
      
        const user = param.user;

        const { email, name } = user

        try {
          await fauna.query(
            query.If(
              query.Not(
                query.Exists(
                  query.Match(
                    query.Index('user_by_email'),
                    query.Casefold(user.email)
                  )
                )
              ),
              query.Create(
                query.Collection('users'),
                { data: { email, name } }
              ),
              query.Get(
                query.Match(
                  query.Index('user_by_email'),
                  query.Casefold(user.email)
                )
              )
            )
          )

          return true
        } catch {
          return false
        }
      },
  },
}

export default NextAuth (authOptions)