# Cyfotok Academy - Sanity Blog Platform

A modern, feature-rich blog platform built with Next.js 15, Sanity CMS, and NextAuth.js. This application provides a comprehensive blogging experience with an intuitive admin dashboard, enhanced content creation tools, and a beautiful user-facing interface.

## ✨ Features

### 🎯 Core Functionality
- **Modern Blog Platform** - Built with Next.js 15 App Router
- **Content Management** - Powered by Sanity CMS for flexible content creation
- **Authentication System** - NextAuth.js with GitHub OAuth and Personal Access Token support
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode Support** - Built-in theme switching with system preference detection

### 🚀 Admin Dashboard
- **Analytics Overview** - Comprehensive blog statistics and insights
- **Blog Management** - Create, edit, and manage blog posts with advanced features
- **Content Editor** - Enhanced Markdown editor with real-time preview
- **ChatGPT Integration** - Smart content parsing and auto-fill capabilities
- **User Management** - Secure authentication and role-based access

### 📝 Content Creation
- **Advanced Markdown Editor** - Built-in MDEditor with multiple view modes
- **Smart Content Parsing** - Import content from ChatGPT with intelligent formatting
- **SEO Optimization** - Built-in meta tags, descriptions, and SEO tools
- **Image Management** - Optimized image handling with Next.js Image component
- **Category Management** - Flexible categorization and tagging system

### 🌐 User Experience
- **Enhanced Blog List** - Grid and list views with advanced filtering
- **Search & Filtering** - Real-time search with category and date filters
- **Social Sharing** - Web Share API integration with clipboard fallback
- **Responsive Navigation** - Mobile-optimized navigation and sidebar
- **Performance Optimized** - Fast loading with Next.js optimizations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **CMS**: Sanity.io
- **Authentication**: NextAuth.js
- **Database**: Sanity (with MongoDB backend)
- **Deployment**: Vercel (recommended)
- **Icons**: Lucide React
- **UI Components**: Shadcn/ui components

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Sanity account
- GitHub account (for OAuth)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sanity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with the following variables:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # GitHub OAuth
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-sanity-api-token
   
   # Authentication URL (for development)
   AUTH_URL=http://localhost:3000
   ```

4. **Sanity Setup**
   ```bash
   npm run sanity:deploy
   # or
   npx sanity deploy
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Setup

### GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to your `.env.local`

### Personal Access Token (Alternative)
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with appropriate permissions
3. Use the token for authentication in the admin panel

## 🎨 Customization

### Theme Configuration
The application uses Tailwind CSS with a comprehensive design system. Customize colors, spacing, and components in:
- `tailwind.config.ts` - Main configuration
- `src/lib/theme.tsx` - Theme context and utilities
- `src/app/globals.css` - Global styles and CSS variables

### Component Library
Built with Shadcn/ui components for consistency and accessibility:
- All components are located in `src/components/ui/`
- Follow the established patterns for adding new components
- Maintain dark mode compatibility

### Content Schema
Customize your Sanity content models in:
- `src/sanity/schemaTypes/` - Content type definitions
- `src/sanity/lib/queries.ts` - Data fetching queries
- `src/sanity/structure.ts` - Studio structure configuration

## 📱 Available Routes

### Public Routes
- `/` - Homepage with hero section and featured content
- `/blogs` - Blog listing with search and filtering
- `/blog/[slug]` - Individual blog post view
- `/careers` - Career opportunities page
- `/internships` - Internship listings
- `/contact` - Contact form and information

### Admin Routes
- `/admin` - Admin dashboard overview
- `/admin/dashboard` - Main admin dashboard with analytics
- `/admin/createblog` - Blog creation and editing interface
- `/admin/settings` - Application settings and configuration

### Authentication Routes
- `/auth/signin` - Sign-in page
- `/auth/error` - Authentication error handling

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure your hosting provider

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Sanity Studio
npm run sanity:dev   # Start Sanity Studio
npm run sanity:deploy # Deploy Sanity Studio
npm run sanity:build # Build Sanity Studio

# Database
npm run sanity:seed  # Seed database with sample data
```

## 📊 Performance Features

- **Image Optimization** - Next.js Image component with automatic optimization
- **Code Splitting** - Automatic route-based code splitting
- **Static Generation** - Pre-rendered pages for better performance
- **Lazy Loading** - Components and images load on demand
- **Caching** - Built-in caching strategies for optimal performance

## 🎯 Key Components

### Admin Dashboard
- **DashboardStats** - Blog statistics and metrics
- **AnalyticsOverview** - Comprehensive analytics visualization
- **BlogManagement** - Blog post management interface
- **QuickActions** - Common admin actions
- **CreateForm** - Advanced blog creation form

### User Interface
- **EnhancedBlogList** - Feature-rich blog listing with filtering
- **HeroSection** - Engaging homepage hero
- **Navigation** - Responsive navigation components
- **Footer** - Comprehensive site footer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [documentation](docs/)
- Review the [changelog](CHANGELOG.md)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Content management by [Sanity](https://www.sanity.io/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ by the Cyfotok Academy Team**
