"use client";

import { useState, useMemo } from "react";
import { Filter, Grid3X3, List, User, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  _id: string;
  title: string;
  excerpt?: string;
  image?: string;
  category: string[];
  author?: {
    name: string;
    image?: string;
  };
  _createdAt: string;
}

interface EnhancedBlogListProps {
  posts: BlogPost[];
  searchQuery?: string;
}

const EnhancedBlogList = ({ posts, searchQuery }: EnhancedBlogListProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Share function using Web Share API
  const handleShare = async (post: BlogPost) => {
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url: `${window.location.origin}/blog/${post._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link copied", description: "Post URL copied to clipboard." });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link copied", description: "Post URL copied to clipboard." });
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy the link. Please try again.",
        });
      }
    }
  };

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts || [];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => {
        // Ensure category is an array and handle both string and array cases
        const postCategories = Array.isArray(post.category) ? post.category : [post.category].filter(Boolean);
        return (
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          postCategories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => {
        // Ensure category is an array and handle both string and array cases
        const postCategories = Array.isArray(post.category) ? post.category : [post.category].filter(Boolean);
        return postCategories.includes(selectedCategory);
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "latest":
        filtered = [...filtered].sort((a, b) => 
          new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
        );
        break;
      case "oldest":
        filtered = [...filtered].sort((a, b) => 
          new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime()
        );
        break;
      case "title":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!posts) return [];
    const allCategories = posts.flatMap(post => {
      // Ensure category is an array and handle both string and array cases
      return Array.isArray(post.category) ? post.category : [post.category].filter(Boolean);
    });
    return ["all", ...Array.from(new Set(allCategories))];
  }, [posts]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    if (!posts) return {};
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      // Ensure category is an array and handle both string and array cases
      const categories = Array.isArray(post.category) ? post.category : [post.category].filter(Boolean);
      categories.forEach(cat => {
        if (cat) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      });
    });
    return counts;
  }, [posts]);

     if (!posts || posts.length === 0) {
     return (
       <div className="text-center py-20">
         <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
           <Filter className="h-12 w-12 text-muted-foreground" />
         </div>
         <h3 className="text-xl font-semibold text-foreground mb-2">No posts found</h3>
         <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
       </div>
     );
   }

     return (
     <div className="space-y-6">
             {/* Controls Bar */}
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-background rounded-xl shadow-sm border border-border">
        <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
             <Filter className="h-4 w-4 text-muted-foreground" />
             <span className="text-sm font-medium text-foreground">Filters:</span>
           </div>
          
          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                                     {category === "all" ? "All Categories" : category}
                   {category !== "all" && categoryCounts[category] && (
                     <span className="ml-2 text-muted-foreground">({categoryCounts[category]})</span>
                   )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

                 {/* View Mode Toggle */}
         <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

             {/* Results Count */}
       <div className="flex items-center justify-between">
         <p className="text-muted-foreground">
           Showing <span className="font-semibold">{filteredAndSortedPosts.length}</span> of{" "}
           <span className="font-semibold">{posts.length}</span> posts
         </p>
         {searchQuery && (
           <p className="text-sm text-muted-foreground">
             Search results for: <span className="font-medium">&quot;{searchQuery}&quot;</span>
           </p>
         )}
       </div>

             {/* Blog Posts Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-5"
        }
      >
        {filteredAndSortedPosts.map((post, index) => {
          const primaryCategory = Array.isArray(post.category)
            ? post.category[0]
            : (post.category as unknown as string) || "Tech";
          const extraCategories = Array.isArray(post.category)
            ? post.category.slice(1)
            : [];
          const href = `/blog/${post._id}`;

          return (
            <Card
              key={post._id}
              className={cn(
                "group overflow-hidden border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/40",
                "hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300",
                viewMode === "list" && "sm:flex"
              )}
            >
              {/* Media */}
              <div
                className={cn(
                  "relative overflow-hidden",
                  viewMode === "grid" ? "aspect-[16/10]" : "aspect-[16/10] sm:w-[44%] sm:aspect-auto"
                )}
              >
                <Link href={href} className="absolute inset-0" aria-label={post.title}>
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      {...(index === 0 ? { priority: true, fetchPriority: "high" as const } : {})}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto mb-2 bg-background/70 rounded-full flex items-center justify-center border border-border">
                          <Filter className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">No image</p>
                      </div>
                    </div>
                  )}
                  {/* subtle gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-70" />
                </Link>

                {/* Category */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white dark:bg-black/60 dark:text-white">
                    {primaryCategory}
                  </Badge>
                </div>

                {/* Share */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-9 w-9 p-0 bg-white/90 hover:bg-white dark:bg-black/60 dark:hover:bg-black/70"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare(post);
                    }}
                    title="Share this post"
                    aria-label="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <CardContent className={cn("p-5", viewMode === "list" && "sm:flex-1")}>
                <div className="space-y-3">
                  <h3
                    className={cn(
                      "font-bold tracking-tight text-foreground group-hover:text-blue-600 transition-colors",
                      viewMode === "grid" ? "text-lg" : "text-xl"
                    )}
                  >
                    <Link href={href} className="line-clamp-2">
                      {post.title}
                    </Link>
                  </h3>

                  {post.excerpt && (
                    <p
                      className={cn(
                        "text-muted-foreground leading-6",
                        viewMode === "list" ? "text-base line-clamp-3" : "text-sm line-clamp-3"
                      )}
                    >
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {post.author?.image ? (
                        <div className="relative h-6 w-6 overflow-hidden rounded-full border border-border/60">
                          <Image
                            src={post.author.image}
                            alt={post.author.name || "Author"}
                            fill
                            sizes="24px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="truncate max-w-40">{post.author?.name || "Anonymous"}</span>
                    </div>
                  </div>

                  {/* Extra categories */}
                  {extraCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {extraCategories.slice(0, 3).map((cat, i) => (
                        <Badge key={`${cat}-${i}`} variant="outline" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

             {/* Load More Button */}
       {filteredAndSortedPosts.length < posts.length && (
         <div className="text-center pt-6">
          <Button variant="outline" size="lg" className="px-8">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedBlogList;
