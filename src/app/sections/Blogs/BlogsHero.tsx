"use client";

import { useState, useMemo } from "react";
import { Search, Clock, Users, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

interface BlogsHeroProps {
  posts: BlogPost[];
  onSearch: (query: string) => void;
}

const BlogsHero = ({ posts, onSearch }: BlogsHeroProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");



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

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    // You can implement category filtering here
  };

  return (
         <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Hero Header */}
         <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Latest Technology Insights
          </div>
          
                     <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
             Discover
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
               {" "}Amazing
             </span>
             <br />
             Tech Content
           </h1>
           
           <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
             Explore cutting-edge tutorials, industry insights, and expert knowledge 
             from our technology community. Stay ahead with the latest trends.
           </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex shadow-lg rounded-2xl overflow-hidden">
              <Input
                type="text"
                placeholder="Search for articles, tutorials, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 border-0 px-6 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
              <Button
                onClick={handleSearch}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-none text-lg font-medium"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

                     {/* Quick Stats */}
           <div className="flex flex-wrap justify-center gap-8 text-center">
             <div className="flex items-center gap-2 text-muted-foreground">
               <BookOpen className="h-5 w-5 text-blue-500" />
               <span className="font-medium">{posts?.length || 0} Articles</span>
             </div>
             <div className="flex items-center gap-2 text-muted-foreground">
               <Users className="h-5 w-5 text-green-500" />
               <span className="font-medium">Expert Authors</span>
             </div>
             <div className="flex items-center gap-2 text-muted-foreground">
               <TrendingUp className="h-5 w-5 text-purple-500" />
               <span className="font-medium">Trending Topics</span>
             </div>
           </div>
        </div>

                 {/* Category Filter */}
         <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                                 className={`px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 hover:scale-105 ${
                   selectedCategory === category
                     ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                     : "bg-background text-foreground hover:bg-muted border border-border"
                 }`}
                onClick={() => handleCategoryFilter(category)}
              >
                                 {category === "all" ? "All Topics" : category}
                 {category !== "all" && categoryCounts[category] && (
                   <span className="ml-2 bg-foreground/20 px-2 py-0.5 rounded-full text-xs">
                     {categoryCounts[category]}
                   </span>
                 )}
              </Badge>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default BlogsHero;
