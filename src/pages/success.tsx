import { pricingService } from "@/services/pricingService";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    saveToDB();
  }, []);

  const saveToDB = async () => {
    let userdata = await localStorage.getItem("user_subcription");
    let tempuser = JSON.parse(userdata);
    console.log(tempuser);
    if (userdata != null) {
      await pricingService.createSubscription(tempuser.userId, tempuser.planId);
      await localStorage.removeItem("user_subcription");
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4">Payment Successful</h1>
      <p className="text-lg mb-6">
        Thank you! Your subscription has been activated.
      </p>
      <button
        onClick={() => navigate("/dashboard/seeker")}
        className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition"
      >
        Continue
      </button>
    </div>
  );
}
