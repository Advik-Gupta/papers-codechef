import { ChevronDown } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClick: () => void;
  variant?: "default" | "pinned";
  ref?: React.Ref<HTMLButtonElement>;
}

export default function DropdownToggleButton({
  isOpen,
  onClick,
  variant,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full ${variant === "pinned" ? "border-2 border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)]" : "bg-[#4B22D1]"} text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95`}
      aria-label="Toggle dropdown"
    >
      <ChevronDown
        className={`h-5 w-5 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        strokeWidth={2.5}
      />
    </button>
  );
}
