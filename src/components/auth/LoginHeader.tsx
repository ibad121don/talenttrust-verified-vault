
import React from "react";

interface LoginHeaderProps {
  logoSrc: string;
  title: string;
  subtitle: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ logoSrc, title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <img src={logoSrc} alt="TrustTalent Shield" className="h-8 w-8" />
        <span className="text-2xl font-bold text-gray-900">TrustTalent</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};
