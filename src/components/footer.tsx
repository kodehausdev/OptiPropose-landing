import Link from "next/link";
import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} OptiPropose💥. All rights reserved.</p>
      </div>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
          Terms of Service
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
