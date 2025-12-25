'use server';

/**
 * @fileOverview Extracts text from an image of a medical report.
 *
 * - extractTextFromImage - A function that handles the text extraction process.
 * - ExtractTextFromImageInput - The input type for the extractTextFromImage function.
 * - ExtractTextFromImageOutput - The return type for the extractTextFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTextFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a medical report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractTextFromImageInput = z.infer<
  typeof ExtractTextFromImageInputSchema
>;

const ExtractTextFromImageOutputSchema = z.object({
  extractedText: z
    .string()
    .describe('The text extracted from the medical report image.'),
});
export type ExtractTextFromImageOutput = z.infer<
  typeof ExtractTextFromImageOutputSchema
>;

export async function extractTextFromImage(
  input: ExtractTextFromImageInput
): Promise<ExtractTextFromImageOutput> {
  return extractTextFromImageFlow(input);
}

const extractTextPrompt = ai.definePrompt({
  name: 'extractTextPrompt',
  input: {schema: ExtractTextFromImageInputSchema},
  output: {schema: ExtractTextFromImageOutputSchema},
  prompt: `You are an expert at Optical Character Recognition (OCR). Your task is to accurately extract all text from the provided image of a medical report.

  - The report might be messy, incomplete, or scanned.
  - Preserve the original structure and formatting as much as possible.
  - Do not interpret, analyze, or summarize the text. Your only job is to extract it.

  Image: {{media url=imageDataUri}}
  `,
});

const extractTextFromImageFlow = ai.defineFlow(
  {
    name: 'extractTextFromImageFlow',
    inputSchema: ExtractTextFromImageInputSchema,
    outputSchema: ExtractTextFromImageOutputSchema,
  },
  async input => {
    const {output} = await extractTextPrompt(input);
    return output!;
  }
);
