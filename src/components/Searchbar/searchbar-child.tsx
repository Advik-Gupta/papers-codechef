"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

function SearchBarChild({ initialSubjects }: { initialSubjects: string[] }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [subjects] = useState<string[]>(initialSubjects);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    setIsSearching(true);

    if (text.length > 1 && subjects.length > 0) {
      const filteredSuggestions = subjects.filter((subject) =>
        subject.toLowerCase().includes(text.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setSearchText(suggestion);
    setSuggestions([]);
    setIsSearching(false);
    router.push(`/catalogue?subject=${encodeURIComponent(suggestion)}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node) &&
      !inputRef.current?.contains(event.target as Node)
    ) {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mx-4 md:mx-0">
      <form
        className="w-full max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          if (searchText) {
            setIsSearching(false);
            router.push(`/catalogue?subject=${encodeURIComponent(searchText)}`);
          }
        }}
      >
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            onFocus={() => setIsSearching(true)}
            placeholder="Search by subject..."
            className="text-md w-full rounded-full border bg-[#434dba] px-4 py-6 pr-10 font-sans tracking-wider text-white shadow-sm placeholder:text-white focus:outline-none focus:ring-2"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
          {isSearching &&
            (suggestions.length > 0 ||
              (searchText.length > 1 && subjects.length > 0)) && (
              <ul
                ref={suggestionsRef}
                className="absolute z-20 mx-0.5 mt-2 w-full max-w-xl rounded-md border border-[#434dba] bg-white text-center shadow-lg dark:bg-[#030712] md:mx-0"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="cursor-pointer truncate p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {suggestion}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 dark:text-gray-400">
                    No subjects found
                  </li>
                )}
              </ul>
            )}
        </div>
      </form>
    </div>
  );
}

export default SearchBarChild;
