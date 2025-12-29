import React, { useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { ProcessedDocument } from "../../types";

interface DocumentUploaderProps {
  onDocumentUpload: (document: ProcessedDocument) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentUpload,
}) => {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert("File size must be less than 10MB");
        return;
      }

      // Create processed document object
      const document: ProcessedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: formatFileSize(file.size),
        lastModified: new Date(file.lastModified).toISOString(),
        shared: false,
        url: URL.createObjectURL(file),
        ownerId: "current-user", // In real app, get from auth context
        status: "draft",
        signatures: [],
        uploadedAt: new Date().toISOString(),
      };

      onDocumentUpload(document);
    },
    [onDocumentUpload]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Upload Document
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Upload your document
          </p>
          <p className="text-gray-500 mb-4">
            PDF, DOC, or DOCX files up to 10MB
          </p>

          <label className="cursor-pointer">
            <span className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Choose File
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>• Supported formats: PDF, DOC, DOCX</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Documents will be processed for e-signing</p>
      </div>
    </div>
  );
};
