
const HowItWorksSection = () => {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How TrustTalent Works</h2>
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-blue-600">For Job Seekers</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Upload Your Documents</h4>
                  <p className="text-gray-600">Add degrees, certificates, licences, and work samples to your secure vault</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Get Verified</h4>
                  <p className="text-gray-600">Our AI verifies your credentials with issuing institutions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Apply with Confidence</h4>
                  <p className="text-gray-600">One-click application with verified credentials stands out</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-green-600">For Employers</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Post Verified Jobs</h4>
                  <p className="text-gray-600">Specify verification requirements for your positions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Filter Verified Candidates</h4>
                  <p className="text-gray-600">See only candidates with verified credentials</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Hire with Trust</h4>
                  <p className="text-gray-600">Make confident decisions with verified talent data</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-purple-600">For Universities</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Bulk Verification</h4>
                  <p className="text-gray-600">Process multiple applicant credentials simultaneously</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Fraud Detection</h4>
                  <p className="text-gray-600">Identify forged documents and prevent admission fraud</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Streamline Admissions</h4>
                  <p className="text-gray-600">Make faster, more confident admission decisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
