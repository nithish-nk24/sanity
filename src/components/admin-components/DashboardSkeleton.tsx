import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-96 bg-muted-foreground/20" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6 border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20 bg-muted-foreground/20" />
              <Skeleton className="h-8 w-8 rounded-lg bg-muted-foreground/20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 bg-muted-foreground/20" />
              <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Skeleton */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-muted-foreground/20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 dark:bg-muted/20 border border-border/50">
                <Skeleton className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1 bg-muted-foreground/20" />
                  <Skeleton className="h-3 w-32 bg-muted-foreground/20" />
                </div>
                <Skeleton className="h-5 w-16 bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
        <CardHeader>
          <Skeleton className="h-6 w-32 bg-muted-foreground/20" />
          <Skeleton className="h-4 w-64 bg-muted-foreground/20" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/50 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-9 w-9 rounded-lg bg-muted-foreground/20" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1 bg-muted-foreground/20" />
                    <Skeleton className="h-3 w-32 bg-muted-foreground/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Blog Management Skeleton */}
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40 bg-muted-foreground/20" />
              <Skeleton className="h-4 w-64 bg-muted-foreground/20" />
            </div>
            <Skeleton className="h-10 w-32 bg-muted-foreground/20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 dark:bg-muted/20 border border-border/50">
                <Skeleton className="h-16 w-16 rounded-lg bg-muted-foreground/20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48 bg-muted-foreground/20" />
                  <Skeleton className="h-3 w-32 bg-muted-foreground/20" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16 bg-muted-foreground/20" />
                    <Skeleton className="h-5 w-20 bg-muted-foreground/20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
