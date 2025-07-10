
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import PrivacyPolicy from "@/components/legal/PrivacyPolicy";

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      <PrivacyPolicy />
    </div>
  );
};

export default PrivacyPolicyPage;
