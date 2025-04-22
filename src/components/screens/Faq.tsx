"use client";

import React from "react";
import { useState } from "react";

function Faq() {
  const faqs = [
    {
      question: "How do you source exam papers for the website?",
      answer:
        "We continuously update our database with the latest exam papers to ensure comprehensive coverage. Additionally, users can contribute by uploading papers directly to our platform, helping us grow our collection.",
    },
    {
      question: "Is logging in required to download exam papers?",
      answer:
        "No login is needed! You can freely browse and download exam papers without creating an account.",
    },
    {
      question: 'What is meant by "flexible search" for exam papers?',
      answer:
        "Our flexible search feature allows you to filter exam papers using multiple criteria, such as exam type, slot, year, subject, and more, making it easy to find exactly what you need.",
    },
    {
      question: "How can I upload an exam paper to the website?",
      answer:
        'To upload a paper, click the "Upload" button located at the top-right corner of the page. You can submit papers in PDF or image formats, especially if they’re not already available on our site.',
    },
    {
      question: "Do you provide papers for soft skills?",
      answer: "lmao",
    },
    {
      question: "How do I reach out for support or assistance?",
      answer:
        'For any queries or issues, contact our support team via the "Contact Us" section on the website. We’re here to help with all your questions about exam papers and site features.',
    },
    {
      question:
        "What should I do if I can’t find a specific exam paper on the website?",
      answer:
        "Our database is regularly updated with both new and older exam papers. If the paper you’re looking for isn’t available, you can upload it yourself to share with the community.",
    },
    {
      question: "Are uploaded papers immediately visible on the website?",
      answer:
        "Once uploaded, our AI system identifies and categorizes the paper by subject, slot, and other relevant tags. The paper then undergoes a quick manual review to ensure quality before it becomes visible on the site.",
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
        className="font-vipnabd mb-8 w-full px-6 text-center text-4xl font-bold text-[#120020] dark:text-white lg:text-left lg:text-5xl"
      >
        Frequently Asked Questions
      </div>
      <div className="font-play mx-auto w-full space-y-6 px-6">
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
