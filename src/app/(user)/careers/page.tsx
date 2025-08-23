import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  Heart,
  Zap,
  Shield,
  Trophy,
  ArrowRight,
  Building,
  DollarSign,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { parseISO, format } from "date-fns";

export const metadata: Metadata = {
  title: "Careers | Cyfotok Academy",
  description: "Join our team at Cyfotok Academy. Explore career opportunities and help shape the future of education technology.",
};

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote / Bangalore",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹12-18 LPA",
    description: "Lead the development of our next-generation learning platform using React, TypeScript, and modern web technologies.",
    requirements: [
      "5+ years of React/TypeScript experience",
      "Experience with state management (Redux/Zustand)",
      "Knowledge of testing frameworks (Jest, Cypress)",
      "Strong understanding of web performance",
      "Experience with design systems"
    ],
    responsibilities: [
      "Architect and develop scalable frontend solutions",
      "Mentor junior developers",
      "Collaborate with design and product teams",
      "Optimize application performance",
      "Lead code reviews and technical discussions"
    ],
    posted: "2024-01-15"
  },
  {
    id: 2,
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Hybrid - Bangalore",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹10-15 LPA",
    description: "Build and maintain our cloud infrastructure, ensuring scalability, security, and reliability of our educational platform.",
    requirements: [
      "Experience with AWS/Azure cloud platforms",
      "Proficiency in Docker and Kubernetes",
      "Knowledge of CI/CD pipelines",
      "Infrastructure as Code (Terraform/CloudFormation)",
      "Monitoring and logging tools experience"
    ],
    responsibilities: [
      "Design and implement scalable infrastructure",
      "Automate deployment processes",
      "Monitor system performance and reliability",
      "Implement security best practices",
      "Collaborate with development teams"
    ],
    posted: "2024-01-12"
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "Bangalore",
    type: "Full-time",
    experience: "3-6 years",
    salary: "₹15-22 LPA",
    description: "Drive product strategy and execution for our educational technology platform, working closely with engineering, design, and business teams.",
    requirements: [
      "3+ years of product management experience",
      "Experience in EdTech or SaaS products",
      "Strong analytical and data-driven mindset",
      "Excellent communication skills",
      "Experience with agile methodologies"
    ],
    responsibilities: [
      "Define product roadmap and strategy",
      "Conduct user research and analysis",
      "Work with cross-functional teams",
      "Analyze product metrics and KPIs",
      "Drive product launches and iterations"
    ],
    posted: "2024-01-10"
  },
  {
    id: 4,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote / Bangalore",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹8-12 LPA",
    description: "Create intuitive and engaging user experiences for our educational platform, focusing on accessibility and user-centered design.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma, Adobe Creative Suite",
      "Strong portfolio showcasing design process",
      "Experience with design systems",
      "Knowledge of accessibility guidelines"
    ],
    responsibilities: [
      "Design user interfaces and experiences",
      "Conduct user research and usability testing",
      "Create and maintain design systems",
      "Collaborate with product and engineering",
      "Prototype and iterate on designs"
    ],
    posted: "2024-01-08"
  },
  {
    id: 5,
    title: "Data Scientist",
    department: "Analytics",
    location: "Bangalore",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹12-18 LPA",
    description: "Leverage data to improve learning outcomes, build predictive models, and generate insights to drive product decisions.",
    requirements: [
      "Strong Python/R programming skills",
      "Experience with ML frameworks (scikit-learn, TensorFlow)",
      "Statistical analysis and modeling expertise",
      "SQL and database knowledge",
      "Experience with data visualization tools"
    ],
    responsibilities: [
      "Analyze educational data and metrics",
      "Build predictive models and algorithms",
      "Create data-driven insights and reports",
      "Collaborate with product and engineering teams",
      "Implement A/B testing frameworks"
    ],
    posted: "2024-01-05"
  },
  {
    id: 6,
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹8-12 LPA",
    description: "Lead our content marketing strategy, creating engaging educational content and building our brand presence in the EdTech space.",
    requirements: [
      "3+ years of content marketing experience",
      "Excellent writing and editing skills",
      "Experience with SEO and content optimization",
      "Social media marketing expertise",
      "Analytics and performance tracking"
    ],
    responsibilities: [
      "Develop content marketing strategy",
      "Create blog posts, guides, and educational content",
      "Manage social media presence",
      "Collaborate with subject matter experts",
      "Analyze content performance and optimize"
    ],
    posted: "2024-01-03"
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs."
  },
  {
    icon: Zap,
    title: "Growth & Learning",
    description: "Professional development budget, conference attendance, and continuous learning opportunities."
  },
  {
    icon: Shield,
    title: "Work-Life Balance",
    description: "Flexible working hours, remote work options, and generous paid time off."
  },
  {
    icon: Trophy,
    title: "Recognition & Rewards",
    description: "Performance bonuses, stock options, and regular recognition programs."
  }
];

const values = [
  {
    title: "Innovation First",
    description: "We embrace new technologies and approaches to solve educational challenges."
  },
  {
    title: "Student-Centric",
    description: "Every decision we make is guided by what's best for our students' learning journey."
  },
  {
    title: "Collaborative Culture",
    description: "We believe in the power of teamwork and open communication."
  },
  {
    title: "Continuous Growth",
    description: "We're committed to personal and professional development for all team members."
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build the Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Education
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our passionate team of educators, technologists, and innovators who are 
            transforming how people learn and grow. Make an impact that matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View Open Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Team Members", value: "150+", icon: Users },
              { label: "Open Positions", value: "12", icon: Briefcase },
              { label: "Countries", value: "5+", icon: Building },
              { label: "Employee Satisfaction", value: "4.8/5", icon: Trophy }
            ].map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <stat.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive benefits and a supportive environment where you can thrive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                      <benefit.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover opportunities that match your skills and passion. Each role offers 
              unique challenges and growth potential.
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <Badge variant="secondary">{job.department}</Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4 max-w-2xl">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {format(parseISO(job.posted), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Apply Now
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Don&apos;t see a role that fits? We&apos;re always looking for talented individuals.
            </p>
            <Button variant="outline" size="lg">
              Send Us Your Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Hiring Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;ve designed our hiring process to be transparent, fair, and focused on finding the right fit.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: "01",
                title: "Application",
                description: "Submit your application with resume and cover letter."
              },
              {
                step: "02",
                title: "Screening",
                description: "Initial review and phone/video screening call."
              },
              {
                step: "03",
                title: "Technical",
                description: "Technical assessment or portfolio review."
              },
              {
                step: "04",
                title: "Interview",
                description: "In-depth interviews with team members."
              },
              {
                step: "05",
                title: "Decision",
                description: "Reference checks and final decision."
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-sm text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our mission to transform education and help millions of students achieve their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Browse Open Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
