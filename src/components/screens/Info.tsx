import Image from "next/image";
import man from "@/assets/man.svg" assert { type: "image/svg" };
import man1 from "@/assets/man1.svg" assert { type: "image/svg" };
import sign from "@/assets/sign.svg" assert { type: "image/svg" };
import signd from "@/assets/signd.svg" assert { type: "image/svg" };
import download from "@/assets/download.svg" assert { type: "image/svg" };
import downloadd from "@/assets/downloadd.svg" assert { type: "image/svg" };
import tick from "@/assets/tick.svg" assert { type: "image/svg" };
import tickd from "@/assets/tickd.svg" assert { type: "image/svg" };
import filter from "@/assets/filter.svg" assert { type: "image/svg" };
import filterd from "@/assets/filterd.svg" assert { type: "image/svg" };

function Info() {
  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-between px-6 py-12 lg:flex-row scroll-mt-24 md:scroll-mt-32"
    >
      <div className="w-full text-center lg:w-[50%] lg:text-left">
        <div className="vignabd mb-8 block text-3xl font-extrabold text-[#120020] dark:text-white lg:text-5xl">
          <span>Prepare to excel in </span>
          <span>your CATs and FATs </span>
          <span>with CodeChef-</span>
          <span>VIT’s dedicated </span>
          <span>repository of past</span>
          <span>exam papers</span>
        </div>
        <div className="play grid gap-4 text-[12px] xl:text-[16px] text-[#120020] dark:text-white md:grid-cols-3">
          <FeatureCard
            lightIcon={signd as HTMLImageElement}
            darkIcon={sign as HTMLImageElement}
            text="No Sign-up required"
          />
          <FeatureCard
            isHighlight
            highlightText="900+"
            subText="Past Year Papers"
          />
          <FeatureCard
            lightIcon={downloadd as HTMLImageElement}
            darkIcon={download as HTMLImageElement}
            text="Flexible Downloads"
          />
          <FeatureCard
            lightIcon={tickd as HTMLImageElement}
            darkIcon={tick as HTMLImageElement}
            text="Answer Key Available"
          />
          <FeatureCard
            lightIcon={filterd as HTMLImageElement}
            darkIcon={filter as HTMLImageElement}
            text="Filtered Search"
          />
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
  lightIcon?: HTMLImageElement;
  darkIcon?: HTMLImageElement;
  text?: string;
  isHighlight?: boolean;
  highlightText?: string;
  subText?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  lightIcon,
  darkIcon,
  text,
  isHighlight = false,
  highlightText,
  subText,
}) => {
  if (isHighlight) {
    return (
      <div className="row-span-2 flex flex-col justify-center rounded-lg border-2 border-[#7480FF8A] bg-[#EAEEFF] p-4 text-center dark:border-[#453D60] dark:bg-[#130E20]">
        <span className="p-3 text-2xl font-extrabold lg:text-4xl xl:text-5xl text-center">
          {highlightText}
        </span>
        <span>{subText}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-2 rounded-lg border-2 border-[#7480FF8A] bg-[#EAEEFF] p-4 text-center dark:border-[#453D60] dark:bg-[#130E20]">
      <Image
        src={lightIcon ?? ""}
        height={30}
        width={30}
        className="block dark:hidden"
        alt={text ?? ""}
      />
      <Image
        src={darkIcon ?? ""}
        height={30}
        width={30}
        className="hidden dark:block"
        alt={text ?? ""}
      />
      {text}
    </div>
  );
};
