
import React from "react";

interface SecurityNoticeProps {
  logoSrc: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({ logoSrc }) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <img src={logoSrc} alt="TrustTalent Shield" className="h-4 w-4" />
        <p className="text-sm text-blue-800 font-medium">Secure Login</p>
      </div>
      <p className="text-xs text-blue-600">
        Your connection is encrypted with TLS 1.3. We monitor for suspicious activity 
        and will alert you of any security concerns.
      </p>
    </div>
  );
};
