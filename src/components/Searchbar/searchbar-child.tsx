"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import axios from "axios";

function SearchBarChild({
  initialSubjects,
  filtersNotPulled,
}: {
  initialSubjects: string[];
  filtersNotPulled?: () => void;
}) {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const fuzzy = new Fuse(initialSubjects);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.length > 1 && initialSubjects.length > 0) {
      const filteredSuggestions = fuzzy
        .search(text)
        .sort((a, b) => {
          return (a.score ?? Infinity) - (b.score ?? Infinity); // Use Infinity for undefined scores
        })
        .map((item) => item.item)
        .slice(0, 10);

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    router.push(`/catalogue?subject=${encodeURIComponent(suggestion)}`);
    setSearchText(suggestion);
    setSuggestions([]);
    filtersNotPulled?.();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl font-play">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchText) {
            router.push(`/catalogue?subject=${encodeURIComponent(searchText)}`);
            setSuggestions([]);
          }
        }}
      >
        <div className="relative w-full">
          <Input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search by subject..."
            className={`text-md rounded-lg bg-[#B2B8FF] px-4 py-6 pr-10 font-play tracking-wider text-black shadow-sm ring-0 placeholder:text-black focus:outline-none focus:ring-0 dark:bg-[#7480FF66] dark:text-white placeholder:dark:text-white ${suggestions.length > 0 ? "rounded-b-none" : ""}`}
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            title="Search"
          >
            <Search className="h-5 w-5 text-black dark:text-white" />
          </button>
          {suggestions.length > 0 && (
            <ul
              ref={suggestionsRef}
              className={`absolute z-20 h-[250px] w-full max-w-xl overflow-y-scroll rounded-md rounded-t-none border border-t-0 bg-white text-center shadow-lg dark:bg-[#303771] md:mx-0 ${suggestions.length > 6 ? "h-[250px]" : "h-auto"} ${suggestions.length > 10 ? "md:h-[400px]" : "md:h-auto"} `}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer truncate p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchBarChild;
