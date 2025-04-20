import React from "react";

interface ErrorProps {
  message?: string;
  filtersPulled?: boolean;
}

const Error = ({
  message = "Some error occured",
  filtersPulled,
}: ErrorProps) => {
  return (
    <div
      className={`flex h-full flex-1 items-center justify-center ${filtersPulled ? "blur-xl" : ""}`}
    >
      <div className="-mt-32 text-center text-lg">{message}</div>
    </div>
  );
};

export default Error;
