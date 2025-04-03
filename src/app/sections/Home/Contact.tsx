import Image from "next/image";
import { contactBG, socialLink } from "../../../../public/assets/assets";
import { RainbowButton } from "@/components/ui/rainbow-button";
import SocialIcons from "../../../components/social-Icons";

const Contact = () => {
  return (
    <section className="m-5">
      <div className="flex justify-center items-center max-lg:flex-col px-3 max-lg:text-center">
        <div className="w-1/2 max-lg:w-full ">
          <h2 className="text-6xl font-semibold max-xl:text-4xl max-sm:text-3xl">
            Start Your Career With{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
              Cyfotok Academy
            </span>
          </h2>
          <p className="mt-4 text-xl max-md:text-sm ">
            Join us today and take the first step towards a brighter future in
            cybersecurity.{" "}
          </p>
        </div>
        <div className="w-1/2 relative overflow-hidden max-lg:w-full h-[500px] max-lg:h-auto">
          <Image
            src={contactBG}
            alt="contact-bakcground"
            width={1080}
            height={1080}
            className="absolute top-0 left-0 max-w-2xl object-cover z-[-1] opacity-40 h-full max-lg:hidden"
          />
          <div className="p-3  h-96 flex justify-center max-lg:h-auto items-start flex-col">
            <div className="bg-black/90 text-white px-6 py-4 xl:max-w-xl max-lg:w-full w-full rounded-lg ">
              <h2 className="text-5xl font-semibold my-4 max-sm:text-3xl">
                Get In Touch
              </h2>
              <form className="flex  items-center gap-2">
                <input
                  type="email"
                  className="w-full p-2 my-2 rounded-lg outline-none text-black/90"
                  required
                  placeholder="Enter your email"
                />
                <RainbowButton className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-lg hover:scale-105  duration transition hover:bg-white hover:bg-transparent ">
                  Submit
                </RainbowButton>
              </form>
              <div className="my-4 flex gap-2 max-sm:justify-center">
                {socialLink.map((item, index) => (
                  <SocialIcons key={index} icon={item.icon} url={item.url} />
                ))}
              </div>
            </div>
          </div>
          <hr className="my-10 max-lg:hidden" />
        </div>
      </div>
    </section>
  );
};

export default Contact;
