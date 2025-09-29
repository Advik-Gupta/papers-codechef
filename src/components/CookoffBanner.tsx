import { Button } from "./ui/button";

import Image from "next/image";

import Link from "next/link";

export default function CookoffBanner() {
  return (
    <>
      <div className="z-50 flex h-fit w-full items-center justify-center bg-[#626bd2] px-6 py-3 text-center text-white sm:h-14 sm:py-0 md:sticky md:top-0 md:justify-between md:text-left">
        <div className="flex items-center gap-x-2">
          <Image
            src="/cookoff.png"
            alt="cookofflogo"
            height={40}
            width={40}
            className="md:hidden"
          />

            <span className="hidden md:block">
            10 Years. Hundreds of Coders. One Champion.
            CookOff, the biggest competitive coding challenge of graVITas is back!
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
          <Button className="bg-[#5c34e7] hover:bg-[#a6b0ff] focus:ring-2 focus:ring-offset-2 focus:ring-[#b2b8ff]">
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
