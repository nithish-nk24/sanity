import ShineBorder from "@/components/ui/shine-border";
import { CalendarDays, Download, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

// start gif
type CourseCardProps = {
  id: string;
  imgUrl: string;
  title: string;
  duration: string | number;
  classes: number | string;
  selling?: string;
  metaTitle?: string;
  discountedPrice: number;
  originalPrice: number;
};

const CourseCard = ({
  imgUrl,
  title,
  duration,
  classes,
  id,
  selling,
  metaTitle,
  discountedPrice,
  originalPrice,
}: CourseCardProps) => {
  return (
    <Link href={`/course/${id}`}>
      <ShineBorder
        className="p-0 shadow-sm"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        borderWidth={3}
      >
        <div className="flex flex-col h-[380px] w-[300px] rounded-lg scale-90 relative hover:bg-white/50  duration transition cursor-pointer">
          <Image
            src={imgUrl}
            alt={""}
            width={200}
            height={200}
            className="w-full object-cover border border-pink-700/60 rounded-lg "
          />
          <div>
            <span
              className={`absolute top-3 right-0 px-1 py-1   to-black text-white text-xs font-semibold ${selling === "Popular" && "bg-gradient-to-l from-pink-500 to-black inline-flex gap-x-1 rounded-l-md"} ${selling === "Trending" && "bg-gradient-to-l from-blue-950 to-black inline-flex items-center gap-x-1 rounded-l-md"} ${selling === "Featured" && "bg-gradient-to-l from-yellow-500 inline-flex items-center gap-x-1 rounded-l-md"}`}
            >
              {selling === "Popular" && (
                <Image
                  src={
                    "https://hubble.cdn.chittiapp.com/cdn_uploads/5f2f7410-bc6c-11ef-9467-dbf64511c27d_fire.gif"
                  }
                  width={10}
                  height={10}
                  className="w-4"
                  alt="fire"
                />
              )}
              {selling === "Trending" && (
                <Image
                  src={
                    "https://upload.wikimedia.org/wikipedia/commons/f/f0/Hit_Lightning_Animation.gif"
                  }
                  width={10}
                  height={10}
                  className="w-5 h-4 rotate-180"
                  alt="fire"
                />
              )}
              {selling}
            </span>
          </div>
          <div className="p-3 flex flex-col gap-y-1">
            <h2 className="text-base font-semibold h-[80px] text-balance ">
              {title.slice(0, 70)}
            </h2>
            <div className="flex flex-col h-16 justify-between">
              <p className="text-xs">{metaTitle}</p>
              <ul className="flex items-center gap-2 justify-between">
                <li className="flex items-center  text-black rounded shadow-md bg-slate-200 text-xs font-semibold  px-1 py-1">
                  <CalendarDays className="w-5 h-5 " />
                  <span className="ml-1 -mb-1 text-sm">{duration}</span>
                </li>
                {/* <li className="flex items-center  text-white trollrounded shadow-md bg-orange-500 text-xs font-thin  px-1 py-1">
                  <School className="w-5 h-5 opacity-70" />
                  <span className="ml-1 -mb-1 text-sm">{`${classes} Classes`}</span>
                </li> */}
                <li className="text-xl text-green-600 font-bold">
                  <p className="text-black">
                    ₹
                    <span className="text-green-600">
                      {` ${discountedPrice}/-`}{" "}
                    </span>
                    <span className="ml-1 text-xs line-through text-black">
                      {originalPrice}/-
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-2 border-t gap-x-3 flex items-center justify-between border-pink-500/50 rounded">
            <Link href={`/course/${id}`} className="w-1/2">
              <Button className="w-full">View Details</Button>
            </Link>
            <Link href={`/contact`} className="w-1/2">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center">
                <span>
                  <Download />
                </span>
                Brochure
              </Button>
            </Link>
          </div>
        </div>
      </ShineBorder>
    </Link>
  );
};

export default CourseCard;
