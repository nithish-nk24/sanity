"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "./admin-components/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "@/components/ui/badge";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";
import { createBlog, updateBlog } from "@/lib/action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_ID_QUERY } from "@/sanity/lib/queries";
import { validateForm, validateInput } from "@/lib/validation";
import { 
  FileText, 
  Image, 
  Tag, 
  Globe, 
  Edit3, 
  Save, 
  Eye, 
  Code,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Lightbulb,
  Clock,
  X,
  Zap,
  Trash2,
  Clipboard,
  Search,
  HelpCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CreateForm({
  className,
  isEditMode = false,
  blogId,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  isEditMode?: boolean;
  blogId?: string;
}) {
  const [pitch, setPitch] = useState("");
  const [chatgptContent, setChatgptContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [editorMode, setEditorMode] = useState<"edit" | "preview" | "live">("edit");
  const [formData, setFormData] = useState({
    title: "",
    metaTitle: "",
    image: "",
    metaKeywords: "",
    category: "",
    metaDescription: "",
    description: "",
  });
  const { toast } = useToast();
  const router = useRouter();

  // Fetch blog data when editing
  useEffect(() => {
    if (isEditMode && blogId) {
      const fetchBlogData = async () => {
        try {
          const blog = await client.fetch(BLOG_BY_ID_QUERY, { id: blogId });
          if (blog) {
            setFormData({
              title: blog.title || "",
              metaTitle: blog.metaTitle || "",
              image: blog.image || "",
              metaKeywords: blog.metaKeywords || "",
              category: blog.category || "",
              metaDescription: blog.metaDescription || "",
              description: blog.description || "",
            });
            setPitch(blog.pitch || "");
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load blog data for editing.",
          });
        }
      };
      
      fetchBlogData();
    }
  }, [isEditMode, blogId, toast]);

  // Validation states
  const isBasicInfoValid = formData.title && formData.category && formData.description;
  const isSEOValid = formData.metaTitle && formData.metaDescription && formData.metaKeywords;
  const isPitchValid = pitch && pitch.length > 50;
  const isFormValid = isBasicInfoValid && isSEOValid && isPitchValid;

  const parseChatGPTContent = (content: string) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // If not JSON, try to parse from formatted text
      const lines = content.split('\n');
      const result: any = {};
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('Title:')) {
          result.title = trimmed.replace('Title:', '').trim();
        } else if (trimmed.startsWith('Meta Title:')) {
          result.metaTitle = trimmed.replace('Meta Title:', '').trim();
        } else if (trimmed.startsWith('Image:')) {
          result.image = trimmed.replace('Image:', '').trim();
        } else if (trimmed.startsWith('Meta Keywords:')) {
          result.metaKeywords = trimmed.replace('Meta Keywords:', '').trim();
        } else if (trimmed.startsWith('Category:')) {
          result.category = trimmed.replace('Category:', '').trim();
        } else if (trimmed.startsWith('Meta Description:')) {
          result.metaDescription = trimmed.replace('Meta Description:', '').trim();
        } else if (trimmed.startsWith('Description:')) {
          result.description = trimmed.replace('Description:', '').trim();
        } else if (trimmed.startsWith('Pitch:')) {
          result.pitch = trimmed.replace('Pitch:', '').trim();
        }
      });
      
      return result;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasteFromChatGPT = () => {
    const parsed = parseChatGPTContent(chatgptContent);
    
    // Fill form fields using state
    const newFormData = { ...formData };
    if (parsed.title) newFormData.title = parsed.title;
    if (parsed.metaTitle) newFormData.metaTitle = parsed.metaTitle;
    if (parsed.image) newFormData.image = parsed.image;
    if (parsed.metaKeywords) newFormData.metaKeywords = parsed.metaKeywords;
    if (parsed.category) newFormData.category = parsed.category;
    if (parsed.metaDescription) newFormData.metaDescription = parsed.metaDescription;
    if (parsed.description) newFormData.description = parsed.description;
    if (parsed.pitch) setPitch(parsed.pitch);

    setFormData(newFormData);
    setIsModalOpen(false);
    setChatgptContent("");
    
    toast({
      title: "Content Pasted Successfully",
      description: "Form fields have been filled with ChatGPT content",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      toast({
        variant: "destructive",
        title: "Form Incomplete",
        description: "Please fill in all required fields before submitting.",
      });
      return;
    }

    // Comprehensive form validation
    const validationRules = {
      title: { type: 'title' as const, required: true },
      metaTitle: { type: 'metaTitle' as const, required: true },
      metaKeywords: { type: 'metaKeywords' as const, required: false },
      category: { type: 'category' as const, required: true },
      metaDescription: { type: 'metaDescription' as const, required: true },
      description: { type: 'description' as const, required: true }
    };
    
    const formValidation = validateForm(formData, validationRules);
    if (!formValidation.isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: Object.values(formValidation.errors)[0] || "Please check your input.",
      });
      return;
    }

    setIsSubmitting(true);
    const formValues = {
      title: formValidation.sanitizedData.title,
      metaTitle: formValidation.sanitizedData.metaTitle,
      link: (() => {
        // Validate image URL if provided
        if (formData.image && formData.image.trim()) {
          const urlValidation = validateInput(formData.image, 'link', { required: false });
          if (!urlValidation.isValid) {
            throw new Error(urlValidation.error || 'Invalid image URL');
          }
          return urlValidation.sanitizedValue || '';
        }
        return '';
      })(),
      metaKeywords: formValidation.sanitizedData.metaKeywords,
      category: formValidation.sanitizedData.category,
      metaDescription: formValidation.sanitizedData.metaDescription,
      description: formValidation.sanitizedData.description,
    };

    try {
      let result;
      if (isEditMode && blogId) {
        result = await updateBlog(blogId, formValues, pitch);
      } else {
        result = await createBlog(formValues, pitch);
      }

      if (result.status === "SUCCESS") {
        if (isEditMode) {
          toast({
            title: "🎉 Blog Updated Successfully!",
            description: "Your blog post has been updated and is now live.",
          });
        } else {
          // Reset form only for new blogs
          setFormData({
            title: "",
            metaTitle: "",
            image: "",
            metaKeywords: "",
            category: "",
            metaDescription: "",
            description: "",
          });
          setPitch("");

          toast({
            title: "🎉 Blog Created Successfully!",
            description: "Your blog post is now live and ready to be viewed.",
          });
        }
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error ${isEditMode ? 'Updating' : 'Creating'} Blog`,
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Enhanced ChatGPT Modal */}
      {/* Enhanced ChatGPT Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI Content Assistant
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                      Transform your ChatGPT content into a perfectly formatted blog post
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Feature Pills */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Smart Parsing</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Auto-Fill</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Format Support</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Content Area */}
            <div className="p-6 space-y-6">
              {/* Input Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chatgpt-content" className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Paste Your ChatGPT Content
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setChatgptContent("")}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      disabled={!chatgptContent.trim()}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.readText().then(text => {
                          setChatgptContent(text);
                        }).catch(err => {
                          console.error('Failed to read clipboard:', err);
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Clipboard className="h-4 w-4 mr-1" />
                      Paste from Clipboard
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                <Textarea
                  id="chatgpt-content"
                  value={chatgptContent}
                  onChange={(e) => setChatgptContent(e.target.value)}
                    placeholder={`🎯 Paste your ChatGPT content here...

Examples of supported formats:

📝 Plain Text:
"Write a blog post about React hooks with the title 'Mastering React Hooks' and include code examples."

📋 JSON Format:
{
  "title": "React Hooks Guide",
  "description": "Complete guide to React hooks",
  "content": "# React Hooks\\n\\nYour content here...",
  "category": "Web Development"
}

💬 Chat Format:
User: Write a blog post about JavaScript promises
Assistant: Here's a blog post about JavaScript promises...

The AI will automatically detect the format and extract the relevant information!`}
                    rows={16}
                    className="resize-none font-mono text-sm border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl p-4 transition-colors"
                  />
                  
                  {/* Character Counter */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400">
                    <FileText className="h-3 w-3" />
                    <span>{chatgptContent.length} characters</span>
                  </div>
                </div>
                
                {/* Content Analysis */}
                {chatgptContent.trim() && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Search className="h-4 w-4 text-blue-600" />
                      Content Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{chatgptContent.split(/\s+/).filter(word => word.length > 0).length}</div>
                        <div className="text-gray-600 dark:text-gray-400">Words</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{chatgptContent.split('\n').filter(line => line.trim()).length}</div>
                        <div className="text-gray-600 dark:text-gray-400">Lines</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{Math.ceil(chatgptContent.split(/\s+/).filter(word => word.length > 0).length / 200)}</div>
                        <div className="text-gray-600 dark:text-gray-400">Min Read</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{chatgptContent.includes('```') ? 'Yes' : 'No'}</div>
                        <div className="text-gray-600 dark:text-gray-400">Code Blocks</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  type="button" 
                  onClick={handlePasteFromChatGPT}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                  disabled={!chatgptContent.trim()}
                >
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Parse & Auto-Fill Form
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const sampleContent = `User: Write a blog post about JavaScript promises with the title "Understanding JavaScript Promises" and include code examples.

Assistant: Here's a comprehensive blog post about JavaScript promises:

# Understanding JavaScript Promises

JavaScript promises are a powerful way to handle asynchronous operations. They provide a cleaner alternative to callback-based approaches.

## What are Promises?

A promise represents the eventual completion (or failure) of an asynchronous operation.

\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});
\`\`\`

## Using Promises

\`\`\`javascript
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error));
\`\`\`

This post covers the fundamentals of promises and their practical applications.`;
                    setChatgptContent(sampleContent);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl font-medium transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Sample
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
              
              {/* Help Section */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  How it works
                </h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <p>• <strong>Smart Detection:</strong> Automatically detects content format (JSON, plain text, or chat)</p>
                  <p>• <strong>Intelligent Parsing:</strong> Extracts title, description, content, and category</p>
                  <p>• <strong>Auto-Fill:</strong> Populates all form fields with the parsed content</p>
                  <p>• <strong>Format Support:</strong> Works with any ChatGPT output format</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn("space-y-6", className)} {...props}>
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode ? 'Update your existing blog post' : 'Share your thoughts and ideas with the world'}
              </p>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isBasicInfoValid ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-muted bg-muted/30'}`}>
              {isBasicInfoValid ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
              <span className={`text-sm ${isBasicInfoValid ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>Basic Info</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isSEOValid ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-muted bg-muted/30'}`}>
              {isSEOValid ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
              <span className={`text-sm ${isSEOValid ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>SEO Data</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isPitchValid ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-muted bg-muted/30'}`}>
              {isPitchValid ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
              <span className={`text-sm ${isPitchValid ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>Content</span>
            </div>
          </div>

          {/* AI Assistant Button */}
                  <Button 
                    type="button" 
                    variant="outline" 
            size="lg"
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800 hover:shadow-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Use AI Assistant
                  </Button>
                </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Basic Information
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO & Meta
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Content Editor
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter the fundamental details about your blog post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Edit3 className="h-4 w-4 text-blue-600" />
                      Blog Title *
                    </Label>
                  <Input
                    id="title"
                    type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter an engaging title for your blog post"
                      className="h-14 text-lg border-2 focus:border-blue-500 transition-colors"
                    required
                  />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${formData.title.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>{formData.title.length}/60 characters</span>
                      {formData.title.length > 60 && (
                        <span className="text-red-500">(Too long for optimal display)</span>
                      )}
                    </div>
                </div>

                  {/* Category Section */}
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Tag className="h-4 w-4 text-green-600" />
                      Category *
                    </Label>
                  <Input
                      id="category"
                    type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="e.g., Web Development, Data Science, AI/ML"
                      className="h-12 border-2 focus:border-green-500 transition-colors"
                    required
                  />
                    <p className="text-xs text-muted-foreground">
                      Choose a category that best describes your content
                    </p>
                </div>

                  {/* Image Section */}
                  <div className="space-y-3">
                    <Label htmlFor="image" className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image className="h-4 w-4 text-purple-600" />
                      Featured Image URL *
                    </Label>
                  <Input
                    id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange("image", e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                      className="h-12 border-2 focus:border-purple-500 transition-colors"
                    required
                  />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${formData.image.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Use high-quality images (recommended: 1200x630px)</span>
                    </div>
                </div>

                  {/* Description Section */}
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                      Short Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      placeholder="Write a brief, engaging description of your blog post..."
                      className="resize-none border-2 focus:border-orange-500 transition-colors"
                    required
                  />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${formData.description.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>{formData.description.length}/160 characters</span>
                      </div>
                      <span>This will appear in blog previews and summaries</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO & Meta Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Globe className="h-6 w-6 text-green-600" />
                </div>
                    SEO & Meta Information
                  </CardTitle>
                  <CardDescription className="text-base">
                    Optimize your blog post for search engines and social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Meta Title Section */}
                  <div className="space-y-3">
                    <Label htmlFor="metaTitle" className="text-sm font-semibold text-foreground">
                      Meta Title *
                    </Label>
                  <Input
                      id="metaTitle"
                    type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                      placeholder="SEO-optimized title for search engines"
                      className="h-12 border-2 focus:border-green-500 transition-colors"
                    required
                  />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${formData.metaTitle.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>{formData.metaTitle.length}/60 characters</span>
                      {formData.metaTitle.length > 60 && (
                        <span className="text-red-500">(Too long for search results)</span>
                      )}
                    </div>
                </div>

                  {/* Meta Description Section */}
                  <div className="space-y-3">
                    <Label htmlFor="metaDescription" className="text-sm font-semibold text-foreground">
                      Meta Description *
                    </Label>
                  <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    rows={3}
                      placeholder="Write a compelling meta description that will appear in search results..."
                      className="resize-none border-2 focus:border-green-500 transition-colors"
                    required
                  />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${formData.metaDescription.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>{formData.metaDescription.length}/160 characters</span>
                      {formData.metaDescription.length > 160 && (
                        <span className="text-red-500">(Too long for search results)</span>
                      )}
                    </div>
                </div>

                  {/* Keywords Section */}
                  <div className="space-y-3">
                    <Label htmlFor="metaKeywords" className="text-sm font-semibold text-foreground">
                      Keywords *
                    </Label>
                    <Input
                      id="metaKeywords"
                      type="text"
                      value={formData.metaKeywords}
                      onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
                      placeholder="react, javascript, web development, frontend"
                      className="h-12 border-2 focus:border-green-500 transition-colors"
                    required
                  />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${formData.metaKeywords.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Separate keywords with commas (5-10 keywords recommended)</span>
                    </div>
                  </div>

                  {/* SEO Preview Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800/50">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Search Result Preview
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="text-blue-600 dark:text-blue-400 font-medium truncate">
                        {formData.metaTitle || "Your Meta Title Here"}
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-xs">
                        {typeof window !== 'undefined' ? `${window.location.origin}/blog/...` : '/blog/...'}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {formData.metaDescription || "Your meta description will appear here in search results..."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Editor Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card className="border-0 bg-gradient-to-br from-background to-muted/20 dark:from-background dark:to-muted/10 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Content Editor
                  </CardTitle>
                  <CardDescription>
                    Write your blog content with our enhanced markdown editor
                  </CardDescription>
                  
                  {/* Enhanced Editor Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={editorMode === "edit" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditorMode("edit")}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Mode
                      </Button>
                      <Button
                        type="button"
                        variant={editorMode === "preview" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditorMode("preview")}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button
                        type="button"
                        variant={editorMode === "live" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEditorMode("live")}
                        className="flex items-center gap-2"
                      >
                        <Code className="h-4 w-4" />
                        Split View
                      </Button>
                    </div>
                    
                    {/* Word Count & Reading Time */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                        <FileText className="h-4 w-4" />
                        <span>{pitch.split(/\s+/).filter(word => word.length > 0).length} words</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                        <Clock className="h-4 w-4" />
                        <span>{Math.ceil(pitch.split(/\s+/).filter(word => word.length > 0).length / 200)} min read</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Enhanced Editor Container */}
                    <div className="border-2 border-border/50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Editor Header */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 px-6 py-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                              <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">Enhanced Markdown Editor</h3>
                              <p className="text-sm text-muted-foreground">Full-featured editor with live preview</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {/* Word Count Badge */}
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-black/20 rounded-lg border border-border/30">
                              <FileText className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium">{pitch.split(/\s+/).filter(word => word.length > 0).length} words</span>
                            </div>
                            {/* Auto-save Indicator */}
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800/50">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-green-700 dark:text-green-300">Auto-save</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Editor Toolbar */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">View Mode:</span>
                            <div className="flex items-center gap-1 p-1 bg-white/60 dark:bg-black/20 rounded-lg border border-border/30">
                              <Button
                                type="button"
                                variant={editorMode === "edit" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEditorMode("edit")}
                                className="h-8 px-3 text-xs"
                              >
                                <Edit3 className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant={editorMode === "preview" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEditorMode("preview")}
                                className="h-8 px-3 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                type="button"
                                variant={editorMode === "live" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setEditorMode("live")}
                                className="h-8 px-3 text-xs"
                              >
                                <Code className="h-3 w-3 mr-1" />
                                Split
                              </Button>
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const template = `# 🚀 Your Blog Title

## 🎯 Introduction
Write a compelling introduction that hooks your readers. What problem are you solving?

## 📚 Main Content
Your detailed content goes here with clear structure:

### 💡 Key Point 1
Break down your content into digestible sections with examples.

\`\`\`javascript
// Add relevant code examples
function example() {
  console.log("Engaging content!");
  return "Success!";
}
\`\`\`

### 🔧 Key Point 2
Continue developing your ideas with practical applications.

> **💡 Pro Tip:** Use blockquotes to highlight important information!

## 🔗 Resources
- [Useful Resource 1](https://example.com)
- [Documentation](https://example.com)

## 🎉 Conclusion
Wrap up with a strong conclusion and clear call-to-action.

---
*What's your next step? Let me know in the comments!*`;
                                setPitch(template);
                              }}
                              className="h-8 px-3 text-xs bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/30"
                              title="Insert enhanced template"
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Template
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const count = pitch.split(/\s+/).filter(word => word.length > 0).length;
                                const readTime = Math.ceil(count / 200);
                                alert(`📊 Content Stats:\n\n• ${pitch.length} characters\n• ${count} words\n• ~${readTime} min read time\n• ${pitch.split('\n').length} lines`);
                              }}
                              className="h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/30"
                              title="Show content statistics"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Stats
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPitch("")}
                              className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Clear all content"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Clear
                            </Button>
                          </div>
                        </div>
                </div>
                      
                      {/* Enhanced MDEditor */}
                      <div className="relative">
                  <MDEditor
                    value={pitch}
                          onChange={(value) => setPitch(value || "")}
                    id="pitch"
                          preview={editorMode}
                          height={650}
                          style={{ 
                            borderRadius: "0",
                            backgroundColor: 'transparent'
                          }}
                    textareaProps={{
                            placeholder: `# 🚀 Welcome to Your Blog Post

Start writing your amazing content here...

## 🎯 Introduction
Begin with a compelling hook that captures your reader's attention. What problem are you solving? What value will they get?

## 📚 Main Content
Structure your content with clear sections and use emojis to make it engaging:

### 💡 Key Point 1
Explain your first main idea with examples and evidence.

\`\`\`javascript
// Add code examples to illustrate concepts
function example() {
  console.log("Hello, readers!");
  return "Engaging content!";
}
\`\`\`

### 🔧 Key Point 2
Develop your second concept with practical applications.

> **Pro Tip:** Use blockquotes to highlight important information!

### 📊 Key Point 3
Cover your third important topic with real-world scenarios.

## 🔗 Resources & Links
- [Useful Resource 1](https://example.com)
- [Documentation](https://example.com)
- [Related Article](https://example.com)

## 📸 Visual Content
![Descriptive alt text](https://via.placeholder.com/600x300?text=Your+Image+Here)

## 🎉 Conclusion
Wrap up with a strong summary and call-to-action.

---

### 📝 Writing Tips:
- **Bold** text for emphasis
- *Italic* text for subtle emphasis
- \`inline code\` for technical terms
- Use headers (H1, H2, H3) for structure
- Add lists for easy scanning
- Include emojis for visual appeal
- Keep paragraphs short and readable

### 🚀 Ready to publish?
Your readers will love this well-structured content!`,
                            style: {
                              fontSize: '16px',
                              lineHeight: '1.6',
                              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                            }
                    }}
                    previewOptions={{
                      disallowedElements: ["style"],
                            rehypePlugins: [],
                          }}
                        />
                        
                        {/* Content Quality Indicator */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 bg-white/90 dark:bg-black/80 rounded-lg shadow-lg border border-border/50 backdrop-blur-sm">
                          <div className={`w-2 h-2 rounded-full ${pitch.length > 1000 ? 'bg-green-500' : pitch.length > 500 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs font-medium">
                            {pitch.length > 1000 ? 'Excellent' : pitch.length > 500 ? 'Good' : 'Add more content'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Content Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Content Length</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{pitch.length} characters</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border border-green-200 dark:border-green-800/50">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Reading Time</p>
                          <p className="text-lg font-bold text-green-700 dark:text-green-300">{Math.ceil(pitch.split(/\s+/).filter(word => word.length > 0).length / 200)} min</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800/50">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Status</p>
                          <p className={`text-lg font-bold ${pitch.length > 50 ? 'text-purple-700 dark:text-purple-300' : 'text-red-600 dark:text-red-400'}`}>
                            {pitch.length > 50 ? 'Ready' : 'Incomplete'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 rounded-xl p-6 border border-gray-200 dark:border-gray-800/50 shadow-lg">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                          <Code className="h-5 w-5 text-gray-600" />
                        </div>
                        ⌨️ Keyboard Shortcuts
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200">Text Formatting</h5>
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Bold</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+B</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Italic</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+I</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Code</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+K</kbd>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200">Editor Actions</h5>
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Save</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+S</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Undo</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Z</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Redo</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Y</kbd>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200">Quick Inserts</h5>
                          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Link</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+L</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Image</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Alt+I</kbd>
                            </div>
                            <div className="flex justify-between">
                              <span>Code Block</span>
                              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl+Alt+C</kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Writing Tips */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Writing Best Practices */}
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-4 flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-yellow-600" />
                          </div>
                          Writing Best Practices
                        </h4>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-3">
                          <li className="flex items-start gap-3 group">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">1</div>
                            <span>Use clear, descriptive headings (H1, H2, H3) to structure your content</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">2</div>
                            <span>Keep paragraphs short (2-3 sentences max) for better readability</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">3</div>
                            <span>Include code examples with proper syntax highlighting</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">4</div>
                            <span>Add images and diagrams to illustrate complex concepts</span>
                          </li>
                          <li className="flex items-start gap-3 group">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">5</div>
                            <span>End with a strong conclusion and clear call-to-action</span>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Markdown Syntax */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Code className="h-5 w-5 text-blue-600" />
                          </div>
                          Markdown Syntax
                        </h4>
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-4">
                          <div className="space-y-2">
                            <p className="font-semibold mb-2">Text Formatting:</p>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center justify-between p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-xs">**Bold**</code>
                                <span className="text-xs">→ <strong>Bold</strong></span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-xs">*Italic*</code>
                                <span className="text-xs">→ <em>Italic</em></span>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg">
                                <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-xs">\`Code\`</code>
                                <span className="text-xs">→ <code>Code</code></span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="font-semibold mb-2">Structure:</p>
                            <ul className="space-y-1 text-xs">
                              <li>• <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">#</code> H1, <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">##</code> H2, <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">###</code> H3</li>
                              <li>• <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">-</code> or <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">*</code> for lists</li>
                              <li>• <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">\`\`\`</code> for code blocks</li>
                              <li>• <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">[text](url)</code> for links</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Insert Templates */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Sparkles className="h-5 w-5 text-green-600" />
                          </div>
                          Quick Templates
                        </h4>
                        <div className="space-y-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const codeSnippet = `\`\`\`javascript
// Your code example here
function example() {
  console.log("Hello World!");
  return "Success!";
}
\`\`\``;
                              setPitch(pitch + (pitch ? '\n\n' : '') + codeSnippet);
                            }}
                            className="w-full justify-start h-auto p-3 bg-green-100/50 hover:bg-green-200/50 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                          >
                            <Code className="h-4 w-4 mr-2 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-green-800 dark:text-green-200">Code Block</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Insert syntax-highlighted code</div>
                            </div>
                          </Button>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const imageTemplate = `![Image description](https://via.placeholder.com/600x300?text=Your+Image+Here)

*Caption: Add a descriptive caption for your image*`;
                              setPitch(pitch + (pitch ? '\n\n' : '') + imageTemplate);
                            }}
                            className="w-full justify-start h-auto p-3 bg-green-100/50 hover:bg-green-200/50 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                          >
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image className="h-4 w-4 mr-2 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-green-800 dark:text-green-200">Image</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Add image with caption</div>
                            </div>
                          </Button>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const tipsTemplate = `> **💡 Pro Tip:** 
> This is a helpful tip or important note that readers should pay attention to. Use blockquotes to make key information stand out!`;
                              setPitch(pitch + (pitch ? '\n\n' : '') + tipsTemplate);
                            }}
                            className="w-full justify-start h-auto p-3 bg-green-100/50 hover:bg-green-200/50 dark:bg-green-900/20 dark:hover:bg-green-800/30"
                          >
                            <Lightbulb className="h-4 w-4 mr-2 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-green-800 dark:text-green-200">Pro Tip</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Insert highlighted tip box</div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Section */}
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${isFormValid ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {isFormValid ? "🎉 Ready to publish!" : "⚠️ Almost there..."}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isFormValid ? "All fields are complete! Your blog post is ready to go live." : "Please complete all required fields before publishing."}
                  </p>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Form completion:</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (Object.values(formData).filter(Boolean).length / Object.keys(formData).length) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{Math.round((Object.values(formData).filter(Boolean).length / Object.keys(formData).length) * 100)}%</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={!isFormValid || isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {isEditMode ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-3" />
                        {isEditMode ? 'Update Blog Post' : 'Publish Blog Post'}
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </>
                    )}
                </Button>
                  
                  {/* Quick Tips */}
                  <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                    <Lightbulb className="h-3 w-3" />
                    <span>💡 Use the AI Assistant above for content help!</span>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
        </form>
      </div>
    </>
  );
}
