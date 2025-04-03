"use client";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
const BlogForm = () => {
  // const [error, setError] = useState<string | string>({});
  const [pitch, setPitch] = useState("");
  return (
    <form className="startup-form mx-auto ml-10">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Enter Title"
        />
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Enter Description"
        />
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: "20px", overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your startup idea",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
      </div>
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={!pitch}
      >
        {!pitch ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default BlogForm;
