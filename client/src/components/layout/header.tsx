import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/images/unnamed.png" alt="yo" className="h-12 w-70 object-contain" />
        </div>

        {/* Profile Button with Icon and Text */}
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <UserCircle className="h-6 w-6" />
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </Button>
      </div>
    </header>
  );
}
