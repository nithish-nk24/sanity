import { FooterCompany, FooterCourses, FooterResources, FooterSupport } from "../../public/assets/assets";
import ListItems from "./list-Items";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="p-5">
      <div className="flex justify-between items-center">
        <Logo />
        <p className="text-black/80">© 2025 Cyfotok Academy</p>
      </div>
      <hr className="my-3" />
      <div className="my-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        <div>
          <h2 className="text-xl font-semibold">Cyfotok Courses</h2>
          <hr className="my-3" />
          {FooterCourses.map((course, index) => (
            <ListItems title={course.title} url={course.link} key={index} />
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Cyfotok Company</h2>
          <hr className="my-3" />
          {FooterCompany.map((company, index) => (
            <ListItems title={company.title} url={company.link} key={index} />
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Resources</h2>
          <hr className="my-3" />
          {FooterResources.map((resource, index) => (
            <ListItems title={resource.title} url={resource.link} key={index} />
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <hr className="my-3" />
          {FooterSupport.map((support, index) => (
            <ListItems title={support.title} url={support.link} key={index} />
          ))}
        </div>
      </div>
      <p className="text-black/80 text-center font-semibold">
        Cyfotok Academy,© All Rights Reserved 2025
      </p>
      <hr className="my-3" />
    </footer>
  );
};

export default Footer;
