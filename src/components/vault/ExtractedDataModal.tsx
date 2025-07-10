import {
  X,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Calendar,
  BadgeCheck,
  User,
} from "lucide-react";

interface ExtractedData {
  name: string;
  institution: string;
  dateOfIssue: string;
  registrationNumber: string;
  result: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  extractedData?: ExtractedData;
}

const ExtractedDataModal = ({ isOpen, setIsOpen, extractedData }: Props) => {
  const resultText = extractedData?.result || "";
  const isFake = resultText.includes("Fake");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 z-50">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <BadgeCheck className="text-blue-600" />
                Extracted Document Data
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-600 text-2xl font-bold"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
              {extractedData ? (
                <>
                  <div className="flex items-start gap-3">
                    <User className="text-gray-500 mt-1" />
                    <div>
                      <h4 className="text-gray-700 font-medium">Name:</h4>
                      <p className="text-gray-900">{extractedData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <GraduationCap className="text-gray-500 mt-1" />
                    <div>
                      <h4 className="text-gray-700 font-medium">
                        Institution:
                      </h4>
                      <p className="text-gray-900">
                        {extractedData.institution}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-gray-500 mt-1" />
                    <div>
                      <h4 className="text-gray-700 font-medium">
                        Date of Issue:
                      </h4>
                      <p className="text-gray-900">
                        {extractedData.dateOfIssue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BadgeCheck className="text-gray-500 mt-1" />
                    <div>
                      <h4 className="text-gray-700 font-medium">
                        Registration Number:
                      </h4>
                      <p className="text-gray-900">
                        {extractedData.registrationNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {isFake ? (
                      <AlertCircle className="text-red-500 mt-1" />
                    ) : (
                      <CheckCircle className="text-green-500 mt-1" />
                    )}
                    <div>
                      <h4 className="text-gray-700 font-medium">Result:</h4>
                      <p
                        className={`text-sm font-semibold ${
                          isFake ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {resultText}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Loading extracted data...</p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtractedDataModal;
