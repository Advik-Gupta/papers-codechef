"use client";
import React from "react";
import { useState } from "react";

function Faq() {
  const faqs = [
    {
      question: "What makes papers unique?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "How are papers created?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    },
    {
      question: "Why choose our papers?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit.",
    },
    {
      question: "What is the quality of papers?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident.",
    },
    {
      question: "How to order papers?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ];
  const [faqActive, setFaqActive] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setFaqActive(faqActive === index ? null : index);
  };

  return (
    <>
      <div
        id="faq"
        className="mb-8 w-full px-6 text-center text-4xl font-bold text-[#120020] dark:text-white lg:text-left lg:text-5xl"
      >
        Frequently Asked Questions
      </div>
      <div className="mx-auto w-full space-y-6 px-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="cursor-pointer border-b-2 border-[#453D60] p-4"
            onClick={() => handleClick(index)}
          >
            <div className="flex w-full items-center justify-between">
              <h2
                className={`w-full text-lg font-semibold ${faqActive === index ? "text-[#A47DE5]" : "text-black dark:text-white"}`}
              >
                {faq.question}
              </h2>
              <button
                className={`text-md flex h-6 w-11 items-center justify-center rounded-full font-bold transition-all duration-200 ${faqActive === index ? "bg-[#A47DE5] text-white" : "bg-white text-[#99979F]"}`}
              >
                {faqActive === index ? "−" : "+"}
              </button>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                faqActive === index
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="mt-2 text-black dark:text-white">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Faq;
