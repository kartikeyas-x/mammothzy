import { UseFormReturn } from "react-hook-form";
import { InsertActivity } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface ActivityDetailsProps {
  form: UseFormReturn<InsertActivity>;
  onNext: () => void;
}

export default function ActivityDetails({ form, onNext }: ActivityDetailsProps) {
  const validateStep = () => {
    const fields = ["name", "category", "description", "activityType", "locationType"];
    const isValid = fields.every(field => !form.formState.errors[field as keyof InsertActivity]);
    if (isValid) onNext();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Activity Details</h1>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activity Name</FormLabel>
            <FormControl>
              <Input placeholder="Eg: Cooking class in Palo Alto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select the best category to describe your activity</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  "Adventure & Games",
                  "Creative Expression",
                  "Food & Drink",
                  "Learning & Development",
                  "Sports and Fitness",
                  "Volunteering",
                  "Other"
                ].map((category) => (
                  <FormItem key={category}>
                    <FormControl>
                      <RadioGroupItem value={category} />
                    </FormControl>
                    <FormLabel className="ml-2">{category}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activity Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Activity Description"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="activityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Please select the activity type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                {["Indoor", "Outdoor", "Virtual"].map((type) => (
                  <FormItem key={type} className="flex items-center">
                    <FormControl>
                      <RadioGroupItem value={type} />
                    </FormControl>
                    <FormLabel className="ml-2">{type}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button type="button" onClick={validateStep}>
          Save and Continue
        </Button>
      </div>
    </div>
  );
}
