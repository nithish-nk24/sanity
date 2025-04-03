import Image from "next/image";

import ShineBorder from "@/components/ui/shine-border";

type FacilitiesCardProps = {
    imgUrl: string;
    title: string;
    description: string
}
const FacilitiesCard = ({imgUrl, title, description}: FacilitiesCardProps) => {
  return (
    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="bg-white/60">
      <div className=" px-5 py-3 flex flex-col gap-y-3 h-[280px] hover:scale-100 scale-95 duration transition max-md:py-0">
        <Image
          alt={title}
          src={imgUrl}
          width={200}
          height={200}
          className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-3xl text-white "
        />
        <h2 className="font-semibold text-3xl max-md:text-2xl">{title}</h2>
        <p className="text-black/80 text-base xl:text-lg">{description.slice(0, 200)}</p>
      </div>
    </ShineBorder>
  );
};

export default FacilitiesCard;
