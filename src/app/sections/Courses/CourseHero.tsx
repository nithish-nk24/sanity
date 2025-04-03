import Image from "next/image";
import { girl } from "../../../../public/assets/assets";


const CourseHero = () => {
  return (
    <section>
      <div className="mx-5 flex justify-center items-center max-md:flex-col">
        <h2 className="text-4xl">
          Choose your right Courses & Sculpt <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
            your talents with us!
          </span>
        </h2>
        <Image src={girl} alt="girl" width={1080} height={1080} className="max-w-[300px]"/>
      </div>
      <hr />
    </section>
  );
};

export default CourseHero;
