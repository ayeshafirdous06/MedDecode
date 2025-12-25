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
  simpleExplanation: z.string().describe('The explanation of the medical report in simple language, formatted with emojis and bullet points.'),
  doctorSummary: z.string().describe('A concise summary of the report for discussion with a doctor.'),
  lifestyleAwareness: z.string().describe('General lifestyle awareness information related to the report findings, formatted with an emoji and bullet points.'),
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
  1.  **Analyze the Report**: The user will provide text from a medical report (e.g., blood test, DNA report, health checkup). Extract key values and markers.
  2.  **Explain Simply**: Explain what these values mean in simple, non-technical language using the user-selected language: {{{language}}}.
  3.  **Provide Lifestyle Suggestions**: Offer relevant, general lifestyle tips based on the report's findings.
  4.  **Format Precisely**: You must follow the output format exactly, using the specified emojis, bullet points, and headings.

  **Strict Rules You MUST Follow:**
  - **DO NOT** diagnose any disease.
  - **DO NOT** confirm any illness.
  - **DO NOT** recommend or prescribe any specific medicines or treatments.
  - **ALWAYS** add a bullet point that says "Discuss with your doctor" under each explained medical marker.
  - **ALWAYS** frame your output as educational information, not medical advice.

  **Input Medical Report Text:**
  \`\`\`
  {{{reportText}}}
  \`\`\`

  **Required Output Structure:**

  **1. Simple Explanation:**
  Create a list explaining the key findings. Use emojis to categorize sections.
  - Use 🩸 for blood/RBC related markers.
  - Use 🧪 for WBC/differential count/other chemistry markers.
  - For each marker, provide short, indented bullet points explaining what it is, what the level means, and a final point to "Discuss with your doctor".
  
  *Example for 'Simple Explanation' field:*
  🩸 Hemoglobin: 8.7 g/dL (low)
    - Protein in RBCs that carries oxygen
    - Low levels may cause tiredness or weakness
    - Discuss with your doctor

  🩸 MCV: 56.2 fL (low)
    - Average size of your red blood cells
    - Smaller size is often seen with low hemoglobin
    - Discuss with your doctor

  🧪 Neutrophils: 71.9% (slightly high)
    - A type of white blood cell that helps fight infections
    - A slight elevation by itself does not confirm disease
    - Discuss with your doctor


  **2. Doctor Summary:**
  Write a concise summary for the user to share with their doctor. Highlight the key findings and values that warrant discussion. Omit emojis and lifestyle tips.

  **3. Lifestyle Awareness:**
  Provide a separate section with general lifestyle tips, inspired by the report.
  - Start with the 🍎 emoji and the heading "Lifestyle Tips:".
  - Use bullet points for each tip.

  *Example for 'Lifestyle Awareness' field:*
  🍎 Lifestyle Tips:
  - Eat iron-rich foods (spinach, lentils, eggs)
  - Vitamin C helps your body absorb iron
  - Stay hydrated by drinking 2-3 liters of water daily
  - Aim for 7-8 hours of quality sleep per night
  - Include light daily exercise like a 30-minute walk
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
