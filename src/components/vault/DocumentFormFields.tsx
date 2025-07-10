
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentFormFieldsProps {
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: string;
  setDocumentType: (type: string) => void;
  customDocumentType: string;
  setCustomDocumentType: (type: string) => void;
  issuer: string;
  setIssuer: (issuer: string) => void;
  expiryDate: string;
  setExpiryDate: (date: string) => void;
}

const DocumentFormFields = ({
  documentName,
  setDocumentName,
  documentType,
  setDocumentType,
  customDocumentType,
  setCustomDocumentType,
  issuer,
  setIssuer,
  expiryDate,
  setExpiryDate
}: DocumentFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="docName">Document Name *</Label>
        <Input 
          id="docName" 
          placeholder="e.g., Bachelor's Degree in Computer Science"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="docType">Document Type *</Label>
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="degree">Degree</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="license">License</SelectItem>
            <SelectItem value="reference">Reference</SelectItem>
            <SelectItem value="work_sample">Work Sample</SelectItem>
            <SelectItem value="cv_resume">CV/Resume</SelectItem>
            <SelectItem value="transcript">Transcript</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="id_card">ID Card</SelectItem>
            <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
            <SelectItem value="marriage_certificate">Marriage Certificate</SelectItem>
            <SelectItem value="bank_statement">Bank Statement</SelectItem>
            <SelectItem value="insurance_document">Insurance Document</SelectItem>
            <SelectItem value="tax_document">Tax Document</SelectItem>
            <SelectItem value="medical_record">Medical Record</SelectItem>
            <SelectItem value="other">Other (specify below)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {documentType === "other" && (
        <div>
          <Label htmlFor="customType">Custom Document Type *</Label>
          <Input 
            id="customType" 
            placeholder="e.g., Professional Membership Card"
            value={customDocumentType}
            onChange={(e) => setCustomDocumentType(e.target.value)}
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="issuer">Issuing Institution *</Label>
        <Input 
          id="issuer" 
          placeholder="e.g., Stanford University, DMV, etc."
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="expiry">Expiry Date (if applicable)</Label>
        <Input 
          id="expiry" 
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </div>
    </>
  );
};

export default DocumentFormFields;
