'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, FolderOpen, TrendingUp, Users } from "lucide-react";
import { parseISO, format } from "date-fns";

interface DashboardStatsProps {
  totalBlogs: number;
  monthlyBlogs: number;
  totalCategories: number;
  recentBlogs: any[];
}

export function DashboardStats({ 
  totalBlogs, 
  monthlyBlogs, 
  totalCategories, 
  recentBlogs 
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Blogs",
      value: totalBlogs,
      icon: FileText,
      description: "All published blogs",
      color: "bg-blue-500 dark:bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      title: "This Month",
      value: monthlyBlogs,
      icon: Calendar,
      description: "Blogs published this month",
      color: "bg-green-500 dark:bg-green-600",
      textColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: FolderOpen,
      description: "Unique blog categories",
      color: "bg-purple-500 dark:bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      title: "Growth",
      value: monthlyBlogs > 0 ? "+" + monthlyBlogs : "0",
      icon: TrendingUp,
      description: "Monthly growth",
      color: "bg-orange-500 dark:bg-orange-600",
      textColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
      borderColor: "border-orange-200 dark:border-orange-800"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color} shadow-lg`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            Recent Blog Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog, index) => (
                <div key={blog._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 dark:bg-muted/20 hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors border border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(blog._createdAt), "MMM dd, yyyy")} • {blog.author.name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground hover:bg-muted/80">
                    {blog.category}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p>No blogs yet. Create your first blog to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
