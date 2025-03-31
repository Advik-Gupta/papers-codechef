import { type IPaper } from "@/interface";
import Image from "next/image";
import {
  extractBracketContent,
  extractWithoutBracketContent,
} from "@/util/utils";
import { capsule } from "@/util/utils";
import Link from "next/link";

const PreviewCard = ({ paper }: { paper: IPaper }) => {
  if (paper.finalUrl.startsWith("http://")) {
    paper.finalUrl = paper.finalUrl.replace("http://", "https://");
  }
  return (
    <div
      key={paper._id}
      className="w-[280px] play space-y-1 rounded-sm border-2 border-[#734DFF] bg-white p-4 hover:bg-[#EFEAFF] dark:border-[#453D60] dark:bg-[#171720] dark:hover:bg-[#262635]"
    >
      <Link
        href={`/paper/${paper._id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={paper.thumbnailUrl}
          alt={paper.subject}
          width={180}
          height={180}
          className="mb-2 h-[156px] w-full object-cover md:h-[170px]"
        />

        <div className="flex h-25 flex-col justify-center space-y-2">
          <div className="play text-sm font-medium">
            {extractBracketContent(paper.subject)}
            <hr className="w-full border-t-2 dark:border-[#453D60] border-[#453D60] mt-2" />
          </div>
          <div className="cursor-pointer play text-base font-semibold h-[50px]">
            {extractWithoutBracketContent(paper.subject)}
          </div>
          <div className="flex flex-wrap gap-2">
            {capsule(paper.exam)}
            {capsule(paper.slot)}
            {capsule(paper.year)}
            {capsule(paper.semester)}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PreviewCard;
