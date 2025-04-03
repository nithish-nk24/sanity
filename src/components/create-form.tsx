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
  const { toast } = useToast();
  const router = useRouter();
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
    // const title = formData.get("title") as string;
    // const image = formData.get("image") as string;
    // const category = formData.get("category") as string;
    // const description = formData.get("description") as string;
    // const pitch = formData.get("pitch") as string;
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
        router.push("/blogs/all");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Creating Blog",
        description: "Please Try Again",
      });
    }
    // console.log(formValues);

    // TODO: Add post
  };
  return (
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
  );
}
