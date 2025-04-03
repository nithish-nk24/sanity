import Courses from "@/components/courses";
import { coursesData } from "../../../../public/assets/courses";


const CourseList = () => {


  // console.log(course);

  return (
    <section>
      <div className="flex items-center justify-center gap-5">
        <Courses course={coursesData} />
      </div>
    </section>
  );
};

export default CourseList;
