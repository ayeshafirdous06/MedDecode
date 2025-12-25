'use server';

import { z } from 'zod';
import { explainMedicalReport, type ExplainMedicalReportOutput } from '@/ai/flows/explain-medical-report';
import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';

const formSchema = z.object({
  reportText: z.string().optional(),
  imageDataUri: z.string().optional(),
  language: z.enum(['Hindi', 'English', 'Telugu'], { required_error: 'Please select a language.' }),
}).refine(data => data.reportText || data.imageDataUri, {
  message: 'Either report text or an image upload is required.',
  path: ['reportText'], // Assign error to a field
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: ExplainMedicalReportOutput;
};

export async function getExplanation(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: 'Invalid form data.',
      issues: errors.map((e) => e.message),
    };
  }
  
  const { imageDataUri, language } = validatedFields.data;
  let { reportText } = validatedFields.data;

  try {
    // If there's an image, extract text from it
    if (imageDataUri) {
      const extractionResult = await extractTextFromImage({ imageDataUri });
      reportText = extractionResult.extractedText;
    }

    if (!reportText || reportText.length < 20) {
      return {
        message: 'Could not extract enough text from the image, or the provided text is too short. Please try a clearer image or paste the text directly.',
      }
    }
    
    // Then, get the explanation for the (newly extracted) text
    const result = await explainMedicalReport({ reportText, language });
    return {
      message: 'success',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while processing the report. The AI model may be unavailable. Please try again later.',
    };
  }
}
