"use client";
import { resources, resourcesCategory } from "@/lib/types";
import { Search } from "lucide-react";
import  { useEffect, useState } from "react";
import ResourceCard from "../../components/resource-card";

type ResourcesListProps = {
  resources: resources;
  resourcesCategory: resourcesCategory;
};

const ResourcesList = ({
  resources,
  resourcesCategory,
}: ResourcesListProps) => {
  const [filter, setFilter] = useState("All Categories"); // State to store the selected filter
  const [input, setInput] = useState(""); // State to store the input value
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setFilter(value || "All Categories"); // If input is empty, reset filter to "All Categories"
  };

  useEffect(() => {}, [filter]);

  return (
    <div className="px-5">
      <div className="flex gap-3 items-center justify-center px-4 py-2 border bg-slate-300 rounded-md max-w-[500px] mx-auto hover:shadow-lg transition duration -mt-14 max-sm:-mt-10 max-sm:mx-3 mb-10">
        <Search width={20} height={20} />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-[50px] max-sm:h-[30px] px-2 py-2 rounded-md outline-none border-none bg-transparent text-black placeholder:text-black/50 font-semibold text-xl max-sm:text-lg"
          onChange={handleFilter}
        />
      </div>
      <ul className="flex justify-center items-center gap-4  my-5 flex-wrap">
        {resourcesCategory.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer px-4 py-2 rounded-lg text-xs xl:text-base max-sm:px-2 ${
              filter == item.title
                ? "bg-black text-white border border-white font-semibold"
                : "text-black border border-black"
            }`}
            onClick={() => setFilter(item.title)}
          >
            {item.title}
          </li>
        ))}
      </ul>
      {filter == "All Categories" ? (
        <h2 className="text-2xl font-bold bg-gradient-to-tr from-pink-500 to-rose-500 text-transparent bg-clip-text">
          {filter}
        </h2>
      ) : (
        <h2 className="text-2xl font-bold bg-gradient-to-tr from-pink-500 to-rose-500 text-transparent bg-clip-text">{`${filter} Resources`}</h2>
      )}

      <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-md:px-3">
        {resources
          .filter(
            (item) => item.category == filter || filter == "All Categories"
          )
          .map((item, index) => (
            <ResourceCard
              key={index}
              title={item.title}
              imgUrl={item.imgSrc}
              download={item.download}
              pdf={item.pdf}
            />
          ))}
      </div>
    </div>
  );
};

export default ResourcesList;
