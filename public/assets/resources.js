import article1 from "./article/1.png"
import article2 from "./article/2.png"
import article3 from "./article/3.png"
import article4 from "./article/4.png"
import article5 from "./article/5.png"

export const resourcesCategory = [
  {
    id:1,
    title:'All Categories',
  },
  {
    id:2,
    title:"CyberSecurity",
  },
  {
    id:3,
    title:"Web Development",
  },
  {
    id:4,
    title:"Artificial Intelligence",
  },
  {
    id:5,
    title:'Data Science',
  }
  
]

export const resources = [
  {
    id: 1,
    imgSrc: article1.src,
    title: "From Style Sheets to Design Powerhouses",
    date: "20 January 2024",
    pdf:"https://utfs.io/f/CVETMkBmijEYo5fOCpCxykvDOJENGremSx4bW10KzfpUinRd",
    location: "Coimbatore, TamilNadu",
    desc: "Revolutionizing Web Development: A Deep Dive into Serverless Architecture",
    category: "Web Development",
    download:1.5,
    searchKeyword:"web development"
    // paid: false,
    // price: 0,
    // preDiscount: 0,
  },
  {
    id: 2,
    imgSrc: article2.src,
    title: "Navigating the Future",
    date: "20 January 2024",
    pdf:"https://utfs.io/f/CVETMkBmijEY4K7UK8D2yWjp1TSiA5mOebZgME6XaoPRf3Qn",
    location: "Coimbatore, TamilNadu",
    desc: "Comprehensive Guide to Web Security Best Practices: Safeguarding Your Online Presence",
    category: "CyberSecurity",
    download:0.6,
    searchKeyword:"cybersecurity"
    // paid: false,
    // price: 0,
    // preDiscount: 0,
  },
  {
    id:3,
    imgSrc: article3.src,
    title: "Comprehensive Guide to Web Security Best Practices",
    date: "20 January 2024",
    location: "Coimbatore, TamilNadu",
    pdf:"https://utfs.io/f/CVETMkBmijEYrvpu9f5zrtvK5V3daF4hRiO26lHPL8BQSNk9",
    desc: "Navigating the Future: Creation the Top Transformative Web Development Trends of 2024",
    category: "CyberSecurity",
    download:1.2,
    searchKeyword:"cybersecurity"
    // paid: false,
    // price: 0,
    // preDiscount: 0,
  }, 
  {
    id: 4,
    imgSrc: article4.src,
    title: "Optimizing Mobile Web Development",
    date: "20 January 2024",
    location: "Coimbatore, TamilNadu",
    desc: "Style Sheets Unleashed: Navigating the Dynamic Evolution of CSS Design",
    pdf:"https://utfs.io/f/CVETMkBmijEY6BLrkRh8bJrlGkzNcBi36dEMvwZ2q70PUCtL",
    category: "CyberSecurity",
    download:0.8,
    searchKeyword:"cybersecurity"
    // paid: false,
    // price: 0,
    // preDiscount: 0,
  }
  , 
  {
    id: 4,
    imgSrc: article5.src,
    title: "Revolutionizing Web Development",
    date: "20 January 2024",
    location: "Coimbatore, TamilNadu",
    pdf:"https://utfs.io/f/CVETMkBmijEYvkXABhPlCH1wUMIsLtOfrZhi4V8uWcXz2AdR",
    desc: "Optimizing Mobile Web Development: A Complete Guide to Responsive Design, Performance, and User Experience",
    category: "Data Science",
    download:2.0,
    searchKeyword:"data science"
    // paid: false,
    // price: 0,
    // preDiscount: 0,
  }, 
];