import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b sticky top-0 z-50">
      <Link href="#" className="flex items-center justify-center" prefetch={false}>
        <FileText className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold font-headline">PitchPerfect AI</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="#cta">
            Get Early Access
          </Link>
        </Button>
      </nav>
    </header>
  );
}
