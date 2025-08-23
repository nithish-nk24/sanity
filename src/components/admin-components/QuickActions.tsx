'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Settings, BarChart3, Users, FileText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Create Blog",
      description: "Write and publish a new blog post",
      icon: Plus,
      href: "/admin/dashboard/createBlog",
      color: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800/50"
    },
    {
      title: "Manage Blogs",
      description: "Edit, delete, or organize existing blogs",
      icon: Edit,
      href: "#blogs",
      color: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800/50"
    },
    {
      title: "Analytics",
      description: "View blog performance and insights",
      icon: BarChart3,
      href: "#analytics",
      color: "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800/50"
    },
    {
      title: "User Management",
      description: "Manage authors and permissions",
      icon: Users,
      href: "#users",
      color: "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-800/50"
    },
    {
      title: "Content Library",
      description: "Organize media and resources",
      icon: FileText,
      href: "#library",
      color: "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      borderColor: "border-indigo-200 dark:border-indigo-800/50"
    },
    {
      title: "Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "#settings",
      color: "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700",
      iconColor: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-950/30",
      borderColor: "border-gray-200 dark:border-gray-800/50"
    }
  ];

  return (
    <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Quick Actions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Access frequently used features and tools
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <div key={index} className="group">
              {action.href.startsWith('/') ? (
                <Link href={action.href}>
                  <div className={`p-4 rounded-lg border ${action.borderColor} hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 hover:from-background hover:to-muted/30 dark:hover:from-background dark:hover:to-muted/20`}>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white transition-colors shadow-lg`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className={`p-4 rounded-lg border ${action.borderColor} hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-500/20 transition-all duration-300 group-hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 hover:from-background hover:to-muted/30 dark:hover:from-background dark:hover:to-muted/20`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white transition-colors shadow-lg`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
