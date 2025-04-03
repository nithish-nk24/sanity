import { defineField, defineType } from "sanity";

export const blog = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "metaTitle",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaKeywords",
      type: "string",
    }),
    defineField({
      name: "category",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      type: "text",
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "pitch",
      type: "markdown",
    }),
  ],
});
