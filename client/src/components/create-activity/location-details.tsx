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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

interface LocationDetailsProps {
  form: UseFormReturn<InsertActivity>;
  onPrevious: () => void;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California",
  "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const COUNTRY_CODES = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  // Add more country codes as needed
];

export default function LocationDetails({ form, onPrevious }: LocationDetailsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Location Details</h1>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Address Line 1 <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="House number and street name" {...field} className="rounded-lg bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Address Line 2</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Other information, e.g., building name, landmark, etc." 
                  value={value || ''} 
                  onChange={onChange}
                  className="rounded-lg bg-white" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">ZIP Code <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="eg: 123 467" {...field} className="rounded-lg bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">City <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-lg bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">State <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-lg bg-white">
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contact Number <span className="text-red-500">*</span></FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={(value) => field.onChange(`${value}${field.value?.replace(/^\+\d+/, '')}`)}
                      defaultValue="+1"
                    >
                      <FormControl>
                        <SelectTrigger className="w-24 rounded-lg bg-white">
                          <SelectValue placeholder="+1" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRY_CODES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.code} ({country.country})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="tel" {...field} className="flex-1 rounded-lg bg-white" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contact Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-lg bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrevious} 
            className="group text-gray-800 border-gray-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Previous
          </Button>
          <Button 
            type="submit"
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}