import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import { authenticateUser } from "@/lib/auth-utils";

// Extend the User type to include custom properties
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
  bio?: string;
  role?: string;
  permissions?: string[];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    // Alternative: Personal Access Token provider
    Credentials({
      id: "github-token",
      name: "GitHub Token",
      credentials: {
        token: { label: "GitHub Token", type: "text" }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.token) return null;
        
        try {
          // Fetch user data using the token
          const response = await fetch('https://api.github.com/user', {
            headers: {
              'Authorization': `token ${credentials.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          if (!response.ok) return null;
          
          const user = await response.json();
          
          // Fetch user emails
          const emailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `token ${credentials.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          
          const emails = await emailsResponse.ok ? await emailsResponse.json() : [];
          const primaryEmail = emails.find((email: any) => email.primary)?.email || user.email;
          
          return {
            id: user.id.toString(),
            name: user.name || user.login,
            email: primaryEmail,
            image: user.avatar_url,
            username: user.login,
            bio: user.bio || ""
          };
        } catch (error) {
          console.error('Error fetching GitHub user:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle both OAuth and credentials providers
      if (account?.provider === 'github') {
        // OAuth flow
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id: profile?.id,
            name: user.name,
            username: profile?.login,
            email: user.email,
            image: user.image,
            bio: profile?.bio || "",
          });
        }
      } else if (account?.provider === 'github-token') {
        // Personal Access Token flow
        const extendedUser = user as ExtendedUser;
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: user.id,
          });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id: user.id,
            name: user.name,
            username: extendedUser.username || user.name,
            email: user.email,
            image: user.image,
            bio: extendedUser.bio || "",
          });
        }
      }

      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === 'github' && profile) {
        const userData = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        token.id = userData?._id;
      } else if (account?.provider === 'github-token' && user) {
        const userData = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: user.id,
          });
        token.id = userData?._id;
      } else if (account?.provider === 'credentials' && user) {
        // Handle credentials provider
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.username = extendedUser.username;
        token.role = extendedUser.role;
        token.permissions = extendedUser.permissions;
      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { 
        id: token.id,
        username: token.username,
        role: token.role,
        permissions: token.permissions
      });
      return session;
    },
  },
});