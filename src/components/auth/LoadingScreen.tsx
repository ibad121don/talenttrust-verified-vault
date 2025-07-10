
import React from "react";

interface LoadingScreenProps {
  logoSrc: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ logoSrc }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <img src={logoSrc} alt="TrustTalent" className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading...</p>
      </div>
    </div>
  );
};
