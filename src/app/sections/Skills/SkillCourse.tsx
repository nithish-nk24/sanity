import CourseCard from "@/components/course-card";
import { CourseData } from "@/lib/types";

type SkillCourseProps = {
  data: CourseData[];
};

const SkillCourse = ({ data }: SkillCourseProps) => {
  return (
    <section className="my-10 mx-3">
      <h2 className="text-4xl font-semibold text-center">
        Expert Developed Courses
      </h2>
      <p className="my-3 text-center max-w-[800px] mx-auto text-xl">
        Explore our on-demand courses developed by seasoned certified
        cybersecurity practitioners, aligned to the certification exam’s key
        learning objectives.
      </p>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-10 max-md:my-5 justify-items-center">
        {/* filtering by category */}
        {data.map((item, index) => (
          <CourseCard
            key={index}
            id={item.id}
            imgUrl={item.imageSrc}
            title={item.title}
            duration={item.duration}
            classes={item.class}
            selling={item.state}
          />
        ))}
      </div>
    </section>
  );
};

export default SkillCourse;
