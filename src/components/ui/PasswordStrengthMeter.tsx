import React from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const calculateStrength = (
    pwd: string
  ): { score: number; label: string; color: string } => {
    let score = 0;

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    // Determine strength
    if (score < 3) return { score, label: "Weak", color: "bg-red-500" };
    if (score < 5) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score < 7) return { score, label: "Good", color: "bg-blue-500" };
    return { score, label: "Strong", color: "bg-green-500" };
  };

  const strength = calculateStrength(password);
  const width = password ? `${(strength.score / 8) * 100}%` : "0%";

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Password strength:</span>
        <span
          className={`text-sm font-medium ${
            strength.label === "Weak"
              ? "text-red-600"
              : strength.label === "Fair"
              ? "text-yellow-600"
              : strength.label === "Good"
              ? "text-blue-600"
              : "text-green-600"
          }`}
        >
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Use at least 8 characters with uppercase, lowercase, numbers, and
        symbols
      </div>
    </div>
  );
};
