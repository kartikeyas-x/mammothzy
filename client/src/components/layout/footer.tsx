import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-xl">mammothzy</span>
          </div>

          <p className="text-sm text-gray-600 text-center">
            Marketplace for searching, filtering, and instantly booking team activities
          </p>

          <div className="flex gap-4">
            <Facebook className="h-5 w-5 text-gray-600" />
            <Instagram className="h-5 w-5 text-gray-600" />
            <Linkedin className="h-5 w-5 text-gray-600" />
            <Mail className="h-5 w-5 text-gray-600" />
          </div>

          <p className="text-sm text-gray-600">
            Copyright © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
