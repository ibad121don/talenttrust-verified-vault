
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Process?</h2>
        <p className="text-xl mb-8 opacity-90">Join the verified credential revolution today</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => navigate("/register?role=seeker")}>
            Start as Job Seeker
          </Button>
          <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => navigate("/register?role=employer")}>
            Start as Employer
          </Button>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700" onClick={() => navigate("/register?role=university")}>
            Start as University
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
