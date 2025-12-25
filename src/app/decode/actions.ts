'use server';

import { z } from 'zod';
import { explainMedicalReport, type ExplainMedicalReportOutput } from '@/ai/flows/explain-medical-report';

const formSchema = z.object({
  reportText: z.string().min(50, { message: 'Report text must be at least 50 characters long.' }),
  language: z.enum(['Hindi', 'English', 'Telugu'], { required_error: 'Please select a language.' }),
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

  try {
    const result = await explainMedicalReport(validatedFields.data);
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
