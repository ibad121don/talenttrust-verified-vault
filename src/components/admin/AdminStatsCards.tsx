
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, AlertTriangle, Users, Clock, XCircle } from 'lucide-react';

interface AdminStatsCardsProps {
  stats: {
    totalVerifications: number;
    verifiedCount: number;
    pendingCount: number;
    suspiciousCount: number;
    failedCount: number;
    activeUsers: number;
  };
}

const AdminStatsCards = ({ stats }: AdminStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVerifications}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Verified</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-green-700">{stats.verifiedCount}</p>
                {stats.totalVerifications > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {Math.round((stats.verifiedCount / stats.totalVerifications) * 100)}%
                  </Badge>
                )}
              </div>
            </div>
            <Shield className="h-10 w-10 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pendingCount}</p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Suspicious</p>
              <p className="text-2xl font-bold text-orange-700">{stats.suspiciousCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-700">{stats.failedCount}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users (30d)</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <Users className="h-10 w-10 text-gray-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsCards;
