import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-xl">mammothzy</span>
        </div>

        <Button variant="ghost" size="icon">
          <UserCircle className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
