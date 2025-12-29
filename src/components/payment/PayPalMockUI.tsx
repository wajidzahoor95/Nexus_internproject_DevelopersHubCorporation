import { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface PayPalMockUIProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PayPalMockUI = ({ onClose, onSuccess }: PayPalMockUIProps) => {
  const { deposit } = useWallet();
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePayment = () => {
    const numAmount = parseFloat(amount);
    if (
      isNaN(numAmount) ||
      numAmount <= 0 ||
      !email ||
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !cardName
    )
      return;

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      deposit(numAmount);
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* PayPal Header */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">PayPal</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">
            Send Money
          </h3>

          <div className="space-y-4">
            <Input
              label="PayPal Email or Mobile Number"
              type="email"
              placeholder="Enter PayPal email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />

            <Input
              label="Amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              startAdornment={<span className="text-gray-500">₹</span>}
            />

            <div className="border-t pt-4">
              <h4 className="text-md font-semibold mb-3 text-gray-900">
                Card Details
              </h4>

              <Input
                label="Name on Card"
                type="text"
                placeholder="Enter name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                fullWidth
              />

              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                fullWidth
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  fullWidth
                />

                <Input
                  label="CVV"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              onClick={handlePayment}
              fullWidth
              disabled={!email || !amount || isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? "Processing..." : "Send Money"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>This is a mock PayPal interface for demonstration purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalMockUI;
