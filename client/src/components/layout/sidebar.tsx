import { cn } from "@/lib/utils";

interface SidebarProps {
  currentStep: 1 | 2;
}

export default function Sidebar({ currentStep }: SidebarProps) {
  const steps = [
    { number: 1, name: "Activity Details" },
    { number: 2, name: "Location Details" },
  ];

  return (
    <div className="w-64 bg-gray-50 p-6 border-r">
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              currentStep === step.number
                ? "bg-primary text-primary-foreground"
                : currentStep > step.number
                ? "text-primary"
                : "text-gray-500"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-sm border",
                currentStep === step.number
                  ? "border-primary-foreground"
                  : currentStep > step.number
                  ? "border-primary"
                  : "border-gray-500"
              )}
            >
              {step.number}
            </div>
            <span className="font-medium">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
