const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require('puppeteer');

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe('The technical question can be asked in the interview'),
        intention: z
          .string()
          .describe('The intention of interviewer behind asking this question'),
        answer: z
          .string()
          .describe(
            'How to answer this question, what points to cover, what approach to take etc.',
          ),
      }),
    )
    .describe(
      'Technical questions that can be asked in the interview along with their intention and how to answer them',
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe('The technical question can be asked in the interview'),
        intention: z
          .string()
          .describe('The intention of interviewer behind asking this question'),
        answer: z
          .string()
          .describe(
            'How to answer this question, what points to cover, what approach to take etc.',
          ),
      }),
    )
    .describe(
      'Behavioral questions that can be asked in the interview along with their intention and how to answer them',
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe('The skill which the candidate is lacking'),
        severity: z
          .enum(['low', 'medium', 'high'])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          ),
      }),
    )
    .describe(
      "List of skill gaps in the candidate's profile along with their severity",
    ),
  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe('The day number in the preparation plan, starting from 1'),
        focus: z
          .string()
          .describe(
            'The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.',
          ),
        tasks: z
          .array(z.string())
          .describe(
            'List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.',
          ),
      }),
    )
    .describe(
      'A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively',
    ),
  title: z
    .string()
    .describe(
      'The title of the job for which the interview report is generated',
    ),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  //   const prompt = `Generate an interview report for a candidate with the following details:
  //                         Resume: ${resume}
  //                         Self Description: ${selfDescription}
  //                         Job Description: ${jobDescription}
  // `;
  const prompt = `
You are an experienced Senior Technical Recruiter.

Analyze the candidate's resume and compare it with the target job description.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

Instructions:

1. Carefully compare the candidate's profile with the job description.
2. Estimate a realistic match score between 0 and 100.
3. Explain skill gaps based only on missing or weak skills.
4. Generate 10 technical interview questions tailored to this role.
5. Generate 5 behavioral interview questions.
6. Create a practical day-wise preparation roadmap.
7. Generate the exact job title from the job description.
8. Avoid generic questions.
9. Prioritize missing skills while creating questions.
10. Return ONLY valid JSON.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm',
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        'The HTML content of the resume which can be converted to PDF using any library like puppeteer',
      ),
  });

  // const prompt = `Generate resume for a candidate with the following details:
  //                       Resume: ${resume}
  //                       Self Description: ${selfDescription}
  //                       Job Description: ${jobDescription}

  //                       the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
  //                       The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
  //                       The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
  //                       you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
  //                       The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
  //                       The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
  //                   `;

  const prompt = `
You are an expert ATS Resume Writer.

Generate a professional, ATS-friendly resume using ONLY HTML and inline CSS.

Candidate Information

Resume:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

===========================
DESIGN REQUIREMENTS
===========================

Create a clean, elegant one-page resume similar to a professional Harvard/Stanford style resume.

The layout MUST be:

------------------------------------------------------
FULL NAME
Professional Title

Phone | Email | LinkedIn | GitHub
------------------------------------------------------

SUMMARY

------------------------------------------------------

SKILLS

Frontend:
Backend:
Database:
Libraries:
Tools:

------------------------------------------------------

EXPERIENCE

Job Title                             Duration

Company                               Technologies

• Achievement
• Achievement
• Achievement

------------------------------------------------------

PROJECTS

Project Name | Tech Stack | Year

• Achievement
• Achievement

------------------------------------------------------

CERTIFICATIONS

• Certification

------------------------------------------------------

EDUCATION

Degree                              Year

College                             CGPA

------------------------------------------------------

RULES

1. Use ONLY HTML and inline CSS.
2. White background.
3. Black text.
4. Professional typography.
5. Font family: Georgia or Times New Roman.
6. Name should be centered and large.
7. Section headings should have a bottom border.
8. Use bullet points for achievements.
9. Dates aligned to the right.
10. Technologies shown in italic.
11. Keep margins compact.
12. Resume should fit on ONE page.
13. Use semantic HTML.
14. Do NOT use tables.
15. Do NOT use images.
16. Do NOT use icons.
17. ATS friendly.
18. Never mention AI.
19. Improve grammar wherever necessary.
20. Rewrite weak sentences professionally.
21. Tailor every section according to the Target Job Description.
22. Include only relevant skills and projects.
23. Make achievements impact-oriented using action verbs.
24. Keep project descriptions concise (2–3 bullet points each).
25. Generate realistic content if some information is missing.
26. The final resume should look similar to a professionally written software engineer resume.

Return ONLY a JSON object:

{
  "html":"..."
}

Do not return markdown.
Do not wrap HTML inside triple backticks.
`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: zodToJsonSchema(resumePdfSchema),
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
