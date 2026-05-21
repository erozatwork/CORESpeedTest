import React from "react";
import { Printer } from "lucide-react";

// Main Helper Component
export function PrintableDocument({
  children,
  letterheadImage,
  topPadding = "140px",
  bottomPadding = "120px",
  sidePadding = "60px",
}) {
  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
          }
          .no-print {
            display: none !important;
          }
          .print-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
          }
          .print-background img {
            width: 100%;
            height: 100%;
            object-fit: fill;
          }
          .print-content {
            position: relative;
            z-index: 1;
            padding: ${topPadding} ${sidePadding} ${bottomPadding} ${sidePadding};
          }
          @page {
            margin: 0;
            size: letter portrait;
          }
        }
        
        @media screen {
          .print-background {
            display: none;
          }
        }
      `}</style>

      {/* Print View Container */}
      {letterheadImage && (
        <div className="print-container">
          <div className="print-background">
            <img src={letterheadImage} alt="Letterhead Background" />
          </div>
          <div className="print-content">{children}</div>
        </div>
      )}
    </>
  );
}

// Print Button Component
export function PrintButton({ disabled, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`no-print flex items-center gap-2 px-4 py-2 rounded-lg transition ${disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
        } ${className}`}
    >
      <Printer size={20} />
      Print Document
    </button>
  );
}

// Print Actions Component with Download/Print options
export function PrintActions({ disabled, className = "" }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Trigger print dialog with save as PDF option
    window.print();
  };

  return (
    <div className={`no-print flex gap-3 ${className}`}>
      <button
        onClick={handlePrint}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        <Printer size={20} />
        Print
      </button>
      <button
        onClick={handleDownload}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}

// Example Usage Component
export default function ExampleUsage() {
  // CORE letterhead image
  // To use this helper, replace this with your actual letterhead image:
  // Option 1: Place image in public folder and use path
  const letterheadImage = "/path/to/your/letterhead.png";

  // Option 2: Use base64 (recommended for embedding)
  // Convert your image at: https://www.base64-image.de/
  // const letterheadImage = "data:image/png;base64,YOUR_BASE64_STRING_HERE";

  // For the CORE letterhead you shared, you would:
  // 1. Save the letterhead image to your public folder as 'core-letterhead.png'
  // 2. Then use: const letterheadImage = "/core-letterhead.png";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Print Actions */}
        <div className="mb-6 no-print">
          <PrintActions />
        </div>

        {/* Your Content - Screen View */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Employee Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="font-bold text-gray-700">Name:</div>
              <div className="col-span-3 text-gray-900">John Doe</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-bold text-gray-700">Position:</div>
              <div className="col-span-3 text-gray-900">Software Developer</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-bold text-gray-700">Department:</div>
              <div className="col-span-3 text-gray-900">IT Development</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-bold text-gray-700">Email:</div>
              <div className="col-span-3 text-gray-900">
                john.doe@onecoredevit.com
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="font-bold text-gray-700">Phone:</div>
              <div className="col-span-3 text-gray-900">+632 5310-6188</div>
            </div>
          </div>
        </div>

        {/* PrintableDocument wrapper - Print View */}
        <PrintableDocument letterheadImage={letterheadImage}>
          <div className="max-w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Employee Information
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold text-gray-700">Name:</div>
                <div className="col-span-3 text-gray-900">John Doe</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold text-gray-700">Position:</div>
                <div className="col-span-3 text-gray-900">
                  Software Developer
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold text-gray-700">Department:</div>
                <div className="col-span-3 text-gray-900">IT Development</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold text-gray-700">Email:</div>
                <div className="col-span-3 text-gray-900">
                  john.doe@onecoredevit.com
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold text-gray-700">Phone:</div>
                <div className="col-span-3 text-gray-900">+632 5310-6188</div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="font-bold text-gray-700">Employee ID:</div>
                <div className="col-span-3 text-gray-900">EMP-2024-001</div>
              </div>
            </div>
          </div>
        </PrintableDocument>
      </div>
    </div>
  );
}
