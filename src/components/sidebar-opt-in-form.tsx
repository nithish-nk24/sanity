"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authSession, logout } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type UserSession = {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
};

export function SidebarOptInForm() {
  const [authDetails, setAuthDetails] = useState<UserSession | null>(null);

  useEffect(() => {
    authSession().then((res) => setAuthDetails(res));
  }, []);

  return (
    <Card className="shadow-none">
      <CardHeader className="flex items-center gap-x-3">
        <Avatar>
          <AvatarImage src={authDetails?.user.image} />
          <AvatarFallback>{authDetails?.user.name}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{authDetails?.user.name}</CardTitle>
          <CardDescription className="text-sm">
            You are currently logged in as {authDetails?.user.name}.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="text-sm">{authDetails?.user.email}</CardContent>
      <Button
        className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
        size="sm"
        variant="outline"
        onClick={() => logout()}
      >
        Log Out
      </Button>
    </Card>
  );
}
