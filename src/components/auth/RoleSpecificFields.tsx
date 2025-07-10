
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RoleSpecificFieldsProps {
  activeTab: string;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RoleSpecificFields: React.FC<RoleSpecificFieldsProps> = ({
  activeTab,
  formData,
  handleInputChange
}) => {
  return (
    <>
      <TabsContent value="employer" className="space-y-4 m-0">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required={activeTab === "employer"}
          />
        </div>
      </TabsContent>

      <TabsContent value="university" className="space-y-4 m-0">
        <div className="space-y-2">
          <Label htmlFor="universityName">University Name</Label>
          <Input
            id="universityName"
            name="universityName"
            value={formData.universityName}
            onChange={handleInputChange}
            required={activeTab === "university"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accreditationId">Accreditation ID (Optional)</Label>
          <Input
            id="accreditationId"
            name="accreditationId"
            value={formData.accreditationId}
            onChange={handleInputChange}
            placeholder="e.g., WASC, ABET, etc."
          />
        </div>
      </TabsContent>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (Optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};
