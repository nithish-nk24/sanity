import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Star
} from "lucide-react";
import Link from "next/link";
import { parseISO, format } from "date-fns";

export const metadata: Metadata = {
  title: "Internships | Cyfotok Academy",
  description: "Explore exciting internship opportunities at Cyfotok Academy. Gain real-world experience in technology, development, and innovation.",
};

const internships = [
  {
    id: 1,
    title: "Frontend Development Intern",
    department: "Engineering",
    location: "Remote / On-site",
    duration: "3-6 months",
    type: "Paid",
    level: "Beginner to Intermediate",
    description: "Work with our development team to build modern web applications using React, TypeScript, and cutting-edge technologies.",
    requirements: [
      "Basic knowledge of HTML, CSS, JavaScript",
      "Familiarity with React or similar frameworks",
      "Understanding of version control (Git)",
      "Strong problem-solving skills"
    ],
    benefits: [
      "Mentorship from senior developers",
      "Real project experience",
      "Certificate of completion",
      "Potential for full-time offer"
    ],
    applications: 45,
    deadline: "2024-03-15"
  },
  {
    id: 2,
    title: "Data Science Intern",
    department: "Analytics",
    location: "Hybrid",
    duration: "4-6 months",
    type: "Paid",
    level: "Intermediate",
    description: "Analyze educational data, build predictive models, and create insights to improve student learning outcomes.",
    requirements: [
      "Python programming experience",
      "Knowledge of pandas, numpy, scikit-learn",
      "Basic understanding of statistics",
      "Experience with data visualization"
    ],
    benefits: [
      "Work with real educational datasets",
      "Learn advanced ML techniques",
      "Present findings to stakeholders",
      "Industry-standard tools and practices"
    ],
    applications: 32,
    deadline: "2024-03-20"
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    department: "Design",
    location: "Remote",
    duration: "3-4 months",
    type: "Paid",
    level: "Beginner to Intermediate",
    description: "Design user interfaces and experiences for our educational platform, working closely with product and engineering teams.",
    requirements: [
      "Proficiency in Figma or similar design tools",
      "Understanding of design principles",
      "Basic knowledge of user research",
      "Portfolio of design work"
    ],
    benefits: [
      "Mentorship from senior designers",
      "Portfolio development support",
      "Exposure to design systems",
      "User testing experience"
    ],
    applications: 28,
    deadline: "2024-03-18"
  },
  {
    id: 4,
    title: "Digital Marketing Intern",
    department: "Marketing",
    location: "Remote / On-site",
    duration: "3-6 months",
    type: "Paid",
    level: "Beginner",
    description: "Support our marketing team in creating content, managing social media, and analyzing campaign performance.",
    requirements: [
      "Strong written communication skills",
      "Social media savvy",
      "Basic understanding of digital marketing",
      "Creative mindset"
    ],
    benefits: [
      "Learn digital marketing strategies",
      "Content creation experience",
      "Analytics and reporting skills",
      "Industry networking opportunities"
    ],
    applications: 67,
    deadline: "2024-03-25"
  }
];

const stats = [
  { label: "Active Internships", value: "12+", icon: Briefcase },
  { label: "Success Rate", value: "89%", icon: Star },
  { label: "Average Duration", value: "4 months", icon: Clock },
  { label: "Full-time Offers", value: "65%", icon: GraduationCap }
];

export default function InternshipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Launch Your Career with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}Internships
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gain hands-on experience, work on real projects, and learn from industry experts. 
            Our internship program is designed to bridge the gap between education and career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View All Positions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More About Our Program
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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

      {/* Internships Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Current Opportunities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover internships that match your skills and interests. Each position offers 
              unique learning opportunities and career growth potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {internships.map((internship) => (
              <Card key={internship.id} className="hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {internship.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{internship.department}</Badge>
                        <Badge variant="outline">{internship.type}</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {internship.applications} applications
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {internship.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {internship.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      {internship.level}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {internship.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {internship.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {internship.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm text-gray-600">
                        Deadline: {format(parseISO(internship.deadline), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Application Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined application process ensures you have the best chance to showcase your skills and potential.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Submit Application",
                description: "Complete the online application form with your resume and cover letter."
              },
              {
                step: "02",
                title: "Initial Screening",
                description: "Our team reviews your application and assesses your qualifications."
              },
              {
                step: "03",
                title: "Interview Round",
                description: "Participate in technical and behavioral interviews with our team."
              },
              {
                step: "04",
                title: "Start Your Journey",
                description: "Join our team and begin your internship with comprehensive onboarding."
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Internship Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of students who have launched their careers through our internship program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Apply for Internships
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
