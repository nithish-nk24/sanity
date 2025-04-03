import { RainbowButton } from "@/components/ui/rainbow-button";
import { externalLinks } from "../../../../public/assets/assets";
import LinkButton from "../../../components/link-button";
import Link from "next/link";

const ExternalLinks = () => {
  return (
    <section className="my-20">
      <p className="text-center text-5xl max-w-4xl font-thin mx-auto max-lg:text-4xl max-md:text-3xl">
        Stand out from the crowd and{" "}
        <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
          advance your career
        </span>{" "}
        with Cyfotok Academy
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-10 mx-60 max-xl:mx-20 max-sm:mx-10">
        {externalLinks.map((item, index) => (
          <LinkButton key={index} {...item} />
        ))}
      </div>
      <div className="flex justify-center gap-x-2">
        <Link href={'/courses/all'}>
        <RainbowButton className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-6 rounded-lg hover:scale-105  duration transition hover:bg-white hover:bg-transparent ">
          Start Learning Now
        </RainbowButton>
        </Link>
        <Link href={'https://calendly.com/meet-cyfotok/demo-session'}>
        <RainbowButton className="px-4 py-6 rounded-lg hover:scale-105  duration transition">
            Train with us
          </RainbowButton>
        </Link>
      </div>
    </section>
  );
};

export default ExternalLinks;
