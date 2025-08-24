'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Tag,
  FileText,
  Plus,
  Download,
  CheckSquare,
  Square,
  Settings,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { deleteBlog } from "@/lib/action";
import { revalidatePath } from "next/cache";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { parseISO, format } from "date-fns";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  slug: { current: string; _type: string };
  _createdAt: string;
  author: { name: string; image: string };
  category: string;
  description: string;
  pitch: string;
  link: string;
  image: string;
}

interface BlogManagementProps {
  blogs: Blog[];
}

export function BlogManagement({ blogs }: BlogManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedBlogs, setSelectedBlogs] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(blogs.map(blog => blog.category))];
    return ['all', ...cats];
  }, [blogs]);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    let filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.author.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort blogs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.name.localeCompare(b.author.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [blogs, searchTerm, selectedCategory, sortBy]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      await deleteBlog(id);
      revalidatePath('/admin/dashboard');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogs.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedBlogs.size} selected blogs?`)) {
      for (const id of selectedBlogs) {
        await deleteBlog(id);
      }
      setSelectedBlogs(new Set());
      setShowBulkActions(false);
      revalidatePath('/admin/dashboard');
    }
  };

  const handleSelectAll = () => {
    if (selectedBlogs.size === filteredBlogs.length) {
      setSelectedBlogs(new Set());
    } else {
      setSelectedBlogs(new Set(filteredBlogs.map(blog => blog._id)));
    }
  };

  const handleSelectBlog = (id: string) => {
    const newSelected = new Set(selectedBlogs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBlogs(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleExport = () => {
    const exportData = filteredBlogs.map(blog => ({
      title: blog.title,
      slug: blog.slug.current,
      category: blog.category,
      author: blog.author.name,
      description: blog.description,
      created: format(parseISO(blog._createdAt), "yyyy-MM-dd"),
      link: blog.link
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blogs-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "MMM dd, yyyy");
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300" id="blogs">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Blog Management
            </CardTitle>
            <p className="text-sm text-gray-600">
              Manage your blog posts, edit content, and monitor performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleExport}
              disabled={filteredBlogs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowBulkActions(!showBulkActions)}
              className={showBulkActions ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
            >
              <Settings className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
            <Link href="/admin/createblog">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Blog
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-blue-700 hover:text-blue-800"
                >
                  {selectedBlogs.size === filteredBlogs.length ? (
                    <CheckSquare className="h-4 w-4 mr-2" />
                  ) : (
                    <Square className="h-4 w-4 mr-2" />
                  )}
                  {selectedBlogs.size === filteredBlogs.length ? 'Deselect All' : 'Select All'}
                </Button>
                <span className="text-sm text-blue-700">
                  {selectedBlogs.size} of {filteredBlogs.length} blogs selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedBlogs.size === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blogs by title, description, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Selection Checkbox */}
                {showBulkActions && (
                  <div className="absolute top-3 left-3 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 rounded-full ${
                        selectedBlogs.has(blog._id) 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/90 text-gray-600 hover:bg-white'
                      }`}
                      onClick={() => handleSelectBlog(blog._id)}
                    >
                      {selectedBlogs.has(blog._id) ? (
                        <CheckSquare className="h-3 w-3" />
                      ) : (
                        <Square className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                )}

                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${blog.slug.current}`} className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/createblog?edit=${blog._id}`} className="flex items-center">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={blog.link} target="_blank" className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Link
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {blog.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(blog._createdAt)}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {blog.description}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={blog.author.image} alt={blog.author.name} />
                        <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700">
                        {blog.author.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first blog post'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Link href="/admin/createblog">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        {filteredBlogs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Showing {filteredBlogs.length} of {blogs.length} blogs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
