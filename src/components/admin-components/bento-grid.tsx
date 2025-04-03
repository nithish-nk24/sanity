'use client';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  id,
  className,
  title,
  description,
  header,
  icon,
  image,
  author,
  authorImg,
  onDelete
}: {
  id:string
  className?: string;
  title?: string | React.ReactNode;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  image: string;
  author?: string | React.ReactNode;
  authorImg: string;
  onDelete:(id:string)=>void
}) => {

  return (
    <div
      className={cn(
        "row-span-1 rounded-lg group hover:shadow-lg transition duration-300 shadow-md bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6 flex flex-col space-y-4 min-h-[310px]",
        className
      )}
    >
      {header && <div className="mb-4">{header}</div>}
      <div className=" rounded-md ">
        <Image
          src={image}
          alt={title?.toString() || "Image"}
          width={300}
          height={300}
          className="w-full  object-fill transition-transform duration-300 group-hover:scale-105 h-[150px] "
        />
      </div>
      <div className="flex items-center space-x-2">
        {icon && <span className="text-primary">{icon}</span>}
        <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          {title}
        </div>
      </div>
      {/* <p className="text-sm text-gray-600 dark:text-gray-300">
        {description.split(" ").slice(0, 4).join(" ")}...
      </p> */}
      <div className="flex items-center mt-4">
        <Image
          src={authorImg}
          alt={author?.toString() || "Author"}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-400">
          {author}
        </div>
      </div>

      <Button className=" my-3 bg-red-600" onClick={()=>onDelete(id)} >Delete</Button>

    </div>
  );
};

