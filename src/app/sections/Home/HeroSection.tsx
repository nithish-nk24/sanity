import { RainbowButton } from "@/components/ui/rainbow-button";
import { assets } from "../../../../public/assets/assets";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="flex justify-center items-center mt-28 gap-x-8 max-md:flex-col mx-3 ">
      <div className="flex flex-col gap-5 max-w-2xl max-md:w-full">
        <p className="max-sm:text-sm max-md:text-center max-md:text-lg max-lg:text-base text-2xl">
          INTRODUCING THE NEW ERA OF TECHNOLOGY
        </p>
        <h1 className="text-6xl font-semibold uppercase max-md:text-center max-sm:text-5xl max-lg:text-4xl">
          Step Into The{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
            Future Of Technology
          </span>
        </h1>
        <p className="text-2xl font-medium text-black/80 max-md:text-center max-md:text-lg max-sm:text-sm max-lg:text-base">
          We specializes in delivering comprehensive Technology Trainings
          tailored for individuals, universities, and organizations.
        </p>
        <div className="flex gap-5 max-md:justify-center">
          <Link href={"/courses/all"}>
            <RainbowButton className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-lg hover:scale-105  duration transition hover:bg-white hover:bg-transparent ">
              Explore More
            </RainbowButton>
          </Link>
          <Link
            href={`https://calendly.com/meet-cyfotok/demo-session`}
            target="_blank"
          >
            <RainbowButton className="px-4 py-2 rounded-lg hover:scale-105  duration transition">
              Get Started
            </RainbowButton>
          </Link>
        </div>
      </div>
      <div className="w-full max-w-2xl max-md:w-full  ">
        <Image
          src={assets.heroImg}
          alt="hero"
          width={500}
          height={500}
          className="w-full h-full rounded-3xl object-cover mt-5" 
        />
      </div>
    </section>
  );
};

export default HeroSection;
