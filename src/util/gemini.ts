import "@ungap/with-resolvers";

import { GoogleGenAI } from "@google/genai";
import { type ExamDetail } from "@/interface";

// Type definitions

type AnalysisResult = {
  examDetail: ExamDetail;
  rawAnalysis: string;
};

// Custom error type
class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessingError";
  }
}

export default async function processAndAnalyze({
  pdfData,
}: {
  pdfData: string;
}) {
  if (pdfData) {
    const analysisResult = await analyzeImage(pdfData);

    return analysisResult[0]?.examDetail;
  } else {
    throw Error("Error Creating the Image");
  }
}

// Function to parse Gemini's response into ExamDetail format
function parseExamDetail(analysis: string): ExamDetail {
  try {
    // Try to find JSON in the response
    const jsonRegex = /\{[\s\S]*\}/;
    const jsonMatch = jsonRegex.exec(analysis);
    if (jsonMatch) {
      const examDetail: ExamDetail = JSON.parse(jsonMatch[0]) as ExamDetail;
      if (examDetail.semester) {
        const validSemesters = [
          "Fall Semester",
          "Winter Semester",
          "Summer Semester",
          "Weekend Semester",
        ];
        if (!validSemesters.includes(examDetail.semester)) {
          examDetail.semester = "Fall Semester";
        }
      }

      if (examDetail.year) {
        const yearPattern = /^\d{4}$/;
        if (!yearPattern.test(examDetail.year)) {
          examDetail.year = new Date().getFullYear().toString();
        }
      }
      return examDetail;
    }

    throw new Error("Could not parse exam details from response");
  } catch (error) {
    console.error("Error parsing exam details:", error);
    return {
      subject: "Unknown",
      slot: "Unknown",
      "course-code": "Unknown",
      exam: "Unknown",
      semester: "Fall Semester",
      year: new Date().getFullYear().toString(),
      answerKeyIncluded: undefined,
    };
  }
}

// Function to analyze images using Gemini AI
async function analyzeImage(dataUrl: string): Promise<AnalysisResult[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ProcessingError("GEMINI_API_KEY environment variable not set");
    }

    const results: AnalysisResult[] = [];
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `These are images of a question paper. I want you to extract the Exam name, there can be three: final assessment test, continuous assessment test 1, continuous assessment test 2.Now Final assessment should be labelled as FAT, Continuous assessment 1 should be labelled as CAT1 and Continuous assessment 2 should be labelled as CAT2. Also I want you to find me the semester it is from, there can be four: Fall Semester, Winter Semester, Summer Semester, Weekend Semester. Fall semester lasts form july to end of the year and winter from january to May inclusive , summer semester is from june to july. Do not put weekend semester if you dont see it in the image. Also find me the year of the exam and the slot of the exam, they look something like this : A1, A1+TA1, B2+BT2, C1+TC1+TCC1 etc.Instead of the entire slot though i just require the initial, alphaber and number part before the plus sign. And I also require the course title and the course code from the paper. Course code looks something like : BCSE202P, BCSE307L etc. if you unable to find return NOT FOUND also format your output into a .json format. most importantly if you are unsure of anything at all just return NOT FOUND. Also i want you see, if an answerkey is included as well. it may be Handwritten or typed. Answer might be written right after the question or at the end of the questions as well. if you find one return answerKeyIncluded as true.

          make sure to return the output in the following format:
          {
          subject: "course title [course code]"
          exam: "exam type" 
          year: year
          slot: "A1/A2/B1 etc "
          semester: "semester"
          answerKeyIncluded: true or false
          }
  `;
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: dataUrl,
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });

    const rawAnalysis = response.text;

    console.log(rawAnalysis);

    if (rawAnalysis) {
      const examDetail: ExamDetail = parseExamDetail(rawAnalysis);
      results.push({
        examDetail,
        rawAnalysis,
      });
    } else {
      throw new Error("Could not analyse");
    }

    return results;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error analyzing images:", errorMessage);

    return [
      {
        examDetail: {
          subject: "Error",
          slot: "Error",
          "course-code": "Error",
          exam: "Error",
          semester: "Fall Semester",
          year: new Date().getFullYear().toString(),
          answerKeyIncluded: undefined,
        },
        rawAnalysis: `Error analyzing image: ${errorMessage}`,
      },
    ];
  }
}
