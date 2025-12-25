'use client';

import type { ExplainMedicalReportOutput } from '@/ai/flows/explain-medical-report';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle2, FileText, Lightbulb, Siren, Stethoscope } from 'lucide-react';

function Indicator({ type }: { type: 'green' | 'yellow' | 'red' }) {
  const iconClass = "size-5 flex-shrink-0";
  if (type === 'green') {
    return <CheckCircle2 className={`${iconClass} text-green-600 dark:text-green-500`} />;
  }
  if (type === 'yellow') {
    return <AlertTriangle className={`${iconClass} text-yellow-600 dark:text-yellow-500`} />;
  }
  if (type === 'red') {
    return <Siren className={`${iconClass} text-red-600 dark:text-red-500`} />;
  }
  return null;
}

function ExplanationItem({ line }: { line: string }) {
    const lowerLine = line.toLowerCase();
    let type: 'green' | 'yellow' | 'red' | null = null;
    let text = line;

    if (lowerLine.startsWith('green:')) {
        type = 'green';
        text = line.substring(6).trim();
    } else if (lowerLine.startsWith('yellow:')) {
        type = 'yellow';
        text = line.substring(7).trim();
    } else if (lowerLine.startsWith('red:')) {
        type = 'red';
        text = line.substring(4).trim();
    }

    if (type) {
        const bgColor = {
            green: 'bg-green-100/80 dark:bg-green-900/30 border-green-200 dark:border-green-800/50',
            yellow: 'bg-yellow-100/80 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/50',
            red: 'bg-red-100/80 dark:bg-red-900/30 border-red-200 dark:border-red-800/50',
        }[type];

        return (
            <div className={`flex items-start gap-4 p-4 rounded-lg border ${bgColor}`}>
                <div className="pt-0.5">
                  <Indicator type={type} />
                </div>
                <p className="flex-1 text-sm md:text-base">{text}</p>
            </div>
        );
    }
    
    if (line.trim() === '') return null;
    return <p className="text-sm leading-relaxed md:text-base">{line}</p>;
}

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
            
            <TabsContent value="explanation" className="mt-6 space-y-3">
              {result.simpleExplanation.split('\n').map((line, index) => (
                <ExplanationItem key={index} line={line} />
              ))}
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
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          This app provides information for educational purposes only. It does not diagnose, treat, or prevent any disease. Please consult a qualified healthcare professional for medical advice.
        </AlertDescription>
      </Alert>
    </div>
  );
}
