'use server';
/**
 * @fileOverview Generates a short, professional summary of a medical report for doctors.
 *
 * - summarizeReportForDoctor - A function that generates the summary.
 * - SummarizeReportForDoctorInput - The input type for the summarizeReportForDoctor function.
 * - SummarizeReportForDoctorOutput - The return type for the summarizeReportForDoctor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportForDoctorInputSchema = z.object({
  reportText: z
    .string()
    .describe('The full text content of the medical report.'),
  language: z.enum(['Hindi', 'English', 'Telugu']).describe('The preferred language for the summary.'),
});
export type SummarizeReportForDoctorInput = z.infer<
  typeof SummarizeReportForDoctorInputSchema
>;

const SummarizeReportForDoctorOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the medical report, highlighting key findings and potential discussion points with a healthcare professional.'
    ),
});
export type SummarizeReportForDoctorOutput = z.infer<
  typeof SummarizeReportForDoctorOutputSchema
>;

export async function summarizeReportForDoctor(
  input: SummarizeReportForDoctorInput
): Promise<SummarizeReportForDoctorOutput> {
  return summarizeReportForDoctorFlow(input);
}

const summarizeReportForDoctorPrompt = ai.definePrompt({
  name: 'summarizeReportForDoctorPrompt',
  input: {schema: SummarizeReportForDoctorInputSchema},
  output: {schema: SummarizeReportForDoctorOutputSchema},
  prompt: `You are a medical summarization expert.

  Your task is to generate a concise and professional summary of a medical report for a doctor, highlighting key findings and potential discussion points.
  The summary should be in {{{language}}}.

  Here is the medical report text:
  {{reportText}}

  Focus on:
  - Test names or gene names
  - Values or findings
  - Why discussion with a doctor may be helpful

  Do not include:
  - Diagnoses
  - Treatment recommendations

  Use a calm and reassuring tone.
  Omit any lifestyle awareness or disclaimer information.
`,
});

const summarizeReportForDoctorFlow = ai.defineFlow(
  {
    name: 'summarizeReportForDoctorFlow',
    inputSchema: SummarizeReportForDoctorInputSchema,
    outputSchema: SummarizeReportForDoctorOutputSchema,
  },
  async input => {
    const {output} = await summarizeReportForDoctorPrompt(input);
    return output!;
  }
);
