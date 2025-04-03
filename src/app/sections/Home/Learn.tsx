"use client";
import Image from "next/image";
import { useState } from "react";
import { info1, infoData } from "../../../../public/assets/assets";
import LearnMenu from "../../../components/learnMenu";
import { motion } from "framer-motion";
const Learn = () => {
  const [info, setInfo] = useState(info1);
  return (
    <section>
      <p className="text-center font-semibold text-7xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 max-lg:text-6xl max-md:text-5xl max-sm:text-4xl">
        Learn. Practice. Grow.
      </p>
      <div className="flex justify-center gap-x-8 my-10 items-center max-md:flex-col-reverse">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1,}}
          className="relative "
        >
          <Image
            src={info}
            alt=""
            width={1080}
            height={1080}
            className="max-w-[500px] h-full object-contain max-sm:w-[350px]"
          />
        </motion.div>
        <div className="w-1/4 max-md:w-full max-md:px-8">
          {infoData.map((item, index) => (
            <LearnMenu
              key={index}
              title={item.title}
              item={item}
              description={info === item.img ? item.description : null}
              changeImage={(item) => setInfo(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Learn;
