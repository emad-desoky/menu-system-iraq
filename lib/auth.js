import NextAuth from "next-auth"; // Corrected import
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"; // Import NextResponse for API route responses

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        // Note: In a real application, you should hash passwords before storing them
        // and compare the hashed password here. For this example, we'll compare directly.
        // const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        const isPasswordValid = credentials.password === user.password; // Simplified for example

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}

// Helper function to require authentication for API routes
export async function requireAuth() {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return session.user;
}

// Helper function to require admin role for API routes
export async function requireAdmin() {
  const user = await requireAuth();
  if (user instanceof NextResponse) {
    return user; // Return the unauthorized response directly
  }
  if (user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return user;
}
