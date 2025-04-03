import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LinkButtonProps = {
  title: string;
  img: string;
  link: string;
};
const LinkButton = ({ title, img, link }: LinkButtonProps) => {
  return (
    <Link href={`/skills/${link}`}>
      <div className="flex justify-between items-center bg-black/90 rounded-lg px-5 py-3 scale-100 hover:scale-105 duration transition hover:bg-gradient-to-t from-pink-500 to-rose-500 hover:font-semibold">
        <div className="flex gap-3 items-center">
          <Image
            src={img}
            alt={title}
            width={50}
            height={50}
            className="w-6 h-6 "
          />
          <p className="text-white ">{title}</p>
        </div>
        <MoveRight className="w-6 h-6 text-white" />
      </div>
    </Link>
  );
};

export default LinkButton;
