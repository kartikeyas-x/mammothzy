import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/mammothzy-logo.png" alt="Mammothzy Logo" className="h-10" />
          <span className="font-bold text-2xl">mammothzy</span>
        </div>

        <Button variant="ghost" size="icon">
          <UserCircle className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}