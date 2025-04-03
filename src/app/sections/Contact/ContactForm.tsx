'use client'
import { toast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactForm = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      variant: "default",
      title: "Thanks for reaching out",
    });
  };
  return (
    <div className="grid grid-cols-3 gap-x-5 max-lg:grid-cols-1 max-lg:gap-y-3 ">
      <div className="col-span-1 flex flex-col gap-y-6 items-start max-md:gap-y-3">
        <h2 className="text-4xl font-bold">Keep in touch with us</h2>
        <p className="text-lg">
          Stay ahead of the curve by joining our vibrant community on <br />
          <span className="font-bold bg-gradient-to-t from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Cyfotok Academy
          </span>
          ! Connect with us to receive timely updates on articles and the latest
          in tech trends.
        </p>

        <p className="flex items-center gap-2 max-md:text-sm justify-center font-semibold">
          <MapPin className="w-12 h-10 bg-black text-white p-2 rounded-full" />{" "}
          Block 1, Cellar Floor,Block 1, Rathinam Tech Zone Campus, Coimbatore,
          Tamil Nadu
        </p>

        <p className="flex items-center gap-2 justify-center font-semibold">
          <Phone className="w-10 h-10 bg-black text-white p-2 rounded-full" />{" "}
          +91 9176121201
        </p>

        <p className="flex items-center gap-2 justify-center font-semibold">
          <Mail className="w-10 h-10 bg-black text-white p-2 rounded-full" />{" "}
          info@cyfotok.com
        </p>
      </div>
      <div className="col-span-2 flex flex-col gap-y-6 border text-black rounded-lg p-5 border-black/80 shadow-xl">
        <h2 className="text-4xl font-bold">Send a Message</h2>
        <p className="text-lg ">
          Send us your comments! We value your feedback and look forward to
          hearing from you. Connect with us today!
        </p>
        <form onSubmit={handleSubmit}>
          <div className="w-full flex gap-x-5 max-md:flex-col">
            <div className="flex flex-col gap-y-2 w-1/2 max-md:w-full">
              <label htmlFor="name" className="text-lg font-semibold">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter Name"
                className="px-4 py-2  bg-transparent outline-none border border-black/40"
              />
            </div>
            <div className="flex flex-col gap-y-2 w-1/2 max-md:w-full">
              <label htmlFor="email" className="text-lg font-semibold">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="Enter Email"
                className="px-4 py-2  bg-transparent outline-none border border-black/40"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="message" className="text-lg font-semibold">
              Message
            </label>
            <textarea
              required
              placeholder="Enter Message"
              className="px-4 py-2 min-h-[100px]  bg-transparent outline-none border border-black/40"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-gradient-to-t from-pink-500 to-rose-500 hover:bg-gradient-to-t hover:from-pink-400 hover:to-rose-400 px-4 py-2 rounded-md mt-5">
              {" "}
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
