'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Loader2, FileUp, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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
  const [activeTab, setActiveTab] = useState<'text' | 'upload'>('text');
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            setImageDataUri(loadEvent.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handleTabChange = (value: 'text' | 'upload') => {
    setActiveTab(value);
    if (formRef.current) {
        const formData = new FormData(formRef.current);
        const reportTextField = formData.get('reportText');
        if (value === 'upload' && reportTextField) {
            // clear text area when switching to upload
            const textArea = formRef.current.querySelector<HTMLTextAreaElement>('textarea[name="reportText"]');
            if(textArea) textArea.value = '';
        }
    }
  }


  return (
    <form ref={formRef} action={formAction}>
       <input type="hidden" name="imageDataUri" value={imageDataUri || ''} />
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileUp className="size-6 text-primary" />
            Analyze Your Report
          </CardTitle>
          <CardDescription>
            Use text or upload an image of your medical report. We support DNA, blood, and health checkup reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          <RadioGroup defaultValue="text" onValueChange={handleTabChange} className="flex border-b">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="type-text" className="sr-only" />
                <Label htmlFor="type-text" className={cn("cursor-pointer py-2 px-4 font-medium", activeTab === 'text' && "border-b-2 border-primary text-primary")}>
                  Paste Text
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="type-upload" className="sr-only" />
                <Label htmlFor="type-upload" className={cn("cursor-pointer py-2 px-4 font-medium", activeTab === 'upload' && "border-b-2 border-primary text-primary")}>
                  Upload Image
                </Label>
              </div>
          </RadioGroup>

          {activeTab === 'text' ? (
            <div className="grid w-full gap-2">
              <Label htmlFor="reportText" className="font-semibold">Medical Report Text</Label>
              <Textarea
                id="reportText"
                name="reportText"
                placeholder="Paste your report text here..."
                className="min-h-[250px] resize-y"
              />
            </div>
          ) : (
             <div className="grid w-full gap-2">
                <Label className="font-semibold">Upload Report Image</Label>
                {imageDataUri ? (
                    <div className="relative">
                        <Image src={imageDataUri} alt="Report preview" width={500} height={300} className="rounded-md object-contain border max-h-[300px] w-full" />
                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setImageDataUri(null)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <div
                        className={cn("flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer text-muted-foreground hover:bg-muted/50", isDragging && 'bg-primary/10 border-primary')}
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDragEnter}
                        onDragOver={(e) => e.preventDefault()}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <ImageIcon className="size-10 mb-2"/>
                        <span>{isDragging ? 'Drop image here' : 'Drag & drop, or click to browse'}</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="imageFile"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                         <input type="hidden" name="reportText" value="" />
                    </div>
                )}
             </div>
          )}


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
