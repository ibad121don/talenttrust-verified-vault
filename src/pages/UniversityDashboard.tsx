import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, GraduationCap, Users, FileText, Upload, CheckCircle, Clock, AlertTriangle, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const UniversityDashboard = () => {
  const navigate = useNavigate();
  const [bulkVerificationFile, setBulkVerificationFile] = useState<File | null>(null);

  // Mock data for demonstration
  const stats = {
    totalRequests: 1247,
    pendingVerifications: 89,
    completedToday: 34,
    flaggedDocuments: 12
  };

  const recentVerifications = [
    { id: 1, studentName: "John Doe", documentType: "Degree", program: "Computer Science", status: "verified", requestedBy: "TechCorp Inc", date: "2024-06-24" },
    { id: 2, studentName: "Jane Smith", documentType: "Transcript", program: "Business Administration", status: "pending", requestedBy: "Global Finance", date: "2024-06-24" },
    { id: 3, studentName: "Mike Johnson", documentType: "Certificate", program: "Data Analytics", status: "flagged", requestedBy: "StartupXYZ", date: "2024-06-23" },
  ];

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkVerificationFile) {
      console.log("Processing bulk verification file:", bulkVerificationFile.name);
      // Here you would handle the bulk upload processing
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "flagged":
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-6 w-6" />
              <span className="text-xl font-bold text-gray-900">TrustTalent</span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-purple-600" />
              <span className="text-lg font-semibold text-gray-800">University Portal</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingVerifications}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged</p>
                  <p className="text-3xl font-bold text-red-600">{stats.flaggedDocuments}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="verifications">Verification Requests</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Processing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Verification Requests</CardTitle>
                <CardDescription>
                  Manage and track verification requests from employers and other institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(verification.status)}
                        <div>
                          <h4 className="font-semibold">{verification.studentName}</h4>
                          <p className="text-sm text-gray-600">{verification.program} - {verification.documentType}</p>
                          <p className="text-xs text-gray-500">Requested by {verification.requestedBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(verification.status)}
                        <span className="text-sm text-gray-500">{verification.date}</span>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Verification Processing</CardTitle>
                <CardDescription>
                  Upload CSV files for batch processing of verification requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBulkUpload} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bulkFile">Upload CSV File</Label>
                    <Input
                      id="bulkFile"
                      type="file"
                      accept=".csv"
                      onChange={(e) => setBulkVerificationFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-sm text-gray-500">
                      CSV should include: Student Name, Student ID, Document Type, Program, Graduation Date
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={!bulkVerificationFile}>
                      <Upload className="mr-2 h-4 w-4" />
                      Process Bulk Upload
                    </Button>
                    <Button type="button" variant="outline">
                      Download Template
                    </Button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Bulk Processing Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Maximum 1000 records per upload</li>
                    <li>• Processing typically takes 2-4 hours</li>
                    <li>• You'll receive email notification when complete</li>
                    <li>• Failed records will be flagged for manual review</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Verification Analytics</CardTitle>
                <CardDescription>
                  Track your verification request patterns and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Analytics dashboard coming soon</p>
                    <p className="text-sm text-gray-500">Charts and reports will be available here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>University Settings</CardTitle>
                <CardDescription>
                  Manage your institution's verification preferences and team access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Institution Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>University Name</Label>
                        <Input defaultValue="Sample University" />
                      </div>
                      <div>
                        <Label>Accreditation ID</Label>
                        <Input defaultValue="WASC-001" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Team Management</h4>
                    <Button variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Team Members
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">API Integration</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Set up automated verification through our API for faster processing
                    </p>
                    <Button variant="outline">Configure API Access</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityDashboard;
