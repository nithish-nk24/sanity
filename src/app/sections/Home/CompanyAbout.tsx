import Image from "next/image";

import { teamWork } from "../../../../public/assets/assets";

const CompanyAbout = () => {
  return (
    <section className="flex items-center justify-between bg-black/80 text-white rounded-xl max-md:flex-col m-5">
      <div className="flex flex-col gap-y-6 w-2/4 p-5 max-md:w-full max-md:text-center">
        <h1 className="text-6xl font-thin max-lg:text-4xl max-md:text-5xl"><span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 font-semibold">Cyfotok</span> for Teams</h1>
        <p className="text-balance font-thin text-lg max-xl:text-base max-md:text-sm">
          Upskill your team with Cyfotok Academy’s suite of cybersecurity
          training, learning activities, and management tools, including
          hands-on Virtual Labs, role-aligned Career Paths, and personalized
          remediation. Request a demo and learn how Cyfotok Academy tailors our
          deep library of training to your team’s unique needs.
        </p>
      </div>
      <div className="w-2/4 h-full max-md:w-full max-md:px-3 max-md:-mb-10">
        <Image src={teamWork} alt="teamWork" width={1080} height={1080} className="object-cover rounded-2xl h-full w-full"/>
      </div>
    </section>
  );
};

export default CompanyAbout;
