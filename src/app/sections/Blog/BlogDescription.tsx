
type BlogDescriptionProps = {
  heading?: string;
  subheading?: string;
  text?: string;
  code?: string;
};
const BlogDescription = ({
  heading,
  subheading,
  text,
  code,
}: BlogDescriptionProps) => {
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold max-md:text-2xl">{heading}</h1>
        <p className="text-2xl my-3 max-md:text-lg">{subheading}</p>
        <p className="text-xl max-sm:text-lg mb-3">{text}</p>
        {code && (
          <pre className="bg-neutral-900 text-gray-200 p-3 overflow-x-auto overflow-scroll scroll-">
            <code className="text-sm ">
              {code}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default BlogDescription;
