"use client";

import { useState } from "react";
import { TrendingUp, Clock, User, Mail, Tag, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface BlogSidebarProps {
  posts: BlogPost[];
}

const BlogSidebar = ({ posts }: BlogSidebarProps) => {
  const [email, setEmail] = useState("");

  // Get popular posts (first 5 posts for demo)
  const popularPosts = posts?.slice(0, 5) || [];

  // Get unique categories with counts
  const categories = posts?.reduce((acc, post) => {
    // Ensure category is an array and handle both string and array cases
    const postCategories = Array.isArray(post.category) ? post.category : [post.category].filter(Boolean);
    postCategories.forEach(cat => {
      if (cat) {
        acc[cat] = (acc[cat] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>) || {};

  // Get unique tags (using categories as tags for demo)
  const tags = Object.keys(categories);

  const handleNewsletterSignup = () => {
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-lg text-gray-900">Stay Updated</CardTitle>
          <p className="text-sm text-gray-600">
            Get the latest tech insights delivered to your inbox
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <Button
              onClick={handleNewsletterSignup}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-l-none"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            No spam, unsubscribe at any time
          </p>
        </CardContent>
      </Card>

      {/* Popular Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Popular Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularPosts.map((post, index) => (
            <div key={post._id} className="flex gap-3 group">
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post._id}`}>
                    {post.title}
                  </Link>
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <time dateTime={post._createdAt}>
                    {format(parseISO(post._createdAt), "MMM dd")}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-green-500" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(categories).map(([category, count]) => (
              <Link
                key={category}
                href={`/blogs?category=${category}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                  {category}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-purple-500" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 15).map((tag) => (
              <Link
                key={tag}
                href={`/blogs?tag=${tag}`}
                className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Author Spotlight */}
      <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-lg text-gray-900">Meet Our Authors</CardTitle>
          <p className="text-sm text-gray-600">
            Expert technologists sharing their knowledge
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" className="w-full">
            View All Authors
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {posts?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {Object.keys(categories).length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
