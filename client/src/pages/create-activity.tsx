import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertActivitySchema, type InsertActivity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Sidebar from "@/components/layout/sidebar";
import ActivityDetails from "@/components/create-activity/activity-details";
import LocationDetails from "@/components/create-activity/location-details";
import SuccessModal from "@/components/create-activity/success-modal";

export default function CreateActivity() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertActivity>({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: {
      activityType: "Indoor",
      locationType: "Provider Location",
    },
  });

  const onSubmit = async (data: InsertActivity) => {
    try {
      await apiRequest("POST", "/api/activities", data);
      console.log("Form submitted:", data);
      setShowSuccess(true);
      form.reset();
      setStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create activity. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        <Sidebar currentStep={step} />

        <main className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
              {step === 1 ? (
                <ActivityDetails
                  form={form}
                  onNext={() => setStep(2)}
                />
              ) : (
                <LocationDetails
                  form={form}
                  onPrevious={() => setStep(1)}
                />
              )}
            </form>
          </Form>
        </main>
      </div>

      <Footer />

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}