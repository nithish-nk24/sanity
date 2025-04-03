import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";

type LearnMenuProps = {
  title: string;
  description?: string | null;
  changeImage: (item: any) => void;
  item: any;
};
const LearnMenu = ({
  title,
  description,
  changeImage,
  item,
}: LearnMenuProps) => {
  const handleClick = () => {
    if (changeImage) {
      changeImage(item.img);
    }
  };
  return (
    <div className="border-b pb-5">
      <p
        className="flex items-center  font-medium cursor-pointer text-3xl "
        onClick={handleClick}
      >
        <span className="mr-2 text-7xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
          ·
        </span>
        {title}
      </p>
      <p className="text-black/80 text-base ml-2 -mt-2 mb-5 -tracking-wide">
        {description}
      </p>
      {description && (
        <Link href={'/courses/all'}>
          <RainbowButton className="px-4 py-2 rounded-lg hover:scale-105  duration transition ml-2">
            Get Started
          </RainbowButton>
        </Link>
      )}
    </div>
  );
};

export default LearnMenu;
