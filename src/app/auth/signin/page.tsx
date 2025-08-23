"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";

export default function SignIn() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubOAuth = () => {
    setIsLoading(true);
    signIn("github", { callbackUrl: "/" });
  };

  const handleTokenAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    try {
      const result = await signIn("github-token", {
        token,
        redirect: false,
      });

      if (result?.error) {
        alert("Invalid token. Please check your GitHub Personal Access Token.");
      } else if (result?.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your preferred authentication method
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Authentication Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* GitHub OAuth Button */}
            <Button
              onClick={handleGitHubOAuth}
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Personal Access Token Form */}
            <form onSubmit={handleTokenAuth} className="space-y-3">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Personal Access Token
                </label>
                <Input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Create a token at{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub Settings
                  </a>
                </p>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !token.trim()}
                className="w-full"
                variant="outline"
              >
                {isLoading ? "Signing in..." : "Sign in with Token"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>
            Need help?{" "}
            <a
              href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Learn more about Personal Access Tokens
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
