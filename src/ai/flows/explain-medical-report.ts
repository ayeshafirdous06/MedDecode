'use server';

/**
 * @fileOverview An AI agent to explain medical reports in simple language.
 *
 * - explainMedicalReport - A function that handles the medical report explanation process.
 * - ExplainMedicalReportInput - The input type for the explainMedicalReport function.
 * - ExplainMedicalReportOutput - The return type for the explainMedicalReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMedicalReportInputSchema = z.object({
  reportText: z
    .string()
    .describe('The text content of the medical report to be explained.'),
  language: z.enum(['Hindi', 'English', 'Telugu']).describe('The preferred language for the explanation.'),
});
export type ExplainMedicalReportInput = z.infer<typeof ExplainMedicalReportInputSchema>;

const ExplainMedicalReportOutputSchema = z.object({
  simpleExplanation: z.string().describe('The explanation of the medical report in simple language.'),
  doctorSummary: z.string().describe('A concise summary of the report for discussion with a doctor.'),
  lifestyleAwareness: z.string().describe('General lifestyle awareness information related to the report findings.'),
});
export type ExplainMedicalReportOutput = z.infer<typeof ExplainMedicalReportOutputSchema>;

export async function explainMedicalReport(input: ExplainMedicalReportInput): Promise<ExplainMedicalReportOutput> {
  return explainMedicalReportFlow(input);
}

const explainMedicalReportPrompt = ai.definePrompt({
  name: 'explainMedicalReportPrompt',
  input: {schema: ExplainMedicalReportInputSchema},
  output: {schema: ExplainMedicalReportOutputSchema},
  prompt: `You are a friendly, professional AI medical report interpreter. Your goal is to provide educational explanations of medical reports in a way that is easy for a layperson to understand.

  **Core Instructions:**
  1.  **Analyze the Report**: The user will provide text from a medical report (e.g., blood test, DNA report, health checkup). Extract key values and markers (like Hemoglobin, WBC, Cholesterol, DNA traits, etc.).
  2.  **Explain Simply**: Explain what these values mean in simple, non-technical language. Use the user-selected language: {{{language}}}.
  3.  **Provide Lifestyle Suggestions**: Offer relevant, general lifestyle tips (like diet, exercise, sleep) based on the report's findings.
  4.  **Format for Readability**: Use clear headings, bullet points, and short paragraphs with a friendly, reassuring tone.

  **Strict Rules You MUST Follow:**
  - **DO NOT** diagnose any disease.
  - **DO NOT** confirm any illness.
  - **DO NOT** recommend or prescribe any specific medicines or treatments.
  - **ALWAYS** use phrases that encourage professional consultation, like "This may be useful to discuss with your doctor" or "This finding by itself does not confirm a disease."
  - **ALWAYS** frame your output as educational information, not medical advice.

  **Input Medical Report Text:**
  \`\`\`
  {{{reportText}}}
  \`\`\`

  **Required Output Structure:**

  **1. Simple Explanation:**
  Create a bulleted list explaining the key findings. For each point, state the marker, its value, a simple interpretation, and a related tip if applicable.
  *Example:*
  - Hemoglobin: 9.8 g/dL (slightly low) → This is a protein that carries oxygen in your blood. A lower level might make you feel tired. Including iron-rich foods like spinach and lentils can be helpful.

  **2. Doctor Summary:**
  Write a concise summary for the user to share with their doctor. Highlight the key findings and values that warrant discussion.

  **3. Lifestyle Awareness:**
  Provide a separate section with general lifestyle tips for overall well-being, inspired by the report.
  *Example:*
  - Aim for a 30-minute walk daily.
  - Stay hydrated by drinking at least 2 liters of water.
  - Ensure you get 7-8 hours of quality sleep per night.
  `,
});

const explainMedicalReportFlow = ai.defineFlow(
  {
    name: 'explainMedicalReportFlow',
    inputSchema: ExplainMedicalReportInputSchema,
    outputSchema: ExplainMedicalReportOutputSchema,
  },
  async input => {
    const {output} = await explainMedicalReportPrompt(input);
    return output!;
  }
);
