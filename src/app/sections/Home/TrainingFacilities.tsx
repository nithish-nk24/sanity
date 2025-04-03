import { facilitiesData } from "../../../../public/assets/assets";
import FacilitiesCard from "../../../components/facilitiesCard";

const TrainingFacilities = () => {
  return (
    <section className="p-5">
      <p className="my-10 text-4xl tracking-wide font-medium text-black/80 max-md:px-3">
        Why{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 ">
          Cyfotok Academy
        </span>{" "}
        Training?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-md:px-3">
        {
            facilitiesData.map((item,index)=>(
                <FacilitiesCard key={index} {...item}/>

            ))
        }
      </div>
    </section>
  );
};

export default TrainingFacilities;
