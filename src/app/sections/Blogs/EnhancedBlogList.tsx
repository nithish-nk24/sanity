"use client";

import { useState, useMemo } from "react";
import { Filter, Grid3X3, List, Clock, User, Eye, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";

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
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
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
       <div className={
         viewMode === "grid" 
           ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" 
           : "space-y-4"
       }>
        {filteredAndSortedPosts.map((post) => (
          <Card key={post._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Post Image */}
            <div className={`relative overflow-hidden ${
              viewMode === "grid" ? "aspect-video" : "aspect-[16/9]"
            }`}>
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                      <Filter className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">No Image</p>
                  </div>
                </div>
              )}
              
              {/* Category Badge */}
                                   <div className="absolute top-3 left-3">
                       <Badge variant="secondary" className="bg-white/90 text-gray-800 hover:bg-white">
                         {Array.isArray(post.category) ? post.category[0] : post.category || "Tech"}
                       </Badge>
                     </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare(post);
                    }}
                    title="Share this post"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

                         {/* Post Content */}
             <CardContent className="p-4">
                             <h3 className={`font-bold text-foreground mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                 viewMode === "grid" ? "text-lg" : "text-xl"
               }`}>
                 <Link href={`/blog/${post._id}`}>
                   {post.title}
                 </Link>
               </h3>
              
                             {post.excerpt && (
                 <p className={`text-muted-foreground mb-4 line-clamp-3 ${
                   viewMode === "list" ? "text-base" : "text-sm"
                 }`}>
                   {post.excerpt}
                 </p>
               )}
              
                             {/* Post Meta */}
               <div className="flex items-center justify-between text-sm text-muted-foreground">
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1">
                     <User className="h-4 w-4" />
                     <span className="truncate max-w-24">{post.author?.name || "Anonymous"}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <Clock className="h-4 w-4" />
                     <time dateTime={post._createdAt}>
                       {format(parseISO(post._createdAt), "MMM dd, yyyy")}
                     </time>
                   </div>
                 </div>
                 
                 {viewMode === "list" && (
                   <div className="flex items-center gap-1 text-muted-foreground">
                     <Eye className="h-4 w-4" />
                     <span className="text-xs">1.2k views</span>
                   </div>
                 )}
               </div>

                             {/* Categories */}
               {(() => {
                 const postCategories = Array.isArray(post.category) ? post.category : [post.category].filter(Boolean);
                 return postCategories.length > 1 ? (
                   <div className="flex flex-wrap gap-2 mt-4">
                     {postCategories.slice(1).map((cat, index) => (
                       <Badge key={index} variant="outline" className="text-xs">
                         {cat}
                       </Badge>
                     ))}
                   </div>
                 ) : null;
               })()}
            </CardContent>
          </Card>
        ))}
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
