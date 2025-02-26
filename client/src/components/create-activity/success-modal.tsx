import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({ open, onClose }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Activity Created Successfully!</DialogTitle>
          <DialogDescription className="text-center">
            Your activity has been created and is now ready for booking.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
