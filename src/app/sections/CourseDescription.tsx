import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShineBorder from "@/components/ui/shine-border";
import { BookOpen, LaptopMinimal } from "lucide-react";

type CourseDescriptionProps = {
  desc: (string | string[])[];
  require: string[];
  faq: { question: string; answer: string }[];
  lessonItems: {
    id: number;
    heading: string;
    title?: string;
    duration?: string;
    lessons: {
      id: number;
      title: string;
      duration?: string;
      questions?: number;
    }[];
  }[];
};
const CourseDescription = ({
  desc,
  require,
  faq,
  lessonItems,
}: CourseDescriptionProps) => {
  // console.log(desc);

  return (
    <section className="px-3">
      <p className="text-black/80 my-5 font-semibold text-xl max-md:text-lg">{desc[0]}</p>
      <div className="flex justify-center gap-x-6 items-start max-md:flex-col-reverse">
        <div className="w-1/2 max-md:w-full">
          <div className="bg-black/90 p-3 rounded-lg text-white">
            <h2 className="text-3xl font-semibold flex items-center gap-x-2">
              Requirement <LaptopMinimal className="-mb-1" />
            </h2>
            <p className="text-black/80 my-5 font-medium text-base text-white max-md:text-sm">
              {require}
            </p>
          </div>
          <div className="bg-white/30 p-3 rounded-lg  my-5">
            <Accordion type="single" collapsible className="w-full">
              {faq.map((faq, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="border-2 px-3 mb-3 rounded-lg border-black/50"
                >
                  <AccordionTrigger className="font-semibold text-base px-2">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div className="w-1/2 sticky top-28 max-md:relative max-md:top-0 max-md:w-full">
          <ShineBorder
            color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            className="w-full p-0 bg-transparent"
            borderWidth={2}
          >
            <ScrollArea className="w-full h-[300px] rounded-lg border-none  p-3  mb-5">
              <h2 className="text-4xl font-semibold flex items-center gap-x-2 ">
                Lessons <BookOpen className="-mb-1" />
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {lessonItems.map((lesson, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-semibold text-xl max-md:text-base">
                      <p>{`${index + 1}. ${lesson.heading}`}</p>
                    </AccordionTrigger>
                    {lesson.lessons.map((lesson, index) => (
                      <AccordionContent key={index} className="text-black/80 text-base">
                        {lesson.title}
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </ShineBorder>
        </div>
      </div>
    </section>
  );
};

export default CourseDescription;
