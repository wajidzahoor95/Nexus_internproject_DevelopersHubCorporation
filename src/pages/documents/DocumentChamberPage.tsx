import React, { useState } from "react";
import { DocumentUploader } from "../../components/documents/DocumentUploader";
import { DocumentPreview } from "../../components/documents/DocumentPreview";
import { SignaturePad } from "../../components/documents/SignaturePad";
import { StatusLabels } from "../../components/documents/StatusLabels";
import { ProcessedDocument, DocumentStatus } from "../../types";

const DocumentChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null);
  const [signature, setSignature] = useState<string>("");

  const handleDocumentUpload = (uploadedDoc: ProcessedDocument) => {
    setDocuments((prev) => [...prev, uploadedDoc]);
    setSelectedDocument(uploadedDoc);
  };

  const handleStatusChange = (docId: string, newStatus: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    );
    if (selectedDocument?.id === docId) {
      setSelectedDocument((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }
  };

  const handleSignatureSave = (signatureData: string) => {
    setSignature(signatureData);
    if (selectedDocument) {
      // In a real app, this would save the signature to the document
      console.log("Signature saved for document:", selectedDocument.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Document Processing Chamber
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List and Upload */}
          <div className="lg:col-span-1 space-y-6">
            <DocumentUploader onDocumentUpload={handleDocumentUpload} />

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Document List
              </h2>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No documents uploaded yet
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedDocument?.id === doc.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                        <StatusLabels status={doc.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Document Preview and Actions */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDocument ? (
              <>
                <DocumentPreview document={selectedDocument} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SignaturePad onSignatureSave={handleSignatureSave} />
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Document Actions
                    </h2>
                    <div className="space-y-3">
                      <button
                        onClick={() =>
                          handleStatusChange(selectedDocument.id, "in_review")
                        }
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        Mark as In Review
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedDocument.id, "signed")
                        }
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Mark as Signed
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(selectedDocument.id, "draft")
                        }
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Reset to Draft
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📄</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No Document Selected
                </h2>
                <p className="text-gray-500">
                  Upload and select a document to preview and process
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChamberPage;
