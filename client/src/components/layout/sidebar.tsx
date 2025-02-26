// // import { cn } from "@/lib/utils";

// // interface SidebarProps {
// //   currentStep: 1 | 2;
// // }

// // export default function Sidebar({ currentStep }: SidebarProps) {
// //   const steps = [
// //     { number: 1, name: "Activity Details", emoji: "🎯" },
// //     { number: 2, name: "Location Details", emoji: "📍" },
// //   ];

// //   return (
// //     <div className="w-64 bg-gray-50 p-6 border-r">
// //       <div className="space-y-4">
// //         {steps.map((step) => (
// //           <div
// //             key={step.number}
// //             className={cn(
// //               "flex items-center gap-3 p-3 rounded-lg",
// //               currentStep === step.number
// //                 ? "bg-gray-900 text-white"
// //                 : currentStep > step.number
// //                 ? "text-gray-900"
// //                 : "text-gray-500"
// //             )}
// //           >
// //             <div
// //               className={cn(
// //                 "w-8 h-8 rounded-full flex items-center justify-center text-xl",
// //                 currentStep === step.number
// //                   ? "bg-white text-gray-900"
// //                   : currentStep > step.number
// //                   ? "bg-gray-900 text-white"
// //                   : "bg-gray-200 text-gray-500"
// //               )}
// //             >
// //               {step.emoji}
// //             </div>
// //             <span className="font-medium">{step.name}</span>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }



// import { cn } from "@/lib/utils";

// interface SidebarProps {
//   currentStep: 1 | 2;
// }

// const ActivityIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M5.14999 2V22" stroke="#382D51" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M5.14999 4H16.35C19.05 4 19.65 5.5 17.75 7.4L16.55 8.6C15.75 9.4 15.75 10.7 16.55 11.4L17.75 12.6C19.65 14.5 18.95 16 16.35 16H5.14999" stroke="#382D51" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

// const LocationIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#6B6B6B" strokeWidth="1.5"/>
//     <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="#6B6B6B" strokeWidth="1.5"/>
//   </svg>
// );

// export default function Sidebar({ currentStep }: SidebarProps) {
//   const steps = [
//     { number: 1, name: "Activity Details", icon: <ActivityIcon /> },
//     { number: 2, name: "Location Details", icon: <LocationIcon /> },
//   ];

//   return (
//     <div className="w-64 bg-gray-50 p-6 border-r">
//       <div className="space-y-4">
//         {steps.map((step) => (
//           <div
//             key={step.number}
//             className={cn(
//               "flex items-center gap-3 p-3 rounded-lg",
//               currentStep === step.number
//                 ? "bg-gray-200 text-gray-700"
//                 : currentStep > step.number
//                 ? "text-gray-900"
//                 : "text-gray-500"
//             )}
//           >
//             <div
//               className={cn(
//                 "w-8 h-8 rounded-full flex items-center justify-center",
//                 currentStep === step.number
//                   ? "bg-white text-gray-900"
//                   : currentStep > step.number
//                   ? "bg-gray-200 text-gray-700"
//                   : "bg-gray-200 text-gray-500"
//               )}
//             >
//               {step.icon}
//             </div>
//             <span className="font-medium">{step.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { cn } from "@/lib/utils";

interface SidebarProps {
  currentStep: 1 | 2;
}

const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.14999 2V22" stroke="#382D51" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.14999 4H16.35C19.05 4 19.65 5.5 17.75 7.4L16.55 8.6C15.75 9.4 15.75 10.7 16.55 11.4L17.75 12.6C19.65 14.5 18.95 16 16.35 16H5.14999" stroke="#382D51" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="#6B6B6B" strokeWidth="1.5"/>
    <path d="M3.62 8.49C5.59 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z" stroke="#6B6B6B" strokeWidth="1.5"/>
  </svg>
);

export default function Sidebar({ currentStep }: SidebarProps) {
  const steps = [
    { number: 1, name: "Activity Details", icon: <ActivityIcon /> },
    { number: 2, name: "Location Details", icon: <LocationIcon /> },
  ];

  return (
    <div className="w-64 bg-gray-50 p-6 border-r">
      {/* Sidebar Heading */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Activity</h2>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              currentStep === step.number
                ? "bg-gray-200 text-gray-700"
                : currentStep > step.number
                ? "text-gray-900"
                : "text-gray-500"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                currentStep === step.number
                  ? "bg-white text-gray-900"
                  : currentStep > step.number
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step.icon}
            </div>
            <span className="font-medium">{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
