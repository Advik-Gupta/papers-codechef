"use client";
import React from "react";
import { useState } from "react";

function Faq() {
  const faqs = [
    { question: "What makes papers unique?", answer: "Lorem ipsum" },
    { question: "What makes papers unique?", answer: "Lorem ipsum" },
    { question: "What makes papers unique?", answer: "Lorem ipsum" },
    { question: "What makes papers unique?", answer: "Lorem ipsum" },
    { question: "What makes papers unique?", answer: "Lorem ipsum" },
  ];
  const [faqActive, setFaqActive] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setFaqActive(faqActive === index ? null : index);
  };

  return (
    <>
      <div id="faq" className="mb-8 w-full text-center text-4xl font-bold text-[#120020] dark:text-white lg:text-left lg:text-5xl vipnabd">
        Frequently Asked Questions
      </div>
      <div className="play mx-auto w-full space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="cursor-pointer border-b-2 border-[#453D60] p-4"
            onClick={() => handleClick(index)}
          >
            <div className="flex w-full items-center justify-between">
              <h2
                className={`w-full text-lg font-semibold ${faqActive === index ? "text-[#A47DE5]" : "text-[#C0BACE]"}`}
              >
                {faq.question}
              </h2>
              <button
                className={`text-md flex h-6 w-11 items-center justify-center rounded-full font-bold transition-all duration-200 ${faqActive === index ? "bg-[#A47DE5] text-white" : "bg-white text-[#99979F]"}`}
              >
                {faqActive === index ? "−" : "+"}
              </button>
            </div>
            {faqActive === index && (
              <p className="mt-2 text-white">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Faq;
