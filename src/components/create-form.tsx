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
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { createBlog } from "@/lib/action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function CreateForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [pitch, setPitch] = useState("");
  const [chatgptContent, setChatgptContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const handlePasteFromChatGPT = () => {
    const parsed = parseChatGPTContent(chatgptContent);
    
    // Fill form fields
    if (parsed.title) {
      const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
      if (titleInput) titleInput.value = parsed.title;
    }
    if (parsed.metaTitle) {
      const metaTitleInput = document.querySelector('input[name="metaTitle"]') as HTMLInputElement;
      if (metaTitleInput) metaTitleInput.value = parsed.metaTitle;
    }
    if (parsed.image) {
      const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement;
      if (imageInput) imageInput.value = parsed.image;
    }
    if (parsed.metaKeywords) {
      const metaKeywordsInput = document.querySelector('input[name="metaKeywords"]') as HTMLInputElement;
      if (metaKeywordsInput) metaKeywordsInput.value = parsed.metaKeywords;
    }
    if (parsed.category) {
      const categoryInput = document.querySelector('input[name="category"]') as HTMLInputElement;
      if (categoryInput) categoryInput.value = parsed.category;
    }
    if (parsed.metaDescription) {
      const metaDescriptionTextarea = document.querySelector('textarea[name="metaDescription"]') as HTMLTextAreaElement;
      if (metaDescriptionTextarea) metaDescriptionTextarea.value = parsed.metaDescription;
    }
    if (parsed.description) {
      const descriptionTextarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      if (descriptionTextarea) descriptionTextarea.value = parsed.description;
    }
    if (parsed.pitch) {
      setPitch(parsed.pitch);
    }

    setIsModalOpen(false);
    setChatgptContent("");
    
    toast({
      title: "Content Pasted Successfully",
      description: "Form fields have been filled with ChatGPT content",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = {
      title: formData.get("title") as string,
      metaTitle: formData.get("metaTitle") as string,
      link: formData.get("image") as string,
      metaKeywords: formData.get("metaKeywords") as string,
      category: formData.get("category") as string,
      metaDescription: formData.get("metaDescription") as string,
      description: formData.get("description") as string,
    };

    try {
      const result = await createBlog(formValues, pitch);
      console.log(result);
      if (result.status === "SUCCESS") {
        formData.delete("title");
        formData.delete("metaTitle");
        formData.delete("image");
        formData.delete("metaKeywords");
        formData.delete("category");
        formData.delete("metaDescription");
        formData.delete("description");

        toast({
          title: "Successfully Created Blog",
          description: "Your Can View It From Your Blog Section",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Creating Blog",
        description: "Please Try Again",
      });
    }
  };

  return (
    <>
      {/* ChatGPT Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Paste ChatGPT Content</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Paste the formatted content from ChatGPT below. The system will automatically parse and fill the form fields.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="chatgpt-content">ChatGPT Output</Label>
                <Textarea
                  id="chatgpt-content"
                  value={chatgptContent}
                  onChange={(e) => setChatgptContent(e.target.value)}
                  placeholder="Paste your ChatGPT content here..."
                  rows={10}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={handlePasteFromChatGPT}
                  className="flex-1"
                >
                  Parse & Fill Form
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn("flex flex-col gap-6 bg-black/90", className)}
        {...props}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Blog</CardTitle>
            <CardDescription>Must be confirm checking </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* ChatGPT Paste Button */}
                <div className="flex justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    📋 Paste from ChatGPT
                  </Button>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter Title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    type="text"
                    name="metaTitle"
                    placeholder="Enter Meta Title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    type="text"
                    name="metaKeywords"
                    placeholder="Meta Keywords Comma Separated"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Category</Label>
                  <Input
                    id="category"
                    type="text"
                    name="category"
                    placeholder="Web Development, Data Science, etc"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Meta Description</Label>
                  <Textarea
                    name="metaDescription"
                    rows={3}
                    placeholder="Enter Description"
                    className="resize-none"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    name="description"
                    rows={5}
                    placeholder="Enter Description"
                    className="resize-none"
                    required
                  />
                </div>
                <div className="grid gap-2" data-color-mode="light">
                  <Label htmlFor="description">Pitch</Label>
                  <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id="pitch"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: "10px", overflow: "hidden" }}
                    textareaProps={{
                      placeholder: "Briefly describe your startup idea",
                    }}
                    previewOptions={{
                      disallowedElements: ["style"],
                    }}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!pitch}>
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
