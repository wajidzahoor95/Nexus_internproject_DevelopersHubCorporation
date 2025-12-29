import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import { ProcessedDocument } from "../../types";

interface DocumentPreviewProps {
  document: ProcessedDocument;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
}) => {
  const handleDownload = () => {
    // In a real app, this would download the actual file
    console.log("Downloading document:", document.name);
  };

  const handleView = () => {
    // In a real app, this would open the document in a viewer
    console.log("Viewing document:", document.name);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Document Preview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleView}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {document.name}
          </h3>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md text-sm text-gray-600">
            <div>
              <span className="font-medium">Size:</span> {document.size}
            </div>
            <div>
              <span className="font-medium">Type:</span> {document.type}
            </div>
            <div>
              <span className="font-medium">Uploaded:</span>{" "}
              {new Date(document.uploadedAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Modified:</span>{" "}
              {new Date(document.lastModified).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg w-full max-w-md">
            <p className="text-sm text-gray-500 mb-2">Document Preview</p>
            <div className="bg-white border border-gray-200 rounded p-4 text-left">
              <p className="text-gray-700 text-sm">
                This is a placeholder for the actual document preview. In a real
                application, this would display the PDF content or document
                preview using a PDF viewer library like react-pdf or PDF.js.
              </p>
              <p className="text-gray-700 text-sm mt-2">
                The document "{document.name}" has been uploaded and is ready
                for processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>• Click "View" to open the document in a new window</p>
        <p>• Click "Download" to save the document to your device</p>
        <p>• Use the signature pad below to add your electronic signature</p>
      </div>
    </div>
  );
};
