'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, BarChart3, Calendar, Users, Eye } from "lucide-react";

interface AnalyticsOverviewProps {
  totalBlogs: number;
  monthlyBlogs: number;
  previousMonthBlogs: number;
  totalCategories?: number;
}

export function AnalyticsOverview({ 
  totalBlogs, 
  monthlyBlogs, 
  previousMonthBlogs,
  totalCategories = 0
}: AnalyticsOverviewProps) {
  // Calculate growth percentage
  const growthPercentage = previousMonthBlogs > 0 
    ? ((monthlyBlogs - previousMonthBlogs) / previousMonthBlogs) * 100 
    : monthlyBlogs > 0 ? 100 : 0;

  const isGrowing = growthPercentage > 0;
  const isDeclining = growthPercentage < 0;

  // Mock data for demonstration - in real app, this would come from analytics API
  const mockAnalytics = {
    totalViews: totalBlogs * 150, // Mock: each blog gets ~150 views
    avgTimeOnPage: "2m 34s",
    bounceRate: "45.2%",
    topPerformingBlog: "Getting Started with Next.js",
    topCategory: "Web Development"
  };

  const getGrowthIcon = () => {
    if (isGrowing) return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
    if (isDeclining) return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  };

  const getGrowthColor = () => {
    if (isGrowing) return "text-green-600 dark:text-green-400";
    if (isDeclining) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          Analytics Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Performance metrics and insights for your blog platform
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Growth Metrics */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50 hover:shadow-md dark:hover:shadow-blue-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Monthly Growth</h3>
                {getGrowthIcon()}
              </div>
              <div className={`text-2xl font-bold ${getGrowthColor()}`}>
                {growthPercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {monthlyBlogs} blogs this month vs {previousMonthBlogs} last month
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50 hover:shadow-md dark:hover:shadow-green-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-900 dark:text-green-100">Total Views</h3>
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {mockAnalytics.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Across all blog posts
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-3 rounded-lg bg-muted/30 dark:bg-muted/20 border border-border/50 hover:bg-muted/50 dark:hover:bg-muted/30 transition-all duration-300">
              <div className="text-lg font-semibold text-foreground">
                {mockAnalytics.avgTimeOnPage}
              </div>
              <div className="text-xs text-muted-foreground">Avg. Time on Page</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-muted/30 dark:bg-muted/20 border border-border/50 hover:bg-muted/50 dark:hover:bg-muted/30 transition-all duration-300">
              <div className="text-lg font-semibold text-foreground">
                {mockAnalytics.bounceRate}
              </div>
              <div className="text-xs text-muted-foreground">Bounce Rate</div>
            </div>

            <div className="text-center p-3 rounded-lg bg-muted/30 dark:bg-muted/20 border border-border/50 hover:bg-muted/50 dark:hover:bg-muted/30 transition-all duration-300">
              <div className="text-lg font-semibold text-foreground">
                {totalBlogs}
              </div>
              <div className="text-xs text-muted-foreground">Total Posts</div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50 hover:shadow-md dark:hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-purple-900 dark:text-purple-100">Top Performing Blog</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                {mockAnalytics.topPerformingBlog}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Highest engagement rate
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800/50 hover:shadow-md dark:hover:shadow-orange-500/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <h3 className="text-sm font-medium text-orange-900 dark:text-orange-100">Top Category</h3>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                {mockAnalytics.topCategory}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Most popular content type
              </p>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border border-slate-200 dark:border-slate-800/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Quick Insights</h3>
            </div>
            <div className="grid gap-2 text-xs text-slate-700 dark:text-slate-300">
              <p>• Content engagement is {isGrowing ? 'increasing' : isDeclining ? 'decreasing' : 'stable'}</p>
              <p>• {totalCategories} categories help organize content effectively</p>
              <p>• Average monthly growth: {monthlyBlogs > 0 ? '+' + monthlyBlogs : '0'} posts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
