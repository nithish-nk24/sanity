import Marquee from "./marquee";
import Image from "next/image";
import { brands } from "../../public/assets/assets";

export function MarqueeDemo() {
  return (
    <div className="relative flex  w-full flex-col items-center justify-center overflow-hidden rounded-lg ">
      <Marquee pauseOnHover className="[--duration:20s]">
        {brands.map((review,index) => (
          <Image src={review} alt="" key={index} width={200} height={200} className="rounded-lg max-md:w-[100px] max-lg:w-[150px] " />
        ))}
      </Marquee>
    </div>
  );
}
