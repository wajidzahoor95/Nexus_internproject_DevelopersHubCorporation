import { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { entrepreneurs } from "../../data/users";
import PayPalMockUI from "./PayPalMockUI";

type ModalType = "deposit" | "withdraw" | "transfer" | "paypal" | null;

const PaymentSection = () => {
  const { deposit, withdraw, transfer } = useWallet();
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState<string>("");
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<string>("");

  const handleAction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    switch (modal) {
      case "deposit":
        deposit(numAmount);
        break;
      case "withdraw":
        withdraw(numAmount);
        break;
      case "transfer":
        if (selectedEntrepreneur) {
          transfer(numAmount, selectedEntrepreneur);
        }
        break;
    }
    setModal(null);
    setAmount("");
    setSelectedEntrepreneur("");
  };

  const closeModal = () => {
    setModal(null);
    setAmount("");
    setSelectedEntrepreneur("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Payment Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setModal("deposit")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Deposit Funds
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => setModal("withdraw")}
        >
          Withdraw Funds
        </Button>

        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={() => setModal("transfer")}
        >
          Fund Deal
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => setModal("paypal")}
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          PayPal Payment
        </Button>
      </div>

      {/* Modal Backdrop */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {modal === "paypal" ? (
            <PayPalMockUI
              onClose={() => setModal(null)}
              onSuccess={() => setModal(null)}
            />
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {modal === "deposit" && "Deposit Funds"}
                {modal === "withdraw" && "Withdraw Funds"}
                {modal === "transfer" && "Fund Deal"}
              </h3>

              <div className="space-y-4">
                <Input
                  label="Amount (Rs)"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  startAdornment={<span className="text-gray-500">₹</span>}
                />

                {modal === "transfer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Entrepreneur
                    </label>
                    <select
                      value={selectedEntrepreneur}
                      onChange={(e) => setSelectedEntrepreneur(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Choose an entrepreneur...</option>
                      {entrepreneurs.map((ent) => (
                        <option key={ent.id} value={ent.name}>
                          {ent.name} - {ent.startupName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={closeModal} fullWidth>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAction}
                  fullWidth
                  disabled={
                    !amount || (modal === "transfer" && !selectedEntrepreneur)
                  }
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
