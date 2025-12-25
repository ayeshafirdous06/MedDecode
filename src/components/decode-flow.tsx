'use client';

import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getExplanation, type FormState } from '@/app/decode/actions';
import DecodeForm from './decode-form';
import ReportDisplay from './report-display';
import { Button } from './ui/button';
import { ArrowPathIcon } from '@heroicons/react/24/outline'; // Using Heroicons as lucide-react might not have a perfect match

const initialState: FormState = {
  message: '',
};

export default function DecodeFlow() {
  const [state, formAction] = useFormState(getExplanation, initialState);
  const { toast } = useToast();
  const [isNewReport, setIsNewReport] = useState(true);

  useEffect(() => {
    if (state.message === 'success') {
      setIsNewReport(false);
    } else if (state.message !== '') {
      const errorMessage = state.issues ? state.issues.join(', ') : state.message;
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [state, toast]);

  const handleReset = () => {
    setIsNewReport(true);
    // Note: useFormState doesn't have a built-in reset, this approach effectively restarts the flow.
  };

  if (!isNewReport && state.data) {
    return (
      <div className="w-full max-w-3xl space-y-4">
        <ReportDisplay result={state.data} />
        <Button onClick={handleReset} variant="outline" className="w-full">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.691V5.25" />
          </svg>
          Analyze Another Report
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <DecodeForm formAction={formAction} />
    </div>
  );
}
