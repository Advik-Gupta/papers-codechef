import Image from "next/image";
import man from "../assets/man.svg" assert { type: "image/svg" };
import man1 from "../assets/man1.svg" assert { type: "image/svg" };
import sign from "../assets/sign.svg" assert { type: "image/svg" };
import signd from "../assets/signd.svg" assert { type: "image/svg" };
import download from "../assets/download.svg" assert { type: "image/svg" };
import downloadd from "../assets/downloadd.svg" assert { type: "image/svg" };
import tick from "../assets/tick.svg" assert { type: "image/svg" };
import tickd from "../assets/tickd.svg" assert { type: "image/svg" };
import filter from "../assets/filter.svg" assert { type: "image/svg" };
import filterd from "../assets/filterd.svg" assert { type: "image/svg" };

function Hero() {
  return (
    <div id="hero" className="m-10 pt-10 flex flex-col lg:flex-row items-center justify-between">
      <div className="w-full lg:w-[50%] text-center lg:text-left">
        <div className="vignabd mb-8 text-3xl lg:text-5xl font-extrabold text-[#120020] dark:text-white">
          <span className="mb-2 block font-extrabold">Prepare to excel in</span>
          <span className="mb-2 block font-extrabold">your CATs and FATs</span>
          <span className="mb-2 block font-extabold ">with CodeChef-</span>
          <span className="mb-2 block font-extrabold">VIT’s dedicated</span>
          <span className="mb-2 block font-extrabold">repository of past</span>
          <span className="mb-6 block font-extrabold">exam papers</span>
        </div>
        <div className="play mt-6 flex flex-col lg:flex-row lg:gap-6 text-[#120020] dark:text-white items-center">
          <div className="flex flex-col gap-4 lg:w-[200px]">
            <div className="rounded-lg flex flex-row gap-1 border-2 border-[#7480FF8A] dark:border-[#453D60] bg-[#EAEEFF] dark:bg-[#130E20] px-6 py-4 text-center w-[200px] lg:w-[180px] lg:h-[80px]">
              <Image
                src={signd as string}
                height={30}
                width={30}
                className="block dark:hidden"
                alt="sign"
              />
              <Image
                src={sign as string}
                height={30}
                width={30}
                className="hidden dark:block"
                alt="sign"
              />
              No Sign-up required
            </div>
            <div className="rounded-lg border-2 flex flex-row gap-1 border-[#7480FF8A] dark:border-[#453D60] bg-[#EAEEFF] dark:bg-[#130E20] px-6 py-4 text-center w-[200px] lg:w-[180px] lg:h-[80px]">
              <Image
                src={downloadd as string}
                height={30}
                width={30}
                className="block dark:hidden"
                alt="download"
              />
              <Image
                src={download as string}
                height={30}
                width={30}
                className="hidden dark:block"
                alt="download"
              />
              Flexible Downloads
            </div>
          </div>
          <div className="rounded-lg border-2 border-[#7480FF8A] dark:border-[#453D60] bg-[#EAEEFF] dark:bg-[#130E20] px-6 py-6 my-4 text-center flex flex-col justify-center w-[180px] h-[110px] lg:w-[200px] lg:h-[160px] lg:min-h-[175px]">
            <span className="text-4xl lg:text-5xl font-extrabold p-2">900+</span>
            <span>Past Year Papers</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border-2 flex flex-row gap-1 border-[#7480FF8A] dark:border-[#453D60] bg-[#EAEEFF] dark:bg-[#130E20] px-6 py-4 text-center w-[200px] lg:w-[180px] lg:h-[80px]">
              <Image
                src={tickd as string}
                height={30}
                width={30}
                className="block dark:hidden"
                alt="tick"
              />
              <Image
                src={tick as string}
                height={30}
                width={30}
                className="hidden dark:block"
                alt="tick"
              />
              Answer Key Available
            </div>
            <div className="rounded-lg border-2 flex flex-row items-center justify-center gap-2 border-[#7480FF8A] dark:border-[#453D60] bg-[#EAEEFF] dark:bg-[#130E20] px-6 py-4 text-center w-[200px] h-[80px] lg:w-[180px] lg:h-[80px]">
              <Image
                src={filterd as string}
                height={30}
                width={30}
                className="block dark:hidden"
                alt="filter"
              />
              <Image
                src={filter as string}
                height={30}
                width={30}
                className="hidden dark:block"
                alt="filter"
              />
              Filtered Search
            </div>
          </div>
        </div>
      </div>
      <div className="hidden mb-10 h-[450px] w-[450px] lg:flex lg:w-[500px] lg:h-[600px] justify-center p-5">
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
    </div>
  );
}

export default Hero;
