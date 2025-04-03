import { Button } from "@/components/ui/button";
import Link from "next/link";


const TeamWorkBG = () => {
  return (
    <section className="h-[500px] flex relative justify-center rounded-md items-center border w-full bg-skill bg-no-repeat bg-cover ">
      <div className="flex flex-col max-w-[800px] justify-center items-center z-10 px-3">
        <h2 className="text-5xl font-bold text-white">
          Cyfotok Cybersecurity Training
        </h2>
        <p className="text-white/80 my-3">
          Whether you&apos;re looking for a Cybersecurity Course in Coimbatore
          or Online Cybersecurity Training courses offer flexible learning
          opportunities, We are here to provide hands-on experience and expert
          guidance.
        </p>
        <Link href={`https://calendly.com/meet-cyfotok/demo-session`} target="_blank">
          <Button className="hover:bg-gradient-to-t from-pink-500 to-rose-500 text-lg transition-all duration-300">
            Book Free Demo
          </Button>
        </Link>
      </div>
      <div className="absolute rounded-md top-0 left-0 w-full h-full bg-black/70" />
    </section>
  );
};

export default TeamWorkBG;
