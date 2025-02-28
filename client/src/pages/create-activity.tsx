import { useState, useEffect } from "react";
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
import { saveDraft, loadDraft, clearDraft } from "@/lib/draftStorage";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateActivity() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertActivity>({
    resolver: zodResolver(insertActivitySchema),
    defaultValues: {
      name: "",
      category: "Adventure & Games",
      description: "",
      activity_type: "Indoor", // Changed from camelCase to snake_case
      location_type: "Provider Location", // Changed from camelCase to snake_case
      min_members: undefined, // Changed from camelCase to snake_case
      max_members: undefined, // Changed from camelCase to snake_case
      address_line_1: "", // Changed from camelCase to snake_case
      address_line_2: "", // Changed from camelCase to snake_case
      zip_code: "", // Changed from camelCase to snake_case
      city: "",
      state: "",
      contact_number: "", // Changed from camelCase to snake_case
      contact_name: "", // Changed from camelCase to snake_case
    },
  });

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      form.reset(draft);
      toast({
        title: "Draft Loaded",
        description: "Your previous draft has been restored.",
      });
    }
  }, [form, toast]);

  // Auto-save draft when form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      saveDraft(value as Partial<InsertActivity>);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: InsertActivity) => {
    try {
      await apiRequest("POST", "/api/activities", data);
      setShowSuccess(true);
      clearDraft();
      form.reset({
        name: '',
        category: undefined,
        description: '',
        activityType: undefined,
        locationType: undefined,
        minMembers: undefined,
        maxMembers: undefined,
        addressLine1: '',
        addressLine2: '',
        zipCode: '',
        city: '',
        state: '',
        contactNumber: '',
        contactName: ''
      });
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex">
        <Sidebar currentStep={step} />

        <main className="flex-1 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              </AnimatePresence>
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