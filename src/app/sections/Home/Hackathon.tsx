import { MoveRight } from "lucide-react";
import Image from "next/image";

import { hackathon } from "../../../../public/assets/assets";

const Hackathon = () => {
  return (
    <section className="my-20 bg-gradient-to-t from-pink-500 to-rose-500  rounded-lg relative flex justify-between items-center max-md:flex-col m-5">
      <div className="flex flex-col gap-y-3 p-5">
        <p className="text-sm px-3 py-1 font-bold uppercase bg-white rounded-full w-fit">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
            New Event
          </span>
        </p>
        <p className="text-white text-3xl font-semibold">
          Ethical Hacking & Web Development
        </p>
        <p className="flex items-center gap-2 text-lg text-white hover:gap-4 duration-300 transition ">
          South India Hackathon Conducting at Cyfotok Academy{" "}
          <span>
            <MoveRight />
          </span>
        </p>
      </div>
      <div className="-mt-5 max-md:-mb-10">
        <Image src={hackathon} alt="hackathon" width={1080} height={1080} className="max-w-xl rounded-lg max-sm:w-[300px]"/>
      </div>
    </section>
  );
};

export default Hackathon;
