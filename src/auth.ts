import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
    // Username/Password credentials provider
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.username || !credentials?.password) {
          console.log('❌ Missing credentials in authorize callback');
          return null;
        }
        
        try {
          console.log('🔐 Attempting to authenticate user:', credentials.username);
          
          // Use our custom authentication system
          const authResult = await authenticateUser(credentials.username, credentials.password);
          
          console.log('📊 Authentication result:', {
            success: authResult?.success,
            error: authResult?.error || 'No error message',
            hasUser: !!authResult?.user
          });
          
          if (authResult?.success && authResult.user) {
            console.log('✅ User authenticated successfully:', authResult.user.username);
            return {
              id: authResult.user._id,
              name: authResult.user.name,
              email: authResult.user.email,
              username: authResult.user.username,
              role: authResult.user.role,
              permissions: authResult.user.permissions
            };
          } else {
            console.log('❌ Authentication failed:', authResult?.error || 'Unknown error');
            return null;
          }
        } catch (error) {
          console.error('💥 Error in authorize callback:', error);
          if (error instanceof Error) {
            console.error('   Stack:', error.stack);
          }
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
    async signIn({ user, account }) {
      // Only handle credentials provider now
      if (account?.provider === 'credentials') {
        // Credentials provider - user is already authenticated
        return true;
      }
      return false;
    },
    async jwt({ token, account, user }) {
      if (account?.provider === 'credentials' && user) {
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
      return {
        ...session,
        id: token.id,
        username: token.username,
        role: token.role,
        permissions: token.permissions
      };
    },
  },
});