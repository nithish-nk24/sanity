import { UserIcon, Shield, Calendar } from "lucide-react";
import { defineField, defineType } from "sanity";

export const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "username",
      title: "Username",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(50),
      description: "Unique username for login (3-50 characters)"
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
      description: "User's email address"
    }),
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(100),
      description: "User's full name"
    }),
    defineField({
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Hashed password (never store plain text)",
      hidden: true // Hide from Sanity Studio for security
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: [
          { title: "Admin", value: "admin" },
          { title: "Editor", value: "editor" },
          { title: "Author", value: "author" },
          { title: "Viewer", value: "viewer" }
        ]
      },
      validation: (Rule) => Rule.required(),
      description: "User's role in the system"
    }),
    defineField({
      name: "isActive",
      title: "Active Status",
      type: "boolean",
      initialValue: true,
      description: "Whether the user account is active"
    }),
    defineField({
      name: "lastLogin",
      title: "Last Login",
      type: "datetime",
      readOnly: true,
      description: "Timestamp of last successful login"
    }),
    defineField({
      name: "loginAttempts",
      title: "Failed Login Attempts",
      type: "number",
      initialValue: 0,
      readOnly: true,
      description: "Number of consecutive failed login attempts"
    }),
    defineField({
      name: "lockedUntil",
      title: "Account Locked Until",
      type: "datetime",
      readOnly: true,
      description: "Timestamp until which account is locked due to failed attempts"
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true
    }),
    defineField({
      name: "image",
      title: "Profile Image",
      type: "string",
      description: "URL to user's profile image"
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "Short description about the user"
    }),
    defineField({
      name: "permissions",
      title: "Custom Permissions",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Create Blog", value: "create:blog" },
          { title: "Edit Blog", value: "edit:blog" },
          { title: "Delete Blog", value: "delete:blog" },
          { title: "Manage Users", value: "manage:users" },
          { title: "View Analytics", value: "view:analytics" },
          { title: "Export Data", value: "export:data" }
        ]
      },
      description: "Additional permissions beyond role-based access"
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "username",
      role: "role",
      media: "image"
    },
    prepare(selection) {
      const { title, subtitle, role, media } = selection;
      return {
        title: title || "Unnamed User",
        subtitle: `${subtitle} (${role})`,
        media: media || UserIcon
      };
    }
  },
  orderings: [
    {
      title: "Name A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }]
    },
    {
      title: "Recently Created",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }]
    },
    {
      title: "Role",
      name: "roleAsc",
      by: [{ field: "role", direction: "asc" }]
    }
  ]
});
