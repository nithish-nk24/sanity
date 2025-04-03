import { RainbowButton } from "@/components/ui/rainbow-button";
import ShineBorder from "@/components/ui/shine-border";
import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


type ResourceCardProps = {
  imgUrl: string;
  title: string;
  download: number;
  pdf: string;
};

const ResourceCard = ({ imgUrl, title, download, pdf }: ResourceCardProps) => {
  return (
    <div className="max-w-sm h-auto px-3">
      <ShineBorder
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        borderWidth={2}
        className="p-0 m-0  w-full bg-transparent rounded-lg"
      >
        <Image
          src={imgUrl}
          alt={title}
          width={500}
          height={500}
          className="w-full  object-contain rounded-lg"
        />
      </ShineBorder>
      <p className="text-lg font-bold mt-2">{
        title.length > 35 ? title.slice(0, 35) + "..." : title}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="flex items-center gap-2 font-semibold">
          <Download className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text" />{" "}
          <span>{download} K</span>
        </p>
        <Link href={pdf} target="_blank">
          <RainbowButton className="px-4 py-2 rounded-lg hover:scale-105  duration transition">
            Download Now
          </RainbowButton>
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
