import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};
const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div 
      className={cn(
        "animate-pulse  h-4 w-[550px] rounded-md bg-black/5 ",
        className
      )}
    />
  );
};

export default Skeleton;