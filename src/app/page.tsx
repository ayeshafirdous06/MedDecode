import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex justify-center" aria-hidden="true">
          <div className="flex items-center justify-center size-20 bg-primary/10 rounded-2xl">
            <HeartPulse className="size-10 text-primary" />
          </div>
        </div>
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline sm:text-5xl md:text-6xl">
            MedDecode
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Medical reports, made simple.
          </p>
        </header>
        <p className="text-base text-muted-foreground max-w-md mx-auto">
          Upload your medical report and get a simple, easy-to-understand explanation in Hindi, English, or Telugu.
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button asChild size="lg" className="w-full max-w-xs">
            <Link href="/decode">Get Started</Link>
          </Button>
          <div className="text-xs text-muted-foreground pt-8">
            <b>Disclaimer:</b> This app is for educational purposes only and is not a substitute for professional medical advice.
          </div>
        </div>
      </div>
    </div>
  );
}
