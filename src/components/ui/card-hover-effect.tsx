"use client";
import { Blog } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./button";

export const HoverEffect = ({
  items,
  className,
}: {
  items: Blog;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={`/blog/${item.id}`}
          key={item?.authorLink}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="flex flex-col justify-between">
            <CardImage>{item.imageSrc}</CardImage>
            <CardDate>{item.date}</CardDate>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.desc}</CardDescription>
            <CardButton href={item.authorLink}>Read More</CardButton>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-10",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children.length > 50 ? `${children.slice(0, 60)}...` : children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: string;
}) => {
  return (
    <p
      className={cn(
        "mt-3 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children.length > 100 ? `${children.slice(0, 97)}...` : children}
    </p>
  );
};

export const CardImage = ({
  children,
}: {
  className?: string;
  children: string;
}) => {
  return (
    <div>
      <Image
        src={children}
        alt={""}
        className="rounded-lg w-full h-full object-cover"
        width={500}
        height={500}
      />
    </div>
  );
};

export const CardDate = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <p className=" text-sm flex flex-col items-start max-w-[150px] mt-2  bg-white/90 rounded-lg p-2">
        {children}
      </p>
    </div>
  );
};

export const CardButton = ({
  className,
  children,
  href,
}: {
  className?: string;
  children: string;
  href: string;
}) => {
  return (
    <Link href={href} className={className}>
      <Button className="mt-4 hover:bg-white duration transition hover:text-black">
        {children}
      </Button>
    </Link>
  );
};
