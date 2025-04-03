//logo
import logo from "./logo.svg";
//hero img
import heroImg from "./heroImg.jpg";
//brands
import brand1 from "./brands/brand-1.png";
import brand2 from "./brands/brand-2.png";
import brand3 from "./brands/brand-3.png";
import brand4 from "./brands/brand-4.png";
import brand5 from "./brands/brand-5.png";
import brand6 from "./brands/brand-6.png";
import brand7 from "./brands/brand-7.png";
// info
// import info1 from "./information/info1.png";
// import info2 from "./information/info2.png";
// import info3 from "./information/info3.png";
// facilities
import rocket from "./facilities/rocket.svg";
import laptop from "./facilities/laptop.svg";
import certificate from "./facilities/file-badge.svg";
import puzzle from "./facilities/puzzle.svg";
import star from "./facilities/star.svg";
import medal from "./facilities/medal.svg";
//banner
import hackathon from "./banner/hackathon.png";
import teamWork from "./banner/teamwork.png";
//external links
import certificatePrep from "./external-links/clipboard-check.svg";
import careerGuidance from "./external-links/map.svg";
import skill from "./external-links/bug.svg";
import moniter from "./external-links/airplay.svg";
import virus from "./external-links/worm.svg";
import star2 from "./external-links/star2.svg";

// background for contact
import contactBG from "./bg.jpg";
// social icons
import linkedin from "./social-icons/linkedin.svg";
import instagram from "./social-icons/instagram.svg";
import twitter from "./social-icons/twitter.svg";
import youtube from "./social-icons/youtube.svg";
import whatsapp from "./social-icons/whatsapp.svg";
//character
import girl from "./girl.png";
export const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7];

// skill BG
import SkillBG from "./skill/team-work.jpg";


// dummmy for now
import info1 from './skill/CS1.jpeg'
import dummy2 from './skill/WD1.jpeg'
import dummy3 from './skill/AI1.jpeg'
export const assets = {
  logo,
  heroImg,
};

export const infoData = [
  {
    img: info1,
    title: "Learn",
    description:
      "Study core concepts and get hands-on with key skills in cybersecurity courses and labs led by industry experts.",
  },
  {
    img: dummy2,
    title: "Practice",
    description:
      "Apply what you learn in practice through hands-on projects and real-world scenarios in cybersecurity courses and labs led by industry experts.",
  },
  {
    img: dummy3,
    title: "Grow",
    description:
      "Grow your skills and knowledge in cybersecurity by participating in online cybersecurity events, webinars, and workshops led by industry experts.",
  },
];

export const facilitiesData = [
  {
    title: "Launch Your Career",
    description:
      "Get the skills and knowledge you need to launch your career in cybersecurity with our courses and labs led by industry experts.",
    imgUrl: rocket,
  },
  {
    title: "Onboard Team Members",
    description:
      "Onboard your team members to the cybersecurity world with our courses and labs led by industry experts.",
    imgUrl: laptop,
  },
  {
    title: "Earn Certificates",
    description:
      "Earn certificates for your achievements in cybersecurity with our courses and labs led by industry experts.",
    imgUrl: certificate,
  },
  {
    title: "Upskill and Practice",
    description:
      "Master hands-on skills and familiarize yourself with the latest vulnerabilities and threats so you can prepare for real-world attacks.",
    imgUrl: puzzle,
  },
  {
    title: "Retain Top Skills",
    description:
      "Get the skills and knowledge you need to launch your career in cybersecurity with our courses and labs led by industry experts.",
    imgUrl: star,
  },
  {
    title: "Reduce Business Risk",
    description:
      "Get the skills and knowledge you need to launch your career in cybersecurity with our courses and labs led by industry experts.",
    imgUrl: medal,
  },
];

export const externalLinks = [
  {
    title: "CyberSecurity",
    link: "/courses/all",
    img: skill,
  },
  {
    title: "Web Development",
    link: "/courses/all",
    img: moniter,
  },
  {
    title: "Digital Marketing",
    link: "/courses/all",
    img: certificatePrep,
  },
  {
    title: "App Development",
    link: "/courses/all",
    img: careerGuidance,
  },
  {
    title: "Artificial Intelligence",
    link: "/courses/all",
    img: virus,
  },
  {
    title: "UI/UX Design",
    link: "/courses/all",
    img: star2,
  },
];

export const testimonials = [
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Anchitha",
    designation: "Intern Cybersecurity Analyst",
    src: "https://9tyd79g1bs.ufs.sh/f/CVETMkBmijEYfe0dmGWHJVQzwXkF4WBqS3id5bZNjt71l6UO",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Adhithyan",
    designation: "Intern Cybersecurity Analyst",
    src: "https://9tyd79g1bs.ufs.sh/f/CVETMkBmijEYIjvucAEH4dEo1ejPafqiWmZylh9JT0OwX2n6",
  },
];

export const socialLink = [
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/company/cyfotok",
    icon: linkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/cyfotok/",
    icon: instagram,
  },
  {
    name: "X",
    url: "https://www.linkedin.com/company/cyfotok",
    icon: twitter,
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/@CYFOTOK",
    icon: youtube,
  },
];

export const FooterCourses = [
  {
    title: "Cybersecurity",
    link: "/courses/all",
  },
  {
    title: "Web Development",
    link: "/courses/all",
  },
  {
    title: "Artificial Intelligence",
    link: "/courses/all",
  },
  {
    title: "Digital Marketing",
    link: "/courses/all",
  },
  {
    title: "UI/UX Design",
    link: "/courses/all",
  },
];

export const FooterCompany = [
  {
    title: "Cyfotok Academy",
    link: "/",
  },
  {
    title: "Cyfotok Infosec",
    link: "https://cyfotok.com/",
  },
  {
    title: "Cyfotok Blog",
    link: "/#",
  },
  {
    title: "Cyfotok Community",
    link: "/#",
  },
];

export const FooterResources = [
  {
    title: "Blog",
    link: "/blog/all",
  },
  {
    title: "Events",
    link: "/#",
  },
  {
    title: "Hackathons",
    link: "/#",
  },
  {
    title: "Privacy Policy",
    link: "https://merchant.razorpay.com/policy/NPftgKrZlf15oA/terms",
  },
  {
    title: "Terms and Conditions",
    link: "https://merchant.razorpay.com/policy/NPftgKrZlf15oA/terms",
  },
];

export const FooterSupport = [
  {
    title: "Contact Us",
    link: "/contact",
  },
  {
    title: "FAQ",
    link: "/contact",
  },
  {
    title: "Support",
    link: "/contact",
  },
];

export { info1, hackathon, teamWork, contactBG, girl, whatsapp, SkillBG };
