import { compareSync } from "bcrypt-ts-edge";

import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { PrismaAdapter } from "@auth/prisma-adapter";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        // Check if user exists and password is correct
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);
          // If password is correct, return user object
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        // If user doesn't exist or password is incorrect, return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, trigger }: any) {
      // Map the token data to the session object
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.role = token.role;

      // Optionally handle session updates (like name change)
      if (trigger === "update" && token.name) {
        session.user.name = token.name;
      }

      // Return the updated session object
      return session;
    },

    // Right now, that token contains just the name and email. I want to customize it to also have the role. We also
    // want to check if the user has no name and use their email as their name if so. We also want to handle session
    // updates such as a name change. To do this, we need to add a jwt callback.
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;

        //! Bug-FIX:
        token.id = user.id;

        // If user has no name, use email as their default name
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update the user in the database with the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },

    async authorized({ request, auth }) {
      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set newly generated sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
