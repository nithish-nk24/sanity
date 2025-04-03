import { RainbowButton } from "@/components/ui/rainbow-button";
import { Skill } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type SkillProps = {
  data: Skill;
};

const SkillHeroSection = ({ data }: SkillProps) => {
  return (
    <section className="px-3 mx-auto">
      <div className="flex justify-center items-center gap-x-6 max-lg:flex-col-reverse max-lg:gap-y-6">
        <div className="flex flex-col gap-y-4 w-1/2 items-start max-lg:w-full max-lg:items-center">
          <h2 className="text-5xl font-bold max-xl:text-4xl">
            {data[0].title}
          </h2>
          <p className="text-base">{data[0].des}</p>
          <Link
            href={`https://calendly.com/meet-cyfotok/demo-session`}
            target="_blank"
          >
            <RainbowButton className="px-4 py-2 rounded-lg scale-95 hover:scale-100  duration transition">
              Enroll Now
            </RainbowButton>
          </Link>
        </div>
        <div className="w-1/2  max-lg:w-full">
          <Image
            alt="skill"
            src={data[0].img}
            width={500}
            height={500}
            className="w-full rounded-lg object-contain"
          />
        </div>
      </div>
      <hr className="my-10" />
      <div className="my-10  flex justify-center items-center gap-x-6 max-lg:flex-col max-lg:gap-y-6">
        <div className="w-1/2 max-lg:w-full">
          <Image
            alt="skill"
            src={data[0].secImg}
            width={500}
            height={500}
            className="w-full rounded-lg object-contain"
          />
        </div>
        <div className="flex flex-col gap-y-4 w-1/2 items-start max-lg:w-full max-lg:items-center">
          <h2 className="text-5xl font-bold max-xl:text-4xl">
            {`${data[0].secTitle}?`}
          </h2>
          <p className="text-base">{data[0].secDes}</p>
          <Link
            href={`https://calendly.com/meet-cyfotok/demo-session`}
            target="_blank"
          >
            <RainbowButton className="px-4 py-2 rounded-lg scale-95 hover:scale-100  duration transition">
              Enroll Now
            </RainbowButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SkillHeroSection;
