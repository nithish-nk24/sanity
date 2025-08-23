"use client";

import { useState } from "react";
import BlogsHero from "./BlogsHero";
import EnhancedBlogList from "./EnhancedBlogList";

export default function HomePage({ posts }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      {posts && (
        <>
          {/* Hero Section with Search */}
          <BlogsHero posts={posts} onSearch={handleSearch} />
          
                     {/* Main Content Area */}
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <EnhancedBlogList posts={posts} searchQuery={searchQuery} />
          </div>
        </>
      )}
    </>
  );
}
