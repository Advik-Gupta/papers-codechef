import '@ungap/with-resolvers';


// import { Mistral } from "@mistralai/mistralai";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {type  ExamDetail } from '@/interface';

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

// Function to ensure output directory exists
export default async function processAndAnalyze({
  imageURL,
}: {
  imageURL:string;
}) {

  if (imageURL) {
    const analysisResult = await analyzeImage(imageURL);
    
    return analysisResult[0]?.examDetail;
  } else {
    throw Error("Error Creating the Image");
  }
}
// export async function pdfToImage(file: File) {
//   // GlobalWorkerOptions.workerSrc = process.cwd() + '/public/pdf.worker.js'
//     const bytes = await file.arrayBuffer();
  
//     const buffer = Buffer.from(bytes);
//     const singlePage = await PdfToImg(buffer, {
//       returnType: "base64", // accept "base64" and "buffer"
//       imgType: "png", // accept "png" and "jpg"
//       pages: "firstPage",
//   });
//     return singlePage
//   }
// Function to convert PDF file's first page to image


// Function to convert the downloaded PDF to images
// async function convertPDFToImages(binaryData: string): Promise<string> {

//   const pdf = await  PDFDocument.load(binaryData)
//   const bytes = await (await pdf.save())
//   const buffer = Buffer.from(bytes);
//   const dataUrl = `data:${'application/pdf'};base64,${buffer.toString("base64")}`;
//   return dataUrl

// }

// Function to parse Mistral's response into ExamDetail format
function parseExamDetail(analysis: string): ExamDetail {
  try {
    // Try to find JSON in the response
    const jsonRegex = /\{[\s\S]*\}/;
    const jsonMatch = jsonRegex.exec(analysis);
    if (jsonMatch) {
      const examDetail: ExamDetail = JSON.parse(jsonMatch[0]) as ExamDetail;
      if (examDetail.semester) {
        const validSemesters = ["Fall Semester", "Winter Semester", "Summer Semester", "Weekend Semester"];
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
      return examDetail
    }

    throw new Error("Could not parse exam details from response");
  } catch (error) {
    console.error("Error parsing exam details:", error);
    return {
      "subject": "Unknown",
      slot: "Unknown",
      "course-code": "Unknown",
      "exam": "Unknown",
      semester: "Fall Semester",
      year: new Date().getFullYear().toString() 
    };
  }
}

// Function to analyze images using Mistral AI
async function analyzeImage(dataUrl: string): Promise<AnalysisResult[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new ProcessingError("GEMINI_API_KEY environment variable not set");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
    const results: AnalysisResult[] = [];

    // const dataUrl = `data:image/png;base64,${imageBase64}`;

    const prompt = `This is an image of a question paper. I want you to extract the Exam name, there can be three: final assessment test, continuous assessment test 1, continuous assessment test 2.Now Final assessment should be labelled as FAT, Continuous assessment 1 should be labelled as CAT-1 and Continuous assessment 2 should be labelled as CAT-2. Also I want you to find me the semester it is from, there can be four: Fall Semester, Winter Semester, Summer Semester, Weekend Semester. Fall semester lasts form july to end of the year and winter from january to May inclusive , summer semester is from june to july. Do not put weekend semester if you dont see it in the image. Also find me the year of the exam and the slot of the exam, they look something like this : A1, A1+TA1, B2+BT2, C1+TC1+TCC1 etc.Instead of the entire slot though i just require the initial, alphaber and number part before the plus sign. And I also require the course title and the course code from the paper. Course code looks something like : BCSE202P, BCSE307L etc. if you unable to find return NOT FOUND also format your output into a .json format. most importantly if you are unsure of anything at all just return NOT FOUND

    make sure to return the output in the following format:
    {
    subject: "course title [course code]"
    exam: "exam type" 
    year: year
    slot: "A1/A2/B1 etc "
    semester: "semester"
    }
        
    `;
    const image = {
      inlineData: {
        data: dataUrl,
        mimeType: "image/png",
      },
    };
    
    const result = await model.generateContent([prompt, image]);

    const chatResponse = result.response.text();
    const rawAnalysis =  chatResponse;

    console.log(rawAnalysis)
    const examDetail: ExamDetail = parseExamDetail(rawAnalysis);
    results.push({
      examDetail,
      rawAnalysis,
    });

    return results;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error analyzing images:", errorMessage);

    return [
      {
        examDetail: {
          "subject": "Error",
          slot: "Error",
          "course-code": "Error",
          "exam": "Error",
          semester: "Fall Semester", 
          year: new Date().getFullYear().toString()
        },
        rawAnalysis: `Error analyzing image: ${errorMessage}`,
      },
    ];
  }
}
// Main function to process everything
// async function processPDFAndAnalyze(pdfUrl: string): Promise<void> {
//     try {
//         // Convert PDF to images and get the output directory
//         const outputDir = await convertPDFToImages(pdfUrl);

//         // Analyze all the generated images
//         const analysisResults = await analyzeImages(outputDir);

//         // Save results to a JSON file
//         const resultsPath = join(outputDir, 'analysis_results.json');
//         fs.writeFileSync(
//             resultsPath,
//             JSON.stringify(analysisResults, null, 2)
//         );

//         console.log('Analysis completed. Results saved to:', resultsPath);

//         // Log results to console
//         analysisResults.forEach(result => {
//             console.log(`\nAnalysis for ${result.imageName}:`);
//             console.log('Exam Details:', result.examDetail);
//             console.log('Raw Analysis:', result.rawAnalysis);
//         });

//     } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//         console.error('Error in processing:', errorMessage);
//         throw new ProcessingError(errorMessage);
//     }
// }

// Example usage - Replace with your PDF URL
// const pdfUrl =
//   "https://res.cloudinaGEMINI_API_KEY=AIzaSyBpN6k0jktq4VAbNT4QPoxuEEpDGOnHXSYry.com/dtorpaj1c/image/upload/v1731668830/papers/mykcs2yxaman61kx0jvj.pdf";

// Run the complete process
// processPDFAndAnalyze(pdfUrl)
// .then(() => console.log('Complete processing finished'))
// .catch(error => console.error('Processing failed:', error));

// Function to download the PDF from the URL

// async function downloadPDF(url: string): Promise<string> {
//     try {
//         const tmpFile = tmp.fileSync({ postfix: '.pdf' });
//         const response = await axios({
//             method: 'GET',
//             url,
//             responseType: 'arraybuffer',
//         });
//         fs.writeFileSync(tmpFile.name, response.data);
//         return tmpFile.name;
//     } catch (error: unknown) {
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//         console.error('Error downloading PDF:', errorMessage);
//         throw new ProcessingError(errorMessage);
//     }
// }

// // Function to convert image to base64
// function imageToBase64(image: Buffer): string {
//   try {
//     return Buffer.from(image).toString("base64");
//   } catch (error: unknown) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     throw new ProcessingError(
//       `Error converting image to base64: ${errorMessage}`,
//     );
//   }
// }
