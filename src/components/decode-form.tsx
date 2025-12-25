'use client';

import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Loader2, FileUp } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin mr-2" /> : null}
      Explain Report
    </Button>
  );
}

interface DecodeFormProps {
  formAction: (payload: FormData) => void;
}

export default function DecodeForm({ formAction }: DecodeFormProps) {
  return (
    <form action={formAction}>
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileUp className="size-6 text-primary" />
            Analyze Your Report
          </CardTitle>
          <CardDescription>
            Copy and paste the text from your medical report below. We support DNA, blood, and health checkup reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid w-full gap-2">
            <Label htmlFor="reportText" className="font-semibold">Medical Report Text</Label>
            <Textarea
              id="reportText"
              name="reportText"
              placeholder="Paste your report text here..."
              className="min-h-[250px] resize-y"
              required
            />
          </div>
          <div className="grid w-full gap-3">
            <Label className="font-semibold">Choose your preferred language</Label>
            <RadioGroup name="language" className="flex flex-wrap gap-4" required defaultValue="English">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="English" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Hindi" id="lang-hi" />
                <Label htmlFor="lang-hi">Hindi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Telugu" id="lang-te" />
                <Label htmlFor="lang-te">Telugu</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
