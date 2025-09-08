import { Button } from "./ui/button";

import Image from "next/image";

import Link from "next/link";

export default function CookoffBanner() {
  return (
    <>
      <div className="z-50 flex h-fit w-full items-center justify-center bg-[#471600] px-6 py-3 text-center text-white sm:h-14 sm:py-0 md:sticky md:top-0 md:justify-between md:text-left">
        <div className="flex items-center gap-x-2">
          <Image
            src="/cookoff.png"
            alt="cookofflogo"
            height={40}
            width={40}
            className="md:hidden"
          />

          <span className="hidden md:block">
            Marking 10 years of coding excellence, CookOff is back as
            graVITas&apos; biggest coding challenge – test your skills and make
            history!
          </span>

          <Link
            href="https://gravitas.vit.ac.in/events/bdfcebea-c141-4a61-ac73-61dec96c08f4"
            className="block md:hidden"
            rel="noopener noreferrer"
            target="_blank"
            
          >
            Register for CookOff 10.0
          </Link>
        </div>

        <div className="hidden md:block">
          <Button className="bg-[#e5b0a0] hover:bg-[#e68e73] focus:ring-2 focus:ring-offset-2 focus:ring-[#e5b0a0]">
            <Link
              className="flex items-center gap-x-2"
              href="https://gravitas.vit.ac.in/events/bdfcebea-c141-4a61-ac73-61dec96c08f4"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>
                <Image
                  src="/cookoff.png" 
                  alt="cookofflogo"
                  height={20}
                  width={20}
                />
              </span>

              <span className="font-yerk text-xs text-gray-100">Register</span>
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
