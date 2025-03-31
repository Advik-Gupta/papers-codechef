"use client";
import { useState } from "react";

function Faq() {
    const faqs = [
        { question: "What makes papers unique?", answer: "Lorem ipsum" },
        { question: "What makes papers unique?", answer: "Lorem ipsum" },
        { question: "What makes papers unique?", answer: "Lorem ipsum" },
        { question: "What makes papers unique?", answer: "Lorem ipsum" },
        { question: "What makes papers unique?", answer: "Lorem ipsum" }
    ];
    const [faqActive, setFaqActive] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setFaqActive(faqActive === index ? null : index);
    };

    return (
        <div className="w-full mt-12 px-6 md:px-12 py-12">
            <div className="text-center lg:text-left text-4xl lg:text-5xl font-bold text-[#120020] dark:text-white mb-8 w-full">
                Frequently Asked Questions
            </div>
            <div className="max-w-7xl play mx-auto space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="p-4 border-b-2 border-[#453D60]">
                        <div className="flex items-center">
                            <h2
                                className={`text-lg play font-semibold ${faqActive === index ? "dark:text-[#A47DE5] text-[#6F2DA6]" : "dark:text-[#C0BACE] text-black"} w-full pr-15`}
                            >
                                {faq.question}
                            </h2>
                            <button
                                onClick={() => handleClick(index)}
                                className={`text-md font-bold w-11 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${faqActive === index ? "text-white dark:bg-[#A47DE5] bg-[#6F2DA6]" : "dark:bg-white bg-[#EDEFF0] text-[#99979F]"}`}
                            >
                                {faqActive === index ? "−" : "+"}
                            </button>
                        </div>
                        {faqActive === index && (
                            <p className="mt-2 play text-black dark:text-[#C0BACE]">{faq.answer}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Faq;
