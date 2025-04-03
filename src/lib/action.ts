"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createBlog = async (
//   state: any,
  form : {
    title: string,
    metaTitle: string,
    link: string,
    metaKeywords: string,
    category: string,
    metaDescription: string
    description: string
  },
  pitch: string
) => {
  const session = await auth();
  // console.log(session);
  
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, link ,metaTitle, metaKeywords, metaDescription } = form

  if (!title || !description || !category || !link || !metaTitle || !metaKeywords || !metaDescription)
    return parseServerActionResponse({
      error: "Missing required fields",
      status: "ERROR",
    });

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const blog = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      metaTitle,
      metaKeywords,
      metaDescription,
      pitch,
    };

    const result = await writeClient.create({
      _type: "blog",
      ...blog,
    });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};

export const deleteBlog = async(id:string)=>{
  const session = await auth()
  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

    try {
      const result = await writeClient.delete(id)
      return parseServerActionResponse({
        ...result,
        error: "",
        status: "SUCCESS",
      })
    } catch (error) {
      console.log(error);
      return parseServerActionResponse({
        error: JSON.stringify(error),
        status: "ERROR",
      });
    }
}
