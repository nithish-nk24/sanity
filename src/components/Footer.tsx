"use client";

import { FooterCompany, FooterCourses, FooterResources, FooterSupport } from "../../public/assets/assets";
import ListItems from "./list-Items";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Heart
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border relative overflow-hidden w-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info & Logo */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed hover:text-foreground transition-colors duration-300">
              Empowering students with cutting-edge technology education and real-world skills 
              to build successful careers in the digital age.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
                { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
                { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
                { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
                { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" }
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-muted ${social.color} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 social-icon`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-foreground relative">
              GET IN TOUCH
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            
            {/* Email Subscription */}
            <div className="mb-6">
              <p className="text-muted-foreground mb-3">Your Email</p>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary rounded-r-none footer-input"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-l-none px-4 transition-all duration-300 hover:scale-105">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Contact Numbers */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Toll Free Customer Care</p>
                  <p className="text-foreground font-medium">+91 9176121201</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-foreground font-medium">+91 9384125201</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-foreground font-medium">+91 9894451201</p>
                </div>
              </div>
            </div>

            {/* Live Support */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Need live support?</p>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a 
                  href="mailto:info@cyfotok.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  info@cyfotok.com
                </a>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-foreground relative">
              ABOUT
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <div className="space-y-3">
              {[
                { title: "About Us", href: "/about" },
                { title: "Blogs", href: "/blogs/all" },
                { title: "Events", href: "/events" },
                { title: "Contact Us", href: "/contact" }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 transform footer-link-hover"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-foreground relative">
              CATEGORIES
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <div className="space-y-3">
              {[
                { title: "Web Development", href: "/courses/web-development" },
                { title: "Bug Hunting", href: "/courses/bug-hunting" },
                { title: "CyberSecurity", href: "/courses/cybersecurity" },
                { title: "Mobile App Development", href: "/courses/mobile-development" },
                { title: "Artificial Intelligence", href: "/courses/ai-ml" }
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 transform footer-link-hover"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>© 2025 Cyfotok Academy. All Rights Reserved.</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="hidden sm:inline">in India</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-foreground transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 back-to-top"
          aria-label="Back to top"
        >
          <ArrowRight className="h-5 w-5 rotate-[-90deg]" />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
