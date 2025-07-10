import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Upload,
  FileText,
  Shield,
  Eye,
  Download,
  Trash2,
  Search,
  RefreshCw,
} from "lucide-react";
import DocumentVaultHeader from "@/components/vault/DocumentVaultHeader";
import UploadDialog from "@/components/vault/UploadDialog";

import DocumentStats from "@/components/vault/DocumentStats";
import DocumentList from "@/components/vault/DocumentList";
import DocumentControls from "@/components/vault/DocumentControls";
import VerifyDocumentsDialog from "@/components/vault/VerifyDocumentsDialog";
import SharePortfolioDialog from "@/components/vault/SharePortfolioDialog";
import { useUnifiedDashboardData } from "@/hooks/useUnifiedDashboardData";
import HomeFooter from "@/components/home/HomeFooter";
import ExtractedDataModal from "@/components/vault/ExtractedDataModal";
const normalizedData = {
  name: "",
  institution: "",
  dateOfIssue: "",
  registrationNumber: "",
  result: "",
};

const DocumentVault = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isOpenmodel, setIsOpenmodel] = useState(false);
  const [requestOptions, setrequestOptions] = useState(normalizedData);
  const { documents, isRefreshing, refreshAllData } = useUnifiedDashboardData();

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleVerifyDocuments = () => {
    setIsVerifyDialogOpen(true);
  };

  const handleSharePortfolio = () => {
    setIsShareDialogOpen(true);
  };

  const handleUploadComplete = () => {
    setIsUploadDialogOpen(false);
    // Refresh all data to ensure Dashboard and Vault stay in sync
    refreshAllData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <DocumentVaultHeader />

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Document Vault
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Securely store and manage your professional documents
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAllData}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="flex items-center space-x-2 w-full sm:w-auto"
              size="default"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <DocumentStats documents={documents} />

        {/* Search and Filter Controls */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4">
              {/* Search and Filters Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex space-x-2 sm:space-x-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="degree">Degrees</SelectItem>
                      <SelectItem value="certificate">Certificates</SelectItem>
                      <SelectItem value="license">Licenses</SelectItem>
                      <SelectItem value="reference">References</SelectItem>
                      <SelectItem value="work_sample">Work Samples</SelectItem>
                      <SelectItem value="cv_resume">CV/Resume</SelectItem>
                      <SelectItem value="transcript">Transcripts</SelectItem>
                      <SelectItem value="passport">Passports</SelectItem>
                      <SelectItem value="id_card">ID Cards</SelectItem>
                      <SelectItem value="birth_certificate">
                        Birth Certificates
                      </SelectItem>
                      <SelectItem value="marriage_certificate">
                        Marriage Certificates
                      </SelectItem>
                      <SelectItem value="bank_statement">
                        Bank Statements
                      </SelectItem>
                      <SelectItem value="insurance_document">
                        Insurance Documents
                      </SelectItem>
                      <SelectItem value="tax_document">
                        Tax Documents
                      </SelectItem>
                      <SelectItem value="medical_record">
                        Medical Records
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-sm">
              Common document management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-start space-x-3 h-auto p-4 hover:shadow-md transition-shadow"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Upload New Document</div>
                  <div className="text-xs text-gray-500">
                    Add credentials to your vault
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-start space-x-3 h-auto p-4 hover:shadow-md transition-shadow"
                onClick={handleVerifyDocuments}
              >
                <Shield className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Verify Documents</div>
                  <div className="text-xs text-gray-500">
                    Increase your trust score
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex items-center justify-start space-x-3 h-auto p-4 hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1"
                onClick={handleSharePortfolio}
              >
                <FileText className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-sm">Share Portfolio</div>
                  <div className="text-xs text-gray-500">
                    Generate shareable link
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <DocumentList
          documents={documents}
          filteredDocuments={filteredDocuments}
          searchTerm={searchTerm}
          filterType={filterType}
          filterStatus={filterStatus}
        />

        {/* Upload Dialog */}
        <UploadDialog
          isOpen={isUploadDialogOpen}
          onClose={handleUploadComplete}
          setIsOpenmodel={setIsOpenmodel}
          setrequestOptions={setrequestOptions}
        />
        <ExtractedDataModal
          isOpen={isOpenmodel}
          setIsOpen={setIsOpenmodel}
          extractedData={requestOptions as any}
        />
        {/* Verify Documents Dialog */}
        <VerifyDocumentsDialog
          isOpen={isVerifyDialogOpen}
          onClose={() => setIsVerifyDialogOpen(false)}
          documents={documents}
        />

        {/* Share Portfolio Dialog */}
        <SharePortfolioDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          documents={documents}
        />
      </div>

      <HomeFooter />
    </div>
  );
};

export default DocumentVault;
