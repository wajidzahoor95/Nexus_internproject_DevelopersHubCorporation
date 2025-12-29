import React from "react";
import { Badge } from "../ui/Badge";
import { DocumentStatus } from "../../types";

interface StatusLabelsProps {
  status: DocumentStatus;
}

export const StatusLabels: React.FC<StatusLabelsProps> = ({ status }) => {
  const getStatusConfig = (status: DocumentStatus) => {
    switch (status) {
      case "draft":
        return {
          label: "Draft",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800",
        };
      case "in_review":
        return {
          label: "In Review",
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "signed":
        return {
          label: "Signed",
          variant: "secondary" as const,
          className: "bg-green-100 text-green-800",
        };
      default:
        return {
          label: "Unknown",
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
