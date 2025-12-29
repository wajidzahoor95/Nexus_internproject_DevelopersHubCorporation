import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  CircleDollarSign,
  Building2,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { OTPInput } from "../../components/ui/OTPInput";
import { UserRole } from "../../types";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("entrepreneur");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");

  const { login } = useAuth();
  const navigate = useNavigate();

  // STEP 1: CREDENTIALS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter valid credentials");
      setIsLoading(false);
      return;
    }

    // Demo flow → go to OTP
    setStep("2fa");
    setIsLoading(false);
  };

  // STEP 2: OTP
  const handleOTPComplete = async (otp: string) => {
    setError(null);
    setIsLoading(true);

    try {
      // DEMO OTP
      if (otp !== "123456") {
        setError("Invalid OTP. Use 123456 for demo.");
        setIsLoading(false);
        return;
      }

      await login(email, password, role);

      navigate(
        role === "entrepreneur"
          ? "/dashboard/entrepreneur"
          : "/dashboard/investor"
      );
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const handleBackToCredentials = () => {
    setStep("credentials");
    setError(null);
  };

  // Demo credentials
  const fillDemoCredentials = (userRole: UserRole) => {
    if (userRole === "entrepreneur") {
      setEmail("sarah@techwave.io");
      setPassword("password123");
    } else {
      setEmail("michael@vcinnovate.com");
      setPassword("password123");
    }
    setRole(userRole);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === "credentials"
            ? "Sign in to Business Nexus"
            : "Two-Factor Authentication"}
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          {step === "credentials"
            ? "Connect with investors and entrepreneurs"
            : "Enter the 6-digit code sent to your device"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === "credentials" ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md flex items-center justify-center ${
                      role === "entrepreneur"
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setRole("entrepreneur")}
                  >
                    <Building2 size={18} className="mr-2" />
                    Entrepreneur
                  </button>

                  <button
                    type="button"
                    className={`py-3 px-4 border rounded-md flex items-center justify-center ${
                      role === "investor"
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 text-gray-700"
                    }`}
                    onClick={() => setRole("investor")}
                  >
                    <CircleDollarSign size={18} className="mr-2" />
                    Investor
                  </button>
                </div>
              </div>

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                startAdornment={<User size={18} />}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn size={18} />}
              >
                Sign in
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-600">
                Demo OTP: <b>123456</b>
              </p>

              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                disabled={isLoading}
              />

              <Button
                variant="outline"
                fullWidth
                onClick={handleBackToCredentials}
              >
                Back to Login
              </Button>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => fillDemoCredentials("entrepreneur")}
            >
              Entrepreneur Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => fillDemoCredentials("investor")}
            >
              Investor Demo
            </Button>
          </div>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
