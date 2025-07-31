import {
  User,
  Download,
  Check,
  Filter,
  Book,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import man from "@/assets/man.svg" assert { type: "image/svg" };
import man1 from "@/assets/man1.svg" assert { type: "image/svg" };
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PWAInstallButton from "../ui/PWAInstallButton";


function Info() {
  return (
    <section
      id="features"
      className="flex scroll-mt-24 flex-col items-center justify-between px-6 py-12 md:scroll-mt-32 lg:flex-row"
    >
      <div className="w-full text-center lg:w-[50%] lg:text-left">
        <div className="mb-8 hidden font-vipnabd text-3xl font-extrabold text-black dark:text-white lg:block lg:text-5xl">
          <span>Prepare to excel in </span>
          <span>your CATs and FATs </span>
          <span>with CodeChef-</span>
          <span>VIT’s dedicated </span>
          <span>repository of past </span>
          <span>exam papers</span>
        </div>
        <div className="w-full">
          <div className="w-full">
            <div className="origin-top-left">
              <div className="grid grid-cols-3 gap-2 overflow-hidden font-play text-xs text-black dark:text-white sm:text-sm lg:gap-4 lg:text-lg xl:text-base">
                <FeatureCard
                  icon={<User size={24} />}
                  text="No Sign-up required"
                />
                <FeatureCard
                  isHighlight
                  highlightText="1200+"
                  subText="Past Year Papers"
                />
                <FeatureCard
                  icon={<Download size={24} />}
                  text="Flexible Downloads"
                />
                <FeatureCard
                  icon={<Check size={24} />}
                  text="Answer Key Available"
                />
                <FeatureCard
                  icon={<Filter size={24} />}
                  text="Filtered Search"
                />
              </div>
            </div>
          </div>
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
      </section>

      {/* Create Request Section */}
      <section className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h2 className="font-vipnabd text-2xl font-semibold text-black dark:text-white md:text-3xl">
          Can’t Find a Specific Paper?
        </h2>
        <Link href="/request">
          <Button
            variant="outline"
            className="group border-[1.5px] border-[#4A55FF] bg-transparent px-6 py-3 text-sm font-medium text-[#4A55FF] transition-all duration-200 hover:bg-[#4A55FF] hover:text-white dark:border-[#9EA8FF] dark:text-[#9EA8FF] dark:hover:bg-[#9EA8FF] dark:hover:text-black"
          >
            Create Request
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        </Link>
      </section>
      <div className="flex justify-center py-4 z-50">
  <PWAInstallButton />
</div>
    </>
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
      <div className="row-span-2 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-[#7480FF8A] bg-[#EAEEFF] p-4 text-center dark:border-[#453D60] dark:bg-[#130E20]">
        <Book className="md:hidden" />
        <span className="text-xl font-bold text-black dark:text-white sm:text-3xl xl:text-5xl">
          {highlightText}
        </span>
        <span className="break-words text-[10px] leading-tight text-black dark:text-white sm:text-sm">
          {subText}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border-2 border-[#7480FF8A] bg-[#EAEEFF] p-2 text-left dark:border-[#453D60] dark:bg-[#130E20] sm:p-3">
      <div className="shrink-0 pt-[1px]">{icon}</div>
      <span className="min-w-0 flex-1 break-words text-[10px] leading-snug text-black dark:text-white sm:text-xs sm:leading-tight">
        {text}
      </span>
    </div>
  );
};
