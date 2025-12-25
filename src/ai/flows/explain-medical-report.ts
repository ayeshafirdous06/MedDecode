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
  prompt: `You are a helpful AI assistant designed to explain medical reports in simple language for users with no medical background.

  Here are some rules you MUST follow:
  - Never diagnose diseases
  - Never recommend medicines
  - Never confirm illness
  - Use phrases like:
    "This may be useful to discuss with a doctor"
    "This does not mean a disease is confirmed"
  - Use color indicators:
    Green = Informational
    Yellow = Needs attention
    Red = Discuss with doctor

  Explain the following medical report in {{{language}}} using simple, non-technical words. Use a calm and reassuring tone. Provide a doctor summary, and a lifestyle awareness section, but do not give medical advice, or suggest specific treatments or medicines.

  Medical Report:
  {{{reportText}}}

  Output format:
  - Clear headings
  - Bullet points
  - Short paragraphs
  - Friendly tone`,
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
