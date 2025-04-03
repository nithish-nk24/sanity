import SkeletonCard from "@/components/skelton-card"


const Loading = () => {
    return (
      <div className="flex flex-wrap max-w-[1100px] mx-auto px-[20px] py-24 gap-20 justify-center
      +">
        {
          Array.from({length:9}).map((item,i)=>(
            <SkeletonCard key={i} />
          ))
        }
      </div>
    )
  }
  
  export default Loading