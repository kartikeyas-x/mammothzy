import { cn } from "@/lib/utils";

interface SidebarProps {
  currentStep: 1 | 2;
}

export default function Sidebar({ currentStep }: SidebarProps) {
  const steps = [
    { number: 1, name: "Activity Details", emoji: "🎯" },
    { number: 2, name: "Location Details", emoji: "📍" },
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
                ? "bg-gray-900 text-white"
                : currentStep > step.number
                ? "text-gray-900"
                : "text-gray-500"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xl",
                currentStep === step.number
                  ? "bg-white text-gray-900"
                  : currentStep > step.number
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step.emoji}
            </div>
            <span className="font-medium">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}