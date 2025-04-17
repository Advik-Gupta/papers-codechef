import { User, Download, Check, Filter, Book } from "lucide-react";
import Image from "next/image";
import man from "@/assets/man.svg" assert { type: "image/svg" };
import man1 from "@/assets/man1.svg" assert { type: "image/svg" };

function Info() {
  return (
    <section
      id="features"
      className="flex scroll-mt-24 flex-col items-center justify-between px-6 py-12 md:scroll-mt-32 lg:flex-row"
    >
      <div className="w-full text-center lg:w-[50%] lg:text-left">
        <div className="mb-8 block text-3xl font-extrabold text-black dark:text-white lg:text-5xl">
          <span>Prepare to excel in </span>
          <span>your CATs and FATs </span>
          <span>with CodeChef-</span>
          <span>VIT’s dedicated </span>
          <span>repository of past</span>
          <span>exam papers</span>
        </div>
        <div className="grid gap-4 text-[12px] text-black dark:text-white md:grid-cols-3 xl:text-[16px]">
          <FeatureCard icon={<User size={32} />} text="No Sign-up required" />
          <FeatureCard
            isHighlight
            highlightText="900+"
            subText="Past Year Papers"
          />
          <FeatureCard
            icon={<Download size={32} />}
            text="Flexible Downloads"
          />
          <FeatureCard icon={<Check size={32} />} text="Answer Key Available" />
          <FeatureCard icon={<Filter size={32} />} text="Filtered Search" />
        </div>
      </div>
      <div className="mb-10 hidden h-[450px] w-[450px] justify-center p-5 lg:flex lg:h-[600px] lg:w-[500px]">
        <Image
          src={man1 as string}
          height={600}
          width={500}
          alt="man-light"
          className="block dark:hidden"
        />
        <Image
          src={man as string}
          height={600}
          width={500}
          alt="man-dark"
          className="hidden dark:block"
        />
      </div>
    </section>
  );
}

export default Info;

interface FeatureCardProps {
  icon?: JSX.Element;
  text?: string;
  isHighlight?: boolean;
  highlightText?: string;
  subText?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  text,
  isHighlight = false,
  highlightText,
  subText,
}) => {
  if (isHighlight) {
    return (
      <div className="row-span-2 flex items-center gap-2 rounded-lg border-2 border-[#7480FF8A] bg-[#EAEEFF] p-4 text-center dark:border-[#453D60] dark:bg-[#130E20] md:flex-col md:justify-center">
        <Book className="md:hidden" />
        <span className="text-base text-black dark:text-white md:p-3 md:text-4xl md:font-extrabold xl:text-5xl">
          {highlightText}
        </span>
        <span className="text-base text-black dark:text-white">{subText}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-2 rounded-lg border-2 border-[#7480FF8A] bg-[#EAEEFF] p-4 text-center dark:border-[#453D60] dark:bg-[#130E20]">
      {icon}
      <span className="text-base text-black dark:text-white">{text}</span>
    </div>
  );
};
