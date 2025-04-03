"use client";

import { useState } from "react";
import { catagories } from "../../public/assets/courses";
import CourseCard from "./course-card";
import { CourseData } from "@/lib/types";

type CoursesProps = {
  course: CourseData[];
};

const Courses = ({ course }: CoursesProps) => {
  const [menu, setMenu] = useState("All Categories");
  return (
    <section className="my-10">
      <ul className="flex justify-center items-center gap-4 max-md:flex-col max-md:hidden">
        {catagories.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs xl:text-base ${
              menu == item
                ? "bg-black text-white border border-white font-semibold"
                : "text-black border border-black"
            }`}
            onClick={() => setMenu(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* mobile screen menu */}
      <div className="flex justify-center items-center md:hidden  ">
        <select
          onChange={(e) => setMenu(e.target.value)}
          className="px-4 py-2 rounded-lg text-xl bg-black/90 text-white"
        >
          {catagories.map((item, index) => (
            <option key={index} value={item} className="text-sm">
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-10 max-md:my-5 max-md:">
        {/* filtering by category */}
        {course
          ?.filter(
            (item) => item.category === menu || menu === "All Categories"
          )
          .map((item, index) => (
            <CourseCard
              key={index}
              id={item.id}
              imgUrl={item.imageSrc}
              title={item.title}
              duration={item.duration}
              classes={item.class}
              selling={item.state}
              metaTitle={item.metaTitle}
              discountedPrice={item.discountedPrice}
              originalPrice={item.originalPrice}
            />
          ))}
      </div>
    </section>
  );
};

export default Courses;
