import DecodeFlow from '@/components/decode-flow';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DecodeFlowSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <Skeleton className="h-[450px] w-full" />
    </div>
  );
}

export default function DecodePage() {
  return (
    <div className="relative min-h-screen bg-muted/20">
      <header className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="Back to home">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
      </header>
      <main className="flex flex-col items-center justify-center min-h-screen p-4 pt-20 sm:pt-4">
        <Suspense fallback={<DecodeFlowSkeleton />}>
          <DecodeFlow />
        </Suspense>
      </main>
    </div>
  );
}
