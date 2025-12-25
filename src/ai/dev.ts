import { config } from 'dotenv';
config();

import '@/ai/flows/explain-medical-report.ts';
import '@/ai/flows/summarize-report-for-doctor.ts';
import '@/ai/flows/extract-text-from-image.ts';
