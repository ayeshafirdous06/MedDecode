'use client';

import type { ExplainMedicalReportOutput } from '@/ai/flows/explain-medical-report';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lightbulb, Siren, Stethoscope } from 'lucide-react';

export default function ReportDisplay({ result }: { result: ExplainMedicalReportOutput }) {
  return (
    <div className="w-full space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Report Explained</CardTitle>
          <CardDescription>Here is a simplified breakdown of your medical report.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="explanation" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
              <TabsTrigger value="explanation"><FileText className="mr-2" />Simple View</TabsTrigger>
              <TabsTrigger value="doctor"><Stethoscope className="mr-2" />For Your Doctor</TabsTrigger>
              <TabsTrigger value="lifestyle"><Lightbulb className="mr-2" />Lifestyle Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explanation" className="mt-6">
              <div className="p-4 border rounded-lg bg-secondary/30 space-y-2">
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{result.simpleExplanation}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="doctor" className="mt-6">
                <div className="p-4 border rounded-lg bg-secondary/30 space-y-2">
                    <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{result.doctorSummary}</p>
                </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="mt-6">
                 <div className="p-4 border rounded-lg bg-secondary/30 space-y-2">
                    <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{result.lifestyleAwareness}</p>
                 </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/50 border-red-200 dark:border-red-900">
        <Siren className="h-4 w-4" />
        <AlertTitle>⚠️ Important Disclaimer</AlertTitle>
        <AlertDescription>
          This app provides information for educational purposes only. It does not diagnose, treat, or prevent any disease. Please consult a qualified healthcare professional for medical advice.
        </AlertDescription>
      </Alert>
    </div>
  );
}
